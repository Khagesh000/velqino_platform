"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Package, Truck, Clock, Zap, ShoppingCart, AlertCircle, CheckCircle, RefreshCw, Eye } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerDashboard/QuickReorder.scss'

export default function QuickReorder({ data, isLoading }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (isLoading) return <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />

  const reorderSuggestions = data || []

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === reorderSuggestions.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(reorderSuggestions.map(i => i.id))
    }
  }

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getUrgencyBg = (urgency) => {
    switch(urgency) {
      case 'critical': return 'bg-red-50 border-red-200'
      case 'high': return 'bg-orange-50 border-orange-200'
      case 'medium': return 'bg-yellow-50 border-yellow-200'
      case 'low': return 'bg-green-50 border-green-200'
      default: return 'bg-gray-50'
    }
  }

  const getDaysText = (days) => {
    if (days <= 3) return `${days} days left - CRITICAL`
    if (days <= 7) return `${days} days left - URGENT`
    return `${days} days left`
  }

  const totalReorderCost = reorderSuggestions
    .filter(i => selectedItems.includes(i.id))
    .reduce((sum, i) => sum + (i.suggestedQty * i.price), 0)

  const totalItems = selectedItems.length

  return (
    <div className="quick-reorder bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full">
  {/* Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary-50 rounded-lg">
        <Zap size={18} className="text-primary-500" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">Quick Reorder</h3>
        <p className="text-xs text-gray-500 mt-0.5">Suggested based on sales velocity</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
        <RefreshCw size={14} className="text-gray-400" />
      </button>
    </div>
  </div>

  {/* Selection Bar */}
  {selectedItems.length > 0 && (
    <div className="bg-primary-50 rounded-xl p-3 mb-4 flex items-center justify-between animate-fadeIn">
      <span className="text-sm text-primary-700">
        <span className="font-semibold">{selectedItems.length}</span> items selected
      </span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-primary-600">
          Total: ₹{totalReorderCost.toLocaleString()}
        </span>
        <button className="px-3 py-1.5 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all">
          Reorder Selected
        </button>
      </div>
    </div>
  )}

  {/* Summary Stats */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
    <div className="bg-red-50 rounded-xl p-3">
      <p className="text-[11px] text-red-600 font-medium mb-1">Critical Stock</p>
      <p className="text-xl font-bold text-red-700">2</p>
      <p className="text-[10px] text-red-500 mt-0.5">Need immediate action</p>
    </div>
    <div className="bg-orange-50 rounded-xl p-3">
      <p className="text-[11px] text-orange-600 font-medium mb-1">High Priority</p>
      <p className="text-xl font-bold text-orange-700">1</p>
      <p className="text-[10px] text-orange-500 mt-0.5">Reorder soon</p>
    </div>
    <div className="bg-blue-50 rounded-xl p-3">
      <p className="text-[11px] text-blue-600 font-medium mb-1">Total to Reorder</p>
      <p className="text-xl font-bold text-blue-700">{reorderSuggestions.length}</p>
      <p className="text-[10px] text-blue-500 mt-0.5">Suggested items</p>
    </div>
    <div className="bg-green-50 rounded-xl p-3">
      <p className="text-[11px] text-green-600 font-medium mb-1">Est. Restock Cost</p>
      <p className="text-lg font-bold text-green-700">₹2,48,500</p>
      <p className="text-[10px] text-green-500 mt-0.5">For all items</p>
    </div>
  </div>

  {/* Reorder List */}
  {reorderSuggestions.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
      <CheckCircle size={28} className="text-green-500" />
    </div>
    <h4 className="text-sm font-medium text-gray-900 mb-1">No Reorder Suggestions</h4>
    <p className="text-xs text-gray-500">All products have sufficient stock</p>
  </div>
  ) : (
  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scroll">
    {reorderSuggestions.map((item, index) => (
      <div
        key={item.id}
        className={`reorder-item p-3 rounded-xl border-2 transition-all duration-200 ${getUrgencyBg(item.urgency)} ${
          hoveredItem === item.id ? 'shadow-lg transform -translate-y-0.5' : ''
        } ${selectedItems.includes(item.id) ? 'ring-2 ring-primary-500' : ''}`}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="flex flex-row gap-4">
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-1">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => toggleItemSelection(item.id)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </div>

          {/* Left Side - 25% Image */}
          <div className="w-[25%] md:w-[20%] lg:w-[18%] flex-shrink-0">
            <div className="aspect-square bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-sm border border-gray-100">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
              ) : (
                <span className="text-3xl">📦</span>
              )}
            </div>
          </div>

          {/* Right Side - 75% Content */}
          <div className="w-[75%] md:w-[80%] lg:w-[82%] flex-1">
            {/* Product Title and Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{item.name}</h4>
                <p className="text-xs text-gray-500 mt-0.5">SKU: {item.sku}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${getUrgencyColor(item.urgency)}`}>
                  {item.urgency.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">{item.daysUntilOut} days left</span>
              </div>
            </div>

            {/* Stock and Sales Velocity */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
              <div>
                <p className="text-gray-500">Current Stock</p>
                <p className="font-semibold text-gray-900">{item.currentStock} units</p>
              </div>
              <div>
                <p className="text-gray-500">Reorder Level</p>
                <p className="font-semibold text-gray-900">{item.reorderLevel} units</p>
              </div>
              <div>
                <p className="text-gray-500">Sales Velocity</p>
                <p className="font-semibold text-green-600">{item.salesVelocity}/week</p>
              </div>
              <div>
                <p className="text-gray-500">Suggested Qty</p>
                <p className="font-semibold text-primary-600">{item.suggestedQty} units</p>
              </div>
            </div>

            {/* Supplier Info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Truck size={12} className="text-gray-400" />
                <span>{item.supplier}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package size={12} className="text-gray-400" />
                <span>₹{item.price}/unit</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={12} className="text-gray-400" />
                <span>Est. cost: ₹{(item.suggestedQty * item.price).toLocaleString()}</span>
              </div>
            </div>

            {/* Urgency Message and Actions */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1 text-[11px] ${item.daysUntilOut <= 3 ? 'text-red-600' : item.daysUntilOut <= 7 ? 'text-orange-600' : 'text-green-600'}`}>
                <AlertCircle size={12} />
                <span>{getDaysText(item.daysUntilOut)}</span>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="View Details">
                  <Eye size={14} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="Quick Reorder">
                  <ShoppingCart size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  )}

  {/* Footer */}
  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={selectedItems.length === reorderSuggestions.length && reorderSuggestions.length > 0}
          onChange={toggleSelectAll}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <span className="text-xs text-gray-600">Select All</span>
      </label>
    </div>
    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-all flex items-center gap-1">
      View All Suggestions
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  </div>
</div>
  )
}
