'use client'

import React from 'react'
import Link from 'next/link'
import Sidebar from './Sidebar'
import { useTheme } from '@/contexts/ThemeContext'

interface AppLayoutProps {
  children: React.ReactNode
  user?: any
  showSidebar?: boolean
}

export default function AppLayout({ children, user, showSidebar = true }: AppLayoutProps) {
  const { darkMode } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900'
    }`}>
      {showSidebar && <Sidebar user={user} />}
      
      <main className={`transition-all duration-300 ${
        showSidebar ? 'ml-64' : 'ml-0'
      }`}>
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}