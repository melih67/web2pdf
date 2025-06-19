import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Database types
export interface PdfExport {
  id: string
  user_id: string
  url: string
  filename: string
  created_at: string
  storage_path: string
}