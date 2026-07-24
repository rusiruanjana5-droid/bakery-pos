'use client'

import { useState, useEffect } from 'react'
import { createOrder, getOrders } from '@/actions/order'
import { getProducts } from '@/actions/product'
import { getStoreSettings } from '@/actions/store'
import { OrderTable } from './OrderTable'

interface Product {
  id: number
  name: string
  category: string
  costPrice: number
  sellingPrice: number
  currentStock: number
  supplierId: number | null
}

interface OrderItem {
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
  product: Product
  createdAt?: Date
}

interface OrdersClientProps {
  session: any
  orders: OrderItem[]
  products: Product[]
  storeSettings: any & {
    showNoticeOnReceipt?: boolean
    description?: string
  }
}

export default function OrdersClient({ session, orders: initialOrders, products: initialProducts, storeSettings }: OrdersClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders)
  const [orderToPrint, setOrderToPrint] = useState<OrderItem | null>(null)
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [formattedDate, setFormattedDate] = useState<string>('')
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

  const calculateTotals = (productId: string, quantity: string, tax: string, discount: string) => {
    const product = products.find(p => p.id === parseInt(productId))
    const qty = parseInt(quantity || '0')
    const taxAmt = parseFloat(tax || '0')
    const discountAmt = parseFloat(discount || '0')
    const subtotal = product ? (product.sellingPrice * qty) : 0
    const total = (subtotal + taxAmt) - discountAmt
    return {
      subtotal: subtotal.toFixed(2),
      totalPrice: total.toFixed(2)
    }
  }

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value
    const { subtotal, totalPrice } = calculateTotals(productId, formData.quantity, formData.tax, formData.discount)
    setFormData(prev => ({
      ...prev,
      productId,
      subtotal,
      totalPrice
    }))
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = e.target.value
    const { subtotal, totalPrice } = calculateTotals(formData.productId, quantity, formData.tax, formData.discount)
    setFormData(prev => ({
      ...prev,
      quantity,
      subtotal,
      totalPrice
    }))
  }

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tax = e.target.value
    const { subtotal, totalPrice } = calculateTotals(formData.productId, formData.quantity, tax, formData.discount)
    setFormData(prev => ({
      ...prev,
      tax,
      subtotal,
      totalPrice
    }))
  }

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = e.target.value
    const { subtotal, totalPrice } = calculateTotals(formData.productId, formData.quantity, formData.tax, discount)
    setFormData(prev => ({
      ...prev,
      discount,
      subtotal,
      totalPrice
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    formDataToSend.append('productId', formData.productId)
    formDataToSend.append('quantity', formData.quantity)
    formDataToSend.append('subtotal', formData.subtotal)
    formDataToSend.append('tax', formData.tax)
    formDataToSend.append('discount', formData.discount)
    formDataToSend.append('totalPrice', formData.totalPrice)
    formDataToSend.append('paymentMethod', formData.paymentMethod)
    formDataToSend.append('customerName', formData.customerName)
    formDataToSend.append('customerPhone', formData.customerPhone)
    
    try {
      const result = await createOrder(formDataToSend)
      if (result.success && result.order) {
        // Reload orders and products
        const [newOrders, newProducts] = await Promise.all([
          getOrders(),
          getProducts()
        ])
        setOrders(newOrders)
        setProducts(newProducts)
        // Reset logo load state
        setLogoLoaded(false)
        // Show print dialog
        setOrderToPrint(result.order)
        // Trigger print after a delay to allow DOM and image to load
        setTimeout(() => {
          window.print()
        }, 500)
        // Reset form
        setFormData({
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
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create order')
    }
  }

  // Format date client-side to avoid hydration mismatch
  useEffect(() => {
    if (orderToPrint) {
      setFormattedDate(new Date().toLocaleString())
    }
  }, [orderToPrint])

  // Close print dialog
  useEffect(() => {
    const handleAfterPrint = () => {
      setOrderToPrint(null)
    }
    window.addEventListener('afterprint', handleAfterPrint)
    return () => window.removeEventListener('afterprint', handleAfterPrint)
  }, [])

  return (
    <div className="p-8">
      {/* Print Receipt - Only visible in print mode */}
      {orderToPrint && (
        <div id="print-receipt" className="hidden">
          <div style={{ maxWidth: '80mm', width: '100%', fontFamily: 'monospace', fontSize: '12px', color: '#000', padding: '10px' }}>
            {/* Header Section */}
            <div className="flex flex-col items-center justify-center mb-4">
              {storeSettings?.logoUrl && (
                <img 
                  src={ 
                    storeSettings.logoUrl.startsWith('data:image') 
                      ? storeSettings.logoUrl 
                      : `data:image/png;base64,${storeSettings.logoUrl}` 
                  } 
                  alt="Store Logo" 
                  style={{ 
                    maxWidth: '120px', 
                    width: '100%',
                    height: 'auto', 
                    objectFit: 'contain',
                    filter: 'grayscale(100%) contrast(200%)',
                    marginBottom: '8px'
                  }} 
                  onLoad={() => setLogoLoaded(true)}
                  onError={() => setLogoLoaded(false)}
                />
              )}
              <h1 className="text-lg font-bold text-center uppercase">{storeSettings?.shopName || 'Bakery POS'}</h1>
              {storeSettings?.slogan && (
                <p className="text-sm text-center">{storeSettings.slogan}</p>
              )}
              {storeSettings?.address && (
                <p className="text-xs text-center mt-1">{storeSettings.address}</p>
              )}
              {(storeSettings?.phone1 || storeSettings?.phone2) && (
                <p className="text-xs text-center">
                  Tel: {storeSettings?.phone1}
                  {storeSettings?.phone1 && storeSettings?.phone2 && " / "}
                  {storeSettings?.phone2}
                </p>
              )}
              {storeSettings?.brNumber && (
                <p className="text-xs text-center">BR/Tax No: {storeSettings.brNumber}</p>
              )}
              {storeSettings?.receiptHeaderMessage && (
                <p className="text-xs text-center mt-1">{storeSettings.receiptHeaderMessage}</p>
              )}
            </div>
            
            {/* Order Details Section */}
            <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '8px 0', marginBottom: '12px' }}>
              <p>ORDER #: ORD-{String(orderToPrint.id).replace(/\D/g, '').padStart(4, '0')}</p>
              <p>DATE: {formattedDate}</p>
              <p>PAYMENT: {orderToPrint.paymentMethod.toUpperCase()}</p>
              <p>SERVED BY: {session?.username || 'Cashier'}</p>
            </div>
            
            {/* Items Section with Unit Price Breakdown */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold' }}>{orderToPrint.product.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{orderToPrint.quantity} x Rs.{(orderToPrint.subtotal || orderToPrint.totalPrice / orderToPrint.quantity).toFixed(2)}</span>
                  <span style={{ fontWeight: 'bold' }}>Rs.{(orderToPrint.subtotal || orderToPrint.totalPrice).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Price Breakdown Section */}
            <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '8px 0', marginBottom: '12px' }}>
              <div style={{ textAlign: 'right', marginBottom: '4px' }}>
                <p>SUBTOTAL: Rs.{(orderToPrint.subtotal || orderToPrint.totalPrice).toFixed(2)}</p>
              </div>
              {orderToPrint.tax && orderToPrint.tax > 0 && (
                <div style={{ textAlign: 'right', marginBottom: '4px' }}>
                  <p>TAX: Rs.{orderToPrint.tax.toFixed(2)}</p>
                </div>
              )}
              {orderToPrint.discount && orderToPrint.discount > 0 && (
                <div style={{ textAlign: 'right', marginBottom: '4px', color: '#006400' }}>
                  <p>DISCOUNT: -Rs.{orderToPrint.discount.toFixed(2)}</p>
                </div>
              )}
              <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '8px' }}>
                <p>TOTAL: Rs.{orderToPrint.totalPrice.toFixed(2)}</p>
              </div>
            </div>

            {storeSettings?.showNoticeOnReceipt && storeSettings?.description && (
              <div style={{ borderTop: '1px dashed #000', paddingTop: '8px', marginTop: '12px' }}>
                <p style={{ textAlign: 'center', fontSize: '11px', fontStyle: 'italic' }}>{storeSettings.description}</p>
              </div>
            )}

            {storeSettings?.receiptFooterMessage && (
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <p className="text-xs">{storeSettings.receiptFooterMessage}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mb-8">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 bg-white p-6 rounded-xl shadow-md">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleProductChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
              autoFocus
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
              name="quantity"
              value={formData.quantity}
              onChange={handleQuantityChange}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
            <input
              type="number"
              name="subtotal"
              step="0.01"
              value={formData.subtotal}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              required
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
            <input
              type="number"
              name="tax"
              step="0.01"
              value={formData.tax}
              onChange={handleTaxChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
            <input
              type="number"
              name="discount"
              step="0.01"
              value={formData.discount}
              onChange={handleDiscountChange}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Total Price</label>
            <input
              type="number"
              name="totalPrice"
              step="0.01"
              value={formData.totalPrice}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <input
              type="text"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
              placeholder="e.g., Cash, Card, UPI"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Customer name (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Phone</label>
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
              placeholder="Customer phone (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg transition-colors font-medium"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>

      <OrderTable orders={orders} products={products} userRole={session.role as 'ADMIN' | 'CASHIER'} />

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-receipt, #print-receipt * {
            visibility: visible !important;
          }
          #print-receipt {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 80mm !important;
            max-width: 80mm !important;
            padding: 10px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            display: block !important;
          }
          .hidden {
            display: block !important;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
