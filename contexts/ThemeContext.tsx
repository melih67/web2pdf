'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: () => void
  setDarkMode: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      setDarkModeState(JSON.parse(savedTheme))
    } else {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkModeState(systemPrefersDark)
    }
  }, [])

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value)
    localStorage.setItem('darkMode', JSON.stringify(value))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Prevent hydration mismatch by providing default context
  const contextValue = {
    darkMode: mounted ? darkMode : false,
    toggleDarkMode,
    setDarkMode
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={mounted && darkMode ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}