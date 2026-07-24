'use client'

import { useState, useEffect } from 'react'

interface Denomination {
  value: number
  label: string
  type: 'coin' | 'note'
}

const denominations: Denomination[] = [
  { value: 1, label: 'Rs. 1', type: 'coin' },
  { value: 2, label: 'Rs. 2', type: 'coin' },
  { value: 5, label: 'Rs. 5', type: 'coin' },
  { value: 10, label: 'Rs. 10', type: 'coin' },
  { value: 20, label: 'Rs. 20', type: 'note' },
  { value: 50, label: 'Rs. 50', type: 'note' },
  { value: 100, label: 'Rs. 100', type: 'note' },
  { value: 500, label: 'Rs. 500', type: 'note' },
  { value: 1000, label: 'Rs. 1000', type: 'note' },
  { value: 2000, label: 'Rs. 2000', type: 'note' },
  { value: 5000, label: 'Rs. 5000', type: 'note' }
]

interface CashDenominationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CashDenominationModal({ isOpen, onClose }: CashDenominationModalProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Reset quantities when modal opens
      setQuantities({})
      setCopied(false)
    }
  }, [isOpen])

  const handleQuantityChange = (value: number, qty: number) => {
    setQuantities(prev => ({
      ...prev,
      [value]: Math.max(0, qty)
    }))
  }

  const calculateTotal = () => {
    return denominations.reduce((total, denom) => {
      const qty = quantities[denom.value] || 0
      return total + (denom.value * qty)
    }, 0)
  }

  const calculateDenominationTotal = (value: number) => {
    const qty = quantities[value] || 0
    return value * qty
  }

  const handleReset = () => {
    setQuantities({})
    setCopied(false)
  }

  const handleCopyToClipboard = () => {
    const total = calculateTotal()
    navigator.clipboard.writeText(`Rs. ${total.toFixed(2)}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen || !mounted) return null

  const grandTotal = calculateTotal()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onKeyDown={handleKeyDown}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h2 className="text-xl font-bold">Cash Denomination Counter</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-amber-100 transition-colors"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Denominations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {denominations.map((denom) => (
              <div
                key={denom.value}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  denom.type === 'coin' 
                    ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300' 
                    : 'bg-green-50 border-green-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-8 rounded flex items-center justify-center text-xs font-bold ${
                    denom.type === 'coin' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                  }`}>
                    {denom.value}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{denom.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    value={quantities[denom.value] || ''}
                    onChange={(e) => handleQuantityChange(denom.value, parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
                  <div className="w-24 text-right">
                    <span className="text-sm font-semibold text-gray-800">
                      Rs. {calculateDenominationTotal(denom.value).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Grand Total Display */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-amber-700 uppercase tracking-wider">Grand Total</p>
                <p className="text-3xl font-bold text-amber-900 mt-1">Rs. {grandTotal.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  className="px-4 py-2 bg-white border border-amber-300 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Clear / Reset
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
            >
              OK / Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
