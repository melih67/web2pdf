'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface HomepageProps {
  user?: any
}

export default function Homepage({ user }: HomepageProps) {
  const [darkMode, setDarkMode] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900'
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
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                darkMode ? 'bg-blue-600' : 'bg-blue-600'
              }`}>
                <span className="text-white font-bold text-xl">W2P</span>
              </div>
              <h1 className="text-2xl font-bold">Web2PDF</h1>
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
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link href="/dashboard" className="btn-secondary">
                    Dashboard
                  </Link>
                  <button onClick={handleSignOut} className="btn-secondary">
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/signin" className="btn-secondary">
                    Sign In
                  </Link>
                  <Link href="/auth/signin" className="btn-primary">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Convert Any Website
            <span className="block text-blue-600">to PDF Instantly</span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Transform web pages into high-quality PDFs with cloud storage, 
            advanced options, and lightning-fast processing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link href="/generator" className="btn-primary text-lg px-8 py-4">
                Start Converting →
              </Link>
            ) : (
              <Link href="/auth/signin" className="btn-primary text-lg px-8 py-4">
                Get Started Free →
              </Link>
            )}
            <Link href="#pricing" className="btn-secondary text-lg px-8 py-4">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 ${
        darkMode ? 'bg-gray-800/50' : 'bg-white/50'
      }`}>
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-16 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Why Choose Web2PDF?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className={`p-8 rounded-2xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-white'
            } shadow-lg`}>
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Lightning Fast
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Convert any webpage to PDF in seconds with our optimized processing engine.
              </p>
            </div>
            
            <div className={`p-8 rounded-2xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-white'
            } shadow-lg`}>
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">☁️</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Cloud Storage
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                All your PDFs are securely stored in the cloud with instant access from anywhere.
              </p>
            </div>
            
            <div className={`p-8 rounded-2xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-white'
            } shadow-lg`}>
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-6">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                High Quality
              </h3>
              <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                Choose from multiple quality settings to get the perfect balance of size and clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Simple, Transparent Pricing
          </h2>
          <p className={`text-xl text-center mb-16 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Choose the plan that fits your needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-600' 
                : 'bg-white border-gray-200'
            } shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Free
              </h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>$0</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>/month</span>
              </div>
              <ul className={`space-y-3 mb-8 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  10 PDFs per month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Basic quality
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  7-day storage
                </li>
              </ul>
              <Link href="/auth/signin" className="btn-secondary w-full text-center block">
                Get Started
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className={`p-8 rounded-2xl border-2 border-blue-500 ${
              darkMode ? 'bg-gray-800/50' : 'bg-white'
            } shadow-lg relative`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Pro
              </h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>$9</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>/month</span>
              </div>
              <ul className={`space-y-3 mb-8 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  500 PDFs per month
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  High quality
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  30-day storage
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Priority support
                </li>
              </ul>
              <Link href="/auth/signin" className="btn-primary w-full text-center block">
                Start Pro Trial
              </Link>
            </div>
            
            {/* Enterprise Plan */}
            <div className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-600' 
                : 'bg-white border-gray-200'
            } shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Enterprise
              </h3>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>$49</span>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>/month</span>
              </div>
              <ul className={`space-y-3 mb-8 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Unlimited PDFs
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Premium quality
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Unlimited storage
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  API access
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  24/7 support
                </li>
              </ul>
              <Link href="/auth/signin" className="btn-secondary w-full text-center block">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 border-t ${
        darkMode 
          ? 'bg-gray-900/50 border-gray-700' 
          : 'bg-white/50 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              darkMode ? 'bg-blue-600' : 'bg-blue-600'
            }`}>
              <span className="text-white font-bold text-xl">W2P</span>
            </div>
            <h3 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Web2PDF
            </h3>
          </div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            © 2024 Web2PDF. All rights reserved. Convert websites to PDF with ease.
          </p>
        </div>
      </footer>
    </div>
  )
}