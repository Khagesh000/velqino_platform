"use client"

import React, { useState, useEffect } from 'react'
import { Users, UserPlus, UserCheck, TrendingUp, Star, Calendar, Download, ChevronLeft, ChevronRight, Eye, Award } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerReports/CustomerReport.scss'
import { useGetRetailerCustomersQuery } from '@/redux/retailer/slices/retailerOrdersSlice'

export default function CustomerReport({ dateRange, dateRangeString, onRefresh }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('top')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  // API Call - Get customer orders data
  const { data: customersData, isLoading, refetch } = useGetRetailerCustomersQuery()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (onRefresh) {
      refetch()
    }
  }, [onRefresh, refetch])

  if (!mounted) return null

  // Transform customer orders data to get unique customers with their stats
  const customerOrders = customersData?.data || []

  // Group orders by customer
  const customerMap = new Map()

  customerOrders.forEach(order => {
    const customerId = order.customer__id
    if (!customerMap.has(customerId)) {
      customerMap.set(customerId, {
        id: customerId,
        name: order.customer__email?.split('@')[0] || `Customer ${customerId}`,
        email: order.customer__email,
        phone: order.customer__mobile || 'N/A',
        totalSpent: 0,
        orders: [],
        lastVisit: null
      })
    }
    
    const customer = customerMap.get(customerId)
    customer.totalSpent += parseFloat(order.grand_total || 0)
    customer.orders.push(order)
    
    const orderDate = new Date(order.created_at)
    if (!customer.lastVisit || orderDate > new Date(customer.lastVisit)) {
      customer.lastVisit = order.created_at
    }
  })

  // Convert map to array and calculate additional metrics
  let topCustomers = Array.from(customerMap.values()).map(customer => ({
    ...customer,
    ordersCount: customer.orders.length,
    avgOrder: customer.totalSpent / customer.orders.length,
    tier: customer.totalSpent >= 50000 ? 'Platinum' 
          : customer.totalSpent >= 25000 ? 'Gold' 
          : customer.totalSpent >= 10000 ? 'Silver' : 'Bronze',
    visits: customer.orders.length
  }))

  // Sort by total spent descending for top customers
  topCustomers = topCustomers.sort((a, b) => b.totalSpent - a.totalSpent)

  // Calculate new vs returning customers
  const today = new Date()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(today.getDate() - 30)

  const newCustomers = topCustomers.filter(c => {
    const firstOrderDate = new Date(c.orders[0]?.created_at)
    return firstOrderDate >= thirtyDaysAgo
  })

  const returningCustomers = topCustomers.filter(c => c.orders.length > 1)
  const totalCustomers = topCustomers.length

  const newVsReturning = {
    new: newCustomers.length,
    returning: returningCustomers.length,
    total: totalCustomers,
    newPercentage: totalCustomers > 0 ? Math.round((newCustomers.length / totalCustomers) * 100) : 0,
    returningPercentage: totalCustomers > 0 ? Math.round((returningCustomers.length / totalCustomers) * 100) : 0
  }

  // Calculate visit frequency
  const frequencyRanges = [
    { min: 1, max: 2, label: '1-2 visits' },
    { min: 3, max: 5, label: '3-5 visits' },
    { min: 6, max: 10, label: '6-10 visits' },
    { min: 11, max: Infinity, label: '10+ visits' }
  ]

  const visitFrequency = frequencyRanges.map(range => {
    const count = topCustomers.filter(c => c.visits >= range.min && c.visits <= range.max).length
    return {
      frequency: range.label,
      count: count,
      percentage: totalCustomers > 0 ? Math.round((count / totalCustomers) * 100) : 0
    }
  })

  // Calculate average order value
  const totalRevenue = topCustomers.reduce((sum, c) => sum + c.totalSpent, 0)
  const totalOrders = topCustomers.reduce((sum, c) => sum + c.ordersCount, 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Pagination
  const currentData = activeTab === 'top' 
    ? topCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : []

  const totalPages = activeTab === 'top' ? Math.ceil(topCustomers.length / itemsPerPage) : 1

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
      case 'Gold': return 'bg-yellow-500 text-white'
      case 'Silver': return 'bg-gray-400 text-white'
      default: return 'bg-orange-600 text-white'
    }
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN').format(amount)
  }

  if (isLoading) {
    return (
      <div className="customer-report bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading customer data...</p>
        </div>
      </div>
    )
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
          <p className="text-lg font-bold text-blue-700">{totalCustomers}</p>
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
          <p className="text-lg font-bold text-orange-700">₹{formatCurrency(avgOrderValue)}</p>
          <p className="text-[10px] text-orange-600">Avg Order Value</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => { setActiveTab('top'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'top' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          Top Customers ({topCustomers.length})
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
            {topCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No customers found</p>
                <p className="text-xs text-gray-400 mt-1">Customers who have placed orders will appear here</p>
              </div>
            ) : (
              currentData.map((customer, index) => (
                <div key={customer.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all" style={{ animationDelay: `${index * 0.05}s` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">{customer.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{customer.name}</h4>
                          <p className="text-xs text-gray-500">{customer.phone !== 'N/A' ? customer.phone : customer.email}</p>
                        </div>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getTierBadge(customer.tier)}`}>
                          {customer.tier}
                        </div>
                      </div>
                      
                      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Total Spent</p>
                          <p className="font-semibold text-gray-900">₹{formatCurrency(customer.totalSpent)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Orders</p>
                          <p className="font-semibold text-gray-900">{customer.ordersCount}</p>
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
              ))
            )}
          </div>
        )}

        {activeTab === 'newVsReturning' && (
          <div className="space-y-4">
            {totalCustomers === 0 ? (
              <div className="text-center py-8">
                <Users size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No customer data available</p>
              </div>
            ) : (
              <>
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
                      <span className="text-sm font-bold text-gray-900">{totalCustomers}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserPlus size={14} className="text-green-600" />
                      <span className="text-sm text-gray-700">New Customers (30 days)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600">{newVsReturning.new}</span>
                      <span className="text-xs text-gray-500 ml-1">({newVsReturning.newPercentage}%)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <UserCheck size={14} className="text-blue-600" />
                      <span className="text-sm text-gray-700">Returning Customers (2+ orders)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-blue-600">{newVsReturning.returning}</span>
                      <span className="text-xs text-gray-500 ml-1">({newVsReturning.returningPercentage}%)</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'frequency' && (
          <div className="space-y-3">
            {totalCustomers === 0 ? (
              <div className="text-center py-8">
                <Users size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No customer data available</p>
              </div>
            ) : (
              <>
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
                  <p className="text-xs text-gray-600">
                    {returningCustomers.length > 0 
                      ? `${Math.round((returningCustomers.length / totalCustomers) * 100)}% of customers are repeat buyers, showing good loyalty`
                      : 'No repeat customers yet. Focus on customer retention strategies.'}
                  </p>
                </div>
              </>
            )}
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