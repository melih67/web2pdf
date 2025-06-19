'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { PdfExport } from '@/lib/supabase'

interface PdfHistoryProps {
  user: any
  darkMode?: boolean
}

export default function PdfHistory({ user, darkMode = false }: PdfHistoryProps) {
  const [exports, setExports] = useState<PdfExport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  const supabase = createClient()

  useEffect(() => {
    fetchExports()
  }, [currentPage])

  const fetchExports = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('pdf_exports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

      if (error) {
        throw error
      }

      setExports(data || [])
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'historique')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPublicUrl = (storagePath: string) => {
    const { data } = supabase.storage
      .from('pdfs')
      .getPublicUrl(storagePath)
    return data.publicUrl
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="text-red-600 text-center py-4">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div>
      {exports.length === 0 ? (
        <div className={`text-center py-8 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          No exports found. Start by converting a webpage to PDF!
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {exports.map((exportItem) => (
              <div
                key={exportItem.id}
                className={`border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                  darkMode 
                    ? 'border-gray-600/50 bg-gray-700/30 hover:bg-gray-700/50' 
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-lg truncate ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {exportItem.filename}
                    </h3>
                    <p className={`text-sm truncate mt-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {exportItem.url}
                    </p>
                    <p className={`text-xs mt-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {formatDate(exportItem.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-3 ml-4">
                    <a
                      href={getPublicUrl(exportItem.storage_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Open
                    </a>
                    <a
                      href={getPublicUrl(exportItem.storage_path)}
                      download={exportItem.filename}
                      className="btn-secondary text-sm px-4 py-2"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className={`flex items-center px-4 py-2 text-sm rounded-lg ${
              darkMode ? 'text-gray-300 bg-gray-700/50' : 'text-gray-600 bg-gray-100'
            }`}>
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={exports.length < itemsPerPage}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}