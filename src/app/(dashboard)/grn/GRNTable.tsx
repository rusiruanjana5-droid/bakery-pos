'use client'

import { useState } from 'react'
import { deleteGRN, updateGRN } from '@/actions/grn'

interface GRN {
  id: number
  productId: number
  quantity: number
  unitCost: number
  supplierId: number
  product: {
    id: number
    name: string
  }
  supplier: {
    id: number
    name: string
  }
}

interface GRNTableProps {
  grns: GRN[]
  products: any[]
  suppliers: any[]
}

export function GRNTable({ grns, products, suppliers }: GRNTableProps) {
  const [editingGRN, setEditingGRN] = useState<GRN | null>(null)
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    unitCost: '',
    supplierId: ''
  })

  const handleEdit = (grn: GRN) => {
    setEditingGRN(grn)
    setFormData({
      productId: grn.productId.toString(),
      quantity: grn.quantity.toString(),
      unitCost: grn.unitCost.toString(),
      supplierId: grn.supplierId.toString()
    })
  }

  const handleCancel = () => {
    setEditingGRN(null)
    setFormData({ productId: '', quantity: '', unitCost: '', supplierId: '' })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this GRN? This will also reduce the product stock.')) {
      const result = await deleteGRN(id)
      if (!result.success) {
        alert(result.error)
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingGRN) return

    const formDataToSend = new FormData()
    formDataToSend.append('id', editingGRN.id.toString())
    formDataToSend.append('productId', formData.productId)
    formDataToSend.append('quantity', formData.quantity)
    formDataToSend.append('unitCost', formData.unitCost)
    formDataToSend.append('supplierId', formData.supplierId)

    await updateGRN(formDataToSend)
    setEditingGRN(null)
    setFormData({ productId: '', quantity: '', unitCost: '', supplierId: '' })
  }

  return (
    <div>
      {/* Edit Form */}
      {editingGRN && (
        <div className="mb-6 bg-blue-50 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Edit GRN</h2>
          <form onSubmit={handleUpdate} className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select product</option>
                {products.map((product: any) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Unit Cost</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier: any) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Update GRN
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* GRN Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">ID</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Product</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Quantity</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Unit Cost</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Total Cost</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Supplier</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {grns.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No GRN records found. Add your first stock above!
                </td>
              </tr>
            ) : (
              grns.map((grn) => (
                <tr key={grn.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{grn.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{grn.product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{grn.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">Rs. {grn.unitCost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    Rs. {(grn.quantity * grn.unitCost).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{grn.supplier.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(grn)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(grn.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
