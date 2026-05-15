"use client"

import React, { useState, useEffect } from 'react'
import { AlertCircle, Package, Truck, ShoppingCart, MoreHorizontal, Eye, RefreshCw, Bell } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerDashboard/LowStockAlerts.scss'

export default function LowStockAlerts({ data, isLoading, onFilterChange, activeFilter }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [filter, setFilter] = useState(activeFilter || 'all')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (isLoading) return <div className="w-full h-[300px] bg-gray-100 rounded-xl animate-pulse" />

  const lowStockItems = data || []
  const filteredItems = filter === 'all' ? lowStockItems : lowStockItems.filter(item => item.status === filter)

  const getStatusColor = (status) => {
    return status === 'critical' ? 'text-red-600' : 'text-orange-500'
  }

  const getStatusBg = (status) => {
    return status === 'critical' ? 'bg-red-50' : 'bg-orange-50'
  }

  const getStatusBorder = (status) => {
    return status === 'critical' ? 'border-red-200' : 'border-orange-200'
  }

  const getStockPercentage = (current, reorder) => {
    const percentage = (current / reorder) * 100
    return Math.min(percentage, 100)
  }

  const criticalCount = lowStockItems.filter(i => i.status === 'critical').length
  const warningCount = lowStockItems.filter(i => i.status === 'warning').length
  const totalRestockCost = lowStockItems.reduce((sum, i) => sum + ((i.reorderLevel - i.currentStock) * i.price), 0)

  return (
    <div className="low-stock-alerts bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-red-50 rounded-lg animate-pulse">
            <Bell size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Low Stock Alerts</h3>
            <p className="text-xs text-gray-500 mt-0.5">Products below reorder level</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'all' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setFilter('all')}
            >
              All ({lowStockItems.length})
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'critical' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setFilter('critical')}
            >
              Critical ({criticalCount})
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'warning' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setFilter('warning')}
            >
              Warning ({warningCount})
            </button>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
            <RefreshCw size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-red-50 rounded-xl p-3 transition-all hover:shadow-md">
          <p className="text-[11px] text-red-600 font-medium mb-1">Critical Stock</p>
          <p className="text-xl font-bold text-red-700">{criticalCount}</p>
          <p className="text-[10px] text-red-500 mt-0.5">Below 10 units</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 transition-all hover:shadow-md">
          <p className="text-[11px] text-orange-600 font-medium mb-1">Warning Stock</p>
          <p className="text-xl font-bold text-orange-700">{warningCount}</p>
          <p className="text-[10px] text-orange-500 mt-0.5">Below reorder level</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 transition-all hover:shadow-md">
          <p className="text-[11px] text-blue-600 font-medium mb-1">Total Affected</p>
          <p className="text-xl font-bold text-blue-700">{lowStockItems.length}</p>
          <p className="text-[10px] text-blue-500 mt-0.5">Need attention</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 transition-all hover:shadow-md">
          <p className="text-[11px] text-green-600 font-medium mb-1">Est. Restock Cost</p>
          <p className="text-lg font-bold text-green-700">₹{totalRestockCost.toLocaleString()}</p>
          <p className="text-[10px] text-green-500 mt-0.5">For all items</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 custom-scroll">
        {filteredItems.map((item, index) => {
          const stockPercent = getStockPercentage(item.currentStock, item.reorderLevel)
          const neededQty = item.reorderLevel - item.currentStock
          
          return (
            <div
              key={item.id}
              className={`alert-item p-4 rounded-xl border-2 transition-all duration-200 ${getStatusBg(item.status)} ${getStatusBorder(item.status)} ${
                hoveredItem === item.id ? 'shadow-lg transform -translate-y-0.5' : ''
              }`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-3">
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
                      <span className={`text-sm font-bold ${getStatusColor(item.status)}`}>
                        {item.currentStock} units left
                      </span>
                      <span className="text-xs text-gray-400">/ {item.reorderLevel}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.status === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                        Need {neededQty} more
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${item.status === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>

                  {/* Supplier Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Truck size={12} className="text-gray-400" />
                      <span className="text-gray-700 font-medium">{item.supplier}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package size={12} className="text-gray-400" />
                      <span className="text-gray-600">Lead: {item.leadTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-600">₹{item.price}/unit</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0 self-end md:self-start">
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="View Details">
                    <Eye size={14} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="Quick Reorder">
                    <ShoppingCart size={14} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-white rounded-lg transition-all" title="Contact Supplier">
                    <Truck size={14} />
                  </button>
                </div>
              </div>

              {/* Reorder Button Row */}
              <div className="mt-3 pt-3 border-t border-dashed border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AlertCircle size={12} className={item.status === 'critical' ? 'text-red-500' : 'text-orange-500'} />
                  <span>Reorder recommended: {neededQty} units</span>
                </div>
                <button className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${item.status === 'critical' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                  <ShoppingCart size={12} />
                  <span>Reorder Now</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-all flex items-center gap-1">
          View All Low Stock Items
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-gray-500">{criticalCount} critical alerts</span>
        </div>
      </div>
    </div>
  )
}
