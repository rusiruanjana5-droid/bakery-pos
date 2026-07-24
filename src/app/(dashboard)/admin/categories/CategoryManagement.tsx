'use client'

import { useState } from 'react'
import { createCategory, updateCategory, deleteCategory, createSubCategory, updateSubCategory, deleteSubCategory, toggleCategoryStatus, toggleSubCategoryStatus, bulkUpdateCategories, getCategoryAnalytics } from '@/actions/category'

interface Category {
  id: number
  name: string
  description?: string | null
  isActive: boolean
  displayOrder: number
  color?: string | null
  imageUrl?: string | null
  taxRate?: number | null
  activeHoursStart?: string | null
  activeHoursEnd?: string | null
  createdAt: Date
  updatedAt: Date
  subCategories: SubCategory[]
}

interface SubCategory {
  id: number
  name: string
  categoryId: number
  isActive: boolean
  displayOrder: number
  color?: string | null
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

interface CategoryManagementProps {
  categories: Category[]
  userRole: 'ADMIN' | 'CASHIER'
}

export default function CategoryManagement({ categories, userRole }: CategoryManagementProps) {
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null)
  const [selectedParentCategory, setSelectedParentCategory] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [categoryAnalytics, setCategoryAnalytics] = useState<Map<number, { activeProducts: number; totalRevenue: number }>>(new Map())
  const [draggedCategory, setDraggedCategory] = useState<number | null>(null)
  const [localCategories, setLocalCategories] = useState<Category[]>(categories)

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    color: '',
    imageUrl: '',
    taxRate: '',
    activeHoursStart: '',
    activeHoursEnd: ''
  })

  const [subCategoryFormData, setSubCategoryFormData] = useState({
    name: '',
    categoryId: '',
    isActive: true,
    color: '',
    imageUrl: ''
  })

  const handleAddCategory = () => {
    setEditingCategory(null)
    setCategoryFormData({ name: '', description: '', isActive: true, color: '', imageUrl: '', taxRate: '', activeHoursStart: '', activeHoursEnd: '' })
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
      color: category.color || '',
      imageUrl: category.imageUrl || '',
      taxRate: category.taxRate?.toString() || '',
      activeHoursStart: category.activeHoursStart || '',
      activeHoursEnd: category.activeHoursEnd || ''
    })
    setShowCategoryModal(true)
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', categoryFormData.name)
    formData.append('description', categoryFormData.description)
    formData.append('isActive', categoryFormData.isActive.toString())
    formData.append('color', categoryFormData.color)
    formData.append('imageUrl', categoryFormData.imageUrl)
    formData.append('taxRate', categoryFormData.taxRate)
    formData.append('activeHoursStart', categoryFormData.activeHoursStart)
    formData.append('activeHoursEnd', categoryFormData.activeHoursEnd)

    if (editingCategory) {
      formData.append('id', editingCategory.id.toString())
      await updateCategory(formData)
    } else {
      await createCategory(formData)
    }

    setShowCategoryModal(false)
    setEditingCategory(null)
    setCategoryFormData({ name: '', description: '', isActive: true, color: '', imageUrl: '', taxRate: '', activeHoursStart: '', activeHoursEnd: '' })
    window.location.reload()
  }

  const handleAddSubCategory = (categoryId: number) => {
    setEditingSubCategory(null)
    setSelectedParentCategory(categoryId)
    setSubCategoryFormData({ name: '', categoryId: categoryId.toString(), isActive: true, color: '', imageUrl: '' })
    setShowSubCategoryModal(true)
  }

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory)
    setSelectedParentCategory(subCategory.categoryId)
    setSubCategoryFormData({
      name: subCategory.name,
      categoryId: subCategory.categoryId.toString(),
      isActive: subCategory.isActive,
      color: subCategory.color || '',
      imageUrl: subCategory.imageUrl || ''
    })
    setShowSubCategoryModal(true)
  }

  const handleSubCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', subCategoryFormData.name)
    formData.append('categoryId', subCategoryFormData.categoryId)
    formData.append('isActive', subCategoryFormData.isActive.toString())
    formData.append('color', subCategoryFormData.color)
    formData.append('imageUrl', subCategoryFormData.imageUrl)

    if (editingSubCategory) {
      formData.append('id', editingSubCategory.id.toString())
      await updateSubCategory(formData)
    } else {
      await createSubCategory(formData)
    }

    setShowSubCategoryModal(false)
    setEditingSubCategory(null)
    setSelectedParentCategory(null)
    setSubCategoryFormData({ name: '', categoryId: '', isActive: true, color: '', imageUrl: '' })
    window.location.reload()
  }

  const handleDeleteCategory = async (id: number) => {
    if (confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      const result = await deleteCategory(id)
      if (!result.success) {
        alert(result.error)
      } else {
        window.location.reload()
      }
    }
  }

  const handleDeleteSubCategory = async (id: number) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      const result = await deleteSubCategory(id)
      if (!result.success) {
        alert(result.error)
      } else {
        window.location.reload()
      }
    }
  }

  const handleToggleCategoryStatus = async (id: number, isActive: boolean) => {
    await toggleCategoryStatus(id, isActive)
    window.location.reload()
  }

  const handleToggleSubCategoryStatus = async (id: number, isActive: boolean) => {
    await toggleSubCategoryStatus(id, isActive)
    window.location.reload()
  }

  const handleBulkAction = async (action: 'enable' | 'disable' | 'delete') => {
    if (selectedCategories.length === 0) {
      alert('Please select at least one category')
      return
    }
    
    if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedCategories.length} categories?`)) {
      return
    }

    const result = await bulkUpdateCategories(selectedCategories, action)
    if (!result.success) {
      alert(result.error)
    } else {
      window.location.reload()
    }
  }

  const toggleCategoryExpansion = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const loadCategoryAnalytics = async (categoryId: number) => {
    const analytics = await getCategoryAnalytics(categoryId)
    setCategoryAnalytics(prev => new Map(prev).set(categoryId, analytics))
  }

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.subCategories.some(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDragStart = (e: React.DragEvent, categoryId: number) => {
    setDraggedCategory(categoryId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, targetCategoryId: number) => {
    e.preventDefault()
    if (draggedCategory === null || draggedCategory === targetCategoryId) return

    const updatedCategories = [...localCategories]
    const draggedIndex = updatedCategories.findIndex(cat => cat.id === draggedCategory)
    const targetIndex = updatedCategories.findIndex(cat => cat.id === targetCategoryId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const [draggedItem] = updatedCategories.splice(draggedIndex, 1)
    updatedCategories.splice(targetIndex, 0, draggedItem)

    // Update display orders
    const categoryIds = updatedCategories.map(cat => cat.id)
    
    try {
      const { reorderCategories } = await import('@/actions/category')
      await reorderCategories(categoryIds)
      setLocalCategories(updatedCategories)
      window.location.reload()
    } catch (error) {
      console.error('Error reordering categories:', error)
      alert('Failed to reorder categories')
    }

    setDraggedCategory(null)
  }

  if (userRole !== 'ADMIN') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Only administrators can manage categories.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Search and Bulk Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between shadow-sm border border-slate-200 bg-white rounded-lg p-3">
        <div className="flex-1 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search categories and subcategories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
          />
        </div>
        {selectedCategories.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('enable')}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors h-8"
            >
              Enable ({selectedCategories.length})
            </button>
            <button
              onClick={() => handleBulkAction('disable')}
              className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors h-8"
            >
              Disable ({selectedCategories.length})
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors h-8"
            >
              Delete ({selectedCategories.length})
            </button>
          </div>
        )}
        <button
          onClick={handleAddCategory}
          className="px-3 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium h-8"
        >
          + Add Main Category
        </button>
      </div>
      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-3 w-full max-w-md">
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <form onSubmit={handleCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Category Name</label>
                <input
                  type="text"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
                <textarea
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={categoryFormData.color || '#000000'}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                      className="w-8 h-8 border border-slate-200 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={categoryFormData.color}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                      placeholder="#000000"
                      className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={categoryFormData.taxRate}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, taxRate: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Image URL</label>
                <input
                  type="text"
                  value={categoryFormData.imageUrl}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, imageUrl: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  placeholder="https://example.com/image.png"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Active Hours Start</label>
                  <input
                    type="time"
                    value={categoryFormData.activeHoursStart}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, activeHoursStart: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Active Hours End</label>
                  <input
                    type="time"
                    value={categoryFormData.activeHoursEnd}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, activeHoursEnd: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="categoryActive"
                  checked={categoryFormData.isActive}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, isActive: e.target.checked })}
                  className="w-3 h-3 text-amber-500 border-slate-200 rounded focus:ring-amber-500"
                />
                <label htmlFor="categoryActive" className="ml-2 text-xs text-gray-700">Active</label>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-2 py-1.5 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors h-8"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors h-8"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SubCategory Modal */}
      {showSubCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-3 w-full max-w-md">
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              {editingSubCategory ? 'Edit Sub-category' : 'Add New Sub-category'}
            </h2>
            <form onSubmit={handleSubCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Parent Category</label>
                <select
                  value={subCategoryFormData.categoryId}
                  onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, categoryId: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  required
                  disabled={!!editingSubCategory}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Sub-category Name</label>
                <input
                  type="text"
                  value={subCategoryFormData.name}
                  onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, name: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={subCategoryFormData.color || '#000000'}
                      onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, color: e.target.value })}
                      className="w-8 h-8 border border-slate-200 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={subCategoryFormData.color}
                      onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, color: e.target.value })}
                      placeholder="#000000"
                      className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={subCategoryFormData.imageUrl}
                    onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, imageUrl: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                    placeholder="https://example.com/image.png"
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="subCategoryActive"
                  checked={subCategoryFormData.isActive}
                  onChange={(e) => setSubCategoryFormData({ ...subCategoryFormData, isActive: e.target.checked })}
                  className="w-3 h-3 text-amber-500 border-slate-200 rounded focus:ring-amber-500"
                />
                <label htmlFor="subCategoryActive" className="ml-2 text-xs text-gray-700">Active</label>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowSubCategoryModal(false)}
                  className="px-2 py-1.5 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors h-8"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1.5 text-xs bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors h-8"
                >
                  {editingSubCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-2">
        {filteredCategories.map((category, index) => {
          const analytics = categoryAnalytics.get(category.id)
          const isExpanded = expandedCategories.has(category.id)
          const isSelected = selectedCategories.includes(category.id)
          const isDragging = draggedCategory === category.id

          return (
            <div 
              key={category.id} 
              className={`shadow-sm border border-slate-200 bg-white rounded-lg overflow-hidden transition-all ${
                isDragging ? 'opacity-50 scale-95' : ''
              }`}
              draggable
              onDragStart={(e) => handleDragStart(e, category.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, category.id)}
            >
              <div 
                className="p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                style={{ borderLeft: category.color ? `4px solid ${category.color}` : '4px solid transparent' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2 flex-1">
                    <div className="cursor-grab text-gray-400 hover:text-gray-600 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category.id])
                        } else {
                          setSelectedCategories(selectedCategories.filter(id => id !== category.id))
                        }
                      }}
                      className="w-3 h-3 mt-0.5 text-amber-500 border-slate-200 rounded focus:ring-amber-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {category.imageUrl && (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name}
                            className="w-8 h-8 object-cover rounded-md"
                          />
                        )}
                        <h3 className="text-sm font-bold text-gray-800">{category.name}</h3>
                        {!category.isActive && (
                          <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Inactive</span>
                        )}
                        {category.taxRate && category.taxRate > 0 && (
                          <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                            {category.taxRate}% Tax
                          </span>
                        )}
                        {(category.activeHoursStart || category.activeHoursEnd) && (
                          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {category.activeHoursStart} - {category.activeHoursEnd}
                          </span>
                        )}
                      </div>
                      {category.description && (
                        <p className="text-xs text-gray-600 mt-0.5">{category.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{category.subCategories.length} subcategory{category.subCategories.length !== 1 ? 'ies' : ''}</span>
                        {analytics && (
                          <>
                            <span>• {analytics.activeProducts} active products</span>
                            <span>• Rs. {analytics.totalRevenue.toFixed(2)} revenue</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleCategoryStatus(category.id, !category.isActive)
                      }}
                      className={`px-2 py-1 rounded transition-colors text-xs h-7 ${
                        category.isActive 
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                      title={category.isActive ? 'Disable' : 'Enable'}
                    >
                      {category.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditCategory(category)
                      }}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors h-7"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCategory(category.id)
                      }}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors h-7"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Subcategories - Expandable */}
              {category.subCategories.length > 0 && (
                <div className="border-t border-gray-200">
                  <button
                    onClick={() => {
                      toggleCategoryExpansion(category.id)
                      if (!isExpanded) loadCategoryAnalytics(category.id)
                    }}
                    className="w-full p-2 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-xs font-medium text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      {isExpanded ? '▼' : '▶'} Sub-categories ({category.subCategories.length})
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="p-3 bg-gray-50 space-y-2">
                      {category.subCategories.map((subCategory) => (
                        <div 
                          key={subCategory.id} 
                          className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200"
                          style={{ borderLeft: subCategory.color ? `3px solid ${subCategory.color}` : '3px solid transparent' }}
                        >
                          <div className="flex items-center gap-2">
                            {subCategory.imageUrl && (
                              <img 
                                src={subCategory.imageUrl} 
                                alt={subCategory.name}
                                className="w-6 h-6 object-cover rounded"
                              />
                            )}
                            <span className="text-xs text-gray-800">{subCategory.name}</span>
                            {!subCategory.isActive && (
                              <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Inactive</span>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleToggleSubCategoryStatus(subCategory.id, !subCategory.isActive)}
                              className={`px-2 py-1 rounded transition-colors text-xs h-7 ${
                                subCategory.isActive 
                                  ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                              title={subCategory.isActive ? 'Disable' : 'Enable'}
                            >
                              {subCategory.isActive ? 'Disable' : 'Enable'}
                            </button>
                            <button
                              onClick={() => handleEditSubCategory(subCategory)}
                              className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors h-7"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSubCategory(subCategory.id)}
                              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors h-7"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Add Subcategory Button */}
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => handleAddSubCategory(category.id)}
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                >
                  + Add Sub-category
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {categories.length === 0 && (
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg p-6 text-center">
          <p className="text-xs text-gray-500">No categories found. Add your first category to get started.</p>
        </div>
      )}
    </div>
  )
}
