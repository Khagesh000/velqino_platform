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
  Search,
  Filter,
  Save,
  AlertCircle,
  RefreshCw
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/ProductsCatalog/BulkEditTool.scss'

export default function BulkEditTool({ selectedProducts = [], onClose, onApply }) {
  const [step, setStep] = useState(1) // 1: Filter, 2: Apply Updates
  const [editType, setEditType] = useState('price')
  const [updateValue, setUpdateValue] = useState('')
  const [updateOperation, setUpdateOperation] = useState('set')
  const [previewMode, setPreviewMode] = useState(false)
  const [applying, setApplying] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: { min: '', max: '' },
    stockStatus: 'all',
    vendor: ''
  })

  const editOptions = [
    { id: 'price', label: 'Price', icon: DollarSign, description: 'Update product prices' },
    { id: 'category', label: 'Category', icon: FolderTree, description: 'Change product category' },
    { id: 'status', label: 'Status', icon: Tag, description: 'Update product status' },
    { id: 'stock', label: 'Stock', icon: Package, description: 'Adjust inventory levels' }
  ]

  const operations = {
    price: [
      { value: 'set', label: 'Set to' },
      { value: 'increase', label: 'Increase by %' },
      { value: 'decrease', label: 'Decrease by %' },
      { value: 'round', label: 'Round to' }
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

  const categories = [
    'Electronics', 'Clothing', 'Home Decor', 'Fitness', 'Stationery', 'Beauty'
  ]

  const statusOptions = [
    'Active', 'Draft', 'Archived', 'Out of Stock'
  ]

  const previewProducts = [
    { id: 1, name: 'Wireless Headphones', price: 1250, category: 'Electronics', status: 'Active', stock: 45 },
    { id: 2, name: 'Cotton T-Shirt', price: 450, category: 'Clothing', status: 'Active', stock: 120 },
    { id: 3, name: 'Ceramic Mug', price: 299, category: 'Home Decor', status: 'Low Stock', stock: 8 },
    { id: 4, name: 'Yoga Mat', price: 899, category: 'Fitness', status: 'Active', stock: 34 },
    { id: 5, name: 'Desk Lamp', price: 1299, category: 'Home Decor', status: 'Active', stock: 18 }
  ]

  const getFilteredCount = () => {
    return selectedProducts.length || previewProducts.length
  }

  const calculatePreview = () => {
    if (!updateValue) return previewProducts

    return previewProducts.map(product => {
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

  const handleApply = () => {
    setApplying(true)
    
    // Simulate API call
    setTimeout(() => {
      setApplying(false)
      onApply?.({
        type: editType,
        operation: updateOperation,
        value: updateValue,
        filters: filters,
        count: getFilteredCount()
      })
      onClose()
    }, 1500)
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
          /* Step 1: Choose Update Type */
          <div className="space-y-6">
            {/* Edit Type Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">What do you want to update?</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {editOptions.map(option => {
                  const Icon = option.icon
                  return (
                    <button className={`edit-type-card p-3 sm:p-4 rounded-xl border-2 transition-all ${
  editType === option.id
    ? 'border-primary-500 bg-primary-50'
    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
}`}>
  <Icon size={20} className={editType === option.id ? 'text-primary-600' : 'text-gray-500'} />
  <h4 className="text-xs sm:text-sm font-medium text-gray-900 mt-1 sm:mt-2">{option.label}</h4>
  <p className="text-xxs sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{option.description}</p>
</button>
                  )
                })}
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
                  <label className="block text-xxs sm:text-xs text-gray-500 mb-0.5 sm:mb-1">Vendor</label>
                  <input
                    type="text"
                    placeholder="Vendor name"
                    value={filters.vendor}
                    onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                  />
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
          /* Step 2: Apply Updates */
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
            {editType === 'price' && `₹${previewProducts[index].price}`}
            {editType === 'category' && previewProducts[index].category}
          </td>
          <td className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-primary-600">
            {editType === 'price' && `₹${Math.round(product.price)}`}
            {editType === 'category' && product.category}
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
    <button className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1 sm:gap-2" onClick={handleApply} disabled={!updateValue || applying}>
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