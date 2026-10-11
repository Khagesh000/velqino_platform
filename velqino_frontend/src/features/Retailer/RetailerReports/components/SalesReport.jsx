"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Calendar, Download } from '../../../../utils/icons'

export default function SalesReport({ 
  dateRange = 'month', 
  dateRangeString = '', 
  onRefresh, 
  salesData, 
  kpisData, 
  isLoading 
}) {
  const [mounted, setMounted] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [viewType, setViewType] = useState('chart')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const data = {
    labels: salesData?.labels || [],
    sales: salesData?.sales || [],
    total: salesData?.total ?? kpisData?.gross_sales ?? 0,
    previousTotal: salesData?.previous_total ?? 0,
    growth: salesData?.growth ?? kpisData?.growth_rate ?? 0
  }

  const maxSales = data.sales.length > 0 ? Math.max(...data.sales, 1) : 1

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount || 0))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[380px]">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-primary-500 border-t-transparent" />
        <p className="text-xs font-medium text-gray-500 mt-3">Loading sales trends...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <TrendingUp size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Sales Trend & Volume</h3>
            <p className="text-xs text-gray-400 mt-0.5">Sales performance across current period</p>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setViewType('chart')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewType === 'chart' 
                ? 'bg-white text-gray-900 shadow-xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setViewType('table')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewType === 'table' 
                ? 'bg-white text-gray-900 shadow-xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Summary Highlight Ribbon */}
      <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">Total Period Sales</span>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">₹{formatCurrency(data.total)}</p>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            data.growth >= 0 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'bg-rose-50 text-rose-700'
          }`}>
            {data.growth >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span>{Math.abs(data.growth)}%</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">vs previous {dateRange}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-center">
        {data.sales.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
              <TrendingUp size={22} />
            </div>
            <p className="text-sm font-semibold text-gray-800">No Sales Data Available</p>
            <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
              Transactions recorded in this time range will automatically populate the trend chart.
            </p>
          </div>
        ) : viewType === 'chart' ? (
          <div className="h-52 w-full pt-4">
            <div className="flex h-full items-end gap-2 sm:gap-3">
              {data.sales.map((sale, idx) => {
                const heightPct = Math.max(8, Math.round((sale / maxSales) * 100))
                const isHovered = hoveredBar === idx
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full group">
                    <div 
                      className="w-full relative flex-1 flex flex-col justify-end cursor-pointer"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[11px] font-medium rounded-lg px-2.5 py-1 whitespace-nowrap z-20 shadow-md">
                          <span className="text-gray-300 block text-[9px]">{data.labels[idx]}</span>
                          ₹{formatCurrency(sale)}
                        </div>
                      )}
                      {/* Bar */}
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          isHovered 
                            ? 'bg-primary-600 scale-[1.02]' 
                            : 'bg-primary-500 hover:bg-primary-600'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 mt-2 truncate w-full text-center">
                      {data.labels[idx]}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-52 divide-y divide-gray-100 pr-1">
            {data.labels.map((label, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="font-bold text-gray-900">₹{formatCurrency(data.sales[idx])}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info Ribbon */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-gray-400" />
          <span>
            {dateRange === 'day' ? 'Hourly Interval' : dateRange === 'week' ? 'Daily Breakdown' : dateRange === 'year' ? 'Monthly Breakdown' : 'Weekly Breakdown'}
          </span>
        </div>
        {dateRangeString && (
          <span className="font-medium text-gray-600">{dateRangeString}</span>
        )}
      </div>
    </div>
  )
}