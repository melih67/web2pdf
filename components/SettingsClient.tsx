'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import AppLayout from '@/components/AppLayout'
import { createClient } from '@/lib/supabase'

interface SettingsClientProps {
  user: any
}

interface UserSettings {
  defaultFormat: string
  defaultQuality: string
  autoDownload: boolean
  saveHistory: boolean
  emailNotifications: boolean
  darkModeSync: boolean
  defaultPageSize: string
  includeBackground: boolean
  waitForImages: boolean
  timeout: number
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const { darkMode, toggleDarkMode } = useTheme()
  const [settings, setSettings] = useState<UserSettings>({
    defaultFormat: 'A4',
    defaultQuality: 'high',
    autoDownload: true,
    saveHistory: true,
    emailNotifications: false,
    darkModeSync: true,
    defaultPageSize: 'A4',
    includeBackground: true,
    waitForImages: true,
    timeout: 30
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadSettings()
  }, [user])

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        setSettings({
          defaultFormat: data.default_format || 'A4',
          defaultQuality: data.default_quality || 'high',
          autoDownload: data.auto_download ?? true,
          saveHistory: data.save_history ?? true,
          emailNotifications: data.email_notifications ?? false,
          darkModeSync: data.dark_mode_sync ?? true,
          defaultPageSize: data.default_page_size || 'A4',
          includeBackground: data.include_background ?? true,
          waitForImages: data.wait_for_images ?? true,
          timeout: data.timeout || 30
        })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          default_format: settings.defaultFormat,
          default_quality: settings.defaultQuality,
          auto_download: settings.autoDownload,
          save_history: settings.saveHistory,
          email_notifications: settings.emailNotifications,
          dark_mode_sync: settings.darkModeSync,
          default_page_size: settings.defaultPageSize,
          include_background: settings.includeBackground,
          wait_for_images: settings.waitForImages,
          timeout: settings.timeout,
          updated_at: new Date().toISOString()
        })

      if (error) {
        setMessage('Error saving settings. Please try again.')
      } else {
        setMessage('Settings saved successfully!')
      }
    } catch (error) {
      setMessage('Error saving settings. Please try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const updateSetting = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const SettingCard = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <div className={`p-6 rounded-2xl shadow-lg ${
      darkMode 
        ? 'bg-gray-800/50 border border-gray-700/50' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="mb-4">
        <h3 className={`text-lg font-semibold mb-1 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h3>
        <p className={`text-sm ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {description}
        </p>
      </div>
      {children}
    </div>
  )

  const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between">
      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
        {label}
      </span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const Select = ({ value, onChange, options, label }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; label: string }) => (
    <div className="flex items-center justify-between">
      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-3 py-2 rounded-lg border transition-colors ${
          darkMode 
            ? 'bg-gray-700 border-gray-600 text-white' 
            : 'bg-white border-gray-300 text-gray-900'
        }`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )

  if (loading) {
    return (
      <AppLayout user={user}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className={`h-8 rounded ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`h-48 rounded-2xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            ))}
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Settings
          </h1>
          <p className={`text-xl ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Customize your PDF conversion preferences
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Error') 
              ? (darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700')
              : (darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700')
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* PDF Generation Settings */}
          <SettingCard
            title="PDF Generation"
            description="Configure default settings for PDF conversion"
          >
            <div className="space-y-4">
              <Select
                label="Default Page Size"
                value={settings.defaultPageSize}
                onChange={(value) => updateSetting('defaultPageSize', value)}
                options={[
                  { value: 'A4', label: 'A4' },
                  { value: 'Letter', label: 'Letter' },
                  { value: 'Legal', label: 'Legal' },
                  { value: 'A3', label: 'A3' }
                ]}
              />
              <Select
                label="Default Quality"
                value={settings.defaultQuality}
                onChange={(value) => updateSetting('defaultQuality', value)}
                options={[
                  { value: 'low', label: 'Low (Faster)' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High (Better Quality)' }
                ]}
              />
              <Toggle
                checked={settings.includeBackground}
                onChange={(checked) => updateSetting('includeBackground', checked)}
                label="Include Background Graphics"
              />
              <Toggle
                checked={settings.waitForImages}
                onChange={(checked) => updateSetting('waitForImages', checked)}
                label="Wait for Images to Load"
              />
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  Timeout (seconds)
                </span>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={settings.timeout}
                  onChange={(e) => updateSetting('timeout', parseInt(e.target.value))}
                  className={`w-20 px-3 py-2 rounded-lg border transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </SettingCard>

          {/* User Experience */}
          <SettingCard
            title="User Experience"
            description="Customize how the application behaves"
          >
            <div className="space-y-4">
              <Toggle
                checked={settings.autoDownload}
                onChange={(checked) => updateSetting('autoDownload', checked)}
                label="Auto-download PDFs"
              />
              <Toggle
                checked={settings.saveHistory}
                onChange={(checked) => updateSetting('saveHistory', checked)}
                label="Save PDF History"
              />
              <Toggle
                checked={settings.darkModeSync}
                onChange={(checked) => updateSetting('darkModeSync', checked)}
                label="Sync Dark Mode with System"
              />
            </div>
          </SettingCard>

          {/* Notifications */}
          <SettingCard
            title="Notifications"
            description="Manage your notification preferences"
          >
            <div className="space-y-4">
              <Toggle
                checked={settings.emailNotifications}
                onChange={(checked) => updateSetting('emailNotifications', checked)}
                label="Email Notifications"
              />
            </div>
          </SettingCard>

          {/* Account */}
          <SettingCard
            title="Account"
            description="Manage your account settings"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className={`block font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Email Address
                  </span>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {user.email}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className={`block font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Member Since
                  </span>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={toggleDarkMode}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Switch to {darkMode ? 'Light' : 'Dark'} Mode
                </button>
              </div>
            </div>
          </SettingCard>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}