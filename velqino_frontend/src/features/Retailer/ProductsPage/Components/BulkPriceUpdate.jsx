"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Percent, DollarSign, Filter, RefreshCw, CheckCircle, AlertCircle, Save, X, Tag, Truck, FolderTree } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerProducts/BulkPriceUpdate.scss'

export default function BulkPriceUpdate({ onComplete }) {
  const [mounted, setMounted] = useState(false)
  const [updateType, setUpdateType] = useState('percentage')
  const [updateScope, setUpdateScope] = useState('category')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [percentageValue, setPercentageValue] = useState('')
  const [fixedValue, setFixedValue] = useState('')
  const [previewCount, setPreviewCount] = useState(0)
  const [isApplying, setIsApplying] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const categories = [
    { id: 1, name: 'Electronics', productCount: 45 },
    { id: 2, name: 'Clothing', productCount: 78 },
    { id: 3, name: 'Home Decor', productCount: 23 },
    { id: 4, name: 'Fitness', productCount: 34 },
  ]

  const suppliers = [
    { id: 1, name: 'Fashion Hub', productCount: 56 },
    { id: 2, name: 'ElectroMart', productCount: 34 },
    { id: 3, name: 'TechGadgets', productCount: 23 },
    { id: 4, name: 'SportFit', productCount: 45 },
  ]

  const handlePreview = () => {
    // Simulate preview count
    if (updateScope === 'category' && selectedCategory) {
      const category = categories.find(c => c.id === parseInt(selectedCategory))
      setPreviewCount(category?.productCount || 0)
    } else if (updateScope === 'supplier' && selectedSupplier) {
      const supplier = suppliers.find(s => s.id === parseInt(selectedSupplier))
      setPreviewCount(supplier?.productCount || 0)
    } else if (updateScope === 'all') {
      setPreviewCount(245)
    }
  }

  const handleApply = async () => {
    setIsApplying(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsApplying(false)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      if (onComplete) onComplete()
    }, 2000)
  }

  const handleReset = () => {
    setUpdateType('percentage')
    setUpdateScope('category')
    setSelectedCategory('')
    setSelectedSupplier('')
    setPercentageValue('')
    setFixedValue('')
    setPreviewCount(0)
  }

  if (showSuccess) {
    return (
      <div className="bulk-price-update bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Price Update Complete!</h3>
          <p className="text-sm text-gray-500">{previewCount} products updated successfully</p>
          <button
            onClick={() => setShowSuccess(false)}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bulk-price-update bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Bulk Price Update</h3>
          </div>
          <button onClick={handleReset} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
            <RefreshCw size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Update prices in bulk by category or supplier</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Update Type Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Update Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setUpdateType('percentage')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                updateType === 'percentage' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Percent size={14} />
              Percentage
            </button>
            <button
              onClick={() => setUpdateType('fixed')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
                updateType === 'fixed' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <DollarSign size={14} />
              Fixed Amount
            </button>
          </div>
        </div>

        {/* Scope Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Apply to</label>
          <div className="flex gap-2">
            <button
              onClick={() => setUpdateScope('all')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                updateScope === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => setUpdateScope('category')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                updateScope === 'category' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FolderTree size={12} />
              Category
            </button>
            <button
              onClick={() => setUpdateScope('supplier')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1 ${
                updateScope === 'supplier' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Truck size={12} />
              Supplier
            </button>
          </div>
        </div>

        {/* Category Selection */}
        {updateScope === 'category' && (
          <div className="animate-fadeIn">
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="">Choose category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.productCount} products)</option>
              ))}
            </select>
          </div>
        )}

        {/* Supplier Selection */}
        {updateScope === 'supplier' && (
          <div className="animate-fadeIn">
            <label className="block text-xs font-medium text-gray-700 mb-1">Select Supplier</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="">Choose supplier...</option>
              {suppliers.map(sup => (
                <option key={sup.id} value={sup.id}>{sup.name} ({sup.productCount} products)</option>
              ))}
            </select>
          </div>
        )}

        {/* Value Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            {updateType === 'percentage' ? 'Percentage Increase/Decrease' : 'Fixed Amount (₹)'}
          </label>
          <div className="relative">
            {updateType === 'percentage' && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            )}
            <input
              type="number"
              placeholder={updateType === 'percentage' ? 'e.g., 10 for 10% increase' : 'e.g., 50 for ₹50 increase'}
              value={updateType === 'percentage' ? percentageValue : fixedValue}
              onChange={(e) => updateType === 'percentage' ? setPercentageValue(e.target.value) : setFixedValue(e.target.value)}
              className={`w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 ${updateType === 'percentage' ? 'pl-8' : ''}`}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            Use negative value for decrease (e.g., -5 for 5% decrease)
          </p>
        </div>

        {/* Preview Button */}
        {(updateScope === 'category' && selectedCategory) || (updateScope === 'supplier' && selectedSupplier) || updateScope === 'all' ? (
          <button
            onClick={handlePreview}
            className="w-full py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Filter size={14} />
            Preview Update
          </button>
        ) : null}

        {/* Preview Result */}
        {previewCount > 0 && (
          <div className="bg-primary-50 rounded-lg p-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-primary-600">Products affected</p>
                <p className="text-2xl font-bold text-primary-700">{previewCount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-primary-600">New price range</p>
                <p className="text-sm font-semibold text-primary-700">
                  {updateType === 'percentage' 
                    ? `${percentageValue}% ${percentageValue >= 0 ? 'increase' : 'decrease'}`
                    : `₹${fixedValue} ${fixedValue >= 0 ? 'increase' : 'decrease'}`
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Apply Button */}
        {previewCount > 0 && (
          <button
            onClick={handleApply}
            disabled={isApplying}
            className={`w-full py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              isApplying ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {isApplying ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Applying...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Apply Price Update</span>
              </>
            )}
          </button>
        )}

        {/* Info Note */}
        <div className="bg-yellow-50 rounded-lg p-2 flex items-start gap-2">
          <AlertCircle size={14} className="text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-yellow-700">
            This action will update prices for all products in the selected category/supplier. 
            Changes cannot be undone. Please review preview before applying.
          </p>
        </div>
      </div>
    </div>
  )
}