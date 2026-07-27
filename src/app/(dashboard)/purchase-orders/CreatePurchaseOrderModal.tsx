'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createPurchaseOrder, updatePurchaseOrder } from '@/actions/purchaseOrder'

interface Supplier {
  id: number
  name: string
  company: string
}

interface Product {
  id: number
  name: string
  costPrice: number
}

interface CreatePurchaseOrderModalProps {
  suppliers: Supplier[]
  products: Product[]
  onPOCreated?: () => void
  onPOUpdated?: () => void
  editingPO?: PurchaseOrder | null
}

interface PurchaseOrder {
  id: number
  poNumber: string
  supplierId: number
  expectedDate: string | null
  notes: string | null
  items: POItem[]
}

interface POItem {
  productId: number
  quantity: number
  unitCost: number
}

export function CreatePurchaseOrderModal({ suppliers, products, onPOCreated, onPOUpdated, editingPO }: CreatePurchaseOrderModalProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null)
  const [expectedDate, setExpectedDate] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<POItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemUnitCost, setItemUnitCost] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populateform when editing
  useEffect(() => {
    if (editingPO) {
      setSelectedSupplier(editingPO.supplierId)
      setExpectedDate(editingPO.expectedDate ? new Date(editingPO.expectedDate).toISOString().split('T')[0] : '')
      setNotes(editingPO.notes || '')
      setItems(editingPO.items)
      setIsOpen(true)
    }
  }, [editingPO])

  const handleAddItem = () => {
    if (!selectedProduct || itemQuantity <= 0 || itemUnitCost <= 0) {
      alert('Please select a product and enter valid quantity and unit cost')
      return
    }

    const product = products.find(p => p.id === selectedProduct)
    if (!product) return

    setItems([
      ...items,
      {
        productId: selectedProduct,
        quantity: itemQuantity,
        unitCost: itemUnitCost
      }
    ])

    setSelectedProduct(null)
    setItemQuantity(1)
    setItemUnitCost(0)
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log('Submitting purchase order...')

      if (!selectedSupplier) {
        alert('Please select a supplier')
        setIsSubmitting(false)
        return
      }

      if (items.length === 0) {
        alert('Please add at least one item')
        setIsSubmitting(false)
        return
      }

      const formData = new FormData()
      formData.append('supplierId', selectedSupplier.toString())
      if (expectedDate) formData.append('expectedDate', expectedDate)
      if (notes) formData.append('notes', notes)
      formData.append('items', JSON.stringify(items))
      
      if (editingPO) {
        formData.append('id', editingPO.id.toString())
        formData.append('status', 'DRAFT')
      }

      console.log('Form data prepared:', {
        supplierId: selectedSupplier,
        expectedDate,
        notes,
        itemsCount: items.length,
        isEditing: !!editingPO
      })

      const result = editingPO 
        ? await updatePurchaseOrder(formData)
        : await createPurchaseOrder(formData)

      console.log('API response:', result)

      if (result.success) {
        console.log('Purchase order saved successfully:', result.purchaseOrder)
        
        // Reset form state
        setIsOpen(false)
        setSelectedSupplier(null)
        setExpectedDate('')
        setNotes('')
        setItems([])
        
        // Trigger appropriate callback
        if (editingPO && onPOUpdated) {
          onPOUpdated()
        } else if (!editingPO && onPOCreated) {
          onPOCreated()
        }
        
        // Refresh the page to update the table
        router.refresh()
      } else {
        console.error('Failed to save purchase order:', result.error)
        alert(`Failed to save purchase order: ${result.error}`)
      }
    } catch (error) {
      console.error('Error submitting purchase order:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0)

  const handleCloseModal = () => {
    setIsOpen(false)
    setSelectedSupplier(null)
    setExpectedDate('')
    setNotes('')
    setItems([])
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        + Create New PO
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPO ? 'Edit Purchase Order' : 'Create New Purchase Order'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Supplier Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier *
                </label>
                <select
                  value={selectedSupplier || ''}
                  onChange={(e) => setSelectedSupplier(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.company}
                    </option>
                  ))}
                </select>
              </div>

              {/* Expected Delivery Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes..."
                />
              </div>

              {/* Add Items Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add Items</h3>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product *
                    </label>
                    <select
                      value={selectedProduct || ''}
                      onChange={(e) => {
                        setSelectedProduct(Number(e.target.value))
                        const product = products.find(p => p.id === Number(e.target.value))
                        if (product) setItemUnitCost(product.costPrice)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit Cost *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemUnitCost}
                      onChange={(e) => setItemUnitCost(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Add Item
                </button>
              </div>

              {/* Items List */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Unit Cost
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Total
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => {
                          const product = products.find(p => p.id === item.productId)
                          return (
                            <tr key={index}>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {product?.name}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                Rs. {item.unitCost.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                Rs. {(item.quantity * item.unitCost).toFixed(2)}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-right">
                    <div className="text-lg font-bold text-gray-900">
                      Total: Rs. {totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
