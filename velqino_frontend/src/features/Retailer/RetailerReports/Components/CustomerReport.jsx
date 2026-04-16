"use client"

import React, { useState, useEffect } from 'react'
import { Users, UserPlus, UserCheck, TrendingUp, Star, Calendar, Download, ChevronLeft, ChevronRight, Eye, Award } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/CustomerReport.scss'

export default function CustomerReport({ dateRange }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('top')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const topCustomers = [
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', totalSpent: 45890, orders: 12, avgOrder: 3824, lastVisit: '2026-04-14', tier: 'Gold', visits: 12 },
    { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', totalSpent: 18900, orders: 5, avgOrder: 3780, lastVisit: '2026-04-14', tier: 'Silver', visits: 5 },
    { id: 3, name: 'Amit Singh', phone: '+91 76543 21098', totalSpent: 56780, orders: 15, avgOrder: 3785, lastVisit: '2026-04-13', tier: 'Gold', visits: 15 },
    { id: 4, name: 'Vikram Mehta', phone: '+91 54321 09876', totalSpent: 78200, orders: 25, avgOrder: 3128, lastVisit: '2026-04-12', tier: 'Platinum', visits: 25 },
    { id: 5, name: 'Meera Joshi', phone: '+91 21098 76543', totalSpent: 45600, orders: 18, avgOrder: 2533, lastVisit: '2026-04-11', tier: 'Platinum', visits: 18 },
  ]

  const newVsReturning = {
    new: 45,
    returning: 128,
    total: 173,
    newPercentage: 26,
    returningPercentage: 74
  }

  const visitFrequency = [
    { frequency: '1-2 visits', count: 38, percentage: 22 },
    { frequency: '3-5 visits', count: 52, percentage: 30 },
    { frequency: '6-10 visits', count: 45, percentage: 26 },
    { frequency: '10+ visits', count: 38, percentage: 22 },
  ]

  const currentData = activeTab === 'top' 
    ? topCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : []

  const totalPages = activeTab === 'top' ? Math.ceil(topCustomers.length / itemsPerPage) : 1

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
      case 'Gold': return 'bg-yellow-500 text-white'
      case 'Silver': return 'bg-gray-400 text-white'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="customer-report bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Customer Report</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Customer insights and behavior</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-gray-100">
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-blue-700">{newVsReturning.total}</p>
          <p className="text-[10px] text-blue-600">Total Customers</p>
        </div>
        <div className="text-center p-2 bg-green-50 rounded-lg">
          <p className="text-lg font-bold text-green-700">{newVsReturning.new}</p>
          <p className="text-[10px] text-green-600">New Customers</p>
        </div>
        <div className="text-center p-2 bg-purple-50 rounded-lg">
          <p className="text-lg font-bold text-purple-700">{newVsReturning.returning}</p>
          <p className="text-[10px] text-purple-600">Returning</p>
        </div>
        <div className="text-center p-2 bg-orange-50 rounded-lg">
          <p className="text-lg font-bold text-orange-700">₹3,250</p>
          <p className="text-[10px] text-orange-600">Avg Order Value</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => { setActiveTab('top'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'top' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Top Customers
        </button>
        <button
          onClick={() => setActiveTab('newVsReturning')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'newVsReturning' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          New vs Returning
        </button>
        <button
          onClick={() => setActiveTab('frequency')}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'frequency' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Visit Frequency
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[350px] overflow-y-auto custom-scroll">
        {activeTab === 'top' && (
          <div className="space-y-3">
            {currentData.map((customer, index) => (
              <div key={customer.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">{customer.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{customer.name}</h4>
                        <p className="text-xs text-gray-500">{customer.phone}</p>
                      </div>
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTierBadge(customer.tier)}`}>
                        {customer.tier}
                      </div>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-gray-500">Total Spent</p>
                        <p className="font-semibold text-gray-900">₹{customer.totalSpent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Orders</p>
                        <p className="font-semibold text-gray-900">{customer.orders}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Last Visit</p>
                        <p className="text-gray-600">{formatDate(customer.lastVisit)}</p>
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

        {activeTab === 'newVsReturning' && (
          <div className="space-y-4">
            {/* Donut Chart */}
            <div className="flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="15" />
                  <circle 
                    cx="50" cy="50" r="40" fill="none" 
                    stroke="#22c55e" strokeWidth="15" 
                    strokeDasharray={`${newVsReturning.newPercentage * 2.51} 251`}
                    strokeLinecap="round"
                  />
                  <circle 
                    cx="50" cy="50" r="40" fill="none" 
                    stroke="#3b82f6" strokeWidth="15" 
                    strokeDasharray={`${newVsReturning.returningPercentage * 2.51} 251`}
                    strokeDashoffset={-newVsReturning.newPercentage * 2.51}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{newVsReturning.total}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserPlus size={14} className="text-green-600" />
                  <span className="text-sm text-gray-700">New Customers</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-green-600">{newVsReturning.new}</span>
                  <span className="text-xs text-gray-500 ml-1">({newVsReturning.newPercentage}%)</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck size={14} className="text-blue-600" />
                  <span className="text-sm text-gray-700">Returning Customers</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-blue-600">{newVsReturning.returning}</span>
                  <span className="text-xs text-gray-500 ml-1">({newVsReturning.returningPercentage}%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'frequency' && (
          <div className="space-y-3">
            {visitFrequency.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.frequency}</span>
                  <span className="text-sm font-bold text-gray-900">{item.count} customers</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">{item.percentage}% of total</p>
              </div>
            ))}
            
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-green-500" />
                <span className="text-xs font-semibold text-gray-700">Insights</span>
              </div>
              <p className="text-xs text-gray-600">52% of customers visit 3+ times, showing good loyalty</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {activeTab === 'top' && totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {topCustomers.length} customers
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