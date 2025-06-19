'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) throw error
        setMessage('Vérifiez votre email pour confirmer votre inscription!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        router.push('/')
        router.refresh()
      }
    } catch (error: any) {
      setMessage(error.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === 'signin' ? 'Connexion' : 'Inscription'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Chargement...' : (mode === 'signin' ? 'Se connecter' : "S'inscrire")}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.includes('erreur') || message.includes('Error') 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {mode === 'signin' ? "Pas encore de compte ?" : "Déjà un compte ?"}
          <a 
            href={mode === 'signin' ? '/auth/signup' : '/auth/signin'}
            className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            {mode === 'signin' ? "S'inscrire" : 'Se connecter'}
          </a>
        </p>
      </div>
    </div>
  )
}