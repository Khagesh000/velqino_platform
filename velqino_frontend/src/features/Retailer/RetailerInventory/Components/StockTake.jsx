"use client"

import React, { useState, useEffect } from 'react'
import { ClipboardList, CheckCircle, AlertCircle, Search, Plus, Minus, Save, X, RefreshCw, FileText, Printer, Download } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerInventory/StockTake.scss'

export default function StockTake({ onComplete }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('count')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState([])
  const [counts, setCounts] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const products = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', systemStock: 45, location: 'A-12', lastCount: '2026-04-01', image: '👕' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', systemStock: 12, location: 'B-05', lastCount: '2026-04-01', image: '🎧' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', systemStock: 8, location: 'C-08', lastCount: '2026-04-01', image: '⌚' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', systemStock: 23, location: 'D-03', lastCount: '2026-04-01', image: '👛' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', systemStock: 15, location: 'E-07', lastCount: '2026-04-01', image: '👟' },
    { id: 6, name: 'Coffee Mug', sku: 'CM-006', systemStock: 45, location: 'F-02', lastCount: '2026-04-01', image: '☕' },
  ]

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCountChange = (productId, value) => {
    const actualCount = parseInt(value) || 0
    setCounts({ ...counts, [productId]: actualCount })
    
    if (!selectedProducts.includes(productId) && actualCount > 0) {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const getVariance = (productId) => {
    const product = products.find(p => p.id === productId)
    const actualCount = counts[productId] || 0
    return actualCount - product.systemStock
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      if (onComplete) onComplete()
    }, 2000)
  }

  const handleReset = () => {
    setCounts({})
    setSelectedProducts([])
    setSearchQuery('')
  }

  const variances = selectedProducts.map(id => ({
    id,
    variance: getVariance(id),
    product: products.find(p => p.id === id)
  }))

  const totalVariance = variances.reduce((sum, v) => sum + v.variance, 0)
  const productsWithVariance = variances.filter(v => v.variance !== 0).length

  const formatDate = () => {
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (showSuccess) {
    return (
      <div className="stock-take bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Stock Take Complete!</h3>
          <p className="text-sm text-gray-500">Inventory has been updated successfully</p>
          <p className="text-xs text-gray-400 mt-2">{productsWithVariance} products adjusted</p>
        </div>
      </div>
    )
  }

  return (
    <div className="stock-take bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Stock Take</h3>
          </div>
          <button onClick={handleReset} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-all">
            <RefreshCw size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Count physical stock and reconcile</p>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4 p-2 bg-blue-50 rounded-lg flex items-center gap-2">
        <AlertCircle size={14} className="text-blue-500" />
        <p className="text-xs text-blue-700">Last stock take: {formatDate()}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mt-2">
        <button
          onClick={() => setActiveTab('count')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'count' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Count Stock
        </button>
        <button
          onClick={() => setActiveTab('adjustments')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'adjustments' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Adjustments ({selectedProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'history' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          History
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[400px] overflow-y-auto custom-scroll">
        {activeTab === 'count' && (
          <div>
            {/* Search */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products to count..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              />
            </div>

            {/* Products Grid */}
            <div className="space-y-2">
              {filteredProducts.map((product) => {
                const counted = counts[product.id] !== undefined
                const variance = getVariance(product.id)
                return (
                  <div key={product.id} className={`border rounded-lg p-3 transition-all ${counted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                        {product.image}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-xs text-gray-500">SKU: {product.sku} | Location: {product.location}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">System Stock</p>
                        <p className="text-sm font-semibold text-gray-900">{product.systemStock} units</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Actual Count</p>
                        <input
                          type="number"
                          placeholder="Enter count"
                          value={counts[product.id] || ''}
                          onChange={(e) => handleCountChange(product.id, e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
                        />
                      </div>
                    </div>
                    
                    {counted && variance !== 0 && (
                      <div className={`mt-2 text-xs ${variance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {variance > 0 ? '+' : ''}{variance} variance
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'adjustments' && (
          <div>
            {selectedProducts.length === 0 ? (
              <div className="text-center py-8">
                <ClipboardList size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No adjustments yet</p>
                <p className="text-xs text-gray-400 mt-1">Count stock first to see adjustments</p>
              </div>
            ) : (
              <div className="space-y-3">
                {variances.map(({ id, variance, product }) => (
                  <div key={id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className={`text-sm font-bold ${variance > 0 ? 'text-green-600' : variance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {variance > 0 ? '+' : ''}{variance} units
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>System: {product.systemStock}</span>
                      <span>Actual: {counts[id] || 0}</span>
                    </div>
                  </div>
                ))}
                
                <div className="bg-gray-50 rounded-lg p-3 mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Total Variance</span>
                    <span className={`font-bold ${totalVariance > 0 ? 'text-green-600' : totalVariance < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {totalVariance > 0 ? '+' : ''}{totalVariance} units
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">Stock Take #ST-001</span>
                </div>
                <span className="text-xs text-gray-500">01 Apr 2026</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>8 products counted</span>
                <span>•</span>
                <span>3 adjustments</span>
                <span>•</span>
                <span className="text-green-600">+12 units</span>
              </div>
            </div>
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-gray-400" />
                  <span className="text-sm font-medium">Stock Take #ST-002</span>
                </div>
                <span className="text-xs text-gray-500">15 Mar 2026</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>12 products counted</span>
                <span>•</span>
                <span>5 adjustments</span>
                <span>•</span>
                <span className="text-red-600">-8 units</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {activeTab === 'count' && selectedProducts.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <button
            onClick={handleReset}
            className="flex-1 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            Reset
          </button>
          <button
            onClick={() => setActiveTab('adjustments')}
            className="flex-1 py-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            Review Adjustments
          </button>
        </div>
      )}

      {activeTab === 'adjustments' && selectedProducts.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex gap-2">
          <button
            onClick={() => setActiveTab('count')}
            className="flex-1 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
              isSubmitting ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save size={14} />
                Confirm & Update
              </>
            )}
          </button>
        </div>
      )}

      {/* Footer Note */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-2">
            <Printer size={10} />
            <span>Print Report</span>
          </div>
          <div className="flex items-center gap-2">
            <Download size={10} />
            <span>Export CSV</span>
          </div>
        </div>
      </div>
    </div>
  )
}