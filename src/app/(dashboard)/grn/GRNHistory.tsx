'use client'

import { useEffect, useState } from 'react'
import SupplierPaymentModal from '@/components/SupplierPaymentModal'

interface GRN {
  id: number
  createdAt?: Date
  product?: {
    name: string
  }
  supplier?: {
    name: string
    id: number
  }
  quantity: number
  unitCost: number
  totalAmount?: number
  paidAmount?: number
  balanceAmount?: number
  paymentStatus?: string
}

interface GRNHistoryProps {
  grns: GRN[]
}

export function GRNHistory({ grns }: GRNHistoryProps) {
  const [mounted, setMounted] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<{ id: number; name: string } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleOpenPaymentModal = (supplier: { id: number; name: string }) => {
    setSelectedSupplier(supplier)
    setShowPaymentModal(true)
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedSupplier(null)
  }

  const handlePrintPDF = (grn: any) => {
    // Placeholder for PDF generation
    alert(`Generating PDF for GRN #${grn.id} - ${grn.product?.name}\n\nPDF generation will be implemented with a library like jsPDF or react-pdf`)
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 sticky top-8">
        <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Recent GRN History</h2>
        <div className="space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
          <p className="text-sm text-gray-500 text-center py-8">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 lg:p-6 sticky top-8">
      <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Recent GRN History</h2>
      <div className="space-y-3 max-h-[400px] lg:max-h-[600px] overflow-y-auto">
        {grns.slice(0, 10).map((grn: any) => (
          <div key={grn.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-amber-600">GRN #{grn.id}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                grn.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                grn.paymentStatus === 'PARTIALLY_PAID' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {grn.paymentStatus || 'PENDING'}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">{grn.product?.name || 'Unknown Product'}</p>
            <p className="text-xs text-gray-600 mb-2">Supplier: {grn.supplier?.name || 'Unknown'}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-600">Qty: {grn.quantity}</span>
              <span className="text-sm font-semibold text-gray-800">
                Rs. {(grn.quantity * grn.unitCost).toFixed(2)}
              </span>
            </div>
            {grn.balanceAmount !== undefined && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-600">Balance:</span>
                <span className="text-sm font-semibold text-gray-800">
                  Rs. {grn.balanceAmount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handlePrintPDF(grn)}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                PDF
              </button>
              {grn.supplier?.id && (grn.paymentStatus === 'PENDING' || grn.paymentStatus === 'PARTIALLY_PAID') && (
                <button
                  onClick={() => handleOpenPaymentModal({ id: grn.supplier.id, name: grn.supplier.name })}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pay
                </button>
              )}
            </div>
          </div>
        ))}
        {grns.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">No GRN history yet</p>
        )}
      </div>
      {showPaymentModal && selectedSupplier && (
        <SupplierPaymentModal
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          supplierId={selectedSupplier.id}
          supplierName={selectedSupplier.name}
        />
      )}
    </div>
  )
}
