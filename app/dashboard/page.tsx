import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return <DashboardClient user={user} />
}