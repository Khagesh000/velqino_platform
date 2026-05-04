"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Package, Truck, Clock, Zap, ShoppingCart, AlertCircle, CheckCircle, RefreshCw, Eye } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerDashboard/QuickReorder.scss'

export default function QuickReorder() {
  const [mounted, setMounted] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const reorderSuggestions = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', currentStock: 8, reorderLevel: 20, salesVelocity: 45, daysUntilOut: 5, suggestedQty: 50, supplier: 'Fashion Hub', price: 499, urgency: 'high', image: '👕' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', currentStock: 12, reorderLevel: 25, salesVelocity: 28, daysUntilOut: 8, suggestedQty: 40, supplier: 'ElectroMart', price: 2499, urgency: 'medium', image: '🎧' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', currentStock: 5, reorderLevel: 15, salesVelocity: 52, daysUntilOut: 3, suggestedQty: 60, supplier: 'TechGadgets', price: 4999, urgency: 'critical', image: '⌚' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', currentStock: 15, reorderLevel: 20, salesVelocity: 22, daysUntilOut: 10, suggestedQty: 30, supplier: 'LeatherCraft', price: 1499, urgency: 'low', image: '👛' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', currentStock: 3, reorderLevel: 12, salesVelocity: 48, daysUntilOut: 4, suggestedQty: 55, supplier: 'SportFit', price: 2999, urgency: 'critical', image: '👟' },
    { id: 6, name: 'Coffee Mug', sku: 'CM-006', currentStock: 18, reorderLevel: 30, salesVelocity: 15, daysUntilOut: 15, suggestedQty: 25, supplier: 'HomeDecor', price: 299, urgency: 'low', image: '☕' },
  ]

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
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selectedItems.includes(item.id)}
                onChange={() => toggleItemSelection(item.id)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />

              {/* Product Image */}
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                {item.image}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
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
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
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

                {/* Urgency Message */}
                <div className={`flex items-center gap-1 text-[11px] ${item.daysUntilOut <= 3 ? 'text-red-600' : item.daysUntilOut <= 7 ? 'text-orange-600' : 'text-green-600'}`}>
                  <AlertCircle size={12} />
                  <span>{getDaysText(item.daysUntilOut)}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-1 flex-shrink-0">
                <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="View Details">
                  <Eye size={14} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="Quick Reorder">
                  <ShoppingCart size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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