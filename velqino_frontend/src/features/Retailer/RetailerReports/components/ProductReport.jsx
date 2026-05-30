"use client"

import React, { useState, useEffect } from 'react'
import { Package, TrendingUp, TrendingDown, AlertCircle, Star, Download, ChevronLeft, ChevronRight, Eye } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/ProductReport.scss'


export default function ProductReport({ dateRange, cogsData, isLoading: propLoading, onRefresh, productsData, topProductsData }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('bestsellers')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  

  // Use props if provided, otherwise use hook data
  const cogs = cogsData || cogsDataFromHook?.data
  const isLoading = propLoading

  useEffect(() => {
    setMounted(true)
  }, [])


  if (!mounted) return null

  // Get all products
  const allProducts = productsData?.data?.products || []
  
  // Get top products from analytics
  const topProductsFromApi = topProductsData?.data?.products || []
  
  // Calculate product performance from orders (if no top products API data)
  const calculateProductStats = () => {
    return allProducts.map(product => {
      const totalSold = product.total_sold || 0
      const revenue = totalSold * parseFloat(product.price || 0)
      const margin = cogs?.per_product?.find(p => p.product_id === product.id)?.margin_percentage || 0
      
      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        sales: totalSold,
        revenue: revenue,
        growth: '+0%', // Would need previous period data
        stock: product.stock || 0,
        image: product.primary_image ? '📦' : '📦',
        margin: margin,
        daysInStock: product.created_at ? Math.floor((new Date() - new Date(product.created_at)) / (1000 * 60 * 60 * 24)) : 30,
        value: product.stock * parseFloat(product.price || 0)
      }
    })
  }

  const productStats = calculateProductStats()
  
  // Sort products by sales for best sellers
  const bestSellers = [...productStats].sort((a, b) => b.sales - a.sales).slice(0, 10)
  
  // Slow movers (low sales, high stock)
  const slowMovers = productStats
    .filter(p => p.sales < 10 && p.stock > 20)
    .sort((a, b) => a.sales - b.sales)
    .slice(0, 10)
  
  // Dead stock (no sales, high days in stock)
  const deadStock = productStats
    .filter(p => p.sales === 0 && p.daysInStock > 90)
    .sort((a, b) => b.daysInStock - a.daysInStock)
    .slice(0, 10)

  const getGrowthClass = (growth) => {
    if (growth && growth.startsWith('+')) return 'text-green-600'
    if (growth && growth.startsWith('-')) return 'text-red-600'
    return 'text-gray-600'
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
    totalProducts: allProducts.length,
    bestSellersCount: bestSellers.filter(p => p.sales > 0).length,
    slowMoversCount: slowMovers.length,
    deadStockCount: deadStock.length,
    totalRevenue: productStats.reduce((sum, p) => sum + p.revenue, 0),
    avgMargin: productStats.length > 0 
      ? Math.round(productStats.reduce((sum, p) => sum + p.margin, 0) / productStats.length) 
      : 0
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount)
  }

  if (isLoading) {
    return (
      <div className="product-report bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading product data...</p>
        </div>
      </div>
    )
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
          <p className="text-lg font-bold text-blue-700">{summary.avgMargin}%</p>
          <p className="text-[10px] text-blue-600">Avg Margin</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => { setActiveTab('bestsellers'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'bestsellers' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Best Sellers ({bestSellers.length})
        </button>
        <button
          onClick={() => { setActiveTab('slowmovers'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'slowmovers' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Slow Movers ({slowMovers.length})
        </button>
        <button
          onClick={() => { setActiveTab('deadstock'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'deadstock' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Dead Stock ({deadStock.length})
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[320px] overflow-y-auto custom-scroll">
        {allProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No products found</p>
            <p className="text-xs text-gray-400 mt-1">Add products to see performance data</p>
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-8">
            <Package size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No {activeTab === 'bestsellers' ? 'best sellers' : activeTab === 'slowmovers' ? 'slow movers' : 'dead stock'} found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentData.map((product, index) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    {product.image || '📦'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</p>
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
                          ₹{formatCurrency(product.value)} value
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Revenue</p>
                        <p className="font-semibold text-gray-900">₹{formatCurrency(product.revenue)}</p>
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
                      {(activeTab === 'slowmovers' || activeTab === 'deadstock') && (
                        <>
                          <div>
                            <p className="text-gray-500">Stock</p>
                            <p className="font-semibold text-gray-900">{product.stock} units</p>
                          </div>
                          {activeTab === 'slowmovers' && (
                            <div>
                              <p className="text-gray-500">Growth</p>
                              <p className={`font-semibold ${getGrowthClass(product.growth)}`}>{product.growth}</p>
                            </div>
                          )}
                          {activeTab === 'deadstock' && (
                            <div>
                              <p className="text-gray-500">Days in Stock</p>
                              <p className="font-semibold text-red-600">{product.daysInStock} days</p>
                            </div>
                          )}
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