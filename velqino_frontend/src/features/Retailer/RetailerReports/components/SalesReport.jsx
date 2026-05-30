"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Calendar, Download, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/SalesReport.scss'

export default function SalesReport({ dateRange, dateRangeString, onRefresh, salesData, kpisData, isLoading: propLoading }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [viewType, setViewType] = useState('chart')

  // ADD these lines
  const isLoading = propLoading



  useEffect(() => {
    setMounted(true)
  }, [])


  if (!mounted) return null

  // Get data from API response
  const salesDataResponse = salesData
  const kpis = kpisData

  // Extract sales data based on period
  const getSalesData = () => {
    if (!salesDataResponse) {
      return {
        labels: [],
        sales: [],
        total: 0,
        previousTotal: 0,
        growth: 0
      }
    }

    return {
      labels: salesDataResponse.labels || [],
      sales: salesDataResponse.sales || [],
      total: salesDataResponse.total || 0,
      previousTotal: salesDataResponse.previous_total || 0,
      growth: salesDataResponse.growth || 0
    }
  }

  const data = getSalesData()
  const maxSales = data.sales.length > 0 ? Math.max(...data.sales) : 1

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount)
  }

  if (isLoading) {
    return (
      <div className="sales-report bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading sales data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sales-report bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Sales Report</h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setViewType('chart')}
              className={`px-2 py-1 text-xs rounded transition-all ${viewType === 'chart' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}
            >
              Chart
            </button>
            <button
              onClick={() => setViewType('table')}
              className={`px-2 py-1 text-xs rounded transition-all ${viewType === 'table' ? 'bg-primary-500 text-white' : 'text-gray-500'}`}
            >
              Table
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Sales performance over time</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-gray-900">₹{formatCurrency(data.total)}</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="text-sm font-semibold">{Math.abs(data.growth)}%</span>
            </div>
            <p className="text-xs text-gray-500">vs previous period</p>
          </div>
        </div>
      </div>

      {/* Chart View */}
      {viewType === 'chart' && (
        <div className="p-4">
          {data.sales.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No sales data available</p>
              <p className="text-xs text-gray-400 mt-1">Complete orders to see sales data</p>
            </div>
          ) : (
            <div className="h-48 relative">
              <div className="flex h-full items-end gap-2">
                {data.sales.map((sale, idx) => {
                  const height = (sale / maxSales) * 100
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full">
                      <div 
                        className="w-full relative group cursor-pointer flex-1 flex flex-col justify-end"
                        onMouseEnter={() => setHoveredBar(idx)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <div 
                          className="w-full bg-primary-500 rounded-t transition-all duration-300" 
                          style={{ height: `${height}%` }}
                        />
                        {hoveredBar === idx && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap z-10">
                            ₹{formatCurrency(sale)}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1">{data.labels[idx]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Table View */}
      {viewType === 'table' && (
        <div className="p-4">
          {data.sales.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No sales data available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {data.labels.map((label, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">₹{formatCurrency(data.sales[idx])}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={10} />
            <span>{dateRange === 'day' ? 'Hourly' : dateRange === 'week' ? 'Daily' : dateRange === 'month' ? 'Weekly' : 'Monthly'} breakdown</span>
          </div>
          <button className="text-primary-600 flex items-center gap-1">
            <Download size={10} />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}