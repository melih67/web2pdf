import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AuthForm from '@/components/AuthForm'

export default async function SignInPage() {
  const supabase = await createServerClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Web2PDF
          </h1>
          <p className="text-gray-600">
            Connectez-vous pour commencer à convertir vos pages web en PDF
          </p>
        </div>
        <AuthForm mode="signin" />
      </div>
    </div>
  )
}