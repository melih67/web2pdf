'use client'

import { useTheme } from '@/contexts/ThemeContext'
import PdfHistory from '@/components/PdfHistory'
import AppLayout from '@/components/AppLayout'
import Link from 'next/link'

interface DashboardClientProps {
  user: any
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const { darkMode } = useTheme()

  return (
    <AppLayout user={user}>
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
          
          <Link href="/stats" className={`p-6 rounded-2xl shadow-lg transition-all hover:scale-105 ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
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
          </Link>
          
          <Link href="/settings" className={`p-6 rounded-2xl shadow-lg transition-all hover:scale-105 ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700/50' 
              : 'bg-white border border-gray-200 hover:bg-gray-50'
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
          </Link>
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
    </AppLayout>
  )
}