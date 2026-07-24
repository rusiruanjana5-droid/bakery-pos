'use client'

import { useState, useEffect } from 'react'
import { createGRN } from '@/actions/grn'
import CategorySelector from '@/components/CategorySelector'

interface GRNEntryFormProps {
  products: any[]
  suppliers: any[]
  categories: any[]
}

interface InvoiceItem {
  id: string
  productId: string
  quantity: number
  freeQuantity: number
  uom: string
  unitCost: number
  discount: number
  discountType: string
  landedCost: number
  freightCost: number
  handlingCost: number
  taxCost: number
  expiryDate: string
  batchNumber: string
  qcStatus: string
  rejectedQty: number
  rejectionReason: string
  addedAt: Date
}

export function GRNEntryForm({ products, suppliers, categories }: GRNEntryFormProps) {
  const [mounted, setMounted] = useState(false)
  const [invoiceHeader, setInvoiceHeader] = useState({
    supplierId: '',
    invoiceNumber: '',
    poNumber: '',
    paymentType: 'New Ref',
    creditPeriod: 30,
    receivedDate: new Date().toISOString().split('T')[0]
  })
  const [itemEntry, setItemEntry] = useState({
    productId: '',
    quantity: 0,
    freeQuantity: 0,
    uom: 'Kg',
    unitCost: 0,
    discount: 0,
    discountType: 'percentage',
    landedCost: 0,
    freightCost: 0,
    handlingCost: 0,
    taxCost: 0,
    expiryDate: '',
    batchNumber: '',
    qcStatus: 'Passed',
    rejectedQty: 0,
    rejectionReason: ''
  })
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [creditLimitWarning, setCreditLimitWarning] = useState<string | null>(null)
  const [priceVarianceWarning, setPriceVarianceWarning] = useState<string | null>(null)
  const [lastPurchasedPrice, setLastPurchasedPrice] = useState<number | null>(null)
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([])
  const [selectedPO, setSelectedPO] = useState<any | null>(null)
  const [grnNumber, setGrnNumber] = useState<string>('Draft')
  const [grnStatus, setGrnStatus] = useState<'Pending' | 'Completed'>('Pending')
  const [barcodeInput, setBarcodeInput] = useState('')
  const [showSellingPriceAlert, setShowSellingPriceAlert] = useState(false)
  const [proposedSellingPrice, setProposedSellingPrice] = useState<number | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved')

  useEffect(() => {
    setMounted(true)
    // Load draft from localStorage on mount
    const savedDraft = localStorage.getItem('grn_draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        setInvoiceHeader(draft.invoiceHeader)
        setInvoiceItems(draft.invoiceItems)
        setSelectedCategoryId(draft.selectedCategoryId)
        setSelectedSubCategoryId(draft.selectedSubCategoryId)
      } catch (e) {
        console.error('Failed to load draft:', e)
      }
    }
  }, [])

  // Auto-save to localStorage
  useEffect(() => {
    if (mounted) {
      setAutoSaveStatus('saving')
      const draft = {
        invoiceHeader,
        invoiceItems,
        selectedCategoryId,
        selectedSubCategoryId
      }
      localStorage.setItem('grn_draft', JSON.stringify(draft))
      setTimeout(() => setAutoSaveStatus('saved'), 500)
    }
  }, [invoiceHeader, invoiceItems, selectedCategoryId, selectedSubCategoryId, mounted])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const uoms = ['Kg', 'Ltr', 'Pcs', 'Packets', 'Bundles']

  const getItemType = (product: any) => {
    // Determine if product is raw material or resale based on category
    const rawMaterialCategories = ['Flour', 'Sugar', 'Dairy', 'Spices', 'Oils', 'Raw Materials']
    const categoryName = product.category || product.categoryRef?.name || ''
    return rawMaterialCategories.some(cat => categoryName.toLowerCase().includes(cat.toLowerCase())) 
      ? 'Raw Material' 
      : 'Resale Item'
  }

  const handleBarcodeScan = (barcode: string) => {
    // Find product by barcode (assuming barcode is stored in product data)
    const product = products.find((p: any) => p.barcode === barcode || p.id.toString() === barcode)
    if (product) {
      setItemEntry({
        ...itemEntry,
        productId: product.id.toString(),
        uom: product.defaultUom || 'Kg',
        unitCost: product.costPrice || 0
      })
      setSelectedCategoryId(product.categoryId)
      setSelectedSubCategoryId(product.subCategoryId)
      setBarcodeInput('')
      showToast(`Product found: ${product.name}`, 'success')
    } else {
      showToast('Product not found for this barcode', 'error')
    }
  }

  const handleSaveDraft = () => {
    const draft = {
      invoiceHeader,
      invoiceItems,
      selectedCategoryId,
      selectedSubCategoryId
    }
    localStorage.setItem('grn_draft', JSON.stringify(draft))
    showToast('Draft saved successfully', 'success')
  }

  const handleClearDraft = () => {
    localStorage.removeItem('grn_draft')
    setInvoiceHeader({
      supplierId: '',
      invoiceNumber: '',
      poNumber: '',
      paymentType: 'New Ref',
      creditPeriod: 30,
      receivedDate: new Date().toISOString().split('T')[0]
    })
    setInvoiceItems([])
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    showToast('Draft cleared', 'success')
  }

  const checkSellingPriceMargin = () => {
    if (!itemEntry.productId || !itemEntry.unitCost) {
      setShowSellingPriceAlert(false)
      setProposedSellingPrice(null)
      return
    }

    const product = products.find(p => p.id.toString() === itemEntry.productId)
    if (!product) return

    const trueUnitCost = calculateTrueUnitCost()
    const currentSellingPrice = product.sellingPrice || 0
    
    // Calculate recommended selling price (e.g., 30% margin)
    const recommendedPrice = trueUnitCost * 1.3
    
    // Alert if true cost is close to or exceeds current selling price
    if (trueUnitCost >= currentSellingPrice * 0.9) {
      setShowSellingPriceAlert(true)
      setProposedSellingPrice(recommendedPrice)
    } else {
      setShowSellingPriceAlert(false)
      setProposedSellingPrice(null)
    }
  }

  useEffect(() => {
    checkSellingPriceMargin()
  }, [itemEntry.unitCost, itemEntry.landedCost, itemEntry.freightCost, itemEntry.handlingCost, itemEntry.taxCost, itemEntry.quantity, itemEntry.productId])

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter((p: any) => p.category === selectedCategory || p.categoryRef?.name === selectedCategory)

  const handleAddItem = () => {
    if (!itemEntry.productId) {
      showToast('Please select a product', 'error')
      return
    }
    
    const quantity = itemEntry.quantity
    if (!quantity || quantity <= 0) {
      showToast('Quantity must be greater than 0', 'error')
      return
    }
    
    if (!itemEntry.unitCost || itemEntry.unitCost <= 0) {
      showToast('Please enter unit cost', 'error')
      return
    }

    if (editingItemId) {
      // Update existing item
      setInvoiceItems(invoiceItems.map(item => 
        item.id === editingItemId 
          ? {
              ...item,
              productId: itemEntry.productId,
              quantity: quantity,
              freeQuantity: itemEntry.freeQuantity,
              uom: itemEntry.uom,
              unitCost: itemEntry.unitCost,
              discount: itemEntry.discount,
              discountType: itemEntry.discountType,
              landedCost: itemEntry.landedCost,
              freightCost: itemEntry.freightCost,
              handlingCost: itemEntry.handlingCost,
              taxCost: itemEntry.taxCost,
              expiryDate: itemEntry.expiryDate,
              batchNumber: itemEntry.batchNumber,
              qcStatus: itemEntry.qcStatus,
              rejectedQty: itemEntry.rejectedQty,
              rejectionReason: itemEntry.rejectionReason
            }
          : item
      ))
      setEditingItemId(null)
      showToast('Item updated successfully', 'success')
    } else {
      // Add new item
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        productId: itemEntry.productId,
        quantity: quantity,
        freeQuantity: itemEntry.freeQuantity,
        uom: itemEntry.uom,
        unitCost: itemEntry.unitCost,
        discount: itemEntry.discount,
        discountType: itemEntry.discountType,
        landedCost: itemEntry.landedCost,
        freightCost: itemEntry.freightCost,
        handlingCost: itemEntry.handlingCost,
        taxCost: itemEntry.taxCost,
        expiryDate: itemEntry.expiryDate,
        batchNumber: itemEntry.batchNumber,
        qcStatus: itemEntry.qcStatus,
        rejectedQty: parseFloat(String(itemEntry.rejectedQty)),
        rejectionReason: itemEntry.rejectionReason,
        addedAt: new Date()
      }

      setInvoiceItems([...invoiceItems, newItem])
      showToast('Item added to invoice', 'success')
    }

    setItemEntry({
      productId: '',
      quantity: 0,
      freeQuantity: 0,
      uom: 'Kg',
      unitCost: 0,
      discount: 0,
      discountType: 'percentage',
      landedCost: 0,
      freightCost: 0,
      handlingCost: 0,
      taxCost: 0,
      expiryDate: '',
      batchNumber: '',
      qcStatus: 'Passed',
      rejectedQty: 0,
      rejectionReason: ''
    })
  }

  const handleEditItem = (item: InvoiceItem) => {
    setEditingItemId(item.id)
    setItemEntry({
      productId: item.productId,
      quantity: item.quantity,
      freeQuantity: item.freeQuantity,
      uom: item.uom,
      unitCost: item.unitCost,
      discount: item.discount,
      discountType: item.discountType,
      landedCost: item.landedCost,
      freightCost: item.freightCost,
      handlingCost: item.handlingCost,
      taxCost: item.taxCost,
      expiryDate: item.expiryDate,
      batchNumber: item.batchNumber,
      qcStatus: item.qcStatus,
      rejectedQty: item.rejectedQty,
      rejectionReason: item.rejectionReason
    })
  }

  const handleRemoveItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(item => item.id !== id))
    if (editingItemId === id) {
      setEditingItemId(null)
      setItemEntry({
        productId: '',
        quantity: 0,
        freeQuantity: 0,
        uom: 'Kg',
        unitCost: 0,
        discount: 0,
        discountType: 'percentage',
        landedCost: 0,
        freightCost: 0,
        handlingCost: 0,
        taxCost: 0,
        expiryDate: '',
        batchNumber: '',
        qcStatus: 'Passed',
        rejectedQty: 0,
        rejectionReason: ''
      })
    }
    showToast('Item removed from invoice', 'success')
  }

  const calculateItemTotal = (item: InvoiceItem) => {
    let total = item.quantity * item.unitCost
    if (item.discountType === 'percentage') {
      total = total - (total * (item.discount / 100))
    } else {
      total = total - item.discount
    }
    const totalLandedCost = item.landedCost + item.freightCost + item.handlingCost + item.taxCost
    total = total + totalLandedCost
    return total
  }

  const calculateSubTotal = () => {
    return invoiceItems.reduce((total, item) => total + calculateItemTotal(item), 0)
  }

  const calculateTotalDiscount = () => {
    return invoiceItems.reduce((total, item) => {
      const itemTotal = item.quantity * item.unitCost
      const discountAmount = item.discountType === 'percentage' 
        ? itemTotal * (item.discount / 100) 
        : item.discount
      return total + discountAmount
    }, 0)
  }

  const calculateTotalLandedCost = () => {
    return invoiceItems.reduce((total, item) => total + item.landedCost + item.freightCost + item.handlingCost + item.taxCost, 0)
  }

  const calculateGrandTotal = () => {
    return calculateSubTotal()
  }

  const checkCreditLimit = () => {
    if (!invoiceHeader.supplierId) return
    
    const supplier = suppliers.find(s => s.id.toString() === invoiceHeader.supplierId)
    if (supplier && supplier.creditLimit) {
      const currentBalance = supplier.currentBalance || 0
      const newTotal = calculateGrandTotal()
      const projectedBalance = currentBalance + newTotal
      
      if (projectedBalance > supplier.creditLimit) {
        setCreditLimitWarning(
          `Warning: This GRN will exceed supplier credit limit. Current: Rs. ${currentBalance.toFixed(2)}, Projected: Rs. ${projectedBalance.toFixed(2)}, Limit: Rs. ${supplier.creditLimit.toFixed(2)}`
        )
      } else {
        setCreditLimitWarning(null)
      }
    }
  }

  useEffect(() => {
    checkCreditLimit()
  }, [invoiceItems, invoiceHeader.supplierId])

  const calculateTrueUnitCost = () => {
    if (!itemEntry.unitCost || !itemEntry.quantity) return 0
    
    const unitCost = itemEntry.unitCost
    const quantity = itemEntry.quantity
    const landedCost = itemEntry.landedCost || 0
    const freightCost = itemEntry.freightCost || 0
    const handlingCost = itemEntry.handlingCost || 0
    const taxCost = itemEntry.taxCost || 0
    const discount = itemEntry.discount || 0
    const discountType = itemEntry.discountType
    
    let baseCost = unitCost
    if (discountType === 'percentage') {
      baseCost = baseCost - (baseCost * (discount / 100))
    } else {
      baseCost = baseCost - (discount / quantity)
    }
    
    const totalExtraCost = landedCost + freightCost + handlingCost + taxCost
    const trueUnitCost = baseCost + (totalExtraCost / quantity)
    
    return trueUnitCost
  }

  const handlePOSelection = (poNumber: string) => {
    if (!poNumber) {
      setInvoiceItems([])
      return
    }

    // Mock PO data - in a real implementation, this would fetch from the database
    const mockPOData: { [key: string]: any[] } = {
      'PO-2024-001': [
        { productId: '1', quantity: 100, unitCost: 2500, uom: 'Kg' },
        { productId: '2', quantity: 50, unitCost: 3000, uom: 'Kg' }
      ],
      'PO-2024-002': [
        { productId: '3', quantity: 200, unitCost: 2800, uom: 'Kg' }
      ],
      'PO-2024-003': [
        { productId: '4', quantity: 75, unitCost: 4500, uom: 'Ltr' },
        { productId: '5', quantity: 50, unitCost: 3200, uom: 'Ltr' }
      ]
    }

    const poItems = mockPOData[poNumber] || []
    
    const newInvoiceItems: InvoiceItem[] = poItems.map((item, index) => ({
      id: (Date.now() + index).toString(),
      productId: item.productId,
      quantity: item.quantity,
      freeQuantity: 0,
      uom: item.uom,
      unitCost: item.unitCost,
      discount: 0,
      discountType: 'percentage',
      landedCost: 0,
      freightCost: 0,
      handlingCost: 0,
      taxCost: 0,
      expiryDate: '',
      batchNumber: '',
      qcStatus: 'Passed',
      rejectedQty: 0,
      rejectionReason: '',
      addedAt: new Date()
    }))

    setInvoiceItems(newInvoiceItems)
    showToast(`PO ${poNumber} loaded with ${newInvoiceItems.length} items`, 'success')
  }

  const checkPriceVariance = () => {
    if (!itemEntry.productId || !itemEntry.unitCost) {
      setPriceVarianceWarning(null)
      setLastPurchasedPrice(null)
      return
    }

    const product = products.find(p => p.id.toString() === itemEntry.productId)
    if (!product) return

    const currentUnitCost = itemEntry.unitCost
    
    // For now, use product's costPrice as last purchased price
    // In a real implementation, this would fetch from GRN history for the specific supplier
    const previousCost = product.costPrice
    setLastPurchasedPrice(previousCost)

    if (previousCost > 0) {
      const variancePercentage = ((currentUnitCost - previousCost) / previousCost) * 100
      const absVariance = Math.abs(variancePercentage)
      
      if (absVariance >= 5) {
        const direction = variancePercentage > 0 ? 'increased' : 'decreased'
        const icon = variancePercentage > 0 ? '▲' : '▼'
        setPriceVarianceWarning(
          `${icon} ${absVariance.toFixed(1)}% ${direction} (Last: Rs. ${previousCost.toFixed(2)})`
        )
      } else {
        setPriceVarianceWarning(null)
      }
    }
  }

  useEffect(() => {
    checkPriceVariance()
  }, [itemEntry.productId, itemEntry.unitCost])

  const handleSaveAndFinalize = async () => {
    if (!invoiceHeader.supplierId) {
      showToast('Please select a supplier', 'error')
      return
    }

    if (invoiceItems.length === 0) {
      showToast('Please add at least one item to the invoice', 'error')
      return
    }

    try {
      // Create GRN entries for each item
      for (const item of invoiceItems) {
        const formData = new FormData()
        formData.append('productId', item.productId)
        formData.append('quantity', item.quantity.toString())
        formData.append('freeQuantity', item.freeQuantity.toString())
        formData.append('uom', item.uom)
        formData.append('unitCost', item.unitCost.toString())
        formData.append('discount', item.discount.toString())
        formData.append('discountType', item.discountType)
        formData.append('landedCost', item.landedCost.toString())
        formData.append('freightCost', item.freightCost.toString())
        formData.append('handlingCost', item.handlingCost.toString())
        formData.append('taxCost', item.taxCost.toString())
        formData.append('supplierId', invoiceHeader.supplierId)
        formData.append('categoryId', selectedCategoryId?.toString() || '')
        formData.append('subCategoryId', selectedSubCategoryId?.toString() || '')
        formData.append('invoiceNumber', invoiceHeader.invoiceNumber)
        formData.append('poNumber', invoiceHeader.poNumber)
        formData.append('paymentType', invoiceHeader.paymentType)
        formData.append('creditPeriod', invoiceHeader.creditPeriod.toString())
        formData.append('receivedDate', invoiceHeader.receivedDate)
        formData.append('expiryDate', item.expiryDate)
        formData.append('batchNumber', item.batchNumber)
        formData.append('qcStatus', item.qcStatus)
        formData.append('rejectedQty', item.rejectedQty.toString())
        formData.append('rejectionReason', item.rejectionReason)
        
        await createGRN(formData)
      }

      // Reset form
      setInvoiceHeader({
        supplierId: '',
        invoiceNumber: '',
        poNumber: '',
        paymentType: 'New Ref',
        creditPeriod: 30,
        receivedDate: new Date().toISOString().split('T')[0]
      })
      setInvoiceItems([])
      setSelectedCategoryId(null)
      setSelectedSubCategoryId(null)
      setEditingItemId(null)
      setCreditLimitWarning(null)
      setPriceVarianceWarning(null)
      showToast('GRN saved successfully!', 'success')
    } catch (error) {
      showToast('Failed to save GRN. Please try again.', 'error')
    }
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId)
    return product?.name || 'Unknown Product'
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white font-medium animate-in slide-in-from-right duration-300 text-xs`}>
          {toast.message}
        </div>
      )}

      {/* GRN Header Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-bold text-blue-900">{grnNumber}</h1>
              <p className="text-sm text-blue-700">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              grnStatus === 'Pending' 
                ? 'bg-amber-100 text-amber-700 border border-amber-300' 
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}>
              {grnStatus}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${autoSaveStatus === 'saved' ? 'text-green-600' : 'text-gray-400'}`}>
                {autoSaveStatus === 'saved' ? '✓ Auto-saved' : autoSaveStatus === 'saving' ? 'Saving...' : 'Unsaved'}
              </span>
              <button
                onClick={handleSaveDraft}
                className="px-2 py-1 bg-white border border-blue-300 rounded text-xs text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Save Draft
              </button>
              <button
                onClick={handleClearDraft}
                className="px-2 py-1 bg-white border border-red-300 rounded text-xs text-red-600 hover:bg-red-50 transition-colors"
              >
                Clear Draft
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Total Items</p>
              <p className="text-xl font-bold text-blue-900">{invoiceItems.length}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Estimated Net Amount</p>
              <p className="text-xl font-bold text-blue-900">Rs. {calculateGrandTotal().toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Header Card */}
      <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-3">
        <h2 className="text-sm font-bold text-gray-800 mb-3">Invoice Header</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Supplier</label>
            <select
              value={invoiceHeader.supplierId}
              onChange={(e) => setInvoiceHeader({ ...invoiceHeader, supplierId: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            >
              <option value="">Select supplier</option>
              {suppliers.map((supplier: any) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Invoice / Reference Number</label>
            <input
              type="text"
              value={invoiceHeader.invoiceNumber}
              onChange={(e) => setInvoiceHeader({ ...invoiceHeader, invoiceNumber: e.target.value })}
              placeholder="Enter supplier bill number"
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">PO Number</label>
            <select
              value={invoiceHeader.poNumber}
              onChange={(e) => {
                const poNumber = e.target.value
                setInvoiceHeader({ ...invoiceHeader, poNumber })
                handlePOSelection(poNumber)
              }}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            >
              <option value="">Select PO (Optional)</option>
              <option value="PO-2024-001">PO-2024-001 - Flour Supplies</option>
              <option value="PO-2024-002">PO-2024-002 - Sugar Order</option>
              <option value="PO-2024-003">PO-2024-003 - Dairy Products</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Payment Type</label>
            <select
              value={invoiceHeader.paymentType}
              onChange={(e) => setInvoiceHeader({ ...invoiceHeader, paymentType: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            >
              <option value="New Ref">New Ref</option>
              <option value="Against Ref">Against Ref</option>
              <option value="Advance">Advance</option>
              <option value="On Account">On Account</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Credit Period (Days)</label>
            <input
              type="number"
              value={invoiceHeader.creditPeriod}
              onChange={(e) => setInvoiceHeader({ ...invoiceHeader, creditPeriod: parseInt(e.target.value) || 30 })}
              placeholder="30"
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Received Date</label>
            <input
              type="date"
              value={invoiceHeader.receivedDate}
              onChange={(e) => setInvoiceHeader({ ...invoiceHeader, receivedDate: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
        </div>
        {/* Payment Due Date & Status */}
        {invoiceHeader.creditPeriod && invoiceHeader.receivedDate && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-800 font-medium">Payment Due Date</p>
                <p className="text-lg font-bold text-blue-900">
                  {new Date(new Date(invoiceHeader.receivedDate).getTime() + invoiceHeader.creditPeriod * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-800 font-medium">Payment Status</p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Pending
                </span>
              </div>
            </div>
          </div>
        )}
        {creditLimitWarning && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">{creditLimitWarning}</p>
          </div>
        )}
      </div>

      {/* Item Entry Form - Reorganized into Sections */}
      <div className="shadow-sm border border-slate-200 bg-white rounded-xl p-4">
        <h2 className="text-sm font-bold text-gray-800 mb-4">
          {editingItemId ? 'Edit Item' : 'Add Item to Invoice'}
        </h2>
        {priceVarianceWarning && (
          <div className={`mb-4 p-3 rounded-lg border ${
            priceVarianceWarning.includes('increased') 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <p className={`text-xs font-medium ${
              priceVarianceWarning.includes('increased') 
                ? 'text-red-800' 
                : 'text-green-800'
            }`}>{priceVarianceWarning}</p>
          </div>
        )}

        {/* Section A: Primary Product Info */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
            Primary Product Info
          </h3>

          {/* Barcode Scanner Input */}
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Barcode Scanner (Quick Product Lookup)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && barcodeInput.trim()) {
                    handleBarcodeScan(barcodeInput.trim())
                  }
                }}
                placeholder="Scan barcode or enter product ID"
                className="flex-1 h-10 px-3 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => barcodeInput.trim() && handleBarcodeScan(barcodeInput.trim())}
                className="px-4 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Scan
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* ROW 1: Categories & Product */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Main Category
                </label>
                <select
                  value={selectedCategoryId || ''}
                  onChange={(e) => setSelectedCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full h-10 px-3 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Main Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Sub-Category
                </label>
                <select
                  value={selectedSubCategoryId || ''}
                  onChange={(e) => setSelectedSubCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full h-10 px-3 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Sub-category</option>
                  {categories
                    .find((cat: any) => cat.id === selectedCategoryId)
                    ?.subCategories?.map((subCat: any) => (
                      <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Select Product
                </label>
                <div className="flex gap-2">
                  <select
                    value={itemEntry.productId}
                    onChange={(e) => setItemEntry({ ...itemEntry, productId: e.target.value })}
                    className="flex-1 h-10 px-3 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Product</option>
                    {filteredProducts.map((product: any) => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                  {itemEntry.productId && (() => {
                    const product = products.find(p => p.id.toString() === itemEntry.productId)
                    const itemType = product ? getItemType(product) : ''
                    return (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        itemType === 'Raw Material' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {itemType}
                      </span>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* ROW 2: Batch, Qty & UOM */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Batch / Lot Number
                </label>
                <input
                  type="text"
                  value={itemEntry.batchNumber}
                  onChange={(e) => setItemEntry({ ...itemEntry, batchNumber: e.target.value })}
                  placeholder="Enter batch number"
                  className="w-full h-10 px-3 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={itemEntry.quantity}
                  onChange={(e) => setItemEntry({ ...itemEntry, quantity: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  min="0.01"
                  step="0.01"
                  className="w-full h-10 px-3 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  UOM (Unit of Measure)
                </label>
                <select
                  value={itemEntry.uom}
                  onChange={(e) => setItemEntry({ ...itemEntry, uom: e.target.value })}
                  className="w-full h-10 px-3 border border-slate-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {uoms.map(uom => (
                    <option key={uom} value={uom}>{uom}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Pricing & Financials */}
        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-3">Pricing & Financials</h3>
          
          {showSellingPriceAlert && proposedSellingPrice && (
            <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-orange-800 mb-1">⚠️ Cost Price Alert</p>
                  <p className="text-xs text-orange-700">True unit cost is close to current selling price. Recommended selling price: <span className="font-bold">Rs. {proposedSellingPrice.toFixed(2)}</span></p>
                </div>
                <button
                  onClick={() => {
                    const product = products.find(p => p.id.toString() === itemEntry.productId)
                    if (product && confirm(`Update selling price to Rs. ${proposedSellingPrice.toFixed(2)}?`)) {
                      // Note: This would require an API call to update the product selling price
                      // For now, just show a toast
                      showToast('Selling price update requires product management access', 'success')
                    }
                  }}
                  className="px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700 transition-colors"
                >
                  Update Price
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Unit Cost</label>
              <input
                type="number"
                step="0.01"
                value={itemEntry.unitCost}
                onChange={(e) => setItemEntry({ ...itemEntry, unitCost: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0.01"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Discount</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={itemEntry.discount}
                  onChange={(e) => setItemEntry({ ...itemEntry, discount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                />
                <select
                  value={itemEntry.discountType}
                  onChange={(e) => setItemEntry({ ...itemEntry, discountType: e.target.value })}
                  className="w-16 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                >
                  <option value="percentage">%</option>
                  <option value="amount">Rs.</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Landed Cost</label>
              <input
                type="number"
                step="0.01"
                value={itemEntry.landedCost}
                onChange={(e) => setItemEntry({ ...itemEntry, landedCost: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Freight Cost</label>
              <input
                type="number"
                step="0.01"
                value={itemEntry.freightCost}
                onChange={(e) => setItemEntry({ ...itemEntry, freightCost: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Handling Cost</label>
              <input
                type="number"
                step="0.01"
                value={itemEntry.handlingCost}
                onChange={(e) => setItemEntry({ ...itemEntry, handlingCost: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Tax Cost</label>
              <input
                type="number"
                step="0.01"
                value={itemEntry.taxCost}
                onChange={(e) => setItemEntry({ ...itemEntry, taxCost: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                min="0"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              />
            </div>
          </div>
        </div>

        {/* Section C: Quality Control & Expiry */}
        <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-xs font-semibold text-purple-800 uppercase tracking-wider mb-3">Quality Control & Expiry</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Expiry Date</label>
              <input
                type="date"
                value={itemEntry.expiryDate}
                onChange={(e) => setItemEntry({ ...itemEntry, expiryDate: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">QC Status</label>
              <select
                value={itemEntry.qcStatus}
                onChange={(e) => setItemEntry({ ...itemEntry, qcStatus: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              >
                <option value="Passed">Passed</option>
                <option value="Pending QC">Pending QC</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Rejected Qty</label>
              <input
                type="number"
                value={itemEntry.rejectedQty}
                onChange={(e) => setItemEntry({ ...itemEntry, rejectedQty: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Rejection Reason</label>
              <input
                type="text"
                value={itemEntry.rejectionReason}
                onChange={(e) => setItemEntry({ ...itemEntry, rejectionReason: e.target.value })}
                placeholder="Reason for rejection"
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              />
            </div>
          </div>
        </div>

        {/* Action Bar with Add Item Button */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
          <div className="flex gap-3 items-center">
            {itemEntry.unitCost && itemEntry.quantity && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600 font-medium">True Unit Cost:</span>
                  <span className="text-xs font-bold text-blue-800">Rs. {calculateTrueUnitCost().toFixed(2)}</span>
                </div>
              </div>
            )}
            {lastPurchasedPrice && itemEntry.unitCost && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Last: Rs. {lastPurchasedPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {editingItemId && (
              <button
                onClick={() => {
                  setEditingItemId(null)
                  setItemEntry({
                    productId: '',
                    quantity: 0,
                    freeQuantity: 0,
                    uom: 'Kg',
                    unitCost: 0,
                    discount: 0,
                    discountType: 'percentage',
                    landedCost: 0,
                    freightCost: 0,
                    handlingCost: 0,
                    taxCost: 0,
                    expiryDate: '',
                    batchNumber: '',
                    qcStatus: 'Passed',
                    rejectedQty: 0,
                    rejectionReason: ''
                  })
                  setLastPurchasedPrice(null)
                }}
                className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium h-8"
              >
                Cancel Edit
              </button>
            )}
            <button
              onClick={handleAddItem}
              className="h-9 px-4 text-xs font-semibold text-white bg-primary rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {editingItemId ? 'Update Item' : 'Add Item to Bill'}
            </button>
          </div>
        </div>
      </div>

      {/* Current Invoice Items Table */}
      <div className="shadow-sm border border-slate-200 bg-white rounded-lg overflow-hidden">
        <div className="p-3 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-800">Current Invoice Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1200px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">Product</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">Batch / Lot No</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">Qty</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">Free Qty</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">UOM</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">Unit Cost</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">Discount</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">Total Amount</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">Expiry Date</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">QC Status</th>
                <th className="px-4 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoiceItems.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                    No items added yet. Add items using the form above.
                  </td>
                </tr>
              ) : (
                invoiceItems.map((item) => (
                  <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${editingItemId === item.id ? 'bg-amber-50' : ''}`}>
                    <td className="px-4 py-4 text-sm text-gray-800 font-medium">{getProductName(item.productId)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{item.batchNumber || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{item.quantity}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{item.freeQuantity}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{item.uom}</td>
                    <td className="px-4 py-4 text-sm text-gray-800">Rs. {item.unitCost.toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {item.discount > 0 ? (
                        <span>
                          {item.discountType === 'percentage' 
                            ? `${item.discount}%` 
                            : `Rs. ${item.discount.toFixed(2)}`}
                        </span>
                      ) : 'N/A'}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800 font-medium">Rs. {calculateItemTotal(item).toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{item.expiryDate || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.qcStatus === 'Passed' ? 'bg-green-100 text-green-800' :
                        item.qcStatus === 'Pending QC' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.qcStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Invoice Summary Footer */}
        {invoiceItems.length > 0 && (
          <div className="sticky bottom-0 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-gray-200 p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Subtotal</p>
                <p className="text-2xl font-bold text-gray-800">Rs. {calculateSubTotal().toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Discounts</p>
                <p className="text-2xl font-bold text-green-600">- Rs. {calculateTotalDiscount().toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Extra Charges</p>
                <p className="text-2xl font-bold text-amber-600">Rs. {calculateTotalLandedCost().toFixed(2)}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 shadow-md">
                <p className="text-xs text-blue-100 font-medium uppercase tracking-wide">Grand Total</p>
                <p className="text-2xl font-bold text-white">Rs. {calculateGrandTotal().toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-gray-600">Items Count</span>
                <span className="font-semibold text-gray-800">{invoiceItems.length}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-gray-600">Total Quantity</span>
                <span className="font-semibold text-gray-800">{invoiceItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg p-3">
                <span className="text-gray-600">Avg Unit Cost</span>
                <span className="font-semibold text-gray-800">
                  Rs. {(calculateSubTotal() / invoiceItems.reduce((sum, item) => sum + item.quantity, 0)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {invoiceItems.length > 0 && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to cancel? All items will be cleared.')) {
                setInvoiceHeader({ 
                  supplierId: '', 
                  invoiceNumber: '',
                  poNumber: '',
                  paymentType: 'New Ref',
                  creditPeriod: 30,
                  receivedDate: new Date().toISOString().split('T')[0]
                })
                setInvoiceItems([])
                setSelectedCategoryId(null)
                setSelectedSubCategoryId(null)
                setEditingItemId(null)
                setCreditLimitWarning(null)
                setPriceVarianceWarning(null)
              }
            }}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAndFinalize}
            className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Save & Finalize GRN
          </button>
        </div>
      )}
    </div>
  )
}
