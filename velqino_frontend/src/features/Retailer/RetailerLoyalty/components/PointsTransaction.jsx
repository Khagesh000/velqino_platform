"use client"

import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Clock, Calendar, Gift, Star, CheckCircle, AlertCircle, Search, Filter, ChevronLeft, ChevronRight, Download } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerLoyalty/PointsTransaction.scss'

export default function PointsTransaction({ selectedCustomer, pointsTransactions = [], pointsSummary = null, refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 6

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery])

  if (!mounted) return null

  // Transform backend transactions to component format
  const getTypeFromBackend = (type) => {
    switch(type) {
      case 'earned': return 'earned'
      case 'redeemed': return 'redeemed'
      case 'bonus': return 'bonus'
      case 'expired': return 'expired'
      default: return 'earned'
    }
  }

  const getTypeConfig = (type) => {
    switch(type) {
      case 'earned':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: <TrendingUp size={12} />, label: 'Earned', prefix: '+' }
      case 'redeemed':
        return { bg: 'bg-orange-100', text: 'text-orange-700', icon: <Gift size={12} />, label: 'Redeemed', prefix: '-' }
      case 'bonus':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Star size={12} />, label: 'Bonus', prefix: '+' }
      case 'expired':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: <AlertCircle size={12} />, label: 'Expired', prefix: '-' }
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: <Clock size={12} />, label: type, prefix: '' }
    }
  }

  // Transform transactions from backend
  const transactions = pointsTransactions.map(transaction => ({
    id: transaction.transaction_id || transaction.id,
    customer: transaction.customer_name || selectedCustomer?.full_name || 'Customer',
    type: getTypeFromBackend(transaction.transaction_type),
    points: transaction.points,
    description: transaction.description,
    date: transaction.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    status: 'completed',
    balance: transaction.balance_after || 0
  }))

  // Use summary from backend or calculate from transactions
  const summary = pointsSummary || {
    total_earned: transactions.filter(t => t.type === 'earned' || t.type === 'bonus').reduce((sum, t) => sum + t.points, 0),
    total_redeemed: transactions.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + t.points, 0),
    total_expired: transactions.filter(t => t.type === 'expired').reduce((sum, t) => sum + t.points, 0),
    available_points: transactions.filter(t => t.type === 'earned' || t.type === 'bonus').reduce((sum, t) => sum + t.points, 0) - 
                       transactions.filter(t => t.type === 'redeemed').reduce((sum, t) => sum + t.points, 0) -
                       transactions.filter(t => t.type === 'expired').reduce((sum, t) => sum + t.points, 0)
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchQuery === '' || 
      transaction.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = activeTab === 'all' || transaction.type === activeTab
    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  // If no customer selected
  if (!selectedCustomer) {
    return (
      <div className="points-transaction bg-white rounded-xl shadow-sm border border-gray-100 h-full">
        <div className="p-8 text-center">
          <TrendingUp size={48} className="mx-auto text-gray-200 mb-3" />
          <p className="text-sm text-gray-500">Select a customer to view transactions</p>
          <p className="text-xs text-gray-400 mt-1">Click on any customer from the member list</p>
        </div>
      </div>
    )
  }

  return (
    <div className="points-transaction bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Points Transaction</h3>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Track points for {selectedCustomer.full_name || selectedCustomer.name}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-4 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">+{summary.total_earned.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Earned</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-600">-{summary.total_redeemed.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Redeemed</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">-{summary.total_expired.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Expired</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-primary-600">{summary.available_points.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Available</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => { setActiveTab('all'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'all' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'}`}
        >
          All
        </button>
        <button
          onClick={() => { setActiveTab('earned'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'earned' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500'}`}
        >
          Earned
        </button>
        <button
          onClick={() => { setActiveTab('redeemed'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'redeemed' ? 'text-orange-600 border-b-2 border-orange-500' : 'text-gray-500'}`}
        >
          Redeemed
        </button>
        <button
          onClick={() => { setActiveTab('bonus'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'bonus' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-500'}`}
        >
          Bonus
        </button>
        <button
          onClick={() => { setActiveTab('expired'); setCurrentPage(1) }}
          className={`flex-1 py-2 text-xs font-medium transition-all ${activeTab === 'expired' ? 'text-red-600 border-b-2 border-red-500' : 'text-gray-500'}`}
        >
          Expired
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="p-4 max-h-[320px] overflow-y-auto custom-scroll">
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No transactions yet</p>
              <p className="text-xs text-gray-400 mt-1">Points will appear when customer places orders</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Search size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No matching transactions</p>
            </div>
          ) : (
            paginatedTransactions.map((transaction, index) => {
              const typeConfig = getTypeConfig(transaction.type)
              return (
                <div
                  key={transaction.id}
                  className={`transaction-item border rounded-lg p-3 transition-all ${hoveredRow === transaction.id ? 'shadow-md transform -translate-y-0.5' : ''}`}
                  onMouseEnter={() => setHoveredRow(transaction.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeConfig.bg}`}>
                        {typeConfig.icon}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{transaction.customer}</p>
                        <p className="text-xs text-gray-500">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${typeConfig.text}`}>
                        {typeConfig.prefix}{transaction.points.toLocaleString()} points
                      </p>
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConfig.bg} ${typeConfig.text} mt-1`}>
                        {typeConfig.icon}
                        {typeConfig.label}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-gray-400" />
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle size={10} className="text-green-500" />
                      <span>Balance: {transaction.balance.toLocaleString()} points</span>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-gray-500">
            {filteredTransactions.length} transactions
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