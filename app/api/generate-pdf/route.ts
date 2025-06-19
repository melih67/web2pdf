import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { generatePdfFromUrl, extractPageTitle, sanitizeFilename } from '@/lib/pdf'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { url, quality = 'medium' } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }
    
    // Validate quality parameter
    if (!['low', 'medium', 'high'].includes(quality)) {
      return NextResponse.json(
        { error: 'Invalid quality parameter' },
        { status: 400 }
      )
    }
    
    // Get authenticated user
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Extract page title for filename
    const pageTitle = await extractPageTitle(url)
    const sanitizedTitle = sanitizeFilename(pageTitle)
    const timestamp = Date.now()
    const filename = `${sanitizedTitle}_${quality}_${timestamp}.pdf`
    const storagePath = `${user.id}/${filename}`
    
    // Generate PDF with quality setting
    const pdfBuffer = await generatePdfFromUrl({ url, filename, quality })
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdfs')
      .upload(storagePath, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json(
        {
          error: 'Failed to upload PDF to storage.',
          details: uploadError.message,
        },
        { status: 500 }
      )
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('pdfs')
      .getPublicUrl(storagePath)
    
    // Save export record to database (optional)
    const exportRecord = {
      id: uuidv4(),
      user_id: user.id,
      url,
      filename,
      storage_path: storagePath,
      created_at: new Date().toISOString()
    }
    
    // Insert export record to database
    const { error: dbError } = await supabase
      .from('pdf_exports')
      .insert(exportRecord)
    
    if (dbError) {
      console.error('Database insert error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save PDF metadata', details: dbError },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      filename,
      publicUrl: publicUrlData.publicUrl,
      storagePath,
      pageTitle
    })
    
  } catch (error) {
    console.error('PDF generation error:', error)
    
    // Provide more specific error information
    let errorMessage = 'Internal server error'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('TimeoutError')) {
        errorMessage = 'PDF generation timed out. Please try again with a simpler page.'
        statusCode = 408
      } else if (error.message.includes('navigation') || error.message.includes('net::')) {
        errorMessage = 'Unable to access the provided URL. Please check if the URL is valid and accessible.'
        statusCode = 400
      } else if (error.message.includes('chromium') || error.message.includes('browser')) {
        errorMessage = 'Browser initialization failed. Please try again.'
        statusCode = 503
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: statusCode }
    )
  }
}