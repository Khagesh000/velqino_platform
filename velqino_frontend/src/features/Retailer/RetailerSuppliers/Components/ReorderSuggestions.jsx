"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, Package, Truck, Clock, AlertCircle, ShoppingCart, CheckCircle, RefreshCw, Eye, Send } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerSuppliers/ReorderSuggestions.scss'

export default function ReorderSuggestions() {
  const [mounted, setMounted] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const suggestions = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', currentStock: 8, reorderLevel: 20, requiredQty: 12, supplier: 'Fashion Hub', leadTime: '3-5 days', price: 499, salesVelocity: 45, daysUntilOut: 5, urgency: 'critical', image: '👕' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', currentStock: 12, reorderLevel: 25, requiredQty: 13, supplier: 'ElectroMart', leadTime: '5-7 days', price: 2499, salesVelocity: 28, daysUntilOut: 8, urgency: 'warning', image: '🎧' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', currentStock: 5, reorderLevel: 15, requiredQty: 10, supplier: 'TechGadgets', leadTime: '7-10 days', price: 4999, salesVelocity: 52, daysUntilOut: 3, urgency: 'critical', image: '⌚' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', currentStock: 15, reorderLevel: 20, requiredQty: 5, supplier: 'LeatherCraft', leadTime: '3-5 days', price: 1499, salesVelocity: 22, daysUntilOut: 10, urgency: 'warning', image: '👛' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', currentStock: 3, reorderLevel: 12, requiredQty: 9, supplier: 'SportFit', leadTime: '4-6 days', price: 2999, salesVelocity: 48, daysUntilOut: 4, urgency: 'critical', image: '👟' },
  ]

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id))
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  const toggleSelectAll = () => {
    if (selectedItems.length === suggestions.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(suggestions.map(i => i.id))
    }
  }

  const handleReorder = () => {
    const itemsToReorder = suggestions.filter(item => selectedItems.includes(item.id))
    alert(`Purchase order created for ${selectedItems.length} items!\nTotal: ₹${totalReorderCost.toLocaleString()}`)
    setSelectedItems([])
  }

  const getUrgencyConfig = (urgency) => {
    if (urgency === 'critical') {
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', badge: 'bg-red-500', label: 'CRITICAL' }
    }
    return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-500', label: 'WARNING' }
  }

  const totalReorderCost = suggestions
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.requiredQty * item.price), 0)

  const getStockPercentage = (current, reorder) => {
    return Math.min((current / reorder) * 100, 100)
  }

  const getDaysClass = (days) => {
    if (days <= 3) return 'text-red-600 font-bold'
    if (days <= 7) return 'text-orange-600 font-semibold'
    return 'text-yellow-600'
  }

  const handleGenerateSuggestions = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 1000)
  }

  return (
    <div className="reorder-suggestions bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Reorder Suggestions</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {suggestions.length} items
            </span>
          </div>
          <button
            onClick={handleGenerateSuggestions}
            disabled={isGenerating}
            className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Auto-generated orders based on stock level</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">{suggestions.filter(i => i.urgency === 'critical').length}</p>
          <p className="text-[10px] text-gray-500">Critical</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-600">{suggestions.filter(i => i.urgency === 'warning').length}</p>
          <p className="text-[10px] text-gray-500">Warning</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">₹{suggestions.reduce((sum, i) => sum + (i.requiredQty * i.price), 0).toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Est. Cost</p>
        </div>
      </div>

      {/* Select All */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedItems.length === suggestions.length && suggestions.length > 0}
            onChange={toggleSelectAll}
            className="rounded border-gray-300 text-primary-600"
          />
          <span className="text-xs text-gray-600">Select All ({suggestions.length} items)</span>
        </label>
      </div>

      {/* Suggestions List */}
      <div className="p-4 max-h-[320px] overflow-y-auto custom-scroll">
        <div className="space-y-3">
          {suggestions.map((item, index) => {
            const urgency = getUrgencyConfig(item.urgency)
            const stockPercent = getStockPercentage(item.currentStock, item.reorderLevel)
            const isSelected = selectedItems.includes(item.id)
            return (
              <div
                key={item.id}
                className={`border rounded-lg p-3 transition-all ${isSelected ? 'border-primary-500 bg-primary-50' : urgency.border} ${hoveredItem === item.id ? 'shadow-md transform -translate-y-0.5' : ''}`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItemSelection(item.id)}
                    className="mt-1 rounded border-gray-300 text-primary-600"
                  />

                  {/* Product Image */}
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                    {item.image}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${urgency.bg} ${urgency.text}`}>
                        <AlertCircle size={10} />
                        {urgency.label}
                      </div>
                    </div>

                    {/* Stock Progress */}
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                        <span>Current Stock: {item.currentStock} / {item.reorderLevel}</span>
                        <span className={getDaysClass(item.daysUntilOut)}>{item.daysUntilOut} days left</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${item.urgency === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}
                          style={{ width: `${stockPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Sales Velocity & Supplier */}
                    <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-gray-500">
                      <div className="flex items-center gap-1">
                        <TrendingUp size={10} />
                        <span>{item.salesVelocity}/week sales</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck size={10} />
                        <span>{item.supplier}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        <span>Lead: {item.leadTime}</span>
                      </div>
                    </div>

                    {/* Reorder Info */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-600">Need: {item.requiredQty} units</span>
                      <span className="text-sm font-semibold text-gray-900">₹{(item.requiredQty * item.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action */}
                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedItems([...selectedItems, item.id])
                        handleReorder()
                      }}
                      className="px-3 py-1 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-1"
                    >
                      <ShoppingCart size={10} />
                      Quick Reorder
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-700">{selectedItems.length} items selected</p>
              <p className="text-[10px] text-gray-500">Total: ₹{totalReorderCost.toLocaleString()}</p>
            </div>
            <button
              onClick={handleReorder}
              className="px-4 py-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all flex items-center gap-2"
            >
              <Send size={14} />
              Create Purchase Order
            </button>
          </div>
        </div>
      )}
    </div>
  )
}