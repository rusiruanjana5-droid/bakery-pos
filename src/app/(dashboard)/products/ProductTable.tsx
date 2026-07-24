'use client'

import { useState } from 'react'
import { deleteProduct, updateProduct, createProduct } from '@/actions/product'
import { LOW_STOCK_THRESHOLD } from '@/config'
import CategorySelector from '@/components/CategorySelector'

interface Product {
  id: number
  name: string
  category: string
  categoryId?: number | null
  subCategoryId?: number | null
  costPrice: number
  sellingPrice: number
  currentStock: number
  supplierId: number
  supplier: {
    id: number
    name: string
  }
  productType?: 'ready-made' | 'made-to-order'
  trackStock?: boolean
  packagingCost?: number
}

interface ProductTableProps {
  products: Product[]
  suppliers: any[]
  categories: any[]
  userRole: 'ADMIN' | 'CASHIER'
}

export function ProductTable({ products, suppliers, categories, userRole }: ProductTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
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
    supplierId: '',
    productType: 'ready-made' as 'ready-made' | 'made-to-order',
    trackStock: true,
    packagingCost: ''
  })

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
      supplierId: product.supplierId.toString(),
      productType: product.productType || 'ready-made',
      trackStock: product.trackStock !== false,
      packagingCost: (product.packagingCost || 0).toString()
    })
  }

  const handleCancel = () => {
    setEditingProduct(null)
    setShowAddModal(false)
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setFormData({ name: '', category: 'Bakery Items', categoryId: null, subCategoryId: null, costPrice: '', sellingPrice: '', supplierId: '', productType: 'ready-made', trackStock: true, packagingCost: '' })
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
    formDataToSend.append('supplierId', formData.supplierId)

    await updateProduct(formDataToSend)
    setEditingProduct(null)
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setFormData({ name: '', category: 'Bakery Items', categoryId: null, subCategoryId: null, costPrice: '', sellingPrice: '', supplierId: '', productType: 'ready-made', trackStock: true, packagingCost: '' })
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
    formDataToSend.append('supplierId', formData.supplierId)

    await createProduct(formDataToSend)
    setShowAddModal(false)
    setSelectedCategoryId(null)
    setSelectedSubCategoryId(null)
    setFormData({ name: '', category: 'Bakery Items', categoryId: null, subCategoryId: null, costPrice: '', sellingPrice: '', supplierId: '', productType: 'ready-made', trackStock: true, packagingCost: '' })
  }

  const handleProductTypeChange = (type: 'ready-made' | 'made-to-order') => {
    setFormData({
      ...formData,
      productType: type,
      trackStock: type === 'ready-made'
    })
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div>
      {/* Edit Form */}
      {editingProduct && (
        <div className="mb-4 lg:mb-6 bg-blue-50 p-4 lg:p-6 rounded-xl shadow-md">
          <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-4">Edit Product</h2>
          <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <CategorySelector
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                selectedSubCategoryId={selectedSubCategoryId}
                onCategoryChange={setSelectedCategoryId}
                onSubCategoryChange={setSelectedSubCategoryId}
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
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
            <div className="flex items-end gap-2 w-full sm:w-auto">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Update Product
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

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4 lg:mb-6">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
            className="px-6 py-2 bg-primary text-white rounded-lg transition-colors font-medium"
          >
            + Add Product
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-gray-600">ID</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-gray-600">Name</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-gray-600">Cost Price</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-gray-600">Packaging Cost</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-gray-600">Selling Price</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-gray-600">Current Stock</th>
                <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-gray-600">Supplier</th>
                {userRole === 'ADMIN' && (
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-sm font-medium text-gray-600">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={userRole === 'ADMIN' ? 9 : 8} className="px-4 lg:px-6 py-8 text-center text-gray-500">
                    No products found. Add your first product!
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-800">{product.id}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-800 font-medium">{product.name}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-800">Rs. {product.costPrice.toFixed(2)}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-800">Rs. {(product.packagingCost || 0).toFixed(2)}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-800">Rs. {product.sellingPrice.toFixed(2)}</td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                      {product.trackStock === false || product.category === 'Hot Kitchen (Kottu/Rice)' || product.category === 'pizza' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          In-Service
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${
                            product.currentStock < LOW_STOCK_THRESHOLD
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {product.currentStock < LOW_STOCK_THRESHOLD && <span>⚠️</span>}
                          {product.currentStock} - {product.currentStock < LOW_STOCK_THRESHOLD ? 'Critical' : 'Healthy'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-600">{product.supplier.name}</td>
                    {userRole === 'ADMIN' && (
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
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
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                  <select
                    value={formData.productType}
                    onChange={(e) => handleProductTypeChange(e.target.value as 'ready-made' | 'made-to-order')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="ready-made">Ready-made (Bakery)</option>
                    <option value="made-to-order">Made-to-order (Hot Kitchen)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Track Stock</label>
                  <select
                    value={formData.trackStock ? 'Yes' : 'No'}
                    onChange={(e) => setFormData({ ...formData, trackStock: e.target.value === 'Yes' })}
                    disabled={formData.productType === 'made-to-order'}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                      formData.productType === 'made-to-order' ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {formData.productType === 'made-to-order' && (
                    <p className="text-xs text-gray-500 mt-1">Auto-disabled for made-to-order items</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cost Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Select supplier</option>
                    <option value="in-house">In-House / None</option>
                    {suppliers.map((supplier: any) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg transition-colors font-medium"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
