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
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice'
import { useGetCategoriesQuery } from '@/redux/wholesaler/slices/categoriesSlice'

export default function BulkEditTool({ selectedProducts = [], onClose, onApply }) {
 
  const [step, setStep] = useState(1)
  const [editType, setEditType] = useState('price')
  const [updateValue, setUpdateValue] = useState('')
  const [updateOperation, setUpdateOperation] = useState('set')
  const [previewMode, setPreviewMode] = useState(false)
  const [applying, setApplying] = useState(false)
  const [selectedImages, setSelectedImages] = useState([])
  const [localSelectedProducts, setLocalSelectedProducts] = useState(selectedProducts)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [hasAppliedFilters, setHasAppliedFilters] = useState(false)
  const [productsData, setProductsData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [realProducts, setRealProducts] = useState([])
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  

  const categories = Array.isArray(categoriesData?.data) 
    ? categoriesData.data.map(cat => cat.name) 
    : Array.isArray(categoriesData) 
        ? categoriesData.map(cat => cat.name)
        : []

  

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
    return localSelectedProducts.length
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
    return
  }
  
  setApplying(true)
  
  try {
    let successCount = 0
    let failCount = 0
    
    for (const productId of localSelectedProducts) {
      const product = realProducts.find(p => p.id === productId)
      if (!product) continue
      
      const payload = new FormData()
      
      // ✅ FIX: Always ensure cost is a valid number, not empty string
      const updatedPrice = editType === 'price' ? calculateNewValue(product.price) : product.price
      const updatedCost = product.cost && !isNaN(product.cost) ? Number(product.cost) : 0
      
      payload.append('name', product.name)
      payload.append('price', updatedPrice)
      payload.append('cost', updatedCost)  // ✅ Send number instead of empty string
      payload.append('category_id', editType === 'category' ? updateValue : product.category_id)
      payload.append('brand', product.brand || '')
      payload.append('description', product.description || '')
      payload.append('threshold', product.threshold || 10)
      payload.append('status', editType === 'status' ? updateValue : product.status)
      payload.append('stock', editType === 'stock' ? calculateNewStock(product.stock) : product.stock)
      payload.append('pattern', product.pattern || '')
      payload.append('primary_color', product.primary_color || '')
      
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach(variant => payload.append('sizes', variant.size))
      }
      
      try {
        await productsAPI.updateProduct(productId, payload)
        successCount++
      } catch (err) {
        console.error(`Failed to update product ${productId}:`, err)
        failCount++
      }
    }
    
    if (successCount > 0) {
      alert(`Successfully updated ${successCount} product(s)${failCount > 0 ? `, ${failCount} failed` : ''}`)
      onApply?.()
      onClose()
    } else {
      alert('No products were updated')
    }
    
  } catch (error) {
    console.error('Bulk edit failed:', error)
    alert('Bulk edit failed: ' + error.message)
  } finally {
    setApplying(false)
  }
}

// ✅ Helper function to calculate new price
const calculateNewValue = (currentPrice) => {
  if (updateOperation === 'set') {
    return Number(updateValue)
  } else if (updateOperation === 'increase') {
    return currentPrice * (1 + Number(updateValue) / 100)
  } else if (updateOperation === 'decrease') {
    return currentPrice * (1 - Number(updateValue) / 100)
  }
  return currentPrice
}

// ✅ Helper function to calculate new stock
const calculateNewStock = (currentStock) => {
  if (updateOperation === 'set') {
    return Number(updateValue)
  } else if (updateOperation === 'increase') {
    return currentStock + Number(updateValue)
  } else if (updateOperation === 'decrease') {
    return Math.max(0, currentStock - Number(updateValue))
  }
  return currentStock
}

  // ADD this function to fetch products
const fetchProducts = async () => {
  setIsLoading(true)
  try {
    const response = await productsAPI.getProducts({
      page: 1,
      per_page: 100
    })
    const products = response.data?.data?.products || []
    setRealProducts(products)
    setProductsData(response.data)
    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    alert('Failed to load products')
    return []
  } finally {
    setIsLoading(false)
  }
}

const applyFiltersAndNext = async () => {
  console.log('=== Starting applyFiltersAndNext ===')
  console.log('Current filters:', filters)
  
  // ✅ Prevent double call
  if (isLoading) {
    console.log('Already loading, skipping...')
    return
  }
  
  setIsLoading(true)
  
  try {
    // ✅ Build params object with CORRECT field names
    const params = {
      page: 1,
      per_page: 100
    }
    
    // ✅ Find category ID from name
    if (filters.category !== 'all') {
      const selectedCategory = categories.find(cat => cat.name === filters.category || cat === filters.category)
      if (selectedCategory) {
        params.category_id = selectedCategory.id  // ✅ Send ID, not name
      }
    }
    
    if (filters.priceRange.min) {
      params.min_price = filters.priceRange.min
    }
    
    if (filters.priceRange.max) {
      params.max_price = filters.priceRange.max
    }
    
    if (filters.stockStatus !== 'all') {
      if (filters.stockStatus === 'inStock') {
        params.min_stock = 1
      } else if (filters.stockStatus === 'lowStock') {
        params.low_stock = 'true'
      } else if (filters.stockStatus === 'outOfStock') {
        params.stock = 0
      }
    }
    
    console.log('📤 Sending to backend with params:', params)
    
    // ✅ Call API with params
    const response = await productsAPI.getProducts(params)
    const products = response.data?.data?.products || []
    
    console.log('✅ Products fetched:', products.length)
    
    if (products.length === 0) {
      alert('No products match your filters.')
      setIsLoading(false)
      return
    }
    
    setFilteredProducts(products)
    setRealProducts(products)
    setHasAppliedFilters(true)
    setIsLoading(false)
    setStep(2)
    
  } catch (error) {
    console.error('Failed to fetch products:', error)
    alert('Failed to load products')
    setIsLoading(false)
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
        {/* EDIT TYPE SELECTION */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">What do you want to update?</h3>
          <div className="grid grid-cols-2 gap-3">
            {editOptions.map(option => {
              const Icon = option.icon
              return (
                <button 
                  key={option.id} 
                  onClick={() => setEditType(option.id)}
                  className={`edit-type-card p-4 rounded-xl border-2 transition-all ${
                    editType === option.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className={editType === option.id ? 'text-primary-600' : 'text-gray-500'} />
                  <h4 className="text-sm font-medium text-gray-900 mt-2">{option.label}</h4>
                  <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* FILTERS SECTION */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Filter size={16} />
            Filter Products
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-700 mb-1">Category</label>
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
              <label className="block text-xs text-gray-500 mb-1">Stock Status</label>
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
              <label className="block text-xs text-gray-500 mb-1">Price Range</label>
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
        {/* PRODUCT SELECTION SECTION */}
        <div>
  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
    <Package size={16} />
    Select Products ({localSelectedProducts.length} selected)
  </h3>
  <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
    {filteredProducts.length === 0 ? (
      <div className="p-8 text-center">
        <Filter size={32} className="mx-auto text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">No products match your filters. Go back and adjust filters.</p>
      </div>
    ) : (
      <>
        <div className="sticky top-0 bg-white p-3 border-b border-gray-200">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  setLocalSelectedProducts(filteredProducts.map(p => p.id))
                } else {
                  setLocalSelectedProducts([])
                }
              }}
              checked={localSelectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Select All</span>
            <span className="text-xs text-gray-500">({filteredProducts.length} products)</span>
          </label>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredProducts.map(product => (
            <label key={product.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer">
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
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500 truncate">SKU: {product.sku}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-medium text-gray-900">₹{product.price}</p>
                <p className="text-xs text-gray-500">Stock: {product.stock}</p>
              </div>
            </label>
          ))}
        </div>
      </>
    )}
  </div>
</div>

        {/* UPDATE VALUE SECTION - PERFECT ALIGNMENT */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <EditIcon size={16} />
            Update {editOptions.find(opt => opt.id === editType)?.label}
          </h3>
          
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
  <select
    value={updateOperation}
    onChange={(e) => setUpdateOperation(e.target.value)}
    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
  >
    {operations[editType]?.map(op => (
      <option key={op.value} value={op.value}>{op.label}</option>
    ))}
  </select>

  {editType === 'category' ? (
    <select
      value={updateValue}
      onChange={(e) => setUpdateValue(e.target.value)}
      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
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
      className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white"
    >
      <option value="">Select status</option>
      {statusOptions.map(status => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  ) : (
    <div className="flex-1 flex items-center gap-2">
      <input
        type="number"
        placeholder={editType === 'price' ? 'Enter amount' : 'Enter quantity'}
        value={updateValue}
        onChange={(e) => setUpdateValue(e.target.value)}
        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
      />
      {(editType === 'price' && updateOperation !== 'set') || (editType === 'stock' && updateOperation !== 'set') ? (
        <span className="px-3 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-lg min-w-[60px] text-center">
          {editType === 'price' ? '%' : 'units'}
        </span>
      ) : null}
    </div>
  )}
</div>
        </div>

        {/* IMAGES UPLOAD */}
        {editType === 'images' && (
          <div>
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

        {/* PREVIEW TOGGLE */}
        <div>
          <button
            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <ChevronDown size={16} className={`transition-transform duration-200 ${previewMode ? 'rotate-180' : ''}`} />
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {/* PREVIEW TABLE */}
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
                  <tr key={product.id} className="preview-row border-t border-gray-100">
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

        {/* SUMMARY */}
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
      <button 
        className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center gap-2" 
        onClick={applyFiltersAndNext}
      >
        Next
        <ChevronDown size={14} className="rotate-270" />
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