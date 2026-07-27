'use client'

import { useState, useEffect } from 'react'
import { getPendingGRNsBySupplier, recordSupplierPayment } from '@/actions/grn'

interface GRN {
  id: number
  invoiceNumber?: string | null
  dueDate?: Date | null
  totalAmount?: number | null
  paidAmount?: number | null
  balanceAmount?: number | null
  paymentStatus: string
  product?: {
    name: string
  }
}

interface SupplierPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  supplierId: number
  supplierName: string
}

export default function SupplierPaymentModal({ isOpen, onClose, supplierId, supplierName }: SupplierPaymentModalProps) {
  const [mounted, setMounted] = useState(false)
  const [pendingGRNs, setPendingGRNs] = useState<GRN[]>([])
  const [selectedGRNs, setSelectedGRNs] = useState<number[]>([])
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen && mounted) {
      loadPendingGRNs()
    }
  }, [isOpen, mounted, supplierId])

  const loadPendingGRNs = async () => {
    try {
      const grns = await getPendingGRNsBySupplier(supplierId)
      setPendingGRNs(grns)
      // Auto-select all pending GRNs by default
      setSelectedGRNs(grns.map(g => g.id))
    } catch (err) {
      setError('Failed to load pending bills')
    }
  }

  const toggleGRNSelection = (grnId: number) => {
    setSelectedGRNs(prev =>
      prev.includes(grnId)
        ? prev.filter(id => id !== grnId)
        : [...prev, grnId]
    )
  }

  const calculateTotalSelectedBalance = () => {
    return pendingGRNs
      .filter(grn => selectedGRNs.includes(grn.id))
      .reduce((sum, grn) => {
        const balance = grn.balanceAmount ?? (grn.totalAmount || 0) - (grn.paidAmount || 0)
        return sum + balance
      }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (selectedGRNs.length === 0) {
      setError('Please select at least one bill to pay')
      return
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      setError('Please enter a valid payment amount')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('supplierId', supplierId.toString())
      formData.append('paymentAmount', paymentAmount)
      formData.append('paymentMethod', paymentMethod)
      formData.append('referenceNumber', referenceNumber)
      formData.append('selectedGRNs', JSON.stringify(selectedGRNs))
      formData.append('paymentDate', paymentDate)
      formData.append('notes', notes)

      const result = await recordSupplierPayment(formData)

      if (result.success) {
        onClose()
        // Optional: refresh the page or show success message
      } else {
        setError('Payment failed. Please try again.')
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !mounted) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Settle Bills - {supplierName}</h2>
          <p className="text-sm text-gray-600 mt-1">Select bills and enter payment amount</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {pendingGRNs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No pending bills for this supplier
            </div>
          ) : (
            <>
              {/* Bills Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Pending Bills</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {pendingGRNs.map((grn) => {
                    const balance = grn.balanceAmount ?? (grn.totalAmount || 0) - (grn.paidAmount || 0)
                    return (
                      <div
                        key={grn.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedGRNs.includes(grn.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleGRNSelection(grn.id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedGRNs.includes(grn.id)}
                          onChange={() => toggleGRNSelection(grn.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-800">
                              GRN #{grn.id} - {grn.product?.name}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              grn.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              grn.paymentStatus === 'PARTIALLY_PAID' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {grn.paymentStatus}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>Inv: {grn.invoiceNumber || 'N/A'}</span>
                            <span>Due: {grn.dueDate ? new Date(grn.dueDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-600">Balance:</span>
                            <span className="font-semibold text-gray-800">Rs. {balance.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Payment Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Selected Balance
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-lg font-bold text-gray-800">
                        Rs. {calculateTotalSelectedBalance().toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Method *
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Card">Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Receipt/Ref No"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Optional notes"
                  />
                </div>
              </form>
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || pendingGRNs.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}
