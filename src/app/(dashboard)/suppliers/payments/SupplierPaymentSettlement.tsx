'use client'

import { useState, useEffect } from 'react'
import { getOutstandingGRNs, allocatePayment } from '@/actions/supplierPayment'

interface Supplier {
  id: number
  name: string
  company: string
  currentBalance: number | null
  paymentStatus: string | null
}

interface GRN {
  id: number
  invoiceNumber: string | null
  receivedDate: string
  totalAmount: number | null
  paidAmount: number | null
  balanceAmount: number | null
  paymentStatus: string
  product: {
    name: string
  }
}

interface SupplierPaymentSettlementProps {
  suppliers: Supplier[]
}

interface Allocation {
  grnId: number
  amount: number
}

export function SupplierPaymentSettlement({ suppliers }: SupplierPaymentSettlementProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null)
  const [outstandingGRNs, setOutstandingGRNs] = useState<GRN[]>([])
  const [paymentAmount, setPaymentAmount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [remainingAmount, setRemainingAmount] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (selectedSupplier) {
      loadOutstandingGRNs(selectedSupplier)
    } else {
      setOutstandingGRNs([])
      setAllocations([])
      setPaymentAmount(0)
    }
  }, [selectedSupplier])

  useEffect(() => {
    const totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.amount, 0)
    setRemainingAmount(paymentAmount - totalAllocated)
  }, [paymentAmount, allocations])

  const loadOutstandingGRNs = async (supplierId: number) => {
    const result = await getOutstandingGRNs(supplierId)
    if (result.success) {
      setOutstandingGRNs(result.grns ?? [] as any)
      // Initialize allocations with 0
      setAllocations((result.grns ?? []).map(grn => ({ grnId: grn.id, amount: 0 })))
    }
  }

  const handleAllocationChange = (grnId: number, amount: number) => {
    const maxAmount = outstandingGRNs.find(grn => grn.id === grnId)?.balanceAmount || 0
    const clampedAmount = Math.min(Math.max(0, amount), maxAmount)
    
    setAllocations(prev => prev.map(alloc => 
      alloc.grnId === grnId ? { ...alloc, amount: clampedAmount } : alloc
    ))
  }

  const handleAutoAllocate = () => {
    let remaining = paymentAmount
    const newAllocations = [...allocations]
    
    for (let i = 0; i < outstandingGRNs.length && remaining > 0; i++) {
      const grn = outstandingGRNs[i]
      const balance = grn.balanceAmount || 0
      const allocateAmount = Math.min(remaining, balance)
      
      newAllocations[i] = { grnId: grn.id, amount: allocateAmount }
      remaining -= allocateAmount
    }
    
    setAllocations(newAllocations)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSupplier || paymentAmount <= 0) {
      setToast({ message: 'Please select a supplier and enter a payment amount', type: 'error' })
      return
    }
    
    const validAllocations = allocations.filter(alloc => alloc.amount > 0)
    if (validAllocations.length === 0) {
      setToast({ message: 'Please allocate payment to at least one GRN', type: 'error' })
      return
    }
    
    const formData = new FormData()
    formData.append('supplierId', selectedSupplier.toString())
    formData.append('paymentAmount', paymentAmount.toString())
    formData.append('paymentMethod', paymentMethod)
    formData.append('allocations', JSON.stringify(validAllocations))
    
    const result = await allocatePayment(formData)
    
    if (result.success) {
      setToast({ message: `Payment of Rs. ${(result.totalAllocated ?? 0).toFixed(2)} allocated successfully`, type: 'success' })
      // Reload outstanding GRNs
      loadOutstandingGRNs(selectedSupplier)
      setPaymentAmount(0)
    } else {
      setToast({ message: `Failed to allocate payment: ${result.error}`, type: 'error' })
    }
  }

  const totalOutstanding = outstandingGRNs.reduce((sum, grn) => sum + (grn.balanceAmount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Supplier Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Select Supplier</h2>
        <select
          value={selectedSupplier || ''}
          onChange={(e) => setSelectedSupplier(Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name} - {supplier.company} (Outstanding: Rs. {(supplier.currentBalance || 0).toFixed(2)})
            </option>
          ))}
        </select>
      </div>

      {selectedSupplier && outstandingGRNs.length > 0 && (
        <>
          {/* Outstanding GRNs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Outstanding GRNs</h2>
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-blue-800 font-medium">Total Outstanding:</span>
                <span className="text-xl font-bold text-blue-900">Rs. {totalOutstanding.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Paid</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Allocate</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {outstandingGRNs.map((grn) => (
                    <tr key={grn.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{grn.invoiceNumber || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{grn.product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(grn.receivedDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        Rs. {(grn.totalAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        Rs. {(grn.paidAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        Rs. {(grn.balanceAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max={grn.balanceAmount || 0}
                          step="0.01"
                          value={allocations.find(a => a.grnId === grn.id)?.amount || 0}
                          onChange={(e) => handleAllocationChange(grn.id, parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter payment amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit</option>
                    <option value="Cheque / Bank Transfer">Cheque / Bank Transfer</option>
                    <option value="Advance">Advance</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm text-gray-600">Total Allocated:</span>
                  <span className="ml-2 text-lg font-bold text-gray-900">
                    Rs. {allocations.reduce((sum, alloc) => sum + alloc.amount, 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Remaining:</span>
                  <span className={`ml-2 text-lg font-bold ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Rs. {remainingAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAutoAllocate}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Auto Allocate
                </button>
                <button
                  type="submit"
                  disabled={remainingAmount < 0 || allocations.every(a => a.amount === 0)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Allocate Payment
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {selectedSupplier && outstandingGRNs.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No outstanding GRNs found for this supplier
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
