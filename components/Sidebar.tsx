'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { createClient } from '@/lib/supabase'
import Image from 'next/image'

interface SidebarProps {
  user?: any
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { darkMode, toggleDarkMode } = useTheme()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const menuItems = [
    {
      name: 'Home',
      href: '/',
      icon: '🏠',
      show: true
    },
    {
      name: 'Generator',
      href: '/generator',
      icon: '⚡',
      show: !!user
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      show: !!user
    },
    {
      name: 'Usage Stats',
      href: '/stats',
      icon: '📈',
      show: !!user
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: '⚙️',
      show: !!user
    },
    {
      name: 'Pricing',
      href: '/pricing',
      icon: '💰',
      show: true
    },
    {
      name: 'About',
      href: '/about',
      icon: 'ℹ️',
      show: true
    },
    {
      name: 'Contact',
      href: '/contact',
      icon: '📞',
      show: true
    },
    {
      name: 'Help',
      href: '/help',
      icon: '❓',
      show: true
    },
    {
      name: 'Sign In',
      href: '/auth/signin',
      icon: '🔑',
      show: !user
    }
  ]

  return (
    <div className={`fixed left-0 top-0 h-full w-64 z-50 transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    } border-r shadow-lg`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10">
            <Image
              src="/img/logo-snappdf.svg"
              alt="SnapPDF Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </div>
          <div>
            <h1 className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              SnapPDF
            </h1>
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Web to PDF
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {menuItems.filter(item => item.show).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      {user && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className={`p-3 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {user.email}
                </p>
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Signed in
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className={`w-full mt-3 px-3 py-2 text-sm rounded-md transition-colors ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Theme Toggle */}
      {/* Enhanced Theme Toggle */}
      <div className="absolute bottom-20 left-4 right-4">
        <div className={`p-4 rounded-2xl border backdrop-blur-sm ${
          darkMode 
            ? 'bg-gray-800/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Theme
            </span>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              darkMode 
                ? 'bg-blue-900/30 text-blue-300' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {darkMode ? 'Dark' : 'Light'}
            </div>
          </div>
          
          {/* Toggle Switch */}
          <button
            onClick={toggleDarkMode}
            className={`relative w-full h-12 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] ${
              darkMode
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25'
            }`}
          >
            <div className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-sm"></div>
            
            {/* Sliding indicator */}
            <div className={`absolute top-1 bottom-1 w-10 rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out ${
              darkMode ? 'left-1' : 'right-1'
            }`}>
              <div className="flex items-center justify-center h-full">
                <span className="text-lg transition-transform duration-300">
                  {darkMode ? '🌙' : '☀️'}
                </span>
              </div>
            </div>
            
            {/* Labels */}
            <div className="flex items-center justify-between px-4 h-full relative z-10">
              <span className={`text-sm font-medium transition-colors duration-300 ${
                darkMode ? 'text-white/60' : 'text-white'
              }`}>
                🌙 Dark
              </span>
              <span className={`text-sm font-medium transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-white/60'
              }`}>
                ☀️ Light
              </span>
            </div>
          </button>
          
          {/* Smart suggestion */}
          <div className="mt-3 text-center">
            <span className={`text-xs ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {new Date().getHours() >= 18 || new Date().getHours() <= 6 
                ? '🌙 Perfect time for dark mode' 
                : '☀️ Bright and beautiful'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}