"use client"

import React, { useState } from 'react'
import { Package, AlertTriangle, RefreshCw, ChevronRight } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/LowStockAlerts.scss'

export default function LowStockAlerts() {
  const [hoveredItem, setHoveredItem] = useState(null)

  const lowStockItems = [
    { id: 1, name: 'Wireless Headphones', sku: 'WH-001', stock: 2, threshold: 10, category: 'Electronics', image: '🎧' },
    { id: 2, name: 'Cotton T-Shirt', sku: 'CT-045', stock: 5, threshold: 15, category: 'Clothing', image: '👕' },
    { id: 3, name: 'Ceramic Mug', sku: 'CM-112', stock: 3, threshold: 20, category: 'Home Decor', image: '☕' },
    { id: 4, name: 'Yoga Mat', sku: 'YM-078', stock: 1, threshold: 12, category: 'Fitness', image: '🧘' },
    { id: 5, name: 'Desk Lamp', sku: 'DL-234', stock: 4, threshold: 8, category: 'Home Decor', image: '💡' },
    { id: 6, name: 'Notebook Set', sku: 'NB-056', stock: 2, threshold: 25, category: 'Stationery', image: '📓' }
  ]

  const getStockLevelClass = (stock) => {
    if (stock <= 2) return 'bg-error-100 text-error-600'
    if (stock <= 5) return 'bg-warning-100 text-warning-600'
    return 'bg-accent-100 text-accent-600'
  }

  const getProgressColor = (stock, threshold) => {
    const percentage = (stock / threshold) * 100
    if (percentage <= 20) return 'bg-error-500'
    if (percentage <= 40) return 'bg-warning-500'
    return 'bg-accent-500'
  }

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-error-100 flex items-center justify-center text-error-600">
            <AlertTriangle size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Low Stock Alerts</h3>
            <p className="text-xs lg:text-sm text-tertiary">Products below threshold level</p>
          </div>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 lg:px-4 lg:py-2 bg-surface-1 border border-light rounded-full text-xs lg:text-sm text-secondary hover:bg-surface-2 hover:text-primary-600 transition-all">
          <RefreshCw size={14} className="lg:w-4 lg:h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Low Stock Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
        {lowStockItems.map((item) => (
          <div
            key={item.id}
            className={`group relative bg-surface-1 rounded-xl p-4 border border-light transition-all hover:shadow-md ${
              hoveredItem === item.id ? 'scale-[1.02]' : ''
            }`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Status Indicator */}
            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${
              item.stock <= 2 ? 'bg-error-500 animate-pulse' : 
              item.stock <= 5 ? 'bg-warning-500' : 'bg-accent-500'
            }`} />

            {/* Product Info */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-white border border-light flex items-center justify-center text-xl">
                {item.image}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm lg:text-base font-semibold text-primary truncate">{item.name}</h4>
                <p className="text-xs text-tertiary">SKU: {item.sku}</p>
                <p className="text-xs text-secondary mt-0.5">{item.category}</p>
              </div>
            </div>

            {/* Stock Info */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">Current Stock</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full ${getStockLevelClass(item.stock)}`}>
                  {item.stock} units
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-secondary">Threshold</span>
                <span className="text-primary font-medium">{item.threshold} units</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-tertiary">Stock level</span>
                <span className="text-tertiary">{Math.round((item.stock / item.threshold) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(item.stock, item.threshold)}`}
                  style={{ width: `${(item.stock / item.threshold) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 py-2 bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium rounded-lg transition-all hover:shadow-md">
                <Package size={14} />
                <span>Reorder</span>
              </button>
              <button className="p-2 bg-white border border-light rounded-lg hover:bg-primary-50 transition-all text-tertiary hover:text-primary-600">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Hover Glow Effect */}
            {hoveredItem === item.id && (
              <div className={`absolute inset-0 rounded-xl opacity-10 blur-xl pointer-events-none ${
                item.stock <= 2 ? 'bg-error-500' : 
                item.stock <= 5 ? 'bg-warning-500' : 'bg-accent-500'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="flex items-center justify-center mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-light">
        <button className="flex items-center gap-1 text-xs lg:text-sm text-primary-600 hover:text-primary-700 transition-all hover:gap-2">
          <span>View all low stock products</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}