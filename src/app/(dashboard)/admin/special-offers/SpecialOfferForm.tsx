'use client'

import { useState, useMemo } from 'react'

interface Product {
  id: number
  name: string
  sellingPrice: number
}

interface ComboItem {
  productId: number
  quantity: number
  isFree: boolean
}

interface SpecialOfferFormProps {
  products: Product[]
  onSubmit: (formData: FormData) => void
}

type OfferType = 'FIXED_COMBO' | 'BOGO' | 'PERCENTAGE_DISCOUNT' | 'CART_TRIGGER'

interface TriggerItem {
  productId: number
  categoryId: number
}

interface RewardItem {
  productId: number
  quantity: number
  isFree: boolean
  discountPrice: number
}

export default function SpecialOfferForm({ products, onSubmit }: SpecialOfferFormProps) {
  const [name, setName] = useState('')
  const [offerType, setOfferType] = useState<OfferType>('FIXED_COMBO')
  const [promoPrice, setPromoPrice] = useState('')
  const [comboItems, setComboItems] = useState<ComboItem[]>([
    { productId: 0, quantity: 1, isFree: false }
  ])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [activeDays, setActiveDays] = useState<string[]>(['0', '1', '2', '3', '4', '5', '6'])
  const [minBillAmount, setMinBillAmount] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState('')
  // Cart Trigger state
  const [triggerType, setTriggerType] = useState<'ALL_PRODUCTS' | 'SELECTED_CATEGORY' | 'SELECTED_PRODUCTS' | 'MIN_BILL_AMOUNT'>('ALL_PRODUCTS')
  const [triggerCategories, setTriggerCategories] = useState<number[]>([])
  const [triggerProducts, setTriggerProducts] = useState<number[]>([])
  const [triggerMinAmount, setTriggerMinAmount] = useState('')
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([
    { productId: 0, quantity: 1, isFree: true, discountPrice: 0 }
  ])

  const addItem = () => {
    setComboItems([...comboItems, { productId: 0, quantity: 1, isFree: false }])
  }

  const removeItem = (index: number) => {
    if (comboItems.length > 1) {
      setComboItems(comboItems.filter((_, i) => i !== index))
    }
  }

  const addRewardItem = () => {
    setRewardItems([...rewardItems, { productId: 0, quantity: 1, isFree: true, discountPrice: 0 }])
  }

  const removeRewardItem = (index: number) => {
    if (rewardItems.length > 1) {
      setRewardItems(rewardItems.filter((_, i) => i !== index))
    }
  }

  const updateRewardItem = (index: number, field: keyof RewardItem, value: number | boolean) => {
    const updated = [...rewardItems]
    updated[index][field] = value as never
    setRewardItems(updated)
  }

  const updateItem = (index: number, field: keyof ComboItem, value: number | boolean) => {
    const updated = [...comboItems]
    updated[index][field] = value as never
    setComboItems(updated)
  }

  const toggleDay = (day: string) => {
    setActiveDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  // Calculate total original price and savings
  const { totalOriginalPrice, savingsAmount, savingsPercentage } = useMemo(() => {
    let total = 0
    comboItems.forEach(item => {
      const product = products.find(p => p.id === item.productId)
      if (product) {
        total += product.sellingPrice * item.quantity
      }
    })
    
    const promoPriceNum = parseFloat(promoPrice) || 0
    const savings = total - promoPriceNum
    const percentage = total > 0 ? (savings / total) * 100 : 0
    
    return {
      totalOriginalPrice: total,
      savingsAmount: savings,
      savingsPercentage: percentage
    }
  }, [comboItems, promoPrice, products])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('offerType', offerType)
    formData.append('promoPrice', promoPrice)
    formData.append('items', JSON.stringify(comboItems))
    if (startDate) formData.append('startDate', startDate)
    if (endDate) formData.append('endDate', endDate)
    if (startTime) formData.append('startTime', startTime)
    if (endTime) formData.append('endTime', endTime)
    formData.append('activeDays', activeDays.join(','))
    if (minBillAmount) formData.append('minBillAmount', minBillAmount)
    if (discountPercentage) formData.append('discountPercentage', discountPercentage)
    // Cart Trigger fields
    if (offerType === 'CART_TRIGGER') {
      formData.append('triggerType', triggerType)
      if (triggerCategories.length > 0) formData.append('triggerCategories', JSON.stringify(triggerCategories))
      if (triggerProducts.length > 0) formData.append('triggerProducts', JSON.stringify(triggerProducts))
      if (triggerMinAmount) formData.append('triggerMinAmount', triggerMinAmount)
      formData.append('rewardItems', JSON.stringify(rewardItems))
    }
    onSubmit(formData)
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 shadow-sm border border-slate-200 bg-white rounded-lg p-3">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="name" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
          Offer/Combo Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
          placeholder="e.g., Tea Time Special"
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <label htmlFor="offerType" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
          Offer Type
        </label>
        <select
          id="offerType"
          value={offerType}
          onChange={(e) => setOfferType(e.target.value as OfferType)}
          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
        >
          <option value="FIXED_COMBO">Fixed Combo (e.g., Coffee + Donut)</option>
          <option value="BOGO">Buy X Get Y Free (BOGO)</option>
          <option value="PERCENTAGE_DISCOUNT">Percentage Discount on Min Bill</option>
          <option value="CART_TRIGGER">Cart Trigger (Buy X, Get Y Free/Discounted)</option>
        </select>
      </div>

      {(offerType === 'FIXED_COMBO' || offerType === 'BOGO') && (
        <>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="promoPrice" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Promo Price (Rs.)
            </label>
            <input
              type="number"
              id="promoPrice"
              step="0.01"
              value={promoPrice}
              onChange={(e) => setPromoPrice(e.target.value)}
              required={offerType === 'FIXED_COMBO'}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              placeholder="e.g., 250.00"
            />
          </div>

          {/* Dynamic Savings Display */}
          {totalOriginalPrice > 0 && promoPrice && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2">
              <p className="text-xs text-green-800 font-semibold">Total Original Price: Rs. {totalOriginalPrice.toFixed(2)}</p>
              <p className="text-xs text-green-600">Customer Savings: Rs. {savingsAmount.toFixed(2)} ({savingsPercentage.toFixed(1)}%)</p>
            </div>
          )}
        </>
      )}

      {offerType === 'PERCENTAGE_DISCOUNT' && (
        <>
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="minBillAmount" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Minimum Bill Amount (Rs.)
            </label>
            <input
              type="number"
              id="minBillAmount"
              step="0.01"
              value={minBillAmount}
              onChange={(e) => setMinBillAmount(e.target.value)}
              required
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              placeholder="e.g., 1000.00"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label htmlFor="discountPercentage" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Discount Percentage (%)
            </label>
            <input
              type="number"
              id="discountPercentage"
              step="0.1"
              min="0"
              max="100"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              required
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              placeholder="e.g., 10"
            />
          </div>
        </>
      )}

      {offerType === 'CART_TRIGGER' && (
        <>
          {/* Trigger Condition Section */}
          <div className="border-t border-gray-200 pt-3">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">Trigger Condition</h3>
            
            <div className="mb-3">
              <label htmlFor="triggerType" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                Trigger Type
              </label>
              <select
                id="triggerType"
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as any)}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              >
                <option value="ALL_PRODUCTS">All Products</option>
                <option value="SELECTED_CATEGORY">Selected Category</option>
                <option value="SELECTED_PRODUCTS">Selected Products</option>
                <option value="MIN_BILL_AMOUNT">Minimum Bill Amount</option>
              </select>
            </div>

            {triggerType === 'MIN_BILL_AMOUNT' && (
              <div className="mb-3">
                <label htmlFor="triggerMinAmount" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Minimum Bill Amount (Rs.)
                </label>
                <input
                  type="number"
                  id="triggerMinAmount"
                  step="0.01"
                  value={triggerMinAmount}
                  onChange={(e) => setTriggerMinAmount(e.target.value)}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  placeholder="e.g., 500.00"
                  required
                />
              </div>
            )}

            {triggerType === 'SELECTED_PRODUCTS' && (
              <div className="mb-3">
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">
                  Trigger Products
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {products.map((product) => (
                    <label key={product.id} className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={triggerProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTriggerProducts([...triggerProducts, product.id])
                          } else {
                            setTriggerProducts(triggerProducts.filter(id => id !== product.id))
                          }
                        }}
                        className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500"
                      />
                      <span className="text-xs text-gray-700">{product.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reward Items Section */}
          <div className="border-t border-gray-200 pt-3">
            <h3 className="text-xs font-semibold text-gray-700 mb-2">Reward / Free Items</h3>
            <div className="space-y-2">
              {rewardItems.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center p-2 bg-blue-50 rounded-lg">
                  <div className="flex-1 min-w-[200px]">
                    <select
                      value={item.productId}
                      onChange={(e) => updateRewardItem(index, 'productId', parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 h-8"
                      required
                    >
                      <option value={0}>Select Reward Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} (Rs. {product.sellingPrice})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs text-gray-600 mb-0.5">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateRewardItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 h-8"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.isFree}
                        onChange={(e) => updateRewardItem(index, 'isFree', e.target.checked)}
                        className="w-3 h-3 text-amber-500 rounded focus:ring-amber-500"
                      />
                      <span className="text-xs text-gray-700">Free</span>
                    </label>
                  </div>
                  {!item.isFree && (
                    <div className="w-28">
                      <label className="block text-xs text-gray-600 mb-0.5">Discount Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.discountPrice}
                        onChange={(e) => updateRewardItem(index, 'discountPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 h-8"
                      />
                    </div>
                  )}
                  {rewardItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRewardItem(index)}
                      className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium h-8"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addRewardItem}
              className="mt-2 w-full py-1.5 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:text-blue-700 text-xs font-medium transition-colors h-8"
            >
              + Add Reward Item
            </button>
          </div>
        </>
      )}

      {(offerType === 'FIXED_COMBO' || offerType === 'BOGO') && (
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
            Combo Items
          </label>
          <div className="space-y-2">
            {comboItems.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-[200px]">
                  <select
                    value={item.productId}
                    onChange={(e) => updateItem(index, 'productId', parseInt(e.target.value))}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 h-8"
                    required
                  >
                    <option value={0}>Select Product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} (Rs. {product.sellingPrice})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="block text-xs text-gray-600 mb-0.5">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 h-8"
                    required
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.isFree}
                      onChange={(e) => updateItem(index, 'isFree', e.target.checked)}
                      className="w-3 h-3 text-amber-500 rounded focus:ring-amber-500"
                    />
                    <span className="text-xs text-gray-700">Free</span>
                  </label>
                </div>
                {comboItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium h-8"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-2 w-full py-1.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-amber-400 hover:text-amber-600 text-xs font-medium transition-colors h-8"
          >
            + Add Item to Combo
          </button>
        </div>
      )}

      {/* Offer Scheduling */}
      <div className="border-t border-gray-200 pt-3">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Offer Scheduling</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="startDate" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="startTime" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              Start Time (Happy Hour)
            </label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-xs font-semibold uppercase text-gray-500 mb-1">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">
            Active Days
          </label>
          <div className="flex flex-wrap gap-2">
            {dayLabels.map((label, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleDay(index.toString())}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors h-8 ${
                  activeDays.includes(index.toString())
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end w-full sm:w-auto">
        <button
          type="submit"
          className="px-3 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium h-8"
        >
          Create Offer
        </button>
      </div>
    </form>
  )
}
