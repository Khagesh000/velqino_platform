"use client"

import React, { useState, useEffect } from 'react'
import { Users, Search, Filter, ChevronLeft, ChevronRight, Phone, Mail, Calendar, TrendingUp, Star, Award } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerCustomers/CustomersList.scss'

export default function CustomersList({ selectedCustomer, setSelectedCustomer, refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTier, setFilterTier] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 8

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const customers = [
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@example.com', visits: 12, totalSpent: 45890, lastVisit: '2026-04-14', tier: 'Gold', points: 1250, status: 'active' },
    { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya@example.com', visits: 5, totalSpent: 18900, lastVisit: '2026-04-14', tier: 'Silver', points: 450, status: 'active' },
    { id: 3, name: 'Amit Singh', phone: '+91 76543 21098', email: 'amit@example.com', visits: 15, totalSpent: 56780, lastVisit: '2026-04-13', tier: 'Gold', points: 890, status: 'active' },
    { id: 4, name: 'Sneha Reddy', phone: '+91 65432 10987', email: 'sneha@example.com', visits: 3, totalSpent: 8900, lastVisit: '2026-04-13', tier: 'Silver', points: 230, status: 'active' },
    { id: 5, name: 'Vikram Mehta', phone: '+91 54321 09876', email: 'vikram@example.com', visits: 25, totalSpent: 78200, lastVisit: '2026-04-12', tier: 'Platinum', points: 2250, status: 'vip' },
    { id: 6, name: 'Neha Gupta', phone: '+91 43210 98765', email: 'neha@example.com', visits: 8, totalSpent: 23450, lastVisit: '2026-04-12', tier: 'Gold', points: 670, status: 'active' },
    { id: 7, name: 'Rahul Verma', phone: '+91 32109 87654', email: 'rahul@example.com', visits: 2, totalSpent: 3450, lastVisit: '2026-04-11', tier: 'Bronze', points: 80, status: 'new' },
    { id: 8, name: 'Meera Joshi', phone: '+91 21098 76543', email: 'meera@example.com', visits: 18, totalSpent: 45600, lastVisit: '2026-04-11', tier: 'Platinum', points: 1890, status: 'vip' },
  ]

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'Platinum': return { bg: 'bg-gradient-to-r from-gray-400 to-gray-600', text: 'text-white', icon: <Award size={10} /> }
      case 'Gold': return { bg: 'bg-yellow-500', text: 'text-white', icon: <Star size={10} /> }
      case 'Silver': return { bg: 'bg-gray-400', text: 'text-white', icon: <Star size={10} /> }
      case 'Bronze': return { bg: 'bg-orange-600', text: 'text-white', icon: <Star size={10} /> }
      default: return { bg: 'bg-gray-200', text: 'text-gray-700', icon: null }
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchQuery === '' || 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTier = filterTier === 'all' || customer.tier === filterTier
    return matchesSearch && matchesTier
  })

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  const tiers = ['all', 'Platinum', 'Gold', 'Silver', 'Bronze']

  return (
    <div className="customers-list-container bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Customers List</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredCustomers.length} customers
            </span>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-40 focus:outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            >
              {tiers.map(tier => (
                <option key={tier} value={tier}>{tier === 'all' ? 'All Tiers' : tier}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Last Visit</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedCustomers.map((customer, index) => {
              const tierBadge = getTierBadge(customer.tier)
              return (
                <tr
                  key={customer.id}
                  className={`customer-row cursor-pointer transition-all ${selectedCustomer?.id === customer.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedCustomer(customer)}
                  onMouseEnter={() => setHoveredRow(customer.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">{customer.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">ID: #{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Phone size={10} className="text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail size={10} className="text-gray-400" />
                        <span className="truncate max-w-[120px]">{customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{customer.visits}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">₹{customer.totalSpent.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(customer.lastVisit)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tierBadge.bg} ${tierBadge.text}`}>
                      {tierBadge.icon}
                      {customer.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-primary-600">{customer.points}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
                      <TrendingUp size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} customers
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}