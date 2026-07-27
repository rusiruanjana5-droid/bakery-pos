'use client'

import { useState } from 'react'
import { updateChequeStatus } from '@/actions/cheque'
import { ChequeStatus } from '@prisma/client'

interface Cheque {
  id: number
  invoiceNumber: string | null
  chequeNumber: string | null
  bankName: string | null
  chequeDate: Date | null
  chequeStatus: ChequeStatus | null
  totalAmount: number | null
  receivedDate: Date
  supplier: {
    name: string
    company: string
  }
  product: {
    name: string
  }
}

interface ChequeStats {
  total: number
  pending: number
  realized: number
  returned: number
  maturing: number
}

interface ChequeManagementDashboardProps {
  cheques: Cheque[]
  stats: ChequeStats | null
  maturingCheques: Cheque[]
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REALIZED: 'bg-green-100 text-green-800',
  RETURNED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800'
}

const statusLabels = {
  PENDING: 'Pending',
  REALIZED: 'Cleared',
  RETURNED: 'Returned',
  CANCELLED: 'Cancelled'
}

export function ChequeManagementDashboard({ cheques, stats, maturingCheques }: ChequeManagementDashboardProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const filteredCheques = filterStatus === 'ALL' 
    ? cheques 
    : cheques.filter(cheque => cheque.chequeStatus === filterStatus)

  const handleStatusUpdate = async (grnId: number, newStatus: ChequeStatus) => {
    const result = await updateChequeStatus(grnId, newStatus)
    if (result.success) {
      setToast({ message: `Cheque status updated to ${statusLabels[newStatus]}`, type: 'success' })
      window.location.reload()
    } else {
      setToast({ message: `Failed to update status: ${result.error}`, type: 'error' })
    }
  }

  const getChequeStatus = (cheque: Cheque) => {
    if (!cheque.chequeDate) return 'Pending'
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const chequeDate = new Date(cheque.chequeDate)
    chequeDate.setHours(0, 0, 0, 0)
    
    if (chequeDate.getTime() === today.getTime()) {
      return 'Due Today'
    }
    
    return statusLabels[cheque.chequeStatus || 'PENDING']
  }

  const getChequeStatusColor = (cheque: Cheque) => {
    if (!cheque.chequeDate) return statusColors.PENDING
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const chequeDate = new Date(cheque.chequeDate)
    chequeDate.setHours(0, 0, 0, 0)
    
    if (chequeDate.getTime() === today.getTime()) {
      return 'bg-orange-100 text-orange-800'
    }
    
    return statusColors[cheque.chequeStatus || 'PENDING']
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Cheques</div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Pending</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Cleared</div>
            <div className="text-2xl font-bold text-green-600">{stats.realized}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Returned</div>
            <div className="text-2xl font-bold text-red-600">{stats.returned}</div>
          </div>
        </div>
      )}

      {/* Maturing Cheques Alert */}
      {maturingCheques.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-orange-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-orange-900">Cheques Maturing Soon</h3>
              <p className="text-sm text-orange-700">{maturingCheques.length} cheque(s) maturing within the next 3 days</p>
            </div>
          </div>
        </div>
      )}

      {/* Cheques Table */}
      <div className="bg-white rounded-lg shadow">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="REALIZED">Cleared</option>
              <option value="RETURNED">Returned</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cheque #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cheque Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCheques.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No cheques found
                  </td>
                </tr>
              ) : (
                filteredCheques.map((cheque) => (
                  <tr key={cheque.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{cheque.chequeNumber || '-'}</div>
                      <div className="text-xs text-gray-500">{cheque.invoiceNumber || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cheque.bankName || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{cheque.supplier.name}</div>
                      <div className="text-xs text-gray-500">{cheque.supplier.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cheque.totalAmount ? `Rs. ${cheque.totalAmount.toFixed(2)}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {cheque.chequeDate ? new Date(cheque.chequeDate).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getChequeStatusColor(cheque)}`}>
                        {getChequeStatus(cheque)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {cheque.chequeStatus === ChequeStatus.PENDING && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(cheque.id, ChequeStatus.REALIZED)}
                              className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Mark Cleared
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(cheque.id, ChequeStatus.RETURNED)}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Mark Returned
                            </button>
                          </>
                        )}
                        {cheque.chequeStatus === ChequeStatus.RETURNED && (
                          <button
                            onClick={() => handleStatusUpdate(cheque.id, ChequeStatus.PENDING)}
                            className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Reissue
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
