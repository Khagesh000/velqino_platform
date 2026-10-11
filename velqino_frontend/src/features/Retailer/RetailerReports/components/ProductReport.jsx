"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Package, TrendingUp, TrendingDown, Star, ChevronLeft, ChevronRight, Award } from '../../../../utils/icons'

export default function ProductReport({ 
  dateRange = 'month', 
  cogsData, 
  isLoading, 
  onRefresh 
}) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('bestsellers')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const perProductList = useMemo(() => {
    return cogsData?.per_product || []
  }, [cogsData])

  // Derive Best Sellers (sorted by revenue/quantity)
  const bestSellers = useMemo(() => {
    return [...perProductList].sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
  }, [perProductList])

  // High Margin Items
  const highMarginItems = useMemo(() => {
    return [...perProductList]
      .filter(p => (p.margin_percentage || 0) >= 25)
      .sort((a, b) => (b.margin_percentage || 0) - (a.margin_percentage || 0))
  }, [perProductList])

  // Low Margin / Attention items
  const lowMarginItems = useMemo(() => {
    return [...perProductList]
      .filter(p => (p.margin_percentage || 0) < 20)
      .sort((a, b) => (a.margin_percentage || 0) - (b.margin_percentage || 0))
  }, [perProductList])

  const currentList = activeTab === 'bestsellers' 
    ? bestSellers 
    : activeTab === 'highmargin' 
    ? highMarginItems 
    : lowMarginItems

  const totalPages = Math.max(1, Math.ceil(currentList.length / itemsPerPage))
  const paginatedData = currentList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const summary = {
    totalProducts: perProductList.length,
    totalQtySold: cogsData?.summary?.total_quantity_sold || perProductList.reduce((acc, p) => acc + (p.quantity_sold || 0), 0),
    totalGrossProfit: cogsData?.summary?.gross_profit || 0,
    avgMargin: cogsData?.summary?.margin_percentage || 0
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount || 0))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[380px]">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-primary-500 border-t-transparent" />
        <p className="text-xs font-medium text-gray-500 mt-3">Loading product report...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Package size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Product Profitability</h3>
            <p className="text-xs text-gray-400 mt-0.5">COGS, margins & best selling merchandise</p>
          </div>
        </div>
        <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
          {perProductList.length} Items Sold
        </span>
      </div>

      {/* Summary KPI Strip */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-b border-gray-100 bg-gray-50/50">
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Total Sold</p>
          <p className="text-base font-bold text-gray-900 mt-0.5">{summary.totalQtySold} units</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Gross Profit</p>
          <p className="text-base font-bold text-emerald-600 mt-0.5">₹{formatCurrency(summary.totalGrossProfit)}</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Avg Margin</p>
          <p className="text-base font-bold text-primary-600 mt-0.5">{summary.avgMargin}%</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">High Margin</p>
          <p className="text-base font-bold text-indigo-600 mt-0.5">{highMarginItems.length} items</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-3 bg-white">
        <button
          onClick={() => { setActiveTab('bestsellers'); setCurrentPage(1); }}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'bestsellers' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Top Revenue ({bestSellers.length})
        </button>
        <button
          onClick={() => { setActiveTab('highmargin'); setCurrentPage(1); }}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'highmargin' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          High Margin ({highMarginItems.length})
        </button>
        <button
          onClick={() => { setActiveTab('lowmargin'); setCurrentPage(1); }}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'lowmargin' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Low Margin ({lowMarginItems.length})
        </button>
      </div>

      {/* Content List */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[300px] space-y-2.5">
        {currentList.length === 0 ? (
          <div className="text-center py-10">
            <Package size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-medium text-gray-500">No products found in this category</p>
          </div>
        ) : (
          paginatedData.map((prod, idx) => {
            const margin = prod.margin_percentage || 0
            const marginBadge = margin >= 30 
              ? 'bg-emerald-50 text-emerald-700' 
              : margin >= 15 
              ? 'bg-amber-50 text-amber-700' 
              : 'bg-rose-50 text-rose-700'

            return (
              <div 
                key={prod.product_id || idx} 
                className="p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 text-base">
                    📦
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{prod.name}</h4>
                    <p className="text-[11px] text-gray-400">SKU: {prod.sku || 'N/A'} • Sold: {prod.quantity_sold} pcs</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                  <div className="text-right">
                    <p className="text-xs font-bold text-gray-900">₹{formatCurrency(prod.revenue)}</p>
                    <p className="text-[10px] text-gray-400">COGS: ₹{formatCurrency(prod.cogs)}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold text-center shrink-0 ${marginBadge}`}>
                    {margin}% margin
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-500">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}