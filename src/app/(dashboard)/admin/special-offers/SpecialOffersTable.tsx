'use client'

import { useState } from 'react'
import { deleteSpecialOffer, updateSpecialOffer, toggleSpecialOfferStatus } from '@/actions/specialOffer'

interface Product {
  id: number
  name: string
  sellingPrice: number
}

interface SpecialOffer {
  id: number
  name: string
  offerType: string
  promoPrice: number | null
  items: string
  isActive: boolean
  startDate: Date | null
  endDate: Date | null
  startTime: string | null
  endTime: string | null
  activeDays: string | null
  minBillAmount: number | null
  discountPercentage: number | null
  // Cart Trigger fields
  triggerType: string | null
  triggerCategories: string | null
  triggerProducts: string | null
  triggerMinAmount: number | null
  rewardItems: string | null
  // Buy X Get Y fields
  appliesToScope: string | null
  minQty: number | null
  minSpend: number | null
  rewardProductId: number | null
  rewardQty: number | null
  rewardDiscountPercent: number | null
  // Cart Threshold fields
  minCartAmount: number | null
  rewardType: string | null
  createdAt: Date
  updatedAt: Date
}

interface SpecialOffersTableProps {
  specialOffers: SpecialOffer[]
  products: Product[]
}

function getOfferStatus(offer: SpecialOffer): string {
  if (!offer.isActive) return 'Disabled'
  
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  if (offer.startDate) {
    const startDate = new Date(offer.startDate)
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    
    // If start date is in the future, it's Scheduled
    if (startDateOnly > today) return 'Scheduled'
  }
  
  if (offer.endDate) {
    const endDate = new Date(offer.endDate)
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
    
    // If end date is in the past, it's Expired
    if (endDateOnly < today) return 'Expired'
  }
  
  // Check time window
  if (offer.startTime && offer.endTime) {
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [startHour, startMin] = offer.startTime.split(':').map(Number)
    const [endHour, endMin] = offer.endTime.split(':').map(Number)
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin
    
    if (currentTime < startTime || currentTime > endTime) return 'Scheduled'
  }
  
  // Check active days
  if (offer.activeDays) {
    const currentDay = now.getDay()
    const activeDaysArray = offer.activeDays.split(',').map(Number)
    if (!activeDaysArray.includes(currentDay)) return 'Scheduled'
  }
  
  return 'Active'
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800'
    case 'Scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'Expired':
      return 'bg-red-100 text-red-800'
    case 'Disabled':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function SpecialOffersTable({ specialOffers, products }: SpecialOffersTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editForm, setEditForm] = useState({
    name: '',
    offerType: 'FIXED_COMBO',
    promoPrice: 0,
    items: '',
    isActive: true,
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    activeDays: '0,1,2,3,4,5,6',
    minBillAmount: 0,
    discountPercentage: 0
  })

  const handleEdit = (offer: SpecialOffer) => {
    setEditingId(offer.id)
    setEditForm({
      name: offer.name,
      offerType: offer.offerType,
      promoPrice: offer.promoPrice || 0,
      items: offer.items,
      isActive: offer.isActive,
      startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
      endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
      startTime: offer.startTime || '',
      endTime: offer.endTime || '',
      activeDays: offer.activeDays || '0,1,2,3,4,5,6',
      minBillAmount: offer.minBillAmount || 0,
      discountPercentage: offer.discountPercentage || 0
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({ 
      name: '', 
      offerType: 'FIXED_COMBO',
      promoPrice: 0, 
      items: '', 
      isActive: true,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      activeDays: '0,1,2,3,4,5,6',
      minBillAmount: 0,
      discountPercentage: 0
    })
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    const formData = new FormData()
    formData.append('id', editingId.toString())
    formData.append('name', editForm.name)
    formData.append('offerType', editForm.offerType)
    formData.append('promoPrice', editForm.promoPrice.toString())
    formData.append('items', editForm.items)
    formData.append('isActive', editForm.isActive.toString())
    if (editForm.startDate) formData.append('startDate', editForm.startDate)
    if (editForm.endDate) formData.append('endDate', editForm.endDate)
    if (editForm.startTime) formData.append('startTime', editForm.startTime)
    if (editForm.endTime) formData.append('endTime', editForm.endTime)
    formData.append('activeDays', editForm.activeDays)
    if (editForm.minBillAmount) formData.append('minBillAmount', editForm.minBillAmount.toString())
    if (editForm.discountPercentage) formData.append('discountPercentage', editForm.discountPercentage.toString())
    
    await updateSpecialOffer(formData)
    setEditingId(null)
    window.location.reload()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this special offer?')) {
      const result = await deleteSpecialOffer(id)
      if (result.success) {
        window.location.reload()
      } else {
        alert(result.error || 'Failed to delete special offer')
      }
    }
  }

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const result = await toggleSpecialOfferStatus(id, !currentStatus)
    if (result.success) {
      window.location.reload()
    }
  }

  const getProductNames = (items: string) => {
    try {
      const comboItems = JSON.parse(items)
      const productDetails = comboItems
        .map((item: any) => {
          const product = products.find(p => p.id === item.productId)
          if (!product) return null
          const freeLabel = item.isFree ? ' (Free)' : ''
          return `${product.name} x${item.quantity}${freeLabel}`
        })
        .filter(Boolean)
        .join(', ')
      return productDetails || 'No products selected'
    } catch {
      return 'Invalid product data'
    }
  }

  const getRewardNames = (rewardItems: string) => {
    try {
      const items = JSON.parse(rewardItems)
      const productDetails = items
        .map((item: any) => {
          const product = products.find(p => p.id === item.productId)
          if (!product) return null
          const freeLabel = item.isFree ? ' (Free)' : ` (Rs. ${item.discountPrice})`
          return `${product.name} x${item.quantity}${freeLabel}`
        })
        .filter(Boolean)
        .join(', ')
      return productDetails || 'No rewards selected'
    } catch {
      return 'Invalid reward data'
    }
  }

  const getTriggerDescription = (offer: SpecialOffer) => {
    if (offer.offerType === 'BUY_X_GET_Y') {
      switch (offer.appliesToScope) {
        case 'ALL_ITEMS':
          return `Buy ${offer.minQty || 1} of any items`
        case 'SPECIFIC_ITEMS':
          try {
            const productIds = JSON.parse(offer.triggerProducts || '[]')
            const productNames = productIds
              .map((id: number) => products.find(p => p.id === id)?.name)
              .filter(Boolean)
              .join(', ')
            return productNames || 'No products selected'
          } catch {
            return 'Invalid trigger products'
          }
        case 'CATEGORY':
          return 'Specific Category'
        default:
          return 'N/A'
      }
    }
    
    if (offer.offerType !== 'CART_TRIGGER') return 'N/A'
    
    switch (offer.triggerType) {
      case 'ALL_PRODUCTS':
        return 'All Products'
      case 'SELECTED_CATEGORY':
        return 'Selected Category'
      case 'SELECTED_PRODUCTS':
        try {
          const productIds = JSON.parse(offer.triggerProducts || '[]')
          const productNames = productIds
            .map((id: number) => products.find(p => p.id === id)?.name)
            .filter(Boolean)
            .join(', ')
          return productNames || 'No products selected'
        } catch {
          return 'Invalid trigger products'
        }
      case 'MIN_BILL_AMOUNT':
        return `Min Bill: Rs. ${offer.triggerMinAmount?.toFixed(2) || '0'}`
      default:
        return 'N/A'
    }
  }

  const getRewardDescription = (offer: SpecialOffer) => {
    if (offer.offerType === 'BUY_X_GET_Y') {
      const product = products.find(p => p.id === offer.rewardProductId)
      if (!product) return 'No reward product selected'
      
      const discountPercent = offer.rewardDiscountPercent || 100
      const discountLabel = discountPercent === 100 ? 'FREE' : `${discountPercent}% off`
      return `${product.name} x${offer.rewardQty || 1} (${discountLabel})`
    }
    
    if (offer.offerType === 'CART_THRESHOLD') {
      const product = products.find(p => p.id === offer.rewardProductId)
      if (!product) return 'No reward product selected'
      return `${product.name} x${offer.rewardQty || 1} (FREE)`
    }
    
    return 'N/A'
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Offer Name</th>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Price/Discount</th>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Included Products</th>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trigger</th>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Reward</th>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Validity</th>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
              <th className="px-4 lg:px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {specialOffers.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 lg:px-6 py-8 text-center text-sm text-gray-500">
                  No special offers created yet
                </td>
              </tr>
            ) : (
              specialOffers.map((offer) => {
                const status = getOfferStatus(offer)
                return (
                  <tr key={offer.id} className="hover:bg-gray-50">
                    {editingId === offer.id ? (
                      <>
                        <td colSpan={10} className="px-4 lg:px-6 py-4">
                          <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                  type="text"
                                  value={editForm.name}
                                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Type</label>
                                <select
                                  value={editForm.offerType}
                                  onChange={(e) => setEditForm({ ...editForm, offerType: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                >
                                  <option value="FIXED_COMBO">Fixed Combo</option>
                                  <option value="BOGO">BOGO</option>
                                  <option value="PERCENTAGE_DISCOUNT">Percentage Discount</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Price</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editForm.promoPrice}
                                  onChange={(e) => setEditForm({ ...editForm, promoPrice: parseFloat(e.target.value) })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Items (JSON)</label>
                                <input
                                  type="text"
                                  value={editForm.items}
                                  onChange={(e) => setEditForm({ ...editForm, items: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                  placeholder='[{"productId":1,"quantity":2,"isFree":false}]'
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                  type="date"
                                  value={editForm.startDate}
                                  onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                  type="date"
                                  value={editForm.endDate}
                                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                />
                              </div>
                            </div>
                            <div className="flex items-end gap-2">
                              <button
                                type="submit"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-800">{offer.name}</td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                          {offer.offerType === 'FIXED_COMBO' ? 'Fixed Combo' : 
                           offer.offerType === 'BOGO' ? 'BOGO' : 
                           offer.offerType === 'PERCENTAGE_DISCOUNT' ? 'Percentage Discount' :
                           offer.offerType === 'CART_TRIGGER' ? 'Cart Trigger' :
                           offer.offerType === 'BUY_X_GET_Y' ? 'Buy X Get Y' :
                           offer.offerType === 'CART_THRESHOLD' ? 'Cart Threshold' :
                           'Unknown'}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                          {offer.offerType === 'PERCENTAGE_DISCOUNT' 
                            ? `${offer.discountPercentage}% off (min Rs. ${offer.minBillAmount})`
                            : offer.offerType === 'CART_TRIGGER'
                            ? 'See Reward'
                            : `Rs. ${offer.promoPrice?.toFixed(2) || 'N/A'}`}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={getProductNames(offer.items)}>
                          {offer.offerType === 'PERCENTAGE_DISCOUNT' ? 'N/A' : getProductNames(offer.items)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={getTriggerDescription(offer)}>
                          {getTriggerDescription(offer)}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={getRewardDescription(offer)}>
                          {getRewardDescription(offer)}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                          {offer.startDate && offer.endDate 
                            ? `${new Date(offer.startDate).toLocaleDateString()} - ${new Date(offer.endDate).toLocaleDateString()}`
                            : offer.startDate 
                            ? `From ${new Date(offer.startDate).toLocaleDateString()}`
                            : 'Always active'}
                          {offer.startTime && offer.endTime && (
                            <span className="block text-xs text-gray-500">
                              {offer.startTime} - {offer.endTime}
                            </span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleStatus(offer.id, offer.isActive)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  offer.isActive ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    offer.isActive ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                              <span className="text-xs text-gray-600">
                                {offer.isActive ? 'On' : 'Off'}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(offer)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(offer.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
