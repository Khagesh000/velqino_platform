"use client"

import React, { useState, useEffect } from 'react'
import { Users, Award, ChevronLeft, ChevronRight, Target, Clock, Star } from '../../../../utils/icons'

export default function StaffPerformance({ dateRange = 'month', isLoading }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const staffData = [
    { 
      id: 1, 
      name: 'Rajesh Kumar', 
      role: 'Store Manager', 
      sales: 45600, 
      target: 50000,
      achievement: 91,
      orders: 128,
      avgValue: 356,
      customers: 89,
      rating: 4.8,
      joinDate: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      role: 'Sales Associate', 
      sales: 38900, 
      target: 40000,
      achievement: 97,
      orders: 112,
      avgValue: 347,
      customers: 76,
      rating: 4.9,
      joinDate: '2024-03-10'
    },
    { 
      id: 3, 
      name: 'Amit Singh', 
      role: 'Sales Associate', 
      sales: 34200, 
      target: 40000,
      achievement: 85,
      orders: 98,
      avgValue: 349,
      customers: 67,
      rating: 4.5,
      joinDate: '2024-06-20'
    },
    { 
      id: 4, 
      name: 'Sneha Reddy', 
      role: 'Cashier', 
      sales: 28900, 
      target: 30000,
      achievement: 96,
      orders: 156,
      avgValue: 185,
      customers: 134,
      rating: 4.7,
      joinDate: '2024-02-05'
    },
    { 
      id: 5, 
      name: 'Vikram Mehta', 
      role: 'Sales Associate', 
      sales: 51200, 
      target: 50000,
      achievement: 102,
      orders: 145,
      avgValue: 353,
      customers: 98,
      rating: 5.0,
      joinDate: '2023-11-10'
    },
  ]

  const summary = {
    totalStaff: staffData.length,
    totalSales: staffData.reduce((sum, s) => sum + s.sales, 0),
    avgAchievement: Math.round(staffData.reduce((sum, s) => sum + s.achievement, 0) / staffData.length),
    topPerformer: staffData.reduce((max, s) => s.achievement > max.achievement ? s : max, staffData[0])
  }

  const currentData = staffData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(staffData.length / itemsPerPage)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount || 0))
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Users size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Staff Sales Performance</h3>
            <p className="text-xs text-gray-400 mt-0.5">Individual quotas, achievements & rankings</p>
          </div>
        </div>
        <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
          {staffData.length} Team Members
        </span>
      </div>

      {/* Summary KPI Strip */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-b border-gray-100 bg-gray-50/50">
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Team Size</p>
          <p className="text-base font-bold text-gray-900 mt-0.5">{summary.totalStaff} members</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Staff Sales</p>
          <p className="text-base font-bold text-emerald-600 mt-0.5">₹{formatCurrency(summary.totalSales)}</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Avg Target Met</p>
          <p className="text-base font-bold text-primary-600 mt-0.5">{summary.avgAchievement}%</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Top Performer</p>
          <p className="text-base font-bold text-blue-600 mt-0.5 truncate">{summary.topPerformer.name.split(' ')[0]}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-3 bg-white">
        <button
          onClick={() => { setActiveTab('overview'); setCurrentPage(1); }}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'overview' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Staff Overview
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'ranking' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Leaderboard Ranking
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[300px]">
        {activeTab === 'overview' ? (
          <div className="space-y-3">
            {currentData.map((staff) => {
              const isExceeded = staff.achievement >= 100
              return (
                <div 
                  key={staff.id} 
                  className="p-3.5 rounded-xl border border-gray-100 bg-white hover:border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0 text-sm">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900">{staff.name}</h4>
                      <p className="text-[11px] text-gray-400">{staff.role} • {staff.orders} orders closed</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-right">
                      <p className="text-xs sm:text-sm font-bold text-gray-900">₹{formatCurrency(staff.sales)}</p>
                      <p className="text-[10px] text-gray-400">Target: ₹{formatCurrency(staff.target)}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isExceeded 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : staff.achievement >= 85 
                        ? 'bg-amber-50 text-amber-700' 
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {staff.achievement}% met
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {[...staffData].sort((a, b) => b.achievement - a.achievement).map((staff, idx) => (
              <div 
                key={staff.id} 
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                  idx === 0 ? 'bg-amber-50/50 border-amber-200' : 'bg-gray-50/60 border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center text-xs font-black ${idx === 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900">{staff.name}</h4>
                    <p className="text-[11px] text-gray-400">{staff.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{staff.achievement}% achieved</span>
                  <p className="text-[10px] text-gray-400">₹{formatCurrency(staff.sales)} volume</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {activeTab === 'overview' && totalPages > 1 && (
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
