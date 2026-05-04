"use client"

import React, { useState, useEffect } from 'react'
import { Package, TrendingUp, MoreHorizontal, ShoppingCart, Eye } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerDashboard/TopSellingProducts.scss'

export default function TopSellingProducts() {
  const [mounted, setMounted] = useState(false)
  const [hoveredProduct, setHoveredProduct] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const topProducts = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', sales: 245, revenue: 36750, stock: 89, image: '👕', trend: '+12%' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', sales: 189, revenue: 47250, stock: 34, image: '🎧', trend: '+8%' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', sales: 156, revenue: 78000, stock: 23, image: '⌚', trend: '+15%' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', sales: 134, revenue: 20100, stock: 56, image: '👛', trend: '+5%' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', sales: 112, revenue: 56000, stock: 42, image: '👟', trend: '-2%' },
  ]

  return (
    <div className="top-selling-products bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Top Selling Products</h3>
          <p className="text-xs text-gray-500 mt-0.5">Best sellers by quantity</p>
        </div>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
          <MoreHorizontal size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {topProducts.map((product, index) => (
          <div
            key={product.id}
            className={`product-item flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-gray-50 ${
              hoveredProduct === product.id ? 'bg-gray-50' : ''
            }`}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Rank */}
            <div className="rank w-7 text-center">
              <span className={`text-sm font-bold ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-amber-600' : 'text-gray-400'}`}>
                #{index + 1}
              </span>
            </div>

            {/* Product Image */}
            <div className="product-image w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
              {product.image}
            </div>

            {/* Product Info */}
            <div className="product-info flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                <span className="text-xs text-green-600 font-medium">{product.trend}</span>
              </div>
            </div>

            {/* Sales Stats */}
            <div className="sales-stats text-right flex-shrink-0">
              <div className="flex items-center gap-1">
                <TrendingUp size={12} className="text-green-500" />
                <span className="text-sm font-semibold text-gray-900">{product.sales}</span>
                <span className="text-xs text-gray-400">sold</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">₹{product.revenue.toLocaleString()}</p>
            </div>

            {/* Actions */}
            <div className="actions flex gap-1 flex-shrink-0">
              <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                <Eye size={14} />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                <ShoppingCart size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-all flex items-center gap-1">
          View All Products
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}