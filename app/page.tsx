import { createServerClient } from '@/lib/supabase-server'
import Homepage from '@/components/Homepage'

export default async function Home() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <Homepage user={user} />
}