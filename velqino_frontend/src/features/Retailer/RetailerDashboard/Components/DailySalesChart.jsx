"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Calendar, MoreHorizontal } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerDashboard/DailySalesChart.scss'

export default function DailySalesChart() {
  const [mounted, setMounted] = useState(false)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [chartView, setChartView] = useState('today') // 'today' or 'yesterday'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Mock data - hourly sales
  const todaySales = [
    { hour: '10 AM', sales: 1250, target: 1000 },
    { hour: '11 AM', sales: 2100, target: 1800 },
    { hour: '12 PM', sales: 3100, target: 2500 },
    { hour: '1 PM', sales: 2850, target: 3000 },
    { hour: '2 PM', sales: 3450, target: 3200 },
    { hour: '3 PM', sales: 4200, target: 3800 },
    { hour: '4 PM', sales: 5100, target: 4500 },
    { hour: '5 PM', sales: 6350, target: 5500 },
    { hour: '6 PM', sales: 7200, target: 6500 },
    { hour: '7 PM', sales: 6800, target: 7000 },
    { hour: '8 PM', sales: 5900, target: 6200 },
    { hour: '9 PM', sales: 4100, target: 4500 },
  ]

  const yesterdaySales = [
    { hour: '10 AM', sales: 1100, target: 1000 },
    { hour: '11 AM', sales: 1900, target: 1800 },
    { hour: '12 PM', sales: 2800, target: 2500 },
    { hour: '1 PM', sales: 2650, target: 3000 },
    { hour: '2 PM', sales: 3200, target: 3200 },
    { hour: '3 PM', sales: 3900, target: 3800 },
    { hour: '4 PM', sales: 4700, target: 4500 },
    { hour: '5 PM', sales: 5800, target: 5500 },
    { hour: '6 PM', sales: 6500, target: 6500 },
    { hour: '7 PM', sales: 6200, target: 7000 },
    { hour: '8 PM', sales: 5400, target: 6200 },
    { hour: '9 PM', sales: 3800, target: 4500 },
  ]

  const currentData = chartView === 'today' ? todaySales : yesterdaySales
  const maxSales = Math.max(...currentData.map(d => d.sales))
  const totalSales = currentData.reduce((sum, d) => sum + d.sales, 0)
  const previousTotal = chartView === 'today' 
    ? yesterdaySales.reduce((sum, d) => sum + d.sales, 0)
    : todaySales.reduce((sum, d) => sum + d.sales, 0)
  const percentChange = ((totalSales - previousTotal) / previousTotal * 100).toFixed(1)

return (
    <div className="daily-sales-chart bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="chart-header flex justify-between items-start mb-5">
        <div>
          <h3 className="chart-title text-base font-semibold text-gray-900 mb-1">Daily Sales Trend</h3>
          <p className="chart-subtitle text-xs text-gray-500">Hourly sales performance tracking</p>
        </div>
        <div className="chart-header-actions flex items-center gap-3">
          <div className="chart-view-toggle flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              className={`chart-view-btn px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartView === 'today' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setChartView('today')}
            >
              Today
            </button>
            <button
              className={`chart-view-btn px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                chartView === 'yesterday' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setChartView('yesterday')}
            >
              Yesterday
            </button>
          </div>
          <button className="chart-more-btn p-1.5 hover:bg-gray-100 rounded-lg transition-all">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="chart-summary grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="summary-card bg-gray-50 rounded-xl p-2.5 sm:p-3 transition-all hover:shadow-md">
            <span className="summary-label text-[11px] sm:text-xs font-medium text-gray-500 block mb-0.5 sm:mb-1">Total Sales</span>
            <div className="summary-value-wrapper flex flex-wrap items-baseline gap-1 sm:gap-2 mb-0.5 sm:mb-1">
            <span className="summary-value text-base sm:text-xl font-bold text-gray-900 break-words">₹{totalSales.toLocaleString()}</span>
            <div className={`summary-trend flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-semibold ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {percentChange >= 0 ? <TrendingUp size={12} className="sm:w-[14px] sm:h-[14px]" /> : <TrendingDown size={12} className="sm:w-[14px] sm:h-[14px]" />}
                <span>{Math.abs(percentChange)}%</span>
            </div>
            </div>
            <span className="summary-period text-[10px] sm:text-xs text-gray-400">vs {chartView === 'today' ? 'yesterday' : 'today'}</span>
        </div>
        
        <div className="summary-card bg-gray-50 rounded-xl p-2.5 sm:p-3 transition-all hover:shadow-md">
            <span className="summary-label text-[11px] sm:text-xs font-medium text-gray-500 block mb-0.5 sm:mb-1">Peak Hour</span>
            <div className="summary-value-wrapper flex flex-wrap items-baseline gap-1 sm:gap-2 mb-0.5 sm:mb-1">
            <span className="summary-value text-base sm:text-xl font-bold text-gray-900 break-words">
                {currentData.reduce((max, d) => d.sales > max.sales ? d : max).hour}
            </span>
            <span className="summary-subvalue text-[10px] sm:text-xs font-semibold text-primary-600 break-words">
                ₹{Math.max(...currentData.map(d => d.sales)).toLocaleString()}
            </span>
            </div>
            <span className="summary-period text-[10px] sm:text-xs text-gray-400">highest sales hour</span>
        </div>
        
        <div className="summary-card bg-gray-50 rounded-xl p-2.5 sm:p-3 transition-all hover:shadow-md">
            <span className="summary-label text-[11px] sm:text-xs font-medium text-gray-500 block mb-0.5 sm:mb-1">Average per Hour</span>
            <div className="summary-value-wrapper mb-0.5 sm:mb-1">
            <span className="summary-value text-base sm:text-xl font-bold text-gray-900 break-words">₹{(totalSales / 12).toLocaleString()}</span>
            </div>
            <span className="summary-period text-[10px] sm:text-xs text-gray-400">across 12 hours</span>
        </div>
        </div>

      {/* Chart */}
      <div className="chart-container relative mb-4 min-h-[280px] w-full overflow-x-auto">
        <div className="chart-bars flex items-end justify-between gap-1.5 h-[220px] min-w-[600px] sm:min-w-full pb-6">
            {currentData.map((data, index) => {
            const height = (data.sales / maxSales) * 100
            const isHovered = hoveredBar === index
            
            return (
                <div
                key={index}
                className="chart-bar-wrapper flex-1 flex flex-col items-center relative h-full min-w-[40px] sm:min-w-0"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
                >
                <div 
                    className="chart-bar-tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white px-2 py-1.5 rounded-lg text-xs whitespace-nowrap z-10 transition-opacity duration-200 pointer-events-none"
                    style={{ opacity: isHovered ? 1 : 0 }}
                >
                    <span className="tooltip-hour block font-medium text-xs">{data.hour}</span>
                    <span className="tooltip-sales block text-xs opacity-80">₹{data.sales.toLocaleString()}</span>
                </div>
                <div
                    className="chart-bar w-full max-w-[48px] bg-gray-200 rounded-t-md relative cursor-pointer transition-all duration-200 hover:-translate-y-1"
                    style={{ height: `${height}%` }}
                >
                    <div className="chart-bar-fill absolute bottom-0 left-0 right-0 h-full bg-primary-500 rounded-t-md transition-all duration-200" />
                </div>
                <span className="chart-bar-label text-[11px] font-medium text-gray-500 mt-2 transition-all duration-200 whitespace-nowrap">{data.hour.split(' ')[0]}</span>
                </div>
            )
            })}
        </div>
        
        {/* Target Line */}
        <div className="chart-target-line absolute top-0 left-0 right-0 h-[220px] pointer-events-none hidden sm:block">
            <div className="target-line absolute left-0 right-0 border-t-2 border-dashed border-warning-500" style={{ top: '65%' }} />
            <span className="target-label absolute -top-1 right-0 text-[11px] font-medium text-warning-600 bg-warning-50 px-2 py-0.5 rounded">Target</span>
        </div>
        </div>

      {/* Footer Note */}
      <div className="chart-footer flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="chart-legend flex gap-4">
          <div className="legend-item flex items-center gap-1.5">
            <span className="legend-dot legend-sales w-2.5 h-2.5 rounded-full bg-primary-500 transition-all duration-200" />
            <span className="legend-text text-xs text-gray-600">Today's Sales</span>
          </div>
          <div className="legend-item flex items-center gap-1.5">
            <span className="legend-dot legend-target w-2.5 h-2.5 rounded-full border-2 border-dashed border-warning-500 transition-all duration-200" />
            <span className="legend-text text-xs text-gray-600">Daily Target</span>
          </div>
        </div>
        <p className="chart-note text-[11px] text-gray-400 animate-pulse">*Data updates every 15 minutes</p>
      </div>
    </div>
  )
}