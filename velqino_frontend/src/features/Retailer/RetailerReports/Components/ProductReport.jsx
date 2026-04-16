"use client"

import React, { useState, useEffect } from 'react'
import { Package, TrendingUp, TrendingDown, AlertCircle, Star, Download, ChevronLeft, ChevronRight, Eye } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/ProductReport.scss'

export default function ProductReport({ dateRange }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('bestsellers')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const bestSellers = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', sales: 245, revenue: 122255, growth: '+12%', stock: 45, image: '👕', margin: 42 },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', sales: 189, revenue: 472311, growth: '+8%', stock: 12, image: '🎧', margin: 35 },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', sales: 156, revenue: 779844, growth: '+15%', stock: 8, image: '⌚', margin: 48 },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', sales: 134, revenue: 200866, growth: '+5%', stock: 23, image: '👛', margin: 38 },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', sales: 112, revenue: 335888, growth: '-2%', stock: 15, image: '👟', margin: 32 },
  ]

  const slowMovers = [
    { id: 6, name: 'Desk Lamp', sku: 'DL-001', sales: 23, revenue: 22977, growth: '-15%', stock: 45, image: '💡', daysInStock: 120 },
    { id: 7, name: 'Notebook Set', sku: 'NB-001', sales: 18, revenue: 8991, growth: '-8%', stock: 67, image: '📓', daysInStock: 90 },
    { id: 8, name: 'Phone Case', sku: 'PC-001', sales: 12, revenue: 3599, growth: '-25%', stock: 34, image: '📱', daysInStock: 75 },
  ]

  const deadStock = [
    { id: 9, name: 'Old Model Speaker', sku: 'SP-001', sales: 3, revenue: 4497, stock: 23, daysInStock: 180, value: 34485, image: '🔊' },
    { id: 10, name: 'Outdated Cable', sku: 'CB-001', sales: 2, revenue: 998, stock: 56, daysInStock: 200, value: 27944, image: '🔌' },
  ]

  const getGrowthClass = (growth) => {
    if (growth.startsWith('+')) return 'text-green-600'
    return 'text-red-600'
  }

  const getMarginClass = (margin) => {
    if (margin >= 40) return 'text-green-600'
    if (margin >= 30) return 'text-yellow-600'
    return 'text-red-600'
  }

  const totalPages = activeTab === 'bestsellers' 
    ? Math.ceil(bestSellers.length / itemsPerPage)
    : activeTab === 'slowmovers'
    ? Math.ceil(slowMovers.length / itemsPerPage)
    : Math.ceil(deadStock.length / itemsPerPage)

  const currentData = activeTab === 'bestsellers' 
    ? bestSellers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : activeTab === 'slowmovers'
    ? slowMovers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : deadStock.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const summary = {
    totalProducts: 45,
    bestSellersCount: 5,
    slowMoversCount: 8,
    deadStockCount: 12,
    totalRevenue: 2456890,
    avgMargin: 38
  }

  return (
    <div className="product-report bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Product Report</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Product performance analysis</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-gray-100">
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <p className="text-lg font-bold text-green-700">{summary.bestSellersCount}</p>
          <p className="text-[10px] text-green-600">Best Sellers</p>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded-lg">
          <p className="text-lg font-bold text-yellow-700">{summary.slowMoversCount}</p>
          <p className="text-[10px] text-yellow-600">Slow Movers</p>
        </div>
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <p className="text-lg font-bold text-red-700">{summary.deadStockCount}</p>
          <p className="text-[10px] text-red-600">Dead Stock</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-blue-700">₹{summary.avgMargin}%</p>
          <p className="text-[10px] text-blue-600">Avg Margin</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => { setActiveTab('bestsellers'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'bestsellers' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Best Sellers
        </button>
        <button
          onClick={() => { setActiveTab('slowmovers'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'slowmovers' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Slow Movers
        </button>
        <button
          onClick={() => { setActiveTab('deadstock'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'deadstock' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Dead Stock
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[320px] overflow-y-auto custom-scroll">
        {currentData.length === 0 ? (
          <div className="text-center py-8">
            <Package size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentData.map((product, index) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    {product.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                      </div>
                      {activeTab === 'bestsellers' && (
                        <div className="flex items-center gap-1">
                          <Star size={12} className="text-yellow-400 fill-current" />
                          <span className="text-xs font-medium text-gray-700">{product.sales} sales</span>
                        </div>
                      )}
                      {activeTab === 'slowmovers' && (
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                          {product.daysInStock} days in stock
                        </span>
                      )}
                      {activeTab === 'deadstock' && (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          ₹{product.value.toLocaleString()} value
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Revenue</p>
                        <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                      </div>
                      {activeTab === 'bestsellers' && (
                        <>
                          <div>
                            <p className="text-gray-500">Growth</p>
                            <p className={`font-semibold ${getGrowthClass(product.growth)}`}>{product.growth}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Margin</p>
                            <p className={`font-semibold ${getMarginClass(product.margin)}`}>{product.margin}%</p>
                          </div>
                        </>
                      )}
                      {activeTab === 'slowmovers' && (
                        <>
                          <div>
                            <p className="text-gray-500">Growth</p>
                            <p className={`font-semibold ${getGrowthClass(product.growth)}`}>{product.growth}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Stock</p>
                            <p className="font-semibold text-gray-900">{product.stock} units</p>
                          </div>
                        </>
                      )}
                      {activeTab === 'deadstock' && (
                        <>
                          <div>
                            <p className="text-gray-500">Stock</p>
                            <p className="font-semibold text-gray-900">{product.stock} units</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Days in Stock</p>
                            <p className="font-semibold text-red-600">{product.daysInStock} days</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-primary-600">
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {activeTab === 'bestsellers' ? bestSellers.length : activeTab === 'slowmovers' ? slowMovers.length : deadStock.length} products
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-xs text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}