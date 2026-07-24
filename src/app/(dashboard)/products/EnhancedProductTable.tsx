'use client'

import { useState, useEffect } from 'react'
import { deleteProduct, updateProduct, createProduct } from '@/actions/product'
import { getProductProfitMargin, getProductStockStatus, getProductBatches, getProductRecipe, saveProductRecipe } from '@/actions/product-analytics'
import CategorySelector from '@/components/CategorySelector'

interface Product {
  id: number
  name: string
  category: string
  categoryId?: number | null
  subCategoryId?: number | null
  costPrice: number
  sellingPrice: number
  packagingCost?: number
  currentStock: number
  reorderLevel?: number
  supplierId: number
  supplier: {
    id: number
    name: string
  }
  imageUrl?: string | null
  productType?: 'ready-made' | 'made-to-order'
  trackStock?: boolean
}

interface ProductTableProps {
  products: Product[]
  suppliers: any[]
  categories: any[]
  userRole: 'ADMIN' | 'CASHIER' | null
  analytics: {
    totalProducts: number
    totalStockValuation: number
    lowStockCount: number
  }
  storeSettings?: any
}

export default function EnhancedProductTable({ products, suppliers, categories, userRole, analytics, storeSettings }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewBatches, setViewBatches] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bakery Items',
    categoryId: null as number | null,
    subCategoryId: null as number | null,
    costPrice: '',
    sellingPrice: '',
    packagingCost: '',
    reorderLevel: '10',
    supplierId: '',
    imageUrl: '',
    imageFile: null as File | null,
    productType: 'ready-made' as 'ready-made' | 'made-to-order',
    trackStock: true
  })
  
  // Recipe/BOM state
  const [activeTab, setActiveTab] = useState<'details' | 'recipe'>('details')
  const [recipeItems, setRecipeItems] = useState<Array<{ ingredientId: number; quantity: number; unit: string }>>([])
  const [newRecipeItem, setNewRecipeItem] = useState({ ingredientId: '', quantity: '', unit: 'kg' })
  
  // Batches state
  const [batches, setBatches] = useState<any[]>([])

  const staticCategories = ['All', 'Bakery Items', 'Hot Kitchen (Kottu/Rice)', 'Beverages', 'Desserts']

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setSelectedCategoryId(product.categoryId || null)
    setSelectedSubCategoryId(product.subCategoryId || null)
    setFormData({
      name: product.name,
      category: product.category,
      categoryId: product.categoryId || null,
      subCategoryId: product.subCategoryId || null,
      costPrice: product.costPrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      packagingCost: (product.packagingCost || 0).toString(),
      reorderLevel: (product.reorderLevel || 10).toString(),
      supplierId: product.supplierId.toString(),
      imageUrl: product.imageUrl || '',
      imageFile: null,
      productType: product.productType || 'ready-made',
      trackStock: product.trackStock !== false
    })
    setActiveTab('details')
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setShowAddModal(false)
    setViewBatches(null)
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setRecipeItems([])
    setNewRecipeItem({ ingredientId: '', quantity: '', unit: 'kg' })
    setFormData({ name: '', category: 'Bakery Items', categoryId: null, subCategoryId: null, costPrice: '', sellingPrice: '', packagingCost: '', reorderLevel: '10', supplierId: '', imageUrl: '', imageFile: null, productType: 'ready-made', trackStock: true })
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    try {
      const response = await fetch('/api/upload-product-image', {
        method: 'POST',
        body: uploadFormData
      })

      const result = await response.json()
      if (result.success) {
        setFormData({ ...formData, imageUrl: result.path, imageFile: file })
      } else {
        alert('Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id)
      if (!result.success) {
        alert(result.error)
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    const formDataToSend = new FormData()
    formDataToSend.append('id', editingProduct.id.toString())
    formDataToSend.append('name', formData.name)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('categoryId', selectedCategoryId?.toString() || '')
    formDataToSend.append('subCategoryId', selectedSubCategoryId?.toString() || '')
    formDataToSend.append('costPrice', formData.costPrice)
    formDataToSend.append('sellingPrice', formData.sellingPrice)
    formDataToSend.append('packagingCost', formData.packagingCost)
    formDataToSend.append('reorderLevel', formData.reorderLevel)
    formDataToSend.append('supplierId', formData.supplierId)
    formDataToSend.append('imageUrl', formData.imageUrl)

    await updateProduct(formDataToSend)
    
    // Save recipe if in recipe tab
    if (activeTab === 'recipe' && editingProduct) {
      await saveProductRecipe(editingProduct.id, recipeItems)
    }
    
    setEditingProduct(null)
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setRecipeItems([])
    setFormData({ name: '', category: 'Bakery Items', categoryId: null, subCategoryId: null, costPrice: '', sellingPrice: '', packagingCost: '', reorderLevel: '10', supplierId: '', imageUrl: '', imageFile: null, productType: 'ready-made', trackStock: true })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.name)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('categoryId', selectedCategoryId?.toString() || '')
    formDataToSend.append('subCategoryId', selectedSubCategoryId?.toString() || '')
    formDataToSend.append('costPrice', formData.costPrice)
    formDataToSend.append('sellingPrice', formData.sellingPrice)
    formDataToSend.append('packagingCost', formData.packagingCost)
    formDataToSend.append('reorderLevel', formData.reorderLevel)
    formDataToSend.append('supplierId', formData.supplierId)
    formDataToSend.append('imageUrl', formData.imageUrl)

    await createProduct(formDataToSend)
    setShowAddModal(false)
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setRecipeItems([])
    setFormData({ name: '', category: 'Bakery Items', categoryId: null, subCategoryId: null, costPrice: '', sellingPrice: '', packagingCost: '', reorderLevel: '10', supplierId: '', imageUrl: '', imageFile: null, productType: 'ready-made', trackStock: true })
  }

  const handleProductTypeChange = (type: 'ready-made' | 'made-to-order') => {
    setFormData({
      ...formData,
      productType: type,
      trackStock: type === 'ready-made'
    })
  }

  const handleViewBatches = async (product: Product) => {
    setViewBatches(product)
    const batchData = await getProductBatches(product.id)
    setBatches(batchData)
  }

  const addRecipeItem = () => {
    if (newRecipeItem.ingredientId && newRecipeItem.quantity) {
      setRecipeItems([...recipeItems, {
        ingredientId: parseInt(newRecipeItem.ingredientId),
        quantity: parseFloat(newRecipeItem.quantity),
        unit: newRecipeItem.unit
      }])
      setNewRecipeItem({ ingredientId: '', quantity: '', unit: 'kg' })
    }
  }

  const removeRecipeItem = (index: number) => {
    setRecipeItems(recipeItems.filter((_, i) => i !== index))
  }

  const calculateProfitMargin = (product: Product) => {
    const totalCost = product.costPrice + (product.packagingCost || 0)
    const margin = ((product.sellingPrice - totalCost) / product.sellingPrice) * 100
    return margin
  }

  const isLoss = (product: Product) => {
    const totalCost = product.costPrice + (product.packagingCost || 0)
    return product.sellingPrice < totalCost
  }

  const getStockStatus = (product: Product) => {
    if (!product.trackStock) return 'In-Service'
    const lowStockThreshold = storeSettings?.lowStockThreshold || 5
    if (product.currentStock === 0) return 'Out of Stock'
    if (product.currentStock <= lowStockThreshold) return 'Low Stock'
    return 'Healthy'
  }

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case 'Healthy':
        return 'bg-green-100 text-green-800'
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'Out of Stock':
        return 'bg-red-100 text-red-800'
      case 'In-Service':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{analytics.totalProducts}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Valuation</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                Rs. {analytics.totalStockValuation.toFixed(2)}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{analytics.lowStockCount}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-sm">⚠️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      {editingProduct && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-3.5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Edit Product</h2>
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200 mb-3">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Product Details
            </button>
            <button
              onClick={() => setActiveTab('recipe')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'recipe'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Recipe / BOM
            </button>
          </div>

          {activeTab === 'details' ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <CategorySelector
                      categories={categories}
                      selectedCategoryId={selectedCategoryId}
                      selectedSubCategoryId={selectedSubCategoryId}
                      onCategoryChange={setSelectedCategoryId}
                      onSubCategoryChange={setSelectedSubCategoryId}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                    <select
                      value={formData.supplierId}
                      onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">In-House / None</option>
                      {suppliers.map((supplier: any) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Pricing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Packaging Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.packagingCost}
                      onChange={(e) => setFormData({ ...formData, packagingCost: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
                    <input
                      type="number"
                      value={formData.reorderLevel}
                      onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Product Image Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Product Image</h3>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(file)
                        }
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {formData.imageUrl && (
                    <div className="flex-shrink-0">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                      <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img
                          src={formData.imageUrl}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Update Product
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Recipe / Bill of Materials</h3>
              <div className="mb-4">
                <div className="flex gap-2 mb-4">
                  <select
                    value={newRecipeItem.ingredientId}
                    onChange={(e) => setNewRecipeItem({ ...newRecipeItem, ingredientId: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select ingredient</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Quantity"
                    value={newRecipeItem.quantity}
                    onChange={(e) => setNewRecipeItem({ ...newRecipeItem, quantity: e.target.value })}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={newRecipeItem.unit}
                    onChange={(e) => setNewRecipeItem({ ...newRecipeItem, unit: e.target.value })}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="L">L</option>
                    <option value="ml">ml</option>
                    <option value="pcs">pcs</option>
                  </select>
                  <button
                    type="button"
                    onClick={addRecipeItem}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {recipeItems.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-600">
                        <th className="pb-2">Ingredient</th>
                        <th className="pb-2">Quantity</th>
                        <th className="pb-2">Unit</th>
                        <th className="pb-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipeItems.map((item, index) => {
                        const ingredient = products.find(p => p.id === item.ingredientId)
                        return (
                          <tr key={index} className="border-t">
                            <td className="py-2">{ingredient?.name || 'Unknown'}</td>
                            <td className="py-2">{item.quantity}</td>
                            <td className="py-2">{item.unit}</td>
                            <td className="py-2">
                              <button
                                type="button"
                                onClick={() => removeRecipeItem(index)}
                                className="text-red-500 hover:text-red-700"
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
              )}
              
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setActiveTab('details')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Back to Details
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Save Recipe
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
        {userRole === 'ADMIN' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="h-8 px-3 text-xs font-medium text-white bg-primary rounded-lg shadow-sm"
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)]">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">ID</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Name</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Category</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Cost Price</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Packaging Cost</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Selling Price</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Profit Margin %</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Stock Status</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Current Stock</th>
                <th className="px-3 py-2 text-xs font-semibold text-slate-600">Supplier</th>
                {userRole === 'ADMIN' && (
                  <th className="px-3 py-2 text-xs font-semibold text-slate-600">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={userRole === 'ADMIN' ? 11 : 10} className="px-3 py-6 text-center text-xs text-slate-500">
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 py-2 text-xs text-slate-800">{product.id}</td>
                    <td className="px-3 py-2 text-xs text-slate-800 font-medium">{product.name}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{product.category}</td>
                    <td className="px-3 py-2 text-xs text-slate-800">Rs. {product.costPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 text-xs text-slate-800">Rs. {(product.packagingCost || 0).toFixed(2)}</td>
                    <td className="px-3 py-2 text-xs text-slate-800">Rs. {product.sellingPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 text-xs">
                      {isLoss(product) ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          ⚠️ Loss
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-gray-800">
                          {calculateProfitMargin(product).toFixed(1)}%
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStockStatusBadge(getStockStatus(product))}`}>
                        {getStockStatus(product)}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-800">{product.currentStock}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{product.supplier?.name || 'In-House'}</td>
                    {userRole === 'ADMIN' && (
                      <td className="px-3 py-2">
                        <div className="flex gap-1 flex-wrap">
                          <button
                            onClick={() => handleViewBatches(product)}
                            className="px-2 py-0.5 text-[11px] font-medium text-white bg-purple-500 rounded hover:bg-purple-600 transition-colors"
                          >
                            Batches
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-2 py-0.5 text-[11px] font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-2 py-0.5 text-[11px] font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                          >
                            Delete
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

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-4 lg:p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Add New Product</h2>
            <form onSubmit={handleAdd} className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <CategorySelector
                      categories={categories}
                      selectedCategoryId={selectedCategoryId}
                      selectedSubCategoryId={selectedSubCategoryId}
                      onCategoryChange={setSelectedCategoryId}
                      onSubCategoryChange={setSelectedSubCategoryId}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                    <select
                      value={formData.supplierId}
                      onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    >
                      <option value="">In-House / None</option>
                      {suppliers.map((supplier: any) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Pricing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Packaging Cost</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.packagingCost}
                      onChange={(e) => setFormData({ ...formData, packagingCost: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
                    <input
                      type="number"
                      value={formData.reorderLevel}
                      onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Product Image Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">Product Image</h3>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleImageUpload(file)
                        }
                      }}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                  </div>
                  {formData.imageUrl && (
                    <div className="flex-shrink-0">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                      <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <img
                          src={formData.imageUrl}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-white rounded-lg transition-colors font-medium"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Batches Modal */}
      {viewBatches && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 lg:p-6 flex justify-between items-start">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">{viewBatches.name}</h2>
                <p className="text-purple-100">Stock Batches</p>
              </div>
              <button
                onClick={() => setViewBatches(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              {batches.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No stock batches found for this product</p>
              ) : (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Batch Number</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Quantity</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Expiry Date</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">GRN Origin</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Supplier</th>
                          <th className="px-4 py-3 text-sm font-medium text-gray-600">Received Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {batches.map((batch, index) => (
                          <tr key={index} className="hover:bg-gray-100">
                            <td className="px-4 py-3 text-sm text-gray-800">{batch.batchNumber}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{batch.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-800">{batch.grnNumber}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{batch.supplierName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {batch.receivedDate ? new Date(batch.receivedDate).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 p-4 lg:p-6 flex justify-end">
              <button
                onClick={() => setViewBatches(null)}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
