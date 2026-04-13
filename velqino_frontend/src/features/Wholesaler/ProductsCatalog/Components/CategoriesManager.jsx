"use client"

import React, { useState, useEffect } from 'react'
import {
  X,
  FolderTree,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Search,
  Save,
  Folder,
  File
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/ProductsCatalog/CategoriesManager.scss'
import { useDispatch, useSelector } from 'react-redux'
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useReorderCategoriesMutation
} from '@/redux/wholesaler/slices/categoriesSlice'
import { toast } from 'react-toastify'

export default function CategoriesManager({ onClose, onSave }) {
  const dispatch = useDispatch()
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', parentId: null })
  const [expandedNodes, setExpandedNodes] = useState([])
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)

  // RTK Query hooks
  const { data: categoriesData, isLoading, refetch } = useGetCategoriesQuery()
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()
  const [reorderCategories] = useReorderCategoriesMutation()

  // Load categories from API
  useEffect(() => {
    if (categoriesData?.data || categoriesData) {
      const categoriesList = categoriesData?.data || categoriesData
      setCategories(categoriesList)
      // Auto-expand first level categories
      if (expandedNodes.length === 0 && categoriesList.length > 0) {
        setExpandedNodes(categoriesList.map(cat => cat.id))
      }
    }
  }, [categoriesData])

  const handleToggleExpand = (categoryId) => {
    if (expandedNodes.includes(categoryId)) {
      setExpandedNodes(expandedNodes.filter(id => id !== categoryId))
    } else {
      setExpandedNodes([...expandedNodes, categoryId])
    }
  }

  const handleDragStart = (e, category) => {
    setDraggedItem(category)
    e.dataTransfer.setData('text/plain', '')
    e.target.classList.add('dragging')
  }

  const handleDragOver = (e, category) => {
    e.preventDefault()
    setDragOverItem(category)
  }

  const handleDrop = async (e, targetCategory) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetCategory.id) return

    // Simple drag-drop logic - you can enhance this
    console.log(`Move ${draggedItem.name} to ${targetCategory.name}`)
    
    // Here you would call reorder API
    // await reorderCategories({ draggedId: draggedItem.id, targetId: targetCategory.id })
    
    setDraggedItem(null)
    setDragOverItem(null)
    e.target.classList.remove('dragging')
  }

  const handleDragEnd = (e) => {
    setDraggedItem(null)
    setDragOverItem(null)
    e.target.classList.remove('dragging')
  }

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required')
      return
    }
    
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory({ 
          id: editingCategory.id, 
          data: { name: newCategory.name } 
        }).unwrap()
        toast.success('Category updated successfully')
      } else {
        // Create new category
        await createCategory({
          name: newCategory.name,
          parent_id: newCategory.parentId || null
        }).unwrap()
        toast.success('Category created successfully')
      }
      
      setShowAddModal(false)
      setEditingCategory(null)
      setNewCategory({ name: '', parentId: null })
      refetch()
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save category')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (confirm('Are you sure you want to delete this category? Products in this category will be uncategorized.')) {
      try {
        await deleteCategory(categoryId).unwrap()
        toast.success('Category deleted successfully')
        refetch()
      } catch (error) {
        toast.error(error?.data?.message || 'Failed to delete category')
      }
    }
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setNewCategory({ name: category.name, parentId: category.parent || null })
    setShowAddModal(true)
  }

  const handleOpenAddModal = (parentId = null) => {
    setEditingCategory(null)
    setNewCategory({ name: '', parentId: parentId })
    setShowAddModal(true)
  }

  const filterCategories = (cats, query) => {
    if (!query) return cats
    return cats.filter(cat => {
      const matches = cat.name.toLowerCase().includes(query.toLowerCase())
      const childrenMatch = filterCategories(cat.children || [], query)
      if (childrenMatch.length > 0) {
        cat.children = childrenMatch
        return true
      }
      return matches
    })
  }

  const renderCategoryTree = (cats, level = 0) => {
    const filteredCats = filterCategories([...cats], searchQuery)
    
    return filteredCats.map(category => (
      <div key={category.id}>
        <div
          className={`category-item ${dragOverItem?.id === category.id ? 'drag-over' : ''} ${draggedItem?.id === category.id ? 'dragging' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, category)}
          onDragOver={(e) => handleDragOver(e, category)}
          onDrop={(e) => handleDrop(e, category)}
          onDragEnd={handleDragEnd}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          <div className="category-content">
            <div className="category-left">
              <GripVertical size={16} className="drag-handle" />
              
              {category.children?.length > 0 ? (
                <button
                  className="expand-btn"
                  onClick={() => handleToggleExpand(category.id)}
                >
                  {expandedNodes.includes(category.id) ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              ) : (
                <span className="expand-placeholder" />
              )}

              <Folder size={16} className="folder-icon" />
              
              <div className="category-info">
                <span className="category-name">{category.name}</span>
                <span className="category-slug">/{category.slug}</span>
              </div>
            </div>

            <div className="category-right">
              <span className="product-count">{category.productCount || 0} products</span>
              
              <div className="category-actions">
                <button
                  className="action-btn"
                  onClick={() => handleOpenAddModal(category.id)}
                  title="Add subcategory"
                >
                  <Plus size={14} />
                </button>
                <button
                  className="action-btn"
                  onClick={() => handleEditCategory(category)}
                  title="Edit category"
                >
                  <Edit size={14} />
                </button>
                <button
                  className="action-btn delete"
                  onClick={() => handleDeleteCategory(category.id)}
                  title="Delete category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {expandedNodes.includes(category.id) && category.children?.length > 0 && (
          <div className="category-children">
            {renderCategoryTree(category.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="categories-manager bg-white h-full flex flex-col pt-[56px] pb-[70px] sm:pt-0 sm:pb-0">
      {/* Header */}
      <div className="modal-header px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <FolderTree size={16} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-xl font-semibold text-gray-900">Categories Manager</h2>
            <p className="text-xs sm:text-sm text-gray-500">Organize your product categories</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
          <X size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Search and Actions */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="sm:w-[18px] sm:h-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button 
            onClick={() => handleOpenAddModal()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-1 sm:gap-2"
          >
            <Plus size={14} className="sm:w-4 sm:h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Category Tree */}
      <div className="categories-tree flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="text-xxs sm:text-xs text-gray-500 mb-2 sm:mb-3 px-2 sm:px-3">
          <span>Drag •• to reorder categories</span>
        </div>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading categories...</div>
        ) : (
          renderCategoryTree(categories)
        )}
      </div>

      {/* Footer */}
      <div className="modal-footer px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2">
        <button onClick={onClose} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all order-2 sm:order-1">
          Cancel
        </button>
        <button onClick={() => { onSave?.(categories); onClose(); }} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-1 sm:gap-2 order-1 sm:order-2">
          <Save size={14} className="sm:w-4 sm:h-4" />
          <span>Save</span>
        </button>
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-xl max-w-md w-full p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                  placeholder="e.g., Electronics"
                  autoFocus
                />
              </div>

              {!editingCategory && (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Parent Category (Optional)
                  </label>
                  <select
                    value={newCategory.parentId || ''}
                    onChange={(e) => setNewCategory({ ...newCategory, parentId: e.target.value ? Number(e.target.value) : null })}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">None (Root Category)</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 sm:mt-6">
              <button 
                onClick={() => {
                  setShowAddModal(false)
                  setEditingCategory(null)
                  setNewCategory({ name: '', parentId: null })
                }}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCategory}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}