'use client'

import { useState } from 'react'
import { deleteOrder, updateOrder } from '@/actions/order'

interface Order {
  id: number
  productId: number
  quantity: number
  subtotal?: number | null
  tax?: number | null
  discount?: number | null
  totalPrice: number
  paymentMethod: string
  customerName?: string | null
  customerPhone?: string | null
  product: {
    id: number
    name: string
    currentStock: number
  }
}

interface OrderTableProps {
  orders: Order[]
  products: any[]
  userRole: 'ADMIN' | 'CASHIER'
}

export function OrderTable({ orders, products, userRole }: OrderTableProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    subtotal: '',
    tax: '',
    discount: '',
    totalPrice: '',
    paymentMethod: '',
    customerName: '',
    customerPhone: ''
  })
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleEdit = (order: Order) => {
    setEditingOrder(order)
    setFormData({
      productId: order.productId.toString(),
      quantity: order.quantity.toString(),
      subtotal: (order.subtotal || order.totalPrice).toString(),
      tax: (order.tax || 0).toString(),
      discount: (order.discount || 0).toString(),
      totalPrice: order.totalPrice.toString(),
      paymentMethod: order.paymentMethod,
      customerName: order.customerName || '',
      customerPhone: order.customerPhone || ''
    })
  }

  const handleCancel = () => {
    setEditingOrder(null)
    setFormData({ productId: '', quantity: '', subtotal: '', tax: '', discount: '', totalPrice: '', paymentMethod: '', customerName: '', customerPhone: '' })
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this order? This will restore the product stock.')) {
      setDeletingId(id)
      try {
        const result = await deleteOrder(id)
        if (!result.success) {
          alert(result.error)
        }
      } finally {
        setDeletingId(null)
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOrder) return

    const formDataToSend = new FormData()
    formDataToSend.append('id', editingOrder.id.toString())
    formDataToSend.append('productId', formData.productId)
    formDataToSend.append('quantity', formData.quantity)
    formDataToSend.append('subtotal', formData.subtotal)
    formDataToSend.append('tax', formData.tax)
    formDataToSend.append('discount', formData.discount)
    formDataToSend.append('totalPrice', formData.totalPrice)
    formDataToSend.append('paymentMethod', formData.paymentMethod)
    formDataToSend.append('customerName', formData.customerName)
    formDataToSend.append('customerPhone', formData.customerPhone)

    await updateOrder(formDataToSend)
    setEditingOrder(null)
    setFormData({ productId: '', quantity: '', subtotal: '', tax: '', discount: '', totalPrice: '', paymentMethod: '', customerName: '', customerPhone: '' })
  }

  return (
    <div>
      {/* Edit Form */}
      {editingOrder && (
        <div className="mb-6 bg-blue-50 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Order</h2>
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
                    {product.name} (Stock: {product.currentStock})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
              <input
                type="number"
                step="0.01"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
              <input
                type="number"
                step="0.01"
                value={formData.tax}
                onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
              <input
                type="number"
                step="0.01"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1 min-w-[120px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.totalPrice}
                onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <input
                type="text"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Customer name (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
              <input
                type="text"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="Customer phone (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Update Order
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">ID</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Product</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Qty</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Subtotal</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Tax</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Discount</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Total</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Payment</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Customer</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                  No orders found. Create your first order above!
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">{order.product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">Rs. {(order.subtotal || order.totalPrice).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">Rs. {(order.tax || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">Rs. {(order.discount || 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-800 font-bold">Rs. {order.totalPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.paymentMethod}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.customerName && <div>{order.customerName}</div>}
                    {order.customerPhone && <div>{order.customerPhone}</div>}
                  </td>
                  {userRole === 'ADMIN' && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={deletingId === order.id}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deletingId === order.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
