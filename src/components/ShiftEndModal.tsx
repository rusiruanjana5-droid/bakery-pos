'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFocusTrap, useAutoFocus } from '@/hooks/useFocusTrap'

interface ShiftEndModalProps {
  isOpen: boolean
  cashierName: string
  shiftStartTime: Date
  openingBalance: number
  totalCashSales: number
  onSubmit: (closingCash: number, notes?: string) => void
  onClose: () => void
}

export default function ShiftEndModal({
  isOpen,
  cashierName,
  shiftStartTime,
  openingBalance,
  totalCashSales,
  onSubmit,
  onClose
}: ShiftEndModalProps) {
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)
  const closingCashInputRef = useRef<HTMLInputElement>(null)

  // Expected cash = opening balance + total cash sales
  const expectedCash = openingBalance + totalCashSales

  const [closingCash, setClosingCash] = useState(expectedCash)
  const [notes, setNotes] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [shiftDuration, setShiftDuration] = useState('')

  // Enable focus trap when modal is open
  useFocusTrap(isOpen, modalRef)

  // Auto-focus closing cash input when modal opens
  useAutoFocus(isOpen, closingCashInputRef)

  useEffect(() => {
    // Update current time every second (Sri Lanka Standard Time)
    const updateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Colombo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }
      setCurrentTime(now.toLocaleString('en-LK', options))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setClosingCash(expectedCash)
      setNotes('')
    }
  }, [isOpen, expectedCash])

  // Calculate shift duration
  useEffect(() => {
    const calculateDuration = () => {
      const now = new Date()
      const start = new Date(shiftStartTime)
      const diffMs = now.getTime() - start.getTime()
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      
      const startTimeStr = start.toLocaleString('en-LK', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
      
      setShiftDuration(`Logged in since: ${startTimeStr} | Total Time: ${hours}h ${minutes}m`)
    }

    if (isOpen) {
      calculateDuration()
      const interval = setInterval(calculateDuration, 60000) // Update every minute
      return () => clearInterval(interval)
    }
  }, [isOpen, shiftStartTime])

  // Allow ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        onClose()
      }
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if there's a variance from expected cash
    const variance = closingCash - expectedCash
    
    // Require notes if there's a variance
    if (variance !== 0 && !notes.trim()) {
      alert('Please provide a reason for the variance in the Notes field.')
      return
    }
    
    if (closingCash < 0) {
      alert('Closing cash cannot be negative')
      return
    }
    onSubmit(closingCash, notes || undefined)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Close modal when clicking backdrop
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const isValidClosingCash = closingCash >= 0 && !isNaN(closingCash)
  const variance = closingCash - expectedCash
  const hasVariance = variance !== 0
  const notesRequired = hasVariance

  if (!isOpen) return null

  const currentDate = new Date().toLocaleDateString('en-LK', {
    timeZone: 'Asia/Colombo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-red-500 text-white p-4 rounded-t-lg">
          <h2 className="text-lg font-bold">🔒 End Shift / Cashier Logout</h2>
          <p className="text-sm opacity-90">Please confirm your closing cash drawer balance</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Cashier Name */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Cashier Name</label>
            <input
              type="text"
              value={cashierName}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
            />
          </div>

          {/* Current Date */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Current Date</label>
            <input
              type="text"
              value={currentDate}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
            />
          </div>

          {/* Shift Duration */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Shift Duration</label>
            <input
              type="text"
              value={shiftDuration}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
            />
          </div>

          {/* Expected Drawer Cash */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Expected Drawer Cash</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rs.</span>
              <input
                type="number"
                value={expectedCash.toFixed(2)}
                readOnly
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Opening Balance (Rs. {openingBalance.toFixed(2)}) + Cash Sales (Rs. {totalCashSales.toFixed(2)})
            </p>
          </div>

          {/* Closing Cash */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Closing Cash / Final Drawer Count (Rs.) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rs.</span>
              <input
                ref={closingCashInputRef}
                type="number"
                step="0.01"
                min="0"
                value={closingCash}
                onChange={(e) => setClosingCash(parseFloat(e.target.value) || 0)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-medium"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Actual cash in drawer (count and enter the final amount)
            </p>

            {/* Real-time Variance Indicator */}
            <div className={`mt-2 p-2 rounded-md border text-xs font-medium ${
              variance === 0
                ? 'bg-green-50 border-green-200 text-green-800'
                : variance > 0
                ? 'bg-orange-50 border-orange-200 text-orange-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {variance === 0 ? (
                <span className="flex items-center gap-1">
                  <span>✓</span> Matched / Balanced (Rs. 0.00)
                </span>
              ) : variance > 0 ? (
                <span className="flex items-center gap-1">
                  <span>⚠️</span> Excess of Rs. {variance.toFixed(2)}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span>⚠️</span> Shortage of Rs. {Math.abs(variance).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Detailed Variance Warning */}
          {hasVariance && (
            <div className={`p-3 rounded-lg border ${variance > 0 ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-xs font-semibold ${variance > 0 ? 'text-orange-800' : 'text-red-800'}`}>
                {variance > 0 ? '💰 Surplus Detected' : '⚠️ Shortage Detected'}
              </p>
              <p className={`text-xs mt-1 ${variance > 0 ? 'text-orange-700' : 'text-red-700'}`}>
                {variance > 0 ? 'Cash exceeds expected by' : 'Cash is short by'} Rs. {Math.abs(variance).toFixed(2)}
              </p>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Notes {notesRequired && <span className="text-red-600">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none ${
                notesRequired && !notes.trim() ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
              }`}
              placeholder={hasVariance ? "Required: Explain the variance (e.g., Cash used for supplier payment)" : "Any notes about the shift or cash drawer"}
            />
            <p className="mt-1 text-xs text-gray-500">
              {hasVariance ? "Required: Please explain the variance" : "Optional notes about the shift"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            {/* Logout / End Shift Button */}
            <button
              type="submit"
              disabled={!isValidClosingCash || (notesRequired && !notes.trim())}
              className="flex-[2] bg-red-500 text-white py-3 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-500"
            >
              Logout / End Shift
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
