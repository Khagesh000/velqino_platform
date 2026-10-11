"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Users, UserPlus, UserCheck, TrendingUp, ChevronLeft, ChevronRight, Award } from '../../../../utils/icons'

export default function CustomerReport({ 
  dateRange = 'month', 
  customersData = [], 
  isLoading, 
  onRefresh 
}) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('top')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Customers data is passed directly from consolidated reports endpoint!
  // Structure: [{ customer__id, customer__email, customer__mobile, grand_total, order_count, created_at }, ...]
  const customersList = useMemo(() => {
    if (!customersData || !Array.isArray(customersData)) return []
    return customersData.map(c => {
      const totalSpent = parseFloat(c.grand_total || 0)
      const ordersCount = parseInt(c.order_count || 1)
      const tier = totalSpent >= 50000 ? 'Platinum' 
                 : totalSpent >= 25000 ? 'Gold' 
                 : totalSpent >= 10000 ? 'Silver' 
                 : 'Bronze'
      
      const email = c.customer__email || `customer${c.customer__id || ''}@mail.com`
      const name = email.split('@')[0] || `Customer #${c.customer__id}`
      return {
        id: c.customer__id,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email,
        phone: c.customer__mobile || 'N/A',
        totalSpent,
        ordersCount,
        avgOrder: ordersCount > 0 ? totalSpent / ordersCount : 0,
        tier,
        lastVisit: c.created_at
      }
    }).sort((a, b) => b.totalSpent - a.totalSpent)
  }, [customersData])

  const totalCustomers = customersList.length
  const returningCustomers = customersList.filter(c => c.ordersCount > 1)
  const newCustomers = customersList.filter(c => c.ordersCount === 1)
  const totalRevenue = customersList.reduce((sum, c) => sum + c.totalSpent, 0)
  const avgOrderValue = customersList.length > 0 ? totalRevenue / customersList.reduce((acc, c) => acc + c.ordersCount, 0) : 0

  const totalPages = Math.max(1, Math.ceil(customersList.length / itemsPerPage))
  const paginatedCustomers = customersList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(Math.round(amount || 0))
  }

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'Gold': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Silver': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-orange-50 text-orange-700 border-orange-200'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[380px]">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-primary-500 border-t-transparent" />
        <p className="text-xs font-medium text-gray-500 mt-3">Loading customer insights...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-gray-100 flex flex-col h-full overflow-hidden transition-all duration-200">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Users size={18} />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Customer Performance</h3>
            <p className="text-xs text-gray-400 mt-0.5">Customer revenue and repeat buyer metrics</p>
          </div>
        </div>
        <span className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
          {totalCustomers} Active Buyers
        </span>
      </div>

      {/* Summary KPI Strip */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-b border-gray-100 bg-gray-50/50">
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Total Buyers</p>
          <p className="text-base font-bold text-gray-900 mt-0.5">{totalCustomers}</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Repeat Buyers</p>
          <p className="text-base font-bold text-purple-600 mt-0.5">{returningCustomers.length}</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">New Buyers</p>
          <p className="text-base font-bold text-emerald-600 mt-0.5">{newCustomers.length}</p>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Avg Order Val</p>
          <p className="text-base font-bold text-primary-600 mt-0.5">₹{formatCurrency(avgOrderValue)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-3 bg-white">
        <button
          onClick={() => { setActiveTab('top'); setCurrentPage(1); }}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'top' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Top Spenders ({totalCustomers})
        </button>
        <button
          onClick={() => setActiveTab('segments')}
          className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'segments' 
              ? 'border-primary-500 text-primary-600' 
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Customer Retention
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[300px]">
        {activeTab === 'top' ? (
          customersList.length === 0 ? (
            <div className="text-center py-10">
              <Users size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-medium text-gray-500">No customer records in this period</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {paginatedCustomers.map((cust) => (
                <div 
                  key={cust.id || cust.email} 
                  className="p-3 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-50 text-primary-600 font-bold flex items-center justify-center shrink-0 text-sm">
                      {cust.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{cust.name}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTierBadge(cust.tier)}`}>
                          {cust.tier}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">{cust.phone !== 'N/A' ? cust.phone : cust.email} • {cust.ordersCount} orders</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">₹{formatCurrency(cust.totalSpent)}</p>
                    <p className="text-[10px] text-gray-400">AOV: ₹{formatCurrency(cust.avgOrder)}</p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="space-y-4">
            {/* Visual breakdown */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                <span>Repeat Buyer Ratio</span>
                <span className="text-purple-600">
                  {totalCustomers > 0 ? Math.round((returningCustomers.length / totalCustomers) * 100) : 0}% Retention
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className="h-full bg-purple-500 transition-all duration-500" 
                  style={{ width: `${totalCustomers > 0 ? (returningCustomers.length / totalCustomers) * 100 : 0}%` }}
                />
                <div 
                  className="h-full bg-emerald-400 transition-all duration-500" 
                  style={{ width: `${totalCustomers > 0 ? (newCustomers.length / totalCustomers) * 100 : 0}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                  Returning ({returningCustomers.length})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  First-Time ({newCustomers.length})
                </span>
              </div>
            </div>

            <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl text-xs text-purple-900 flex items-start gap-2">
              <TrendingUp size={16} className="text-purple-600 shrink-0 mt-0.5" />
              <span>
                {returningCustomers.length > 0 
                  ? `${returningCustomers.length} loyal customers have ordered multiple times, creating sustained recurring revenue.`
                  : 'Encourage first-time buyers with targeted loyalty points to drive repeat orders.'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {activeTab === 'top' && totalPages > 1 && (
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