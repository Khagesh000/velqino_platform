"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Target, Award, Star, Calendar, Eye, Download, ChevronLeft, ChevronRight, Gift, Trophy, Zap } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerStaff/StaffPerformance.scss'

export default function StaffPerformance({ selectedStaff }) {
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState('month')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const staffPerformance = [
    { id: 1, name: 'Rajesh Kumar', role: 'Store Manager', sales: 456000, target: 500000, achievement: 91, orders: 128, avgValue: 3562, incentives: 5000, commission: 4500, rating: 4.8 },
    { id: 2, name: 'Priya Sharma', role: 'Sales Associate', sales: 389000, target: 400000, achievement: 97, orders: 112, avgValue: 3473, incentives: 3500, commission: 3890, rating: 4.9 },
    { id: 3, name: 'Vikram Mehta', role: 'Sales Associate', sales: 512000, target: 500000, achievement: 102, orders: 145, avgValue: 3531, incentives: 5500, commission: 5120, rating: 5.0 },
    { id: 4, name: 'Amit Singh', role: 'Cashier', sales: 0, target: 0, achievement: 0, orders: 156, avgValue: 0, incentives: 0, commission: 0, rating: 4.5 },
    { id: 5, name: 'Sneha Reddy', role: 'Stock Clerk', sales: 0, target: 0, achievement: 0, orders: 0, avgValue: 0, incentives: 0, commission: 0, rating: 4.7 },
  ]

  const filteredPerformance = selectedStaff 
    ? staffPerformance.filter(s => s.id === selectedStaff.id)
    : staffPerformance

  const totalPages = Math.ceil(filteredPerformance.length / itemsPerPage)
  const paginatedPerformance = filteredPerformance.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const summary = {
    totalSales: staffPerformance.reduce((sum, s) => sum + s.sales, 0),
    avgAchievement: (staffPerformance.filter(s => s.achievement > 0).reduce((sum, s) => sum + s.achievement, 0) / staffPerformance.filter(s => s.achievement > 0).length).toFixed(1),
    topPerformer: staffPerformance.reduce((max, s) => s.sales > max.sales ? s : max, staffPerformance[0]),
    totalIncentives: staffPerformance.reduce((sum, s) => sum + s.incentives + s.commission, 0)
  }

  const getAchievementColor = (achievement) => {
    if (achievement >= 100) return 'text-green-600'
    if (achievement >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getAchievementBg = (achievement) => {
    if (achievement >= 100) return 'bg-green-100'
    if (achievement >= 85) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy size={14} className="text-yellow-500" />
    if (index === 1) return <Award size={14} className="text-gray-400" />
    if (index === 2) return <Star size={14} className="text-orange-500" />
    return null
  }

  return (
    <div className="staff-performance bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Staff Performance</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Sales per staff, targets and incentives</p>
      </div>

      {/* Period Selector */}
      <div className="px-4 pt-3 pb-2 border-b border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${period === 'week' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${period === 'month' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod('quarter')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${period === 'quarter' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            This Quarter
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">₹{(summary.totalSales / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-gray-500">Total Sales</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{summary.avgAchievement}%</p>
          <p className="text-[10px] text-gray-500">Avg Achievement</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-yellow-600">{summary.topPerformer.name.split(' ')[0]}</p>
          <p className="text-[10px] text-gray-500">Top Performer</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-600">₹{(summary.totalIncentives / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-gray-500">Incentives Paid</p>
        </div>
      </div>

      {/* Performance Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Staff</th>
              <th className="px-4 py-3">Sales</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Achievement</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Incentives</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedPerformance.map((staff, index) => (
              <tr
                key={staff.id}
                className={`performance-row transition-all ${hoveredRow === staff.id ? 'bg-gray-50' : ''}`}
                onMouseEnter={() => setHoveredRow(staff.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">{staff.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">{staff.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-gray-900">₹{staff.sales.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">₹{staff.target.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          staff.achievement >= 100 ? 'bg-green-500' : staff.achievement >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(staff.achievement, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${getAchievementColor(staff.achievement)}`}>
                      {staff.achievement}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-700">{staff.orders}</span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-green-600">₹{(staff.incentives + staff.commission).toLocaleString()}</p>
                    <p className="text-[10px] text-gray-500">Inc: ₹{staff.incentives} | Comm: ₹{staff.commission}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredPerformance.length} staff members
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

      {/* Top Performers */}
      <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} className="text-yellow-500" />
          <h4 className="text-xs font-semibold text-gray-700">Top Performers This Month</h4>
        </div>
        <div className="space-y-2">
          {staffPerformance.filter(s => s.sales > 0).sort((a, b) => b.sales - a.sales).slice(0, 3).map((staff, idx) => (
            <div key={staff.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getRankIcon(idx)}
                <span className="text-sm font-medium text-gray-700">{staff.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-900">₹{staff.sales.toLocaleString()}</span>
                <span className="text-xs text-green-600">+{staff.achievement - 100}% over target</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}