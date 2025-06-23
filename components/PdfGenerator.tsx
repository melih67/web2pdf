'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { usageTracker, UsageData } from '@/lib/usage-tracker'
import AppLayout from './AppLayout'
import Link from 'next/link'

interface PdfGeneratorProps {
  user: any
}

type QualityType = 'low' | 'medium' | 'high'

interface GeneratedPdf {
  filename: string
  publicUrl: string
  pageTitle: string
  quality: QualityType
  size?: string
}

export default function PdfGenerator({ user }: PdfGeneratorProps) {
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState<QualityType>('medium')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [generatedPdf, setGeneratedPdf] = useState<GeneratedPdf | null>(null)
  const [recentUrls, setRecentUrls] = useState<string[]>([])
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [usageLimit, setUsageLimit] = useState<number>(3)
  const [canGenerate, setCanGenerate] = useState<boolean>(true)
  
  const router = useRouter()
  const supabase = createClient()
  const { darkMode } = useTheme()

  // Load recent URLs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentUrls')
    if (saved) {
      setRecentUrls(JSON.parse(saved))
    }
  }, [])

  // Check usage limits when component loads or user changes
  useEffect(() => {
    const checkUsage = async () => {
      if (user?.id) {
        try {
          const { canUse, usage, limit } = await usageTracker.checkUsageLimit(user.id)
          setUsageData(usage)
          setUsageLimit(limit)
          setCanGenerate(canUse)
        } catch (error) {
          console.error('Error checking usage:', error)
        }
      }
    }

    checkUsage()
  }, [user?.id])

  // Save URL to recent list
  const saveToRecent = (newUrl: string) => {
    const updated = [newUrl, ...recentUrls.filter(u => u !== newUrl)].slice(0, 5)
    setRecentUrls(updated)
    localStorage.setItem('recentUrls', JSON.stringify(updated))
  }



  const validateUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateUrl(url)) {
      setMessage('Please enter a valid URL (http:// or https://)')
      return
    }

    // Check if user is signed in
    if (!user?.id) {
      setMessage('Please sign in to generate PDFs')
      return
    }

    // Check usage limits
    if (!canGenerate) {
      setMessage(`You've reached your monthly limit of ${usageLimit} PDF conversions. Please upgrade your plan to continue.`)
      return
    }
    
    setLoading(true)
    setMessage('')
    setGeneratedPdf(null)
    setProgress(0)
    saveToRecent(url)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev
        return prev + Math.random() * 15
      })
    }, 500)

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, quality }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error generating PDF')
      }

      setProgress(100)
      setGeneratedPdf({
        filename: data.filename,
        publicUrl: data.publicUrl,
        pageTitle: data.pageTitle,
        quality,
        size: data.size
      })
      
      // Increment usage count
      if (user?.id) {
        try {
          const updatedUsage = await usageTracker.incrementUsage(user.id)
          setUsageData(updatedUsage)
          
          // Check if user has reached limit after this conversion
          const { canUse } = await usageTracker.checkUsageLimit(user.id)
          setCanGenerate(canUse)
        } catch (error) {
          console.error('Error updating usage:', error)
        }
      }
      
      setMessage('PDF generated successfully!')
      
      // Auto-download after a short delay
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = data.publicUrl
        link.download = data.filename
        link.click()
      }, 1000)
      
    } catch (error: any) {
      setMessage(error.message || 'An error occurred while generating the PDF')
    } finally {
      clearInterval(progressInterval)
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4 ${
            darkMode 
              ? 'from-white via-blue-200 to-indigo-200' 
              : 'from-gray-900 via-blue-900 to-indigo-900'
          }`}>
            Transform Web Pages into PDFs
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Powered by AI-optimized rendering engine for professional-quality PDF conversion
          </p>
        </div>

        {/* Usage Indicator */}
        {user && usageData && (
          <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-xl border ${
            canGenerate
              ? darkMode
                ? 'bg-green-900/20 border-green-700/50'
                : 'bg-green-50 border-green-200'
              : darkMode
                ? 'bg-red-900/20 border-red-700/50'
                : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  canGenerate
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}></div>
                <div>
                  <p className={`font-semibold ${
                    canGenerate
                      ? darkMode ? 'text-green-300' : 'text-green-800'
                      : darkMode ? 'text-red-300' : 'text-red-800'
                  }`}>
                    {usageData.plan_type === 'free' ? 'Free Plan' : usageData.plan_type === 'pro' ? 'Pro Plan' : 'Enterprise Plan'}
                  </p>
                  <p className={`text-sm ${
                    canGenerate
                      ? darkMode ? 'text-green-200' : 'text-green-700'
                      : darkMode ? 'text-red-200' : 'text-red-700'
                  }`}>
                    {usageData.conversions_used} of {usageLimit === Infinity ? '∞' : usageLimit} conversions used this month
                  </p>
                </div>
              </div>
              {!canGenerate && (
                <Link
                  href="/pricing"
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Upgrade
                </Link>
              )}
            </div>
            {!canGenerate && (
              <div className={`mt-3 p-3 rounded-lg ${
                darkMode ? 'bg-gray-800/50' : 'bg-white/50'
              }`}>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  💡 <strong>Tip:</strong> Upgrade to Pro for 100 conversions/month or Enterprise for unlimited conversions!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Main Card */}
        <div className={`backdrop-blur-sm rounded-2xl shadow-xl border p-8 mb-8 transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800/70 border-gray-700/50' 
            : 'bg-white/70 border-white/20'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* URL Input */}
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${
                darkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Website URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full px-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg ${
                    darkMode 
                      ? 'bg-gray-700/80 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white/80 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                  disabled={loading}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className={`w-5 h-5 ${
                    darkMode ? 'text-gray-400' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              
              {/* Recent URLs */}
              {recentUrls.length > 0 && (
                <div className="space-y-2">
                  <p className={`text-xs font-medium uppercase tracking-wide ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Recent URLs</p>
                  <div className="flex flex-wrap gap-2">
                    {recentUrls.map((recentUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setUrl(recentUrl)}
                        className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 truncate max-w-xs ${
                          darkMode 
                            ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        disabled={loading}
                      >
                        {recentUrl.replace(/^https?:\/\//, '').substring(0, 30)}...
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quality Selection */}
            <div className="space-y-4">
              <label className={`block text-sm font-semibold ${
                darkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>
                Quality Settings
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['low', 'medium', 'high'] as QualityType[]).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuality(q)}
                    disabled={loading}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      quality === q
                        ? (darkMode 
                            ? 'border-blue-400 bg-blue-900/50 text-blue-200' 
                            : 'border-blue-500 bg-blue-50 text-blue-900')
                        : (darkMode 
                            ? 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500' 
                            : 'border-gray-200 bg-white/50 text-gray-700 hover:border-gray-300')
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                        quality === q 
                          ? (darkMode ? 'bg-blue-400' : 'bg-blue-500') 
                          : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${
                          quality === q 
                            ? 'bg-white' 
                            : (darkMode ? 'bg-gray-400' : 'bg-gray-500')
                        }`}></div>
                      </div>
                      <p className="font-medium capitalize">{q}</p>
                      <p className={`text-xs mt-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {q === 'low' && 'Fast • 800x600'}
                        {q === 'medium' && 'Balanced • 1200x800'}
                        {q === 'high' && 'Best • 1920x1080'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            {loading && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Generating PDF...</span>
                  <span className={darkMode ? 'text-blue-400 font-medium' : 'text-blue-600 font-medium'}>{Math.round(progress)}%</span>
                </div>
                <div className={`w-full rounded-full h-2 overflow-hidden ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !url}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing with AI Engine...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate PDF
                </div>
              )}
            </button>
          </form>
        </div>

        {/* Messages */}
        {message && (
          <div className={`p-4 rounded-xl border backdrop-blur-sm ${
            message.includes('success') 
              ? (darkMode 
                  ? 'bg-green-900/50 text-green-200 border-green-700' 
                  : 'bg-green-50/80 text-green-800 border-green-200')
              : (darkMode 
                  ? 'bg-red-900/50 text-red-200 border-red-700' 
                  : 'bg-red-50/80 text-red-800 border-red-200')
          }`}>
            <div className="flex items-center gap-2">
              {message.includes('success') ? (
                <svg className={`w-5 h-5 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className={`w-5 h-5 ${
                  darkMode ? 'text-red-400' : 'text-red-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {message}
            </div>
          </div>
        )}

        {/* Generated PDF Info */}
        {generatedPdf && (
          <div className={`rounded-xl p-6 backdrop-blur-sm border ${
            darkMode 
              ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-green-700' 
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          }`}>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${
                  darkMode ? 'text-green-200' : 'text-green-900'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  PDF Generated Successfully!
                </h3>
                <div className={`space-y-2 text-sm ${
                  darkMode ? 'text-green-300' : 'text-green-800'
                }`}>
                  <p><span className="font-medium">Page Title:</span> {generatedPdf.pageTitle}</p>
                  <p><span className="font-medium">Quality:</span> {generatedPdf.quality.toUpperCase()}</p>
                  <p><span className="font-medium">File:</span> {generatedPdf.filename}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <a
                  href={generatedPdf.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 border rounded-lg transition-colors duration-200 text-sm font-medium ${
                    darkMode 
                      ? 'bg-gray-800 text-green-300 border-green-600 hover:bg-gray-700' 
                      : 'bg-white text-green-700 border-green-300 hover:bg-green-50'
                  }`}
                >
                  Preview
                </a>
                <a
                  href={generatedPdf.publicUrl}
                  download={generatedPdf.filename}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    darkMode 
                      ? 'bg-green-700 text-white hover:bg-green-600' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
              darkMode ? 'bg-blue-900/50' : 'bg-blue-100'
            }`}>
              <svg className={`w-6 h-6 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className={`font-semibold mb-2 ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>Lightning Fast</h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>AI-optimized rendering engine processes pages in seconds</p>
          </div>
          <div className="text-center p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
              darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
            }`}>
              <svg className={`w-6 h-6 ${
                darkMode ? 'text-indigo-400' : 'text-indigo-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`font-semibold mb-2 ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>High Quality</h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Professional-grade PDFs with perfect formatting</p>
          </div>
          <div className="text-center p-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
              darkMode ? 'bg-green-900/50' : 'bg-green-100'
            }`}>
              <svg className={`w-6 h-6 ${
                darkMode ? 'text-green-400' : 'text-green-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className={`font-semibold mb-2 ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>Secure Storage</h3>
            <p className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>Your PDFs are safely stored in encrypted cloud storage</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}