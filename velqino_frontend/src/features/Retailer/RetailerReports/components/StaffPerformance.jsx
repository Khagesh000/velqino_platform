"use client"

import React, { useState, useEffect } from 'react'
import { Users, TrendingUp, TrendingDown, Star, Award, Calendar, Download, ChevronLeft, ChevronRight, Eye, Target, CheckCircle, Clock } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/StaffPerformance.scss'

export default function StaffPerformance({ dateRange }) {
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
      joinDate: '2024-01-15',
      status: 'active'
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
      joinDate: '2024-03-10',
      status: 'active'
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
      joinDate: '2024-06-20',
      status: 'active'
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
      joinDate: '2024-02-05',
      status: 'active'
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
      joinDate: '2023-11-10',
      status: 'active'
    },
  ]

  const summary = {
    totalStaff: staffData.length,
    totalSales: staffData.reduce((sum, s) => sum + s.sales, 0),
    avgAchievement: (staffData.reduce((sum, s) => sum + s.achievement, 0) / staffData.length).toFixed(1),
    topPerformer: staffData.reduce((max, s) => s.achievement > max.achievement ? s : max, staffData[0])
  }

  const currentData = staffData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(staffData.length / itemsPerPage)

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
    if (index === 0) return <Award size={14} className="text-yellow-500" />
    if (index === 1) return <Award size={14} className="text-gray-400" />
    if (index === 2) return <Award size={14} className="text-orange-500" />
    return null
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })
  }

  return (
    <div className="staff-performance bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Staff Performance</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Sales performance by staff member</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-gray-100">
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-blue-700">{summary.totalStaff}</p>
          <p className="text-[10px] text-blue-600">Active Staff</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <p className="text-lg font-bold text-green-700">₹{(summary.totalSales / 1000).toFixed(0)}k</p>
          <p className="text-[10px] text-green-600">Total Sales</p>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded-lg">
          <p className="text-lg font-bold text-yellow-700">{summary.avgAchievement}%</p>
          <p className="text-[10px] text-yellow-600">Avg Achievement</p>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <p className="text-lg font-bold text-purple-700">{summary.topPerformer.name.split(' ')[0]}</p>
          <p className="text-[10px] text-purple-600">Top Performer</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'overview' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('targets')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'targets' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Targets
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'ranking' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Ranking
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[320px] overflow-y-auto custom-scroll">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {currentData.map((staff, idx) => (
              <div key={staff.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all" style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">{staff.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{staff.name}</h4>
                        <p className="text-xs text-gray-500">{staff.role}</p>
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${getAchievementBg(staff.achievement)} ${getAchievementColor(staff.achievement)}`}>
                        <Target size={10} />
                        {staff.achievement}% achieved
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Sales</p>
                        <p className="font-semibold text-gray-900">₹{staff.sales.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Orders</p>
                        <p className="font-semibold text-gray-900">{staff.orders}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Customers</p>
                        <p className="font-semibold text-gray-900">{staff.customers}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500">
                      <Clock size={10} />
                      <span>Joined {formatDate(staff.joinDate)}</span>
                      <div className="flex items-center gap-1 ml-2">
                        <Star size={10} className="text-yellow-400 fill-current" />
                        <span>{staff.rating}</span>
                      </div>
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

        {activeTab === 'targets' && (
          <div className="space-y-4">
            {staffData.map((staff, idx) => (
              <div key={staff.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold">
                      {staff.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">Target: ₹{staff.target.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getAchievementColor(staff.achievement)}`}>
                    {staff.achievement}%
                  </span>
                </div>
                
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      staff.achievement >= 100 ? 'bg-green-500' : 
                      staff.achievement >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(staff.achievement, 100)}%` }}
                  />
                </div>
                
                <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                  <span>Achieved: ₹{staff.sales.toLocaleString()}</span>
                  <span>Shortfall: ₹{(staff.target - staff.sales).toLocaleString()}</span>
                </div>
              </div>
            ))}
            
            <div className="bg-green-50 rounded-lg p-3 mt-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-xs font-medium text-green-700">Team Achievement: {summary.avgAchievement}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ranking' && (
          <div className="space-y-2">
            {staffData.sort((a, b) => b.achievement - a.achievement).map((staff, idx) => (
              <div key={staff.id} className={`flex items-center gap-3 p-3 rounded-lg transition-all ${idx < 3 ? 'bg-yellow-50' : 'bg-gray-50'}`}>
                <div className="w-8 text-center">
                  {getRankIcon(idx) || <span className="text-sm font-bold text-gray-400">#{idx + 1}</span>}
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold">
                  {staff.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                  <p className="text-xs text-gray-500">{staff.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{staff.achievement}%</p>
                  <p className="text-xs text-gray-500">achieved</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {activeTab === 'overview' && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {staffData.length} staff members
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