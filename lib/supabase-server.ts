import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Server-side Supabase client
export const createServerClient = async () => {
  const cookieStore = await cookies()
  
  return createSupabaseServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          // In Next.js 15, cookies can only be set in Server Actions or Route Handlers
          // For Server Components, we'll skip setting cookies silently
          // The client-side Supabase client will handle authentication state
        },
        remove(name: string, options: any) {
          // In Next.js 15, cookies can only be removed in Server Actions or Route Handlers
          // For Server Components, we'll skip removing cookies silently
          // The client-side Supabase client will handle authentication state
        },
      },
    }
  )
}