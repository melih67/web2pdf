'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import PdfHistory from '@/components/PdfHistory'
import Link from 'next/link'

interface DashboardClientProps {
  user: any
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Load dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Header */}
      <header className={`border-b backdrop-blur-sm transition-colors duration-300 ${
        darkMode 
          ? 'border-gray-700/50 bg-gray-900/80' 
          : 'border-white/20 bg-white/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-600' : 'bg-blue-600'
                }`}>
                  <span className="text-white font-bold text-xl">W2P</span>
                </div>
                <h1 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Web2PDF
                </h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              
              <Link href="/generator" className="btn-primary">
                New PDF
              </Link>
              
              <button onClick={handleSignOut} className="btn-secondary">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Dashboard
          </h1>
          <p className={`text-xl ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage your PDF exports and access your files
          </p>
        </div>

        {/* User Info Card */}
        <div className={`rounded-2xl p-6 mb-8 shadow-lg ${
          darkMode 
            ? 'bg-gray-800/50 border border-gray-700/50' 
            : 'bg-white border border-gray-200'
        }`}>
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-blue-600' : 'bg-blue-100'
            }`}>
              <span className={`font-bold text-2xl ${
                darkMode ? 'text-white' : 'text-blue-600'
              }`}>
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className={`text-2xl font-semibold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {user.email}
              </h2>
              <p className={`text-lg ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link href="/generator" className={`p-6 rounded-2xl shadow-lg transition-all hover:scale-105 ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}>
            <div className="text-white">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="text-xl font-bold mb-2">Create New PDF</h3>
              <p className="opacity-90">Convert any webpage to PDF instantly</p>
            </div>
          </Link>
          
          <div className={`p-6 rounded-2xl shadow-lg ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              <div className="text-3xl mb-3">📊</div>
              <h3 className={`text-xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Usage Stats
              </h3>
              <p>Track your PDF generation activity</p>
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl shadow-lg ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          }`}>
            <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              <div className="text-3xl mb-3">⚙️</div>
              <h3 className={`text-xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Settings
              </h3>
              <p>Customize your PDF preferences</p>
            </div>
          </div>
        </div>

        {/* PDF History */}
        <div className={`rounded-2xl p-6 shadow-lg ${
          darkMode 
            ? 'bg-gray-800/50 border border-gray-700/50' 
            : 'bg-white border border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Recent PDFs
          </h2>
          <PdfHistory user={user} darkMode={darkMode} />
        </div>
      </div>
    </div>
  )
}