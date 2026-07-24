'use client'

import { useState, useEffect } from 'react'

interface Category {
  id: number
  name: string
  subCategories: SubCategory[]
}

interface SubCategory {
  id: number
  name: string
}

interface CategorySelectorProps {
  categories: Category[]
  selectedCategoryId?: number | null
  selectedSubCategoryId?: number | null
  onCategoryChange: (categoryId: number | null) => void
  onSubCategoryChange: (subCategoryId: number | null) => void
  disabled?: boolean
}

export default function CategorySelector({
  categories,
  selectedCategoryId,
  selectedSubCategoryId,
  onCategoryChange,
  onSubCategoryChange,
  disabled = false
}: CategorySelectorProps) {
  const [availableSubCategories, setAvailableSubCategories] = useState<SubCategory[]>([])

  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(c => c.id === selectedCategoryId)
      setAvailableSubCategories(category?.subCategories || [])
    } else {
      setAvailableSubCategories([])
    }
    // Reset subcategory when category changes
    if (selectedCategoryId === null) {
      onSubCategoryChange(null)
    }
  }, [selectedCategoryId, categories, onSubCategoryChange])

  return (
    <div className="flex gap-2">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => onCategoryChange(e.target.value ? parseInt(e.target.value) : null)}
          disabled={disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category</label>
        <select
          value={selectedSubCategoryId || ''}
          onChange={(e) => onSubCategoryChange(e.target.value ? parseInt(e.target.value) : null)}
          disabled={disabled || !selectedCategoryId}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
        >
          <option value="">Select Sub-category</option>
          {availableSubCategories.map((subCategory) => (
            <option key={subCategory.id} value={subCategory.id}>
              {subCategory.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
