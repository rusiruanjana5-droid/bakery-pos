'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/actions/auth'
import { useFocusTrap, useAutoFocus } from '@/hooks/useFocusTrap'

interface ShiftStartModalProps {
  isOpen: boolean
  cashierName: string
  lastShiftClosingBalance?: number
  defaultShiftFloat?: number
  allowEditOpeningBalance?: boolean
  onSubmit: (openingBalance: number, notes?: string) => void
}

export default function ShiftStartModal({
  isOpen,
  cashierName,
  lastShiftClosingBalance,
  defaultShiftFloat = 0,
  allowEditOpeningBalance = true,
  onSubmit
}: ShiftStartModalProps) {
  const router = useRouter()
  const modalRef = useRef<HTMLDivElement>(null)
  const openingBalanceInputRef = useRef<HTMLInputElement>(null)

  // Auto-pre-fill: use defaultShiftFloat if set (>0), otherwise use previous closing balance
  const initialBalance = defaultShiftFloat > 0 ? defaultShiftFloat : (lastShiftClosingBalance || 0)

  const [openingBalance, setOpeningBalance] = useState(initialBalance)
  const [notes, setNotes] = useState('')
  const [currentTime, setCurrentTime] = useState('')

  // Enable focus trap when modal is open
  useFocusTrap(isOpen, modalRef)

  // Auto-focus opening balance input when modal opens (if editable)
  useAutoFocus(isOpen && allowEditOpeningBalance, openingBalanceInputRef)

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
      const initialBalance = defaultShiftFloat > 0 ? defaultShiftFloat : (lastShiftClosingBalance || 0)
      setOpeningBalance(initialBalance)
      setNotes('')
    }
  }, [isOpen, lastShiftClosingBalance, defaultShiftFloat])

  // Prevent ESC key from closing modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
      }
    }
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if there's a discrepancy from previous closing balance
    const hasDiscrepancy = lastShiftClosingBalance && openingBalance !== lastShiftClosingBalance
    
    // Require notes if there's a discrepancy
    if (hasDiscrepancy && !notes.trim()) {
      alert('Please provide a reason for the discrepancy in the Opening Notes field.')
      return
    }
    
    if (openingBalance < 0) {
      alert('Opening balance cannot be negative')
      return
    }
    onSubmit(openingBalance, notes || undefined)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: redirect to login even if logout fails
      router.push('/login')
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Prevent closing when clicking backdrop
    e.preventDefault()
    e.stopPropagation()
  }

  const isValidOpeningBalance = openingBalance >= 0 && !isNaN(openingBalance) ? true : false
  const hasDiscrepancy = lastShiftClosingBalance && openingBalance !== lastShiftClosingBalance
  const notesRequired = hasDiscrepancy ? true : false

  if (!isOpen) return null

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
        <div className="bg-amber-500 text-white p-4 rounded-t-lg">
          <h2 className="text-lg font-bold">🔑 Start Your Shift</h2>
          <p className="text-sm opacity-90">Please confirm your opening cash drawer balance</p>
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

          {/* Date & Time */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Date & Time (Sri Lanka)</label>
            <input
              type="text"
              value={currentTime}
              readOnly
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-mono"
            />
          </div>

          {/* Previous Closing Balance */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Previous Closing Balance</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rs.</span>
              <input
                type="number"
                value={lastShiftClosingBalance?.toFixed(2) || '0.00'}
                readOnly
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed font-medium"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Closing balance from your last shift</p>
          </div>

          {/* Opening Cash Balance */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Opening Cash Balance *
              {defaultShiftFloat > 0 && <span className="text-amber-600 ml-1">(Default Float)</span>}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">Rs.</span>
              <input
                ref={openingBalanceInputRef}
                type="number"
                step="0.01"
                min="0"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
                readOnly={!allowEditOpeningBalance}
                className={`w-full pl-10 pr-3 py-2 text-sm border rounded-lg font-medium ${
                  !allowEditOpeningBalance
                    ? 'bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300'
                    : 'border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent'
                }`}
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {defaultShiftFloat > 0 
                ? `Default float set by admin (edit ${allowEditOpeningBalance ? 'if needed' : 'disabled'})`
                : `Previous closing balance (edit ${allowEditOpeningBalance ? 'if needed' : 'disabled'})`
              }
            </p>
          </div>

          {/* Discrepancy Warning */}
          {hasDiscrepancy && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 font-semibold">
                ⚠️ Discrepancy Detected
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Opening balance differs from previous closing balance by Rs. {Math.abs(openingBalance - (lastShiftClosingBalance || 0)).toFixed(2)}
              </p>
            </div>
          )}

          {/* Opening Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Opening Notes {notesRequired && <span className="text-red-600">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none ${
                notesRequired && !notes.trim() ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
              }`}
              placeholder={hasDiscrepancy ? "Required: Explain the discrepancy (e.g., Admin took Rs. 1000 for flour purchase)" : "e.g., Received 2000 in Rs.500 notes, short 500 from previous shift"}
            />
            <p className="mt-1 text-xs text-gray-500">
              {hasDiscrepancy ? "Required: Please explain the discrepancy" : "Any discrepancies or notes about the cash drawer"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-600 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
            
            {/* Start Shift Button */}
            <button
              type="submit"
              disabled={!isValidOpeningBalance || (notesRequired && !notes.trim())}
              className="flex-[2] bg-amber-500 text-white py-3 rounded-lg font-semibold text-sm hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500"
            >
              Start Shift & Begin Sales
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
