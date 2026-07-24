'use client'

import { useState, useEffect } from 'react'
import { getStoreSettings } from '@/actions/store'

export default function ExportButton() {
  const [filter, setFilter] = useState<'today' | '7days' | 'thisMonth' | 'thisYear' | 'custom'>('thisMonth')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'pdf'>('csv')

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getStoreSettings()
        if (settings && (settings as any).exportFormat) {
          setExportFormat((settings as any).exportFormat as 'csv' | 'xlsx' | 'pdf')
        }
      } catch (error) {
        console.error('Failed to load store settings:', error)
      }
    }
    loadSettings()
  }, [])

  const handleExport = async () => {
    setLoading(true)
    try {
      let url = `/api/reports/export?filter=${filter}&format=${exportFormat}`
      if (filter === 'custom' && customStartDate && customEndDate) {
        url += `&startDate=${customStartDate}&endDate=${customEndDate}`
      }
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      const dateStr = new Date().toISOString().split('T')[0]
      const extension = exportFormat === 'pdf' ? 'pdf' : exportFormat === 'xlsx' ? 'xlsx' : 'csv'
      a.download = `Sales_Report_${filter}_${dateStr}.${extension}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(downloadUrl)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value as 'today' | '7days' | 'thisMonth' | 'thisYear' | 'custom')}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm h-10"
      >
        <option value="today">Today</option>
        <option value="7days">Last 7 Days</option>
        <option value="thisMonth">This Month</option>
        <option value="thisYear">This Year</option>
        <option value="custom">Custom Range</option>
      </select>
      {filter === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={customStartDate}
            onChange={(e) => setCustomStartDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm h-10"
          />
          <input
            type="date"
            value={customEndDate}
            onChange={(e) => setCustomEndDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm h-10"
          />
        </div>
      )}
      <button
        onClick={handleExport}
        disabled={loading || (filter === 'custom' && (!customStartDate || !customEndDate))}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-10"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Exporting...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export
          </>
        )}
      </button>
    </div>
  )
}
