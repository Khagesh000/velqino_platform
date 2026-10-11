"use client"

import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, TrendingDown, Clock, Calendar, Gift, Star, 
  CheckCircle, AlertCircle, Search, Filter, ChevronLeft, ChevronRight, 
  Download, Users, Sparkles, X
} from '../../../../utils/icons'

export default function PointsTransaction({ selectedCustomer, pointsTransactions = [], pointsSummary = null, refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 5

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
        return { 
          bg: 'bg-emerald-50', 
          border: 'border-emerald-200', 
          text: 'text-emerald-700', 
          icon: <TrendingUp size={12} className="text-emerald-600" />, 
          label: 'Earned', 
          prefix: '+' 
        }
      case 'redeemed':
        return { 
          bg: 'bg-amber-50', 
          border: 'border-amber-200', 
          text: 'text-amber-700', 
          icon: <Gift size={12} className="text-amber-600" />, 
          label: 'Redeemed', 
          prefix: '-' 
        }
      case 'bonus':
        return { 
          bg: 'bg-purple-50', 
          border: 'border-purple-200', 
          text: 'text-purple-700', 
          icon: <Star size={12} className="text-purple-600" />, 
          label: 'Bonus', 
          prefix: '+' 
        }
      case 'expired':
        return { 
          bg: 'bg-rose-50', 
          border: 'border-rose-200', 
          text: 'text-rose-700', 
          icon: <AlertCircle size={12} className="text-rose-600" />, 
          label: 'Expired', 
          prefix: '-' 
        }
      default:
        return { 
          bg: 'bg-gray-100', 
          border: 'border-gray-200', 
          text: 'text-gray-700', 
          icon: <Clock size={12} />, 
          label: type, 
          prefix: '' 
        }
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
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full flex flex-col items-center justify-center p-8 text-center min-h-[480px]">
        <div className="w-16 h-16 rounded-3xl bg-primary-50 text-primary-500 border border-primary-100 flex items-center justify-center mb-4">
          <TrendingUp size={28} />
        </div>
        <h3 className="text-base font-extrabold text-gray-900">Member Points Audit</h3>
        <p className="text-xs text-gray-500 mt-1.5 max-w-xs leading-relaxed">
          Select any customer from the Member Directory to audit their lifetime points, redemption history, and active balance.
        </p>
        <span className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">
          <Sparkles size={11} className="text-primary-500" />
          Real-Time Points Ledger
        </span>
      </div>
    )
  }

  const customerName = selectedCustomer.full_name || selectedCustomer.name || 'Selected VIP'

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full flex flex-col justify-between overflow-hidden">
      <div>
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
                {customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-gray-900 tracking-tight">{customerName}</h3>
                <p className="text-xs text-gray-500">Points ledger &amp; audit history</p>
              </div>
            </div>
            <button 
              type="button"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl border border-gray-200/80 transition-all shadow-2xs"
              title="Export ledger"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        {/* 4 Stat Ribbon */}
        <div className="grid grid-cols-4 gap-2 p-3.5 bg-gray-50/60 border-b border-gray-100 text-center">
          <div className="bg-white p-2 rounded-xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-emerald-700">Earned</p>
            <p className="text-sm font-extrabold text-emerald-800 mt-0.5">+{summary.total_earned.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2 rounded-xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-amber-600">Redeemed</p>
            <p className="text-sm font-extrabold text-amber-700 mt-0.5">-{summary.total_redeemed.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2 rounded-xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-rose-600">Expired</p>
            <p className="text-sm font-extrabold text-rose-700 mt-0.5">-{summary.total_expired.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2 rounded-xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase text-primary-600">Available</p>
            <p className="text-sm font-extrabold text-primary-700 mt-0.5">{summary.available_points.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex border-b border-gray-100 px-4 pt-2 gap-1 bg-white overflow-x-auto">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'earned', label: 'Earned' },
            { id: 'redeemed', label: 'Redeemed' },
            { id: 'bonus', label: 'Bonus' },
            { id: 'expired', label: 'Expired' }
          ].map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setCurrentPage(1) }}
                className={`px-3 py-2 text-xs font-bold transition-all border-b-2 shrink-0 ${
                  isActive 
                    ? 'border-primary-600 text-primary-700' 
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="p-3.5 border-b border-gray-100">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search in descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        {/* Transactions List */}
        <div className="p-4 max-h-[300px] overflow-y-auto space-y-2.5">
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-bold text-gray-700">No point events recorded</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Points accumulate automatically when orders are finalized.</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Search size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs font-bold text-gray-700">No matching point events</p>
            </div>
          ) : (
            paginatedTransactions.map((transaction) => {
              const typeConfig = getTypeConfig(transaction.type)
              return (
                <div
                  key={transaction.id}
                  onMouseEnter={() => setHoveredRow(transaction.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`p-3 rounded-2xl border transition-all ${typeConfig.border} ${
                    hoveredRow === transaction.id ? 'bg-gray-50/80 shadow-xs' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${typeConfig.bg}`}>
                        {typeConfig.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-snug">{transaction.description || 'Reward transaction'}</p>
                        <span className="text-[10px] text-gray-400">{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-extrabold ${typeConfig.text}`}>
                        {typeConfig.prefix}{transaction.points.toLocaleString()} pts
                      </p>
                      <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold border mt-0.5 ${typeConfig.bg} ${typeConfig.border} ${typeConfig.text}`}>
                        {typeConfig.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 pt-2 border-t border-gray-100">
                    <span>Balance after</span>
                    <span className="font-bold text-gray-700">{transaction.balance.toLocaleString()} pts</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-3.5 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-[11px] text-gray-400">
            {filteredTransactions.length} records
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="text-[11px] font-bold text-gray-600">{currentPage} / {totalPages}</span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30 rounded"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}