'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import AppLayout from '@/components/AppLayout'
import { createClient } from '@/lib/supabase'

interface StatsClientProps {
  user: any
}

interface PdfStats {
  totalPdfs: number
  thisMonth: number
  thisWeek: number
  today: number
  avgFileSize: string
  mostUsedDomain: string
  recentActivity: Array<{
    date: string
    count: number
  }>
}

export default function StatsClient({ user }: StatsClientProps) {
  const { darkMode } = useTheme()
  const [stats, setStats] = useState<PdfStats>({
    totalPdfs: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0,
    avgFileSize: '0 MB',
    mostUsedDomain: 'N/A',
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      // Fetch PDF history from Supabase
      const { data: pdfs, error } = await supabase
        .from('pdf_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching stats:', error)
        setLoading(false)
        return
      }

      if (pdfs) {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const todayCount = pdfs.filter(pdf => new Date(pdf.created_at) >= today).length
        const weekCount = pdfs.filter(pdf => new Date(pdf.created_at) >= thisWeek).length
        const monthCount = pdfs.filter(pdf => new Date(pdf.created_at) >= thisMonth).length

        // Calculate average file size
        const totalSize = pdfs.reduce((sum, pdf) => sum + (pdf.file_size || 0), 0)
        const avgSize = pdfs.length > 0 ? (totalSize / pdfs.length / 1024 / 1024).toFixed(2) : '0'

        // Find most used domain
        const domains = pdfs.map(pdf => {
          try {
            return new URL(pdf.url).hostname
          } catch {
            return 'unknown'
          }
        })
        const domainCounts = domains.reduce((acc, domain) => {
          acc[domain] = (acc[domain] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        const mostUsed = Object.entries(domainCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'

        // Generate recent activity (last 7 days)
        const activity = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
          const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
          const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
          const count = pdfs.filter(pdf => {
            const pdfDate = new Date(pdf.created_at)
            return pdfDate >= dayStart && pdfDate < dayEnd
          }).length
          activity.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            count
          })
        }

        setStats({
          totalPdfs: pdfs.length,
          thisMonth: monthCount,
          thisWeek: weekCount,
          today: todayCount,
          avgFileSize: `${avgSize} MB`,
          mostUsedDomain: mostUsed,
          recentActivity: activity
        })
      }
    } catch (error) {
      console.error('Error calculating stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
    <div className={`p-6 rounded-2xl shadow-lg ${
      darkMode 
        ? 'bg-gray-800/50 border border-gray-700/50' 
        : 'bg-white border border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mt-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <AppLayout user={user}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className={`h-8 rounded mb-4 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-32 rounded-2xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Usage Statistics
          </h1>
          <p className={`text-xl ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Track your PDF generation activity and usage patterns
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total PDFs" 
            value={stats.totalPdfs} 
            icon="📄" 
            color="bg-blue-500" 
          />
          <StatCard 
            title="This Month" 
            value={stats.thisMonth} 
            icon="📅" 
            color="bg-green-500" 
          />
          <StatCard 
            title="This Week" 
            value={stats.thisWeek} 
            icon="📊" 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Today" 
            value={stats.today} 
            icon="⚡" 
            color="bg-orange-500" 
          />
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className={`p-6 rounded-2xl shadow-lg ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              File Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Average File Size
                </span>
                <span className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stats.avgFileSize}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Most Used Domain
                </span>
                <span className={`font-semibold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stats.mostUsedDomain}
                </span>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl shadow-lg ${
            darkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-white border border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Recent Activity (Last 7 Days)
            </h3>
            <div className="space-y-2">
              {stats.recentActivity.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {day.date}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`h-2 rounded-full bg-blue-500`} 
                         style={{ width: `${Math.max(day.count * 20, 4)}px` }}>
                    </div>
                    <span className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {day.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className={`p-6 rounded-2xl shadow-lg ${
          darkMode 
            ? 'bg-gray-800/50 border border-gray-700/50' 
            : 'bg-white border border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            💡 Usage Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Optimize Your Workflow
              </h4>
              <p className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Use the recent URLs feature to quickly re-convert frequently used pages.
              </p>
            </div>
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <h4 className={`font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Batch Processing
              </h4>
              <p className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Convert multiple pages from the same domain for consistent formatting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}