"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, PieChart, Download, ChevronLeft, ChevronRight, Calendar, AlertCircle, CheckCircle } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerExpenses/ExpenseReport.scss'

export default function ExpenseReport({ refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [hoveredSlice, setHoveredSlice] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentMonthExpenses = [
    { category: 'Rent', amount: 15000, percentage: 28, lastMonth: 15000, change: 0 },
    { category: 'Staff Salary', amount: 25000, percentage: 46, lastMonth: 24000, change: 4.2 },
    { category: 'Electricity', amount: 3500, percentage: 6.5, lastMonth: 3800, change: -7.9 },
    { category: 'Marketing', amount: 5000, percentage: 9.3, lastMonth: 4500, change: 11.1 },
    { category: 'Supplies', amount: 4000, percentage: 7.4, lastMonth: 3500, change: 14.3 },
    { category: 'Internet', amount: 1500, percentage: 2.8, lastMonth: 1500, change: 0 },
  ]

  const lastMonthExpenses = [
    { category: 'Rent', amount: 15000, percentage: 29 },
    { category: 'Staff Salary', amount: 24000, percentage: 46 },
    { category: 'Electricity', amount: 3800, percentage: 7.3 },
    { category: 'Marketing', amount: 4500, percentage: 8.7 },
    { category: 'Supplies', amount: 3500, percentage: 6.8 },
    { category: 'Internet', amount: 1500, percentage: 2.9 },
  ]

  const currentData = selectedPeriod === 'current' ? currentMonthExpenses : lastMonthExpenses
  const totalExpenses = currentData.reduce((sum, e) => sum + e.amount, 0)
  const lastTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const monthOverMonthChange = ((totalExpenses - lastTotal) / lastTotal) * 100

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Rent': return 'bg-blue-500'
      case 'Staff Salary': return 'bg-purple-500'
      case 'Electricity': return 'bg-yellow-500'
      case 'Marketing': return 'bg-pink-500'
      case 'Supplies': return 'bg-orange-500'
      case 'Internet': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getCategoryLightColor = (category) => {
    switch(category) {
      case 'Rent': return 'bg-blue-100 text-blue-700'
      case 'Staff Salary': return 'bg-purple-100 text-purple-700'
      case 'Electricity': return 'bg-yellow-100 text-yellow-700'
      case 'Marketing': return 'bg-pink-100 text-pink-700'
      case 'Supplies': return 'bg-orange-100 text-orange-700'
      case 'Internet': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const paginatedData = currentData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(currentData.length / itemsPerPage)

  let cumulativeAngle = 0
  const pieData = currentData.map(item => {
    const angle = (item.amount / totalExpenses) * 360
    const startAngle = cumulativeAngle
    cumulativeAngle += angle
    return { ...item, startAngle, angle }
  })

  const getPathCoordinates = (startAngle, angle) => {
    const radius = 80
    const center = 100
    const startRad = (startAngle - 90) * Math.PI / 180
    const endRad = (startAngle + angle - 90) * Math.PI / 180
    const x1 = center + radius * Math.cos(startRad)
    const y1 = center + radius * Math.sin(startRad)
    const x2 = center + radius * Math.cos(endRad)
    const y2 = center + radius * Math.sin(endRad)
    const largeArc = angle > 180 ? 1 : 0
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  return (
    <div className="expense-report bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Expense Report</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Category-wise expense analysis</p>
      </div>

      {/* Period Toggle */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setSelectedPeriod('current')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${selectedPeriod === 'current' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          This Month
        </button>
        <button
          onClick={() => setSelectedPeriod('last')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${selectedPeriod === 'last' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Last Month
        </button>
      </div>

      {/* Summary */}
      <div className="p-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
          </div>
          {selectedPeriod === 'current' && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${monthOverMonthChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {monthOverMonthChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(monthOverMonthChange).toFixed(1)}% vs last month</span>
            </div>
          )}
        </div>
      </div>

      {/* Pie Chart & Categories */}
      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Pie Chart */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                {pieData.map((item, idx) => (
                  <path
                    key={idx}
                    d={getPathCoordinates(item.startAngle, item.angle)}
                    fill={`url(#grad-${idx})`}
                    className="transition-all duration-300 cursor-pointer hover:opacity-80"
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <defs>
                      <radialGradient id={`grad-${idx}`}>
                        <stop offset="0%" stopColor={getCategoryColor(item.category).replace('bg-', '').replace('-500', '') === 'blue' ? '#3b82f6' : 
                          getCategoryColor(item.category).replace('bg-', '').replace('-500', '') === 'purple' ? '#a855f7' :
                          getCategoryColor(item.category).replace('bg-', '').replace('-500', '') === 'yellow' ? '#eab308' :
                          getCategoryColor(item.category).replace('bg-', '').replace('-500', '') === 'pink' ? '#ec4899' :
                          getCategoryColor(item.category).replace('bg-', '').replace('-500', '') === 'orange' ? '#f97316' : '#22c55e'} />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
                      </radialGradient>
                    </defs>
                  </path>
                ))}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-lg font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1">
            <div className="space-y-2">
              {paginatedData.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg transition-all ${hoveredSlice === idx ? 'bg-gray-100' : ''}`}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(item.category)}`} />
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">₹{item.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-3 pt-2 border-t border-gray-100">
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
            )}
          </div>
        </div>
      </div>

      {/* Month over Month Comparison */}
      {selectedPeriod === 'current' && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Category-wise Change</h4>
          <div className="space-y-2">
            {currentData.map((item, idx) => {
              const lastMonthItem = lastMonthExpenses.find(l => l.category === item.category)
              const change = ((item.amount - lastMonthItem.amount) / lastMonthItem.amount) * 100
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryLightColor(item.category)}`}>
                      {item.category}
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${change > 0 ? 'text-red-600' : change < 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    {change > 0 ? <TrendingUp size={10} /> : change < 0 ? <TrendingDown size={10} /> : null}
                    <span>{Math.abs(change).toFixed(1)}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}