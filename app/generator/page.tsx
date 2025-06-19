import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import PdfGenerator from '@/components/PdfGenerator'

export default async function GeneratorPage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return <PdfGenerator user={user} />
}