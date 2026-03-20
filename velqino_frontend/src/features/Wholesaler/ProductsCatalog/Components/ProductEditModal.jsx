"use client"

import React, { useState } from 'react'
import {
  X,
  Package,
  DollarSign,
  Box,
  ImageIcon,
  Copy,
  Truck,
  Search,
  Eye,
  Save,
  ChevronRight,
  Plus,
  Trash2,
  Upload,
  Globe,
  ToggleLeft,
  ToggleRight
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/ProductsCatalog/ProductEditModal.scss'

export default function ProductEditModal({ product = null, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState({
    // Basic Info
    name: product?.name || '',
    sku: product?.sku || '',
    category: product?.category || 'Electronics',
    brand: product?.brand || '',
    description: product?.description || '',
    
    // Pricing
    price: product?.price || '',
    comparePrice: product?.comparePrice || '',
    cost: product?.cost || '',
    taxClass: 'standard',
    
    // Inventory
    stock: product?.stock || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    trackQuantity: true,
    allowBackorder: false,
    lowStockThreshold: product?.threshold || 5,
    
    // Media
    images: product?.images || [],
    
    // Variants
    hasVariants: false,
    variants: [],
    
    // Shipping
    weight: product?.weight || '',
    dimensions: { length: '', width: '', height: '' },
    shippingClass: 'standard',
    
    // SEO
    metaTitle: product?.name || '',
    metaDescription: '',
    slug: product?.sku?.toLowerCase() || '',
    
    // Status
    status: product?.status || 'draft',
    visibility: 'public',
    publishDate: new Date().toISOString().split('T')[0]
  })

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Box },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'variants', label: 'Variants', icon: Copy },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'status', label: 'Status', icon: Eye }
  ]

  const categories = [
    'Electronics', 'Clothing', 'Home Decor', 'Fitness', 'Stationery', 'Beauty', 'Toys', 'Books'
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    console.log('Saving product:', formData)
    onSave?.(formData)
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
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  placeholder="WH-001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
                  name="comparePrice"
                  value={formData.comparePrice}
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
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Class</label>
              <select
                name="taxClass"
                value={formData.taxClass}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="standard">Standard Tax</option>
                <option value="reduced">Reduced Tax</option>
                <option value="zero">Zero Tax</option>
              </select>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
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
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barcode (ISBN, UPC, GTIN, etc.)</label>
              <input
                type="text"
                name="barcode"
                value={formData.barcode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="Barcode number"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="trackQuantity"
                  checked={formData.trackQuantity}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Track quantity</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowBackorder"
                  checked={formData.allowBackorder}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Allow backorders</span>
              </label>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-300 transition-all">
              <Upload size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-1">Drag & drop images here</p>
              <p className="text-xs text-gray-500 mb-3">or</p>
              <button className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all">
                Browse Files
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                    {i === 1 ? '🎧' : i === 2 ? '📦' : '🏷️'}
                  </div>
                  <button className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={12} className="text-error-500" />
                  </button>
                </div>
              ))}
              <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center hover:border-primary-300 cursor-pointer transition-all">
                <Plus size={24} className="text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Variants Tab */}
        {activeTab === 'variants' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="hasVariants"
                  checked={formData.hasVariants}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">This product has variants</span>
              </label>
              {formData.hasVariants && (
                <button className="px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all">
                  Add Variant
                </button>
              )}
            </div>

            {formData.hasVariants && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Variant</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">SKU</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Price</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-500">Stock</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2 text-sm">Black / Small</td>
                      <td className="px-4 py-2 text-sm">WH-001-BK-S</td>
                      <td className="px-4 py-2 text-sm">₹1250</td>
                      <td className="px-4 py-2 text-sm">15</td>
                      <td className="px-4 py-2">
                        <button className="text-gray-400 hover:text-error-500">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="0.00"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                <input
                  type="number"
                  name="dimensions.length"
                  value={formData.dimensions.length}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, length: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                <input
                  type="number"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, width: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={(e) => setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, height: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Class</label>
              <select
                name="shippingClass"
                value={formData.shippingClass}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="standard">Standard Shipping</option>
                <option value="express">Express Shipping</option>
                <option value="free">Free Shipping</option>
              </select>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="SEO title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                placeholder="SEO description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">/products/</span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Product Status</label>
              <div className="space-y-2">
                {['draft', 'active', 'archived'].map(status => (
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Visibility</label>
              <div className="space-y-2">
                {['public', 'private', 'password'].map(vis => (
                  <label key={vis} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="visibility"
                      value={vis}
                      checked={formData.visibility === vis}
                      onChange={handleInputChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700 capitalize">{vis}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
              <input
                type="date"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
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
    <button className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
      Save as Draft
    </button>
    <button onClick={handleSave} className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-1 sm:gap-2">
      <Save size={14} className="sm:w-4 sm:h-4" />
      <span className="sm:hidden">{product ? 'Update' : 'Publish'}</span>
      <span className="hidden sm:inline">{product ? 'Update Product' : 'Publish Product'}</span>
    </button>
  </div>
</div>
    </div>
  )
}