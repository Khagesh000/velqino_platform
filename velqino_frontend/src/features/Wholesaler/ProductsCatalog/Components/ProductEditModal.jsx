"use client"

import React, { useState, useEffect } from 'react'
import {
  X,
  Package,
  DollarSign,
  Box,
  Save,
  Eye,
  Upload,
  Trash2 
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/ProductsCatalog/ProductEditModal.scss'
import { useCreateProductMutation, useGetCategoriesQuery  } from '@/redux/wholesaler/slices/productsSlice'
import { toast } from 'react-toastify'

export default function ProductEditModal({ product = null, onClose, onSave }) {
  const [createProduct, { isLoading }] = useCreateProductMutation()
  const { data: categoriesData } = useGetCategoriesQuery()
  const [activeTab, setActiveTab] = useState('basic')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40']
  const [uploading, setUploading] = useState(false)
  
  // ✅ OPTIMIZED - Only fields that match your backend Product model
  // Remove the duplicate sku in Inventory section - keep only one at top
const [formData, setFormData] = useState({
  name: product?.name || '',
  sku: product?.sku || '',
  category_id: product?.category?.id || '',
  brand: product?.brand || '',
  description: product?.description || '',
  price: product?.price || '',
  compare_price: product?.compare_price || '',
  cost: product?.cost || '',
  stock: product?.stock || 0,
  threshold: product?.threshold || 10,
  weight: product?.weight || '',
  status: product?.status || 'draft',
  sizes: product?.sizes || []  // ✅ ADD THIS
})

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Box },
    { id: 'status', label: 'Status', icon: Eye }
  ]

const toggleSize = (size) => {
  setSelectedSizes(prev => {
    if (prev.includes(size)) {
      return prev.filter(s => s !== size)
    } else {
      return [...prev, size]  // ✅ This creates flat array
    }
  })
}

const handleImageSelect = (e) => {
  const files = Array.from(e.target.files)
  setSelectedImages(prev => [...prev, ...files])  // ✅ Change from = to spread
}

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

const handleSave = async () => {
  if (!formData.name) {
    toast.error('Product name is required')
    return
  }
  if (!formData.price) {
    toast.error('Price is required')
    return
  }
  
  setUploading(true)
  
  const payload = new FormData()
  payload.append('name', formData.name)
  payload.append('price', formData.price)
  payload.append('sku', '')  // ✅ SEND EMPTY SKU (NOT REMOVE)
  payload.append('cost', formData.cost || '')
  payload.append('category_id', formData.category_id || '')
  payload.append('brand', formData.brand || '')
  payload.append('description', formData.description || '')
  payload.append('stock', formData.stock.toString())  // ✅ Convert to string
  payload.append('threshold', formData.threshold.toString())  // ✅ Convert to string
  payload.append('weight', formData.weight || '')
  payload.append('status', formData.status)
  
  // ✅ Fix sizes - ensure flat array
  console.log('Selected sizes before send:', selectedSizes)  // Debug
  if (selectedSizes.length > 0) {
    selectedSizes.forEach(size => payload.append('sizes', size))
  }
  
  // ✅ Fix images - ensure files are appended
  console.log('Selected images before send:', selectedImages.length)  // Debug
  if (selectedImages.length > 0) {
    selectedImages.forEach(image => payload.append('images', image))
  }
  
  // ✅ Debug: Log all FormData entries
  for (let pair of payload.entries()) {
    console.log(pair[0], pair[1])
  }
  
  try {
    const result = await createProduct(payload).unwrap()
    toast.success('Product created successfully!')
    onSave?.(result)
    onClose()
  } catch (error) {
    console.error('Full error:', error)
    console.error('Error response:', error.response?.data)
    toast.error(error.response?.data?.errors?.sku?.[0] || error.response?.data?.message || 'Failed to create product')
    setUploading(false)
  }
}

  return (
    <div className="product-edit-modal bg-white h-full flex flex-col pt-[56px] pb-[70px] sm:pt-0 sm:pb-0">
      {/* Header */}
      <div className="modal-header px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Package size={16} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-xl font-semibold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[180px] sm:max-w-none">
              {product ? `Editing ${product.name}` : 'Create a new product in your catalog'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
          <X size={16} className="sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="modal-tabs px-4 sm:px-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`modal-tab px-2 sm:px-4 py-1.5 sm:py-3 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.substring(0, 3)}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="modal-content flex-1 overflow-y-auto p-3 sm:p-6">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="e.g., Wireless Headphones"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Auto if empty)</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  placeholder="Auto-generated"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                >
                  <option value="">Select Category</option>
                  {Array.isArray(categoriesData) 
                    ? categoriesData.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))
                    : categoriesData?.data?.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                placeholder="Brand name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                placeholder="Product description..."
              />
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹) <span className="text-error-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="compare_price"
                  value={formData.compare_price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost per item</label>
              <input
                type="number"
                step="0.01"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
              <input
                type="number"
                name="threshold"
                value={formData.threshold}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="10"
              />
            </div>
          </div>

          {/* ✅ ADD SIZES FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Sizes <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '40'].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                    selectedSizes.includes(size)
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ✅ ADD MEDIA UPLOAD FIELD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary-300 transition-all">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload images</p>
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
                      <Trash2 size={12} className="text-error-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Product Status</label>
              <div className="space-y-2">
                {['draft', 'active'].map(status => (
                  <label key={status} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={formData.status === status}
                      onChange={handleInputChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="modal-footer px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
        <button onClick={onClose} className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all order-2 sm:order-1">
          Cancel
        </button>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button 
            onClick={handleSave}
            disabled={uploading}
            className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50"
          >
            <Save size={14} className="sm:w-4 sm:h-4" />
            <span>{isLoading ? 'Saving...' : (product ? 'Update' : 'Publish')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}