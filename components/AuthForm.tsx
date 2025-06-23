'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'

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
  const { darkMode } = useTheme()

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
        setMessage('Check your email to confirm your registration!')
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
      setMessage(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`max-w-md mx-auto p-8 rounded-2xl shadow-lg border ${
      darkMode 
        ? 'bg-gray-800/50 border-gray-700/50' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Free Usage Banner */}
      {mode === 'signup' && (
        <div className={`mb-6 p-4 rounded-xl border ${
          darkMode 
            ? 'bg-blue-900/20 border-blue-700/50' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎉</div>
            <div>
              <h3 className={`font-semibold ${
                darkMode ? 'text-blue-300' : 'text-blue-800'
              }`}>
                Start Free Today!
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-blue-200' : 'text-blue-700'
              }`}>
                Get 3 free PDF conversions every month
              </p>
            </div>
          </div>
        </div>
      )}
      
      <h2 className={`text-2xl font-bold text-center mb-6 ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {mode === 'signin' ? 'Sign In' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-colors ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
            } focus:ring-2 focus:outline-none`}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border transition-colors ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
            } focus:ring-2 focus:outline-none`}
            placeholder={mode === 'signin' ? 'Enter your password' : 'Create a password'}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
            loading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-[1.02] active:scale-[0.98]'
          } ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          ) : (
            mode === 'signin' ? 'Sign In' : 'Create Account'
          )}
        </button>
      </form>
      
      {message && (
        <div className={`mt-6 p-4 rounded-xl border ${
          message.includes('error') || message.includes('Error')
            ? darkMode
              ? 'bg-red-900/20 border-red-700/50 text-red-300'
              : 'bg-red-50 border-red-200 text-red-700'
            : darkMode
              ? 'bg-green-900/20 border-green-700/50 text-green-300'
              : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="text-lg">
              {message.includes('error') || message.includes('Error') ? '❌' : '✅'}
            </div>
            <span className="text-sm font-medium">{message}</span>
          </div>
        </div>
      )}
      
      {/* Switch Mode Link */}
      <div className="mt-6 text-center">
        <p className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
        </p>
        <Link
          href={mode === 'signin' ? '/auth/signup' : '/auth/signin'}
          className={`inline-block mt-2 text-sm font-semibold transition-colors ${
            darkMode
              ? 'text-blue-400 hover:text-blue-300'
              : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
        </Link>
      </div>
      
      {/* Pricing Link */}
      <div className="mt-4 text-center">
        <Link
          href="/pricing"
          className={`inline-flex items-center space-x-1 text-xs transition-colors ${
            darkMode
              ? 'text-gray-500 hover:text-gray-400'
              : 'text-gray-500 hover:text-gray-600'
          }`}
        >
          <span>💎</span>
          <span>View all plans and pricing</span>
        </Link>
      </div>
    </div>
  )
}