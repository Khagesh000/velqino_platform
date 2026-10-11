"use client"

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, Package, Truck, Clock, AlertCircle, ShoppingCart, 
  CheckCircle, RefreshCw, Eye, Send, ArrowRight, Zap
} from '../../../../utils/icons'

export default function ReorderSuggestions() {
  const [mounted, setMounted] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const [suggestions, setSuggestions] = useState([
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', currentStock: 8, reorderLevel: 20, requiredQty: 12, supplier: 'Fashion Hub', leadTime: '3-5 days', price: 499, salesVelocity: 45, daysUntilOut: 5, urgency: 'critical', image: '👕' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', currentStock: 12, reorderLevel: 25, requiredQty: 13, supplier: 'ElectroMart', leadTime: '5-7 days', price: 2499, salesVelocity: 28, daysUntilOut: 8, urgency: 'warning', image: '🎧' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', currentStock: 5, reorderLevel: 15, requiredQty: 10, supplier: 'TechGadgets', leadTime: '7-10 days', price: 4999, salesVelocity: 52, daysUntilOut: 3, urgency: 'critical', image: '⌚' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', currentStock: 15, reorderLevel: 20, requiredQty: 5, supplier: 'LeatherCraft', leadTime: '3-5 days', price: 1499, salesVelocity: 22, daysUntilOut: 10, urgency: 'warning', image: '👛' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', currentStock: 3, reorderLevel: 12, requiredQty: 9, supplier: 'SportFit', leadTime: '4-6 days', price: 2999, salesVelocity: 48, daysUntilOut: 4, urgency: 'critical', image: '👟' },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-80 bg-gray-100 rounded-2xl animate-pulse" />
  }

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

  const totalReorderCost = suggestions
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + (item.requiredQty * item.price), 0)

  const handleReorder = () => {
    if (selectedItems.length === 0) return
    alert(`Purchase order dispatch triggered for ${selectedItems.length} lines!\nEstimated replenishment value: ₹${totalReorderCost.toLocaleString()}`)
    setSelectedItems([])
  }

  const handleRefresh = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 700)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold ring-1 ring-amber-100">
              <Zap size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Smart Reorder Signals</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {suggestions.length} items low
                </span>
              </div>
              <p className="text-xs text-gray-500">Algorithmic stock depletion and lead-time alerts</p>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isGenerating}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
            title="Recalculate velocities"
          >
            <RefreshCw size={15} className={isGenerating ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* KPI Ticker */}
      <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100 bg-gray-50/40 text-center">
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
          <p className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider">Critical (&lt; 5d)</p>
          <p className="text-base font-bold text-rose-700 mt-0.5">
            {suggestions.filter(i => i.urgency === 'critical').length}
          </p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
          <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Warning (5-10d)</p>
          <p className="text-base font-bold text-amber-700 mt-0.5">
            {suggestions.filter(i => i.urgency === 'warning').length}
          </p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 shadow-2xs">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Est. Restock</p>
          <p className="text-base font-bold text-gray-900 mt-0.5">
            ₹{suggestions.reduce((sum, i) => sum + (i.requiredQty * i.price), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Select All Bar */}
      <div className="px-5 py-2.5 border-b border-gray-100 bg-white flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={selectedItems.length === suggestions.length && suggestions.length > 0}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
          <span className="text-xs font-semibold text-gray-700">Select All Items ({suggestions.length})</span>
        </label>

        {selectedItems.length > 0 && (
          <span className="text-[11px] font-medium text-primary-600">
            {selectedItems.length} selected (₹{totalReorderCost.toLocaleString()})
          </span>
        )}
      </div>

      {/* List */}
      <div className="p-4 flex-1 overflow-y-auto space-y-2.5">
        {suggestions.map((item) => {
          const isSelected = selectedItems.includes(item.id)
          const isCritical = item.urgency === 'critical'
          const stockPercent = Math.min((item.currentStock / item.reorderLevel) * 100, 100)

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50/30 shadow-2xs'
                  : 'border-gray-200/80 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleItemSelection(item.id)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />

                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg flex-shrink-0 shadow-2xs">
                  {item.image}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 tracking-tight">{item.name}</h4>
                      <p className="text-[11px] text-gray-500">SKU: {item.sku} • {item.supplier}</p>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      isCritical
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      <AlertCircle size={10} />
                      {item.daysUntilOut}d left
                    </span>
                  </div>

                  {/* Stock depletion meter */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1">
                      <span>Stock: <strong className="text-gray-800">{item.currentStock}</strong> / {item.reorderLevel} units</span>
                      <span>Lead: {item.leadTime}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCritical ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${stockPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Price & Reorder units */}
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-600">
                      Reorder: <strong className="text-gray-900">{item.requiredQty} units</strong> @ ₹{item.price}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      ₹{(item.requiredQty * item.price).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Footer */}
      {selectedItems.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-900">{selectedItems.length} lines queued</p>
            <p className="text-[11px] text-gray-500">Est. Total: ₹{totalReorderCost.toLocaleString()}</p>
          </div>
          <button
            onClick={handleReorder}
            className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send size={13} />
            Generate PO Batch
          </button>
        </div>
      )}
    </div>
  )
}
