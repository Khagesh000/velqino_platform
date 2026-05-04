"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Calendar, Download, ChevronLeft, ChevronRight } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/SalesReport.scss'

export default function SalesReport({ dateRange }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [viewType, setViewType] = useState('chart')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const salesData = {
    day: {
      labels: ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'],
      sales: [1250, 2100, 3100, 2850, 1750, 2450, 3980, 4520, 5240, 3680],
      total: 28940,
      previousTotal: 26200,
      growth: 10.5
    },
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      sales: [12500, 14800, 16200, 15800, 18900, 24500, 21200],
      total: 123900,
      previousTotal: 112500,
      growth: 10.1
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      sales: [45600, 52300, 49800, 58900],
      total: 206600,
      previousTotal: 189000,
      growth: 9.3
    },
    quarter: {
      labels: ['Jan', 'Feb', 'Mar'],
      sales: [156000, 189000, 206600],
      total: 551600,
      previousTotal: 498000,
      growth: 10.8
    },
    year: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      sales: [551600, 623000, 589000, 678000],
      total: 2441600,
      previousTotal: 2210000,
      growth: 10.5
    }
  }

  const data = salesData[dateRange] || salesData.month
  const maxSales = Math.max(...data.sales)

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
            <p className="text-2xl font-bold text-gray-900">₹{data.total.toLocaleString()}</p>
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
    <div className="h-48 relative">
      <div className="flex h-full items-end gap-2">
        {data.sales.map((sale, idx) => {
          const maxSales = Math.max(...data.sales)
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
                    ₹{sale.toLocaleString()}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-500 mt-1">{data.labels[idx]}</span>
            </div>
          )
        })}
      </div>
    </div>
  </div>
)}

      {/* Table View */}
      {viewType === 'table' && (
        <div className="p-4">
          <div className="space-y-2">
            {data.labels.map((label, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-semibold text-gray-900">₹{data.sales[idx].toLocaleString()}</span>
              </div>
            ))}
          </div>
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