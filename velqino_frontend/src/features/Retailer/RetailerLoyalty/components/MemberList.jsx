"use client"

import React, { useState, useEffect } from 'react'
import { 
  Users, Search, Filter, ChevronLeft, ChevronRight, Star, Award, 
  Eye, Edit, Mail, Phone, TrendingUp, Calendar, Download, Sparkles, X
} from '../../../../utils/icons'

export default function MemberList({ customers = [], selectedCustomer, setSelectedCustomer, isLoading, refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 6

  useEffect(() => {
    setMounted(true)
  }, [])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, tierFilter])

  if (!mounted) return null

  // Helper function to determine tier
  const getTierFromTotalSpent = (spent) => {
    if (spent >= 50000) return 'Platinum'
    if (spent >= 25000) return 'Gold'
    if (spent >= 10000) return 'Silver'
    return 'Bronze'
  }

  // Transform customers to members format
  const members = customers.map(customer => ({
    id: customer.user?.id || customer.id,
    name: customer.full_name || customer.name || 'N/A',
    email: customer.email || customer.user?.email || 'N/A',
    phone: customer.phone || customer.mobile || customer.user?.mobile || 'N/A',
    points: Math.floor(customer.totalSpent / 10) || 0,
    tier: customer.tier || getTierFromTotalSpent(customer.totalSpent),
    totalSpent: customer.totalSpent || 0,
    orders: customer.visits || 0,
    joined: customer.created_at?.split('T')[0] || 'N/A',
    lastActive: customer.lastVisit?.split('T')[0] || 'N/A'
  }))

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'Platinum': 
        return { 
          bg: 'bg-gradient-to-r from-slate-800 to-slate-950 text-white shadow-xs', 
          border: 'border-slate-700',
          icon: <Award size={10} className="text-amber-300" /> 
        }
      case 'Gold': 
        return { 
          bg: 'bg-amber-50 text-amber-800 border-amber-200', 
          border: 'border-amber-200',
          icon: <Star size={10} className="text-amber-500 fill-amber-500" /> 
        }
      case 'Silver': 
        return { 
          bg: 'bg-slate-100 text-slate-700 border-slate-200', 
          border: 'border-slate-200',
          icon: <Star size={10} className="text-slate-500" /> 
        }
      default: 
        return { 
          bg: 'bg-orange-50 text-orange-800 border-orange-200', 
          border: 'border-orange-200',
          icon: <Award size={10} className="text-orange-600" /> 
        }
    }
  }

  const filteredMembers = members.filter(member => {
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery)
    const matchesTier = tierFilter === 'all' || member.tier === tierFilter
    return matchesSearch && matchesTier
  })

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const summary = {
    totalMembers: members.length,
    totalPoints: members.reduce((sum, m) => sum + m.points, 0),
    avgPoints: members.length > 0 ? Math.round(members.reduce((sum, m) => sum + m.points, 0) / members.length) : 0,
    activeMembers: members.filter(m => {
      if (!m.lastActive || m.lastActive === 'N/A') return false
      const lastActiveDate = new Date(m.lastActive)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return lastActiveDate > thirtyDaysAgo
    }).length
  }

  const formatDate = (date) => {
    if (!date || date === 'N/A') return 'N/A'
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const handleRowClick = (member) => {
    const originalCustomer = customers.find(c => (c.user?.id === member.id || c.id === member.id))
    if (originalCustomer && setSelectedCustomer) {
      setSelectedCustomer(originalCustomer)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full p-8 flex flex-col items-center justify-center min-h-[480px]">
        <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm font-semibold text-gray-700">Loading VIP Membership Directory...</p>
        <p className="text-xs text-gray-400 mt-1">Retrieving shopper point scores &amp; tier badges</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs h-full flex flex-col justify-between overflow-hidden">
      {/* Top Header & Filters */}
      <div>
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">VIP Member Directory</h3>
                  <span className="text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-100 px-2.5 py-0.5 rounded-full">
                    {filteredMembers.length} enrolled
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Click any member to inspect real-time points ledger and balances</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 active:scale-95 rounded-xl border border-gray-200/80 transition-all shadow-2xs"
                title="Export member list"
              >
                <Download size={14} />
              </button>
            </div>
          </div>

          {/* Search Bar & Tier Filter Pills */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search member by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Tier Filters Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'Platinum', 'Gold', 'Silver', 'Bronze'].map(tier => {
                const isActive = tierFilter === tier
                return (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setTierFilter(tier)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive 
                        ? 'bg-primary-600 text-white shadow-xs' 
                        : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70'
                    }`}
                  >
                    {tier === 'all' ? 'All Tiers' : tier}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Summary Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 sm:p-4 bg-gray-50/60 border-b border-gray-100 text-center">
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Enrolled</p>
            <p className="text-base font-extrabold text-gray-900 mt-0.5">{summary.totalMembers}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Points Pool</p>
            <p className="text-base font-extrabold text-emerald-700 mt-0.5">{summary.totalPoints.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary-600">Avg Points</p>
            <p className="text-base font-extrabold text-primary-700 mt-0.5">{summary.avgPoints.toLocaleString()}</p>
          </div>
          <div className="bg-white p-2.5 rounded-2xl border border-gray-200/60 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Active (30d)</p>
            <p className="text-base font-extrabold text-purple-700 mt-0.5">{summary.activeMembers}</p>
          </div>
        </div>

        {/* Member Table */}
        {members.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-3xl bg-gray-100 text-gray-300 flex items-center justify-center mx-auto mb-3">
              <Users size={28} />
            </div>
            <h4 className="text-sm font-bold text-gray-800">No VIP Members Found</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Customers who make purchases at your store will automatically earn points and appear here.
            </p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="p-12 text-center">
            <Search size={28} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-bold text-gray-700">No members match your search criteria</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing your filters or searching with a different term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/40 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="py-3 px-4">Member Info</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Points Balance</th>
                  <th className="py-3 px-4">Tier Status</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {paginatedMembers.map((member) => {
                  const tierBadge = getTierBadge(member.tier)
                  const isSelected = selectedCustomer?.user?.id === member.id || selectedCustomer?.id === member.id

                  return (
                    <tr
                      key={member.id}
                      onClick={() => handleRowClick(member)}
                      onMouseEnter={() => setHoveredRow(member.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-primary-50/70 font-medium' 
                          : hoveredRow === member.id 
                            ? 'bg-gray-50/70' 
                            : 'hover:bg-gray-50/40'
                      }`}
                    >
                      {/* Member Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                            isSelected 
                              ? 'bg-primary-600 text-white shadow-xs' 
                              : 'bg-primary-50 text-primary-700 border border-primary-100'
                          }`}>
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">{member.name}</p>
                            <span className="text-[10px] text-gray-400">UID #{member.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                            <Mail size={11} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[130px]">{member.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                            <Phone size={11} className="text-gray-400 shrink-0" />
                            <span>{member.phone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Points Balance */}
                      <td className="py-3.5 px-4">
                        <span className="text-sm font-extrabold text-primary-600">
                          {member.points.toLocaleString()} <span className="text-[10px] font-semibold text-gray-400">pts</span>
                        </span>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${tierBadge.bg} ${tierBadge.border}`}>
                          {tierBadge.icon}
                          {member.tier}
                        </span>
                      </td>

                      {/* Spent */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-bold text-gray-900">
                          ₹{member.totalSpent.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-700">
                          {member.orders} visits
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRowClick(member)
                          }}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-all ${
                            isSelected
                              ? 'bg-primary-600 text-white'
                              : 'text-primary-600 bg-primary-50 hover:bg-primary-100'
                          }`}
                        >
                          {isSelected ? 'Viewing' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-800">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold text-gray-800">{Math.min(currentPage * itemsPerPage, filteredMembers.length)}</span> of <span className="font-bold text-gray-800">{filteredMembers.length}</span> members
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-xs font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-700">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent rounded-xl transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}