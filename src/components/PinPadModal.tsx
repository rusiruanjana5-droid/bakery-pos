'use client'

import { useState, useEffect } from 'react'

interface PinPadModalProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (pin: string) => Promise<{ success: boolean; error?: string; user?: any }>
  title?: string
  description?: string
  requireManager?: boolean
}

export default function PinPadModal({
  isOpen,
  onClose,
  onVerify,
  title = 'Enter PIN',
  description = 'Enter your 4-digit PIN to continue',
  requireManager = false
}: PinPadModalProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPin('')
      setError('')
      setIsVerifying(false)
    }
  }, [isOpen])

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key >= '0' && e.key <= '9' && pin.length < 4) {
        e.preventDefault()
        e.stopPropagation()
        setPin(prev => prev + e.key)
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        e.stopPropagation()
        setPin(prev => prev.slice(0, -1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        if (pin.length === 4) {
          await handleVerify()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true) // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [isOpen, pin, onVerify, onClose])

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num)
    }
  }

  const handleClear = () => {
    setPin('')
    setError('')
  }

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1))
    setError('')
  }

  const handleVerify = async () => {
    if (pin.length !== 4) {
      setError('Please enter a 4-digit PIN')
      return
    }

    setIsVerifying(true)
    setError('')

    try {
      const result = await onVerify(pin)
      
      if (result.success) {
        setPin('')
        onClose()
      } else {
        setError(result.error || 'Invalid PIN')
        setPin('')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setPin('')
    } finally {
      setIsVerifying(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 text-center">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-slate-300 text-sm">{description}</p>
          {requireManager && (
            <p className="text-amber-400 text-xs mt-2 font-medium">
              ⚠️ Manager/Admin PIN Required
            </p>
          )}
        </div>

        {/* PIN Display */}
        <div className="p-6">
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  pin[index]
                    ? 'bg-primary border-primary text-white'
                    : 'border-slate-300 bg-slate-50'
                }`}
              >
                {pin[index] ? '•' : ''}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm text-center mb-4">
              {error}
            </div>
          )}

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="h-16 bg-slate-100 hover:bg-slate-200 rounded-xl text-2xl font-bold text-slate-800 transition-colors active:scale-95"
                disabled={isVerifying}
              >
                {num}
              </button>
            ))}
            <button
              onClick={handleClear}
              className="h-16 bg-red-100 hover:bg-red-200 rounded-xl text-sm font-medium text-red-700 transition-colors active:scale-95"
              disabled={isVerifying}
            >
              Clear
            </button>
            <button
              onClick={() => handleNumberClick('0')}
              className="h-16 bg-slate-100 hover:bg-slate-200 rounded-xl text-2xl font-bold text-slate-800 transition-colors active:scale-95"
              disabled={isVerifying}
            >
              0
            </button>
            <button
              onClick={handleBackspace}
              className="h-16 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors active:scale-95"
              disabled={isVerifying}
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 rounded-lg font-medium text-slate-700 transition-colors"
              disabled={isVerifying}
            >
              Cancel
            </button>
            <button
              onClick={handleVerify}
              disabled={pin.length !== 4 || isVerifying}
              className="flex-1 py-3 bg-primary text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
