"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { 
  TrendingUp, TrendingDown, PieChart, Download, ChevronLeft, 
  ChevronRight, Calendar, ArrowUpRight, ArrowDownRight, RefreshCw
} from '../../../../utils/icons'
import { useGetExpenseByCategoryQuery } from '@/redux/retailer/slices/retailerReportsSlice'

export default function ExpenseReport({ refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [hoveredSlice, setHoveredSlice] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { data: apiCategoryData, isFetching, refetch } = useGetExpenseByCategoryQuery({ period: 'month' })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (refreshTrigger) {
      refetch()
    }
  }, [refreshTrigger, refetch])

  // Seed baseline data
  const defaultCurrentExpenses = useMemo(() => [
    { category: 'Rent', amount: 15000, percentage: 28.0, lastMonth: 15000, change: 0, color: 'indigo' },
    { category: 'Staff Salary', amount: 25000, percentage: 46.7, lastMonth: 24000, change: 4.2, color: 'purple' },
    { category: 'Electricity', amount: 3500, percentage: 6.5, lastMonth: 3800, change: -7.9, color: 'amber' },
    { category: 'Marketing', amount: 5000, percentage: 9.3, lastMonth: 4500, change: 11.1, color: 'rose' },
    { category: 'Supplies', amount: 4000, percentage: 7.5, lastMonth: 3500, change: 14.3, color: 'blue' },
    { category: 'Internet', amount: 1500, percentage: 2.8, lastMonth: 1500, change: 0, color: 'emerald' },
  ], [])

  const defaultLastMonthExpenses = useMemo(() => [
    { category: 'Rent', amount: 15000, percentage: 28.7, color: 'indigo' },
    { category: 'Staff Salary', amount: 24000, percentage: 45.9, color: 'purple' },
    { category: 'Electricity', amount: 3800, percentage: 7.3, color: 'amber' },
    { category: 'Marketing', amount: 4500, percentage: 8.6, color: 'rose' },
    { category: 'Supplies', amount: 3500, percentage: 6.7, color: 'blue' },
    { category: 'Internet', amount: 1500, percentage: 2.8, color: 'emerald' },
  ], [])

  const colorPalette = {
    indigo: { hex: '#6366f1', badge: 'bg-indigo-50 text-indigo-700' },
    purple: { hex: '#a855f7', badge: 'bg-purple-50 text-purple-700' },
    amber: { hex: '#f59e0b', badge: 'bg-amber-50 text-amber-700' },
    rose: { hex: '#f43f5e', badge: 'bg-rose-50 text-rose-700' },
    blue: { hex: '#3b82f6', badge: 'bg-blue-50 text-blue-700' },
    emerald: { hex: '#10b981', badge: 'bg-emerald-50 text-emerald-700' },
    slate: { hex: '#64748b', badge: 'bg-slate-100 text-slate-700' },
  }

  const currentMonthData = useMemo(() => {
    const rawCategories = apiCategoryData?.data?.categories || apiCategoryData?.data || []
    if (Array.isArray(rawCategories) && rawCategories.length > 0) {
      const total = rawCategories.reduce((sum, c) => sum + Number(c.amount || c.total || 0), 0) || 1
      const colorKeys = Object.keys(colorPalette)
      return rawCategories.map((c, i) => {
        const amt = Number(c.amount || c.total || 0)
        return {
          category: c.category || c.name || 'Expense',
          amount: amt,
          percentage: Number(((amt / total) * 100).toFixed(1)),
          lastMonth: amt * 0.95,
          change: 5.0,
          color: colorKeys[i % colorKeys.length]
        }
      })
    }
    return defaultCurrentExpenses
  }, [apiCategoryData, defaultCurrentExpenses])

  const activeData = selectedPeriod === 'current' ? currentMonthData : defaultLastMonthExpenses
  const totalExpenses = useMemo(() => activeData.reduce((sum, e) => sum + e.amount, 0), [activeData])
  const lastTotal = useMemo(() => defaultLastMonthExpenses.reduce((sum, e) => sum + e.amount, 0), [defaultLastMonthExpenses])
  const monthOverMonthChange = lastTotal > 0 ? ((totalExpenses - lastTotal) / lastTotal) * 100 : 0

  const paginatedData = activeData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.max(1, Math.ceil(activeData.length / itemsPerPage))

  // Compute donut chart angles
  const pieSlices = useMemo(() => {
    let currentAngle = 0
    return activeData.map((item, idx) => {
      const sliceAngle = totalExpenses > 0 ? (item.amount / totalExpenses) * 360 : 0
      const startAngle = currentAngle
      currentAngle += sliceAngle
      return {
        ...item,
        startAngle,
        angle: sliceAngle,
        colorHex: colorPalette[item.color]?.hex || '#64748b'
      }
    })
  }, [activeData, totalExpenses])

  const getDonutPath = (startAngle, angle) => {
    const outerRadius = 80
    const innerRadius = 52
    const cx = 100
    const cy = 100

    // Handle full 360 degree case
    const safeAngle = Math.min(angle, 359.99)
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((startAngle + safeAngle - 90) * Math.PI) / 180

    const x1 = cx + outerRadius * Math.cos(startRad)
    const y1 = cy + outerRadius * Math.sin(startRad)
    const x2 = cx + outerRadius * Math.cos(endRad)
    const y2 = cy + outerRadius * Math.sin(endRad)

    const ix1 = cx + innerRadius * Math.cos(endRad)
    const iy1 = cy + innerRadius * Math.sin(endRad)
    const ix2 = cx + innerRadius * Math.cos(startRad)
    const iy2 = cy + innerRadius * Math.sin(startRad)

    const largeArc = safeAngle > 180 ? 1 : 0

    return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`
  }

  const exportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Category,Amount,Percentage", ...activeData.map(e => `"${e.category}",${e.amount},${e.percentage}%`)].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `expenses_report_${selectedPeriod}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!mounted) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs h-full flex-1 flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
              <PieChart size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Expense Analytics</h3>
                {isFetching && <RefreshCw size={12} className="animate-spin text-primary-600" />}
              </div>
              <p className="text-xs text-gray-500">Category allocation and month trends</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={exportReport}
            title="Export CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs border border-gray-200 transition-all"
          >
            <Download size={13} />
            <span>Export</span>
          </button>
        </div>

        {/* Period Switcher */}
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setSelectedPeriod('current')
              setCurrentPage(1)
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              selectedPeriod === 'current'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedPeriod('last')
              setCurrentPage(1)
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              selectedPeriod === 'last'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="px-5 py-3.5 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Expenditures</p>
          <p className="text-xl font-black text-gray-900 tracking-tight">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </p>
        </div>

        {selectedPeriod === 'current' && (
          <div className="text-right">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">MoM Delta</p>
            <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
              monthOverMonthChange > 0 
                ? 'bg-rose-50 text-rose-700 border border-rose-200/60' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
            }`}>
              {monthOverMonthChange > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{Math.abs(monthOverMonthChange).toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Distribution */}
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut Chart */}
          <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-xs">
              {pieSlices.map((slice, idx) => (
                <path
                  key={idx}
                  d={getDonutPath(slice.startAngle, slice.angle)}
                  fill={slice.colorHex}
                  className="transition-all duration-300 cursor-pointer hover:opacity-85"
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total</span>
              <span className="text-xs font-black text-gray-900">
                ₹{(totalExpenses / 1000).toFixed(0)}k
              </span>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="flex-1 w-full space-y-2">
            {paginatedData.map((item, idx) => {
              const palette = colorPalette[item.color] || colorPalette.slate
              const isHovered = hoveredSlice === idx

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                    isHovered ? 'bg-gray-100/70' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: palette.hex }}
                    />
                    <span className="text-xs font-bold text-gray-800 truncate">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-900">₹{item.amount.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{item.percentage}% share</p>
                  </div>
                </div>
              )
            })}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[11px] text-gray-500">
                <span>Page {currentPage} of {totalPages}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
                  >
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category MoM Variance Pill Matrix */}
        {selectedPeriod === 'current' && (
          <div className="mt-5 pt-4 border-t border-gray-100">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2.5">
              Category Velocity & Trajectory
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentMonthData.slice(0, 6).map((item, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-gray-50/70 border border-gray-100">
                  <span className="text-[11px] font-bold text-gray-700 truncate block">{item.category}</span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold mt-0.5 ${
                    item.change > 0 ? 'text-rose-600' : item.change < 0 ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                    {item.change > 0 ? <ArrowUpRight size={11} /> : item.change < 0 ? <ArrowDownRight size={11} /> : null}
                    <span>{item.change === 0 ? 'Flat' : `${Math.abs(item.change)}% vs prior`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
