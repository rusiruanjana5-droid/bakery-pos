'use client'

import { useState, useEffect } from 'react'
import { POStatus } from '@prisma/client'
import { getActivePurchaseOrdersBySupplier, deletePurchaseOrder } from '@/actions/purchaseOrder'

interface PurchaseOrder {
  id: number
  poNumber: string
  orderDate: string
  expectedDate: string | null
  status: POStatus
  totalAmount: number | null
  notes: string | null
  supplier: {
    id: number
    name: string
    company: string
  }
  items: Array<{
    id: number
    quantity: number
    receivedQuantity: number
    unitCost: number
    totalAmount: number | null
    product: {
      id: number
      name: string
    }
  }>
}

interface PurchaseOrderListProps {
  purchaseOrders: PurchaseOrder[]
  onRefetch?: () => Promise<void>
  onEdit?: (po: PurchaseOrder) => void
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800',
  ORDERED: 'bg-blue-100 text-blue-800',
  PARTIALLY_RECEIVED: 'bg-orange-100 text-orange-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const statusLabels = {
  DRAFT: 'Draft',
  PENDING_APPROVAL: 'Pending Approval',
  ORDERED: 'Ordered',
  PARTIALLY_RECEIVED: 'Partially Received',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
}

export function PurchaseOrderList({ purchaseOrders, onRefetch, onEdit }: PurchaseOrderListProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [localOrders, setLocalOrders] = useState<PurchaseOrder[]>(purchaseOrders)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [poToDelete, setPoToDelete] = useState<PurchaseOrder | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Update local state when props change
  useEffect(() => {
    setLocalOrders(purchaseOrders)
  }, [purchaseOrders])

  const handleRefetch = async () => {
    if (onRefetch) {
      await onRefetch()
    }
  }

  const handleDeleteClick = (po: PurchaseOrder) => {
    if (po.status !== 'DRAFT') {
      alert('Only Draft purchase orders can be deleted')
      return
    }
    setPoToDelete(po)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!poToDelete) return

    setIsDeleting(true)
    try {
      const result = await deletePurchaseOrder(poToDelete.id)
      if (result.success) {
        setDeleteModalOpen(false)
        setPoToDelete(null)
        await handleRefetch()
      } else {
        alert(`Failed to delete purchase order: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting purchase order:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditClick = (po: PurchaseOrder) => {
    if (onEdit) {
      onEdit(po)
    }
  }

  const filteredOrders = filterStatus === 'ALL' 
    ? localOrders 
    : localOrders.filter(po => po.status === filterStatus)

  return (
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
            <option value="DRAFT">Draft</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="ORDERED">Ordered</option>
            <option value="PARTIALLY_RECEIVED">Partially Received</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PO Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expected Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  No purchase orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((po) => {
                const totalItems = po.items.length
                const receivedItems = po.items.filter(item => item.receivedQuantity >= item.quantity).length
                const progress = totalItems > 0 ? Math.round((receivedItems / totalItems) * 100) : 0

                return (
                  <tr key={po.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{po.poNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{po.supplier.name}</div>
                      <div className="text-xs text-gray-500">{po.supplier.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(po.orderDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {po.expectedDate ? new Date(po.expectedDate).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[po.status]}`}>
                        {statusLabels[po.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {po.totalAmount ? `Rs. ${po.totalAmount.toFixed(2)}` : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{totalItems} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-600">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(po)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          title="Edit"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(po)}
                          className={`text-red-600 hover:text-red-800 text-sm font-medium ${po.status !== 'DRAFT' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title="Delete"
                          disabled={po.status !== 'DRAFT'}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && poToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Purchase Order</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete PO: <strong>{poToDelete.poNumber}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false)
                  setPoToDelete(null)
                }}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
