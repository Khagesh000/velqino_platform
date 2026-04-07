"use client"

import React, { useState } from 'react'
import {
  X,
  Edit3,
  DollarSign,
  FolderTree,
  Tag,
  Package,
  Check,
  ChevronDown,
  Filter,
  Save,
  AlertCircle,
  RefreshCw,
  Image
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/ProductsCatalog/BulkEditTool.scss'
import productsAPI from '../../../../redux/wholesaler/Api/productsAPI'
import { useGetCategoriesQuery, useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice'

export default function BulkEditTool({ selectedProducts = [], onClose, onApply }) {
  const [step, setStep] = useState(1)
  const [editType, setEditType] = useState('price')
  const [updateValue, setUpdateValue] = useState('')
  const [updateOperation, setUpdateOperation] = useState('set')
  const [previewMode, setPreviewMode] = useState(false)
  const [applying, setApplying] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [localSelectedProducts, setLocalSelectedProducts] = useState(selectedProducts)

  const { data: categoriesData } = useGetCategoriesQuery()
  const { data: productsData, isLoading } = useGetProductsQuery({
    page: 1,
    per_page: 100
  })

  const categories = Array.isArray(categoriesData) 
    ? categoriesData.map(cat => cat.name) 
    : categoriesData?.data?.map(cat => cat.name) || []

  const realProducts = productsData?.data?.products || []

  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: { min: '', max: '' },
    stockStatus: 'all',
  })

  const editOptions = [
    { id: 'price', label: 'Price', icon: DollarSign, description: 'Update product prices' },
    { id: 'category', label: 'Category', icon: FolderTree, description: 'Change product category' },
    { id: 'status', label: 'Status', icon: Tag, description: 'Update product status' },
    { id: 'stock', label: 'Stock', icon: Package, description: 'Adjust inventory levels' },
    { id: 'images', label: 'Images', icon: Image, description: 'Add images to products' }
  ]

  const operations = {
    price: [
      { value: 'set', label: 'Set to' },
      { value: 'increase', label: 'Increase by %' },
      { value: 'decrease', label: 'Decrease by %' }
    ],
    stock: [
      { value: 'set', label: 'Set to' },
      { value: 'increase', label: 'Add quantity' },
      { value: 'decrease', label: 'Reduce quantity' }
    ],
    category: [
      { value: 'set', label: 'Change to' }
    ],
    status: [
      { value: 'set', label: 'Change to' }
    ]
  }

  const statusOptions = ['Active', 'Draft', 'Archived', 'Out of Stock']

  const getFilteredCount = () => {
    return localSelectedProducts.length || 0
}

  const calculatePreview = () => {
    if (!realProducts || realProducts.length === 0) return []
    if (!updateValue) return realProducts.slice(0, 5)

    return realProducts.slice(0, 5).map(product => {
      const newProduct = { ...product }
      
      if (editType === 'price') {
        if (updateOperation === 'set') {
          newProduct.price = Number(updateValue)
        } else if (updateOperation === 'increase') {
          newProduct.price = product.price * (1 + Number(updateValue) / 100)
        } else if (updateOperation === 'decrease') {
          newProduct.price = product.price * (1 - Number(updateValue) / 100)
        }
      } else if (editType === 'category') {
        newProduct.category = updateValue
      } else if (editType === 'status') {
        newProduct.status = updateValue
      } else if (editType === 'stock') {
        if (updateOperation === 'set') {
          newProduct.stock = Number(updateValue)
        } else if (updateOperation === 'increase') {
          newProduct.stock = product.stock + Number(updateValue)
        } else if (updateOperation === 'decrease') {
          newProduct.stock = Math.max(0, product.stock - Number(updateValue))
        }
      }
      
      return newProduct
    })
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setSelectedImages(prev => [...prev, ...files])
  }

  const handleApply = async () => {
    if (localSelectedProducts.length === 0) {
        alert('Please select at least one product')
        setApplying(false)
        return
    }
    
    setApplying(true)
    
    const formData = new FormData()
    
    // Map frontend operation to backend operation
    let backendOperation = editType
    if (editType === 'price') backendOperation = 'update_price'
    if (editType === 'category') backendOperation = 'update_category'
    if (editType === 'status') backendOperation = 'update_status'
    if (editType === 'stock') backendOperation = 'update_stock'
    if (editType === 'images') backendOperation = 'update_images'
    formData.append('operation', backendOperation)
    
    localSelectedProducts.forEach(id => formData.append('product_ids', id))
    
    if (editType === 'price') {
        if (updateOperation === 'set') {
            formData.append('value', updateValue)
        } else if (updateOperation === 'increase') {
            formData.append('percentage', updateValue)
        } else if (updateOperation === 'decrease') {
            formData.append('percentage', -updateValue)
        }
    } else if (editType === 'category') {
        formData.append('category_id', updateValue)
    } else if (editType === 'status') {
        formData.append('value', updateValue)
    } else if (editType === 'stock') {
        if (updateOperation === 'set') {
            formData.append('value', updateValue)
        } else if (updateOperation === 'increase') {
            formData.append('percentage', updateValue)
        } else if (updateOperation === 'decrease') {
            formData.append('percentage', -updateValue)
        }
    } else if (editType === 'images') {
        selectedImages.forEach(img => formData.append('images', img))
    }
    
    try {
        await productsAPI.bulkAction(formData)
        onApply?.()
        onClose()
    } catch (error) {
        console.error('Bulk edit failed:', error)
        alert('Bulk edit failed: ' + error.message)
    } finally {
        setApplying(false)
    }
}

  const EditIcon = editOptions.find(opt => opt.id === editType)?.icon || Edit3

  return (
    <div className="bulk-edit-tool bg-white h-full flex flex-col pt-[56px] pb-[70px] sm:pt-0 sm:pb-0">
      {/* Header */}
      <div className="modal-header px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Edit3 size={16} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-xl font-semibold text-gray-900">Bulk Edit Tool</h2>
            <p className="text-xs sm:text-sm text-gray-500">{getFilteredCount()} products selected</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
          <X size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Steps */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className={`step-indicator ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
            <span className="step-number w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm">{step > 1 ? <Check size={12} /> : 1}</span>
            <span className="step-label text-xxs sm:text-xs">Choose</span>
          </div>
          <div className="step-line w-6 sm:w-8 h-px bg-gray-200"></div>
          <div className={`step-indicator ${step === 2 ? 'active' : ''}`}>
            <span className="step-number w-5 h-5 sm:w-6 sm:h-6 text-xs sm:text-sm">2</span>
            <span className="step-label text-xxs sm:text-xs">Apply</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="modal-content flex-1 overflow-y-auto p-3 sm:p-6">
        {step === 1 ? (
          <div className="space-y-6">
            {/* Edit Type Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">What do you want to update?</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {editOptions.map(option => {
                  const Icon = option.icon
                  return (
                    <button 
                      key={option.id} 
                      onClick={() => setEditType(option.id)}
                      className={`edit-type-card p-3 sm:p-4 rounded-xl border-2 transition-all ${
                        editType === option.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} className={editType === option.id ? 'text-primary-600' : 'text-gray-500'} />
                      <h4 className="text-xs sm:text-sm font-medium text-gray-900 mt-1 sm:mt-2">{option.label}</h4>
                      <p className="text-xxs sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{option.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <Package size={14} className="sm:w-4 sm:h-4" />
                Select Products ({localSelectedProducts.length} selected)
              </h3>
              <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setLocalSelectedProducts(realProducts.map(p => p.id))
                        } else {
                          setLocalSelectedProducts([])
                        }
                      }}
                      checked={localSelectedProducts.length === realProducts.length && realProducts.length > 0}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Select All</span>
                    <span className="text-xs text-gray-500">({realProducts.length} products)</span>
                  </label>
                </div>
                <div className="divide-y divide-gray-100">
                  {realProducts.map(product => (
                    <label key={product.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSelectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLocalSelectedProducts([...localSelectedProducts, product.id])
                          } else {
                            setLocalSelectedProducts(localSelectedProducts.filter(id => id !== product.id))
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                        <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters */}
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <Filter size={14} className="sm:w-4 sm:h-4" />
                Filter Products
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-xxs sm:text-xs text-gray-700 mb-0.5 sm:mb-1">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xxs sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Stock Status</label>
                  <select
                    value={filters.stockStatus}
                    onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="all">All</option>
                    <option value="inStock">In Stock</option>
                    <option value="lowStock">Low Stock</option>
                    <option value="outOfStock">Out of Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xxs sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Price Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange.min}
                      onChange={(e) => setFilters({ ...filters, priceRange: { ...filters.priceRange, min: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange.max}
                      onChange={(e) => setFilters({ ...filters, priceRange: { ...filters.priceRange, max: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Update Value */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <EditIcon size={16} />
                Update {editOptions.find(opt => opt.id === editType)?.label}
              </h3>
              
              <div className="flex items-center gap-3">
                <select
                  value={updateOperation}
                  onChange={(e) => setUpdateOperation(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                >
                  {operations[editType]?.map(op => (
                    <option key={op.value} value={op.value}>{op.label}</option>
                  ))}
                </select>

                {editType === 'category' ? (
                  <select
                    value={updateValue}
                    onChange={(e) => setUpdateValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                ) : editType === 'status' ? (
                  <select
                    value={updateValue}
                    onChange={(e) => setUpdateValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  >
                    <option value="">Select status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    placeholder={editType === 'price' ? 'Enter amount' : 'Enter quantity'}
                    value={updateValue}
                    onChange={(e) => setUpdateValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
                )}
              </div>
            </div>

            {/* Images Upload */}
            {editType === 'images' && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (will be added to all selected products)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary-300 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="bulk-image-upload"
                  />
                  <label htmlFor="bulk-image-upload" className="cursor-pointer block">
                    <Image size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Click to upload images</p>
                    <p className="text-xs text-gray-400 mt-1">Images will be added to all {getFilteredCount()} products</p>
                  </label>
                </div>
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg">
                        <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover rounded-lg" />
                        <button 
                          onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md"
                        >
                          <X size={12} className="text-error-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Preview Toggle */}
            <div>
              <button
                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <ChevronDown size={16} className={`transition-transform ${previewMode ? 'rotate-180' : ''}`} />
                {previewMode ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>

            {/* Preview Table */}
            {previewMode && (
              <div className="preview-table border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
                <table className="w-full min-w-[400px] sm:min-w-0">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-4 py-1.5 sm:py-2 text-left text-xxs sm:text-xs font-medium text-gray-500">Product</th>
                      <th className="px-2 sm:px-4 py-1.5 sm:py-2 text-left text-xxs sm:text-xs font-medium text-gray-500">Current</th>
                      <th className="px-2 sm:px-4 py-1.5 sm:py-2 text-left text-xxs sm:text-xs font-medium text-gray-500">New</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculatePreview().map((product, index) => (
                      <tr key={product.id} className="preview-row">
                        <td className="px-2 sm:px-4 py-1.5 sm:py-2">
                          <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[100px] sm:max-w-none">{product.name}</p>
                        </td>
                        <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600">
                          {editType === 'price' && `₹${realProducts[index]?.price}`}
                          {editType === 'category' && realProducts[index]?.category_name}
                          {editType === 'status' && realProducts[index]?.status}
                          {editType === 'stock' && realProducts[index]?.stock}
                        </td>
                        <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary-600">
                          {editType === 'price' && `₹${Math.round(product.price)}`}
                          {editType === 'category' && product.category}
                          {editType === 'status' && product.status}
                          {editType === 'stock' && product.stock}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            <div className="bg-primary-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle size={14} className="sm:w-[18px] sm:h-[18px] text-primary-600 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-medium text-primary-900">Summary</h4>
                  <p className="text-xs sm:text-sm text-primary-700 mt-1">
                    You are about to update <span className="font-semibold">{getFilteredCount()} products</span>
                  </p>
                  <p className="text-xxs sm:text-xs text-primary-600 mt-1 sm:mt-2">
                    {editType === 'price' && `Prices will be ${updateOperation === 'set' ? 'set to' : updateOperation === 'increase' ? 'increased by' : 'decreased by'} ${updateValue}${updateOperation !== 'set' ? '%' : ''}`}
                    {editType === 'category' && `Categories will be changed to ${updateValue}`}
                    {editType === 'status' && `Status will be changed to ${updateValue}`}
                    {editType === 'stock' && `Stock will be ${updateOperation === 'set' ? 'set to' : updateOperation === 'increase' ? 'increased by' : 'decreased by'} ${updateValue} ${updateOperation !== 'set' ? 'units' : ''}`}
                    {editType === 'images' && `${selectedImages.length} images will be added to all products`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="modal-footer px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex items-center justify-between gap-2">
        <button onClick={step === 1 ? onClose : () => setStep(1)} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
          {step === 1 ? 'Cancel' : 'Back'}
        </button>
        
        {step === 1 ? (
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1 sm:gap-2" onClick={() => setStep(2)}>
            Next
            <ChevronDown size={14} className="sm:w-4 sm:h-4 rotate-270" />
          </button>
        ) : (
          <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1 sm:gap-2" onClick={handleApply} disabled={(!updateValue && editType !== 'images') || applying}>
            {applying ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span className="hidden sm:inline">Applying...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span className="hidden sm:inline">Apply Changes</span>
                <span className="sm:hidden">Apply</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}