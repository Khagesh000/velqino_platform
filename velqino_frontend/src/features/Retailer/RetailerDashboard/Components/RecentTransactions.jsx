"use client"

import React, { useState, useEffect } from 'react'
import { MoreHorizontal, Eye, Receipt, CheckCircle, Clock, XCircle, TrendingUp } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerDashboard/RecentTransactions.scss'

export default function RecentTransactions() {
  const [mounted, setMounted] = useState(false)
  const [hoveredRow, setHoveredRow] = useState(null)
  const [viewMode, setViewMode] = useState('all') // 'all', 'today', 'week'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const transactions = [
    { id: '#TR-001', customer: 'Rajesh Kumar', items: 3, amount: 2450, payment: 'UPI', status: 'completed', time: '10:30 AM', date: 'Today' },
    { id: '#TR-002', customer: 'Priya Sharma', items: 2, amount: 1890, payment: 'Card', status: 'completed', time: '10:15 AM', date: 'Today' },
    { id: '#TR-003', customer: 'Amit Singh', items: 5, amount: 5670, payment: 'Cash', status: 'pending', time: '09:45 AM', date: 'Today' },
    { id: '#TR-004', customer: 'Sneha Reddy', items: 1, amount: 899, payment: 'UPI', status: 'completed', time: '09:20 AM', date: 'Today' },
    { id: '#TR-005', customer: 'Vikram Mehta', items: 4, amount: 3420, payment: 'Card', status: 'refunded', time: 'Yesterday', date: 'Yesterday' },
    { id: '#TR-006', customer: 'Neha Gupta', items: 2, amount: 1560, payment: 'Wallet', status: 'completed', time: 'Yesterday', date: 'Yesterday' },
    { id: '#TR-007', customer: 'Rahul Verma', items: 6, amount: 7890, payment: 'UPI', status: 'completed', time: 'Yesterday', date: 'Yesterday' },
  ]

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle size={14} className="text-green-500" />
      case 'pending': return <Clock size={14} className="text-yellow-500" />
      case 'refunded': return <XCircle size={14} className="text-red-500" />
      default: return null
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Completed'
      case 'pending': return 'Pending'
      case 'refunded': return 'Refunded'
      default: return status
    }
  }

  const getPaymentIcon = (payment) => {
    switch(payment) {
      case 'UPI': return '📱'
      case 'Card': return '💳'
      case 'Cash': return '💵'
      case 'Wallet': return '👛'
      default: return '💰'
    }
  }

  return (
    <div className="recent-transactions bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Recent Transactions</h3>
          <p className="text-xs text-gray-500 mt-0.5">Last sales with items and payment</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'all' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setViewMode('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'today' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setViewMode('today')}
            >
              Today
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'week' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setViewMode('week')}
            >
              This Week
            </button>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-[11px] text-green-600 font-medium mb-1">Total Sales</p>
          <p className="text-lg font-bold text-green-700">₹24,890</p>
          <p className="text-[10px] text-green-500 mt-0.5">+12% vs yesterday</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3">
          <p className="text-[11px] text-blue-600 font-medium mb-1">Transactions</p>
          <p className="text-lg font-bold text-blue-700">24</p>
          <p className="text-[10px] text-blue-500 mt-0.5">+3 more than yesterday</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3">
          <p className="text-[11px] text-purple-600 font-medium mb-1">Avg. Order Value</p>
          <p className="text-lg font-bold text-purple-700">₹1,037</p>
          <p className="text-[10px] text-purple-500 mt-0.5">+5% increase</p>
        </div>
        <div className="bg-orange-50 rounded-xl p-3">
          <p className="text-[11px] text-orange-600 font-medium mb-1">Pending</p>
          <p className="text-lg font-bold text-orange-700">3</p>
          <p className="text-[10px] text-orange-500 mt-0.5">Need attention</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="border-b border-gray-100">
            <tr className="text-left">
              <th className="pb-3 text-xs font-medium text-gray-500">Order ID</th>
              <th className="pb-3 text-xs font-medium text-gray-500">Customer</th>
              <th className="pb-3 text-xs font-medium text-gray-500">Items</th>
              <th className="pb-3 text-xs font-medium text-gray-500">Amount</th>
              <th className="pb-3 text-xs font-medium text-gray-500">Payment</th>
              <th className="pb-3 text-xs font-medium text-gray-500">Status</th>
              <th className="pb-3 text-xs font-medium text-gray-500">Time</th>
              <th className="pb-3 text-xs font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={`transaction-row transition-all duration-200 ${hoveredRow === transaction.id ? 'bg-gray-50' : ''}`}
                onMouseEnter={() => setHoveredRow(transaction.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="py-3">
                  <span className="text-sm font-medium text-gray-900">{transaction.id}</span>
                </td>
                <td className="py-3">
                  <span className="text-sm text-gray-700">{transaction.customer}</span>
                </td>
                <td className="py-3">
                  <span className="text-sm text-gray-700">{transaction.items} items</span>
                </td>
                <td className="py-3">
                  <span className="text-sm font-semibold text-gray-900">₹{transaction.amount.toLocaleString()}</span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{getPaymentIcon(transaction.payment)}</span>
                    <span className="text-xs text-gray-600">{transaction.payment}</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(transaction.status)}
                    <span className={`text-xs font-medium ${
                      transaction.status === 'completed' ? 'text-green-600' :
                      transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {getStatusText(transaction.status)}
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <span className="text-xs text-gray-500">{transaction.time}</span>
                </td>
                <td className="py-3">
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-all flex items-center gap-1">
          View All Transactions
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <TrendingUp size={12} className="text-green-500" />
          <span className="text-[11px] text-gray-500">+8.2% vs last week</span>
        </div>
      </div>
    </div>
  )
}