import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import StatsClient from '@/components/StatsClient'

export default async function StatsPage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return <StatsClient user={user} />
}