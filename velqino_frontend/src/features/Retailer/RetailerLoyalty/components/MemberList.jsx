"use client"

import React, { useState, useEffect } from 'react'
import { Users, Search, Filter, ChevronLeft, ChevronRight, Star, Award, Eye, Edit, Mail, Phone, TrendingUp, Calendar, Download } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerLoyalty/MemberList.scss'

export default function MemberList({ refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [hoveredRow, setHoveredRow] = useState(null)
  const itemsPerPage = 5

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const members = [
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210', points: 1250, tier: 'Gold', totalSpent: 45890, orders: 12, joined: '2025-01-15', lastActive: '2026-04-14' },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 87654 32109', points: 450, tier: 'Silver', totalSpent: 18900, orders: 5, joined: '2025-03-10', lastActive: '2026-04-14' },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', phone: '+91 76543 21098', points: 890, tier: 'Gold', totalSpent: 56780, orders: 15, joined: '2024-12-20', lastActive: '2026-04-13' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 65432 10987', points: 230, tier: 'Silver', totalSpent: 8900, orders: 3, joined: '2025-06-05', lastActive: '2026-04-13' },
    { id: 5, name: 'Vikram Mehta', email: 'vikram@example.com', phone: '+91 54321 09876', points: 2250, tier: 'Platinum', totalSpent: 78200, orders: 25, joined: '2024-08-12', lastActive: '2026-04-12' },
    { id: 6, name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 43210 98765', points: 670, tier: 'Gold', totalSpent: 23450, orders: 8, joined: '2025-02-18', lastActive: '2026-04-12' },
    { id: 7, name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 32109 87654', points: 80, tier: 'Bronze', totalSpent: 3450, orders: 2, joined: '2025-09-22', lastActive: '2026-04-11' },
    { id: 8, name: 'Meera Joshi', email: 'meera@example.com', phone: '+91 21098 76543', points: 1890, tier: 'Platinum', totalSpent: 45600, orders: 18, joined: '2024-10-30', lastActive: '2026-04-11' },
  ]

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'Platinum': return { bg: 'bg-gradient-to-r from-gray-400 to-gray-600', text: 'text-white', icon: <Award size={10} /> }
      case 'Gold': return { bg: 'bg-yellow-500', text: 'text-white', icon: <Star size={10} /> }
      case 'Silver': return { bg: 'bg-gray-400', text: 'text-white', icon: <Star size={10} /> }
      default: return { bg: 'bg-orange-600', text: 'text-white', icon: <Star size={10} /> }
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
    avgPoints: Math.round(members.reduce((sum, m) => sum + m.points, 0) / members.length),
    activeMembers: members.filter(m => new Date(m.lastActive) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="member-list bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Member List</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {filteredMembers.length} members
            </span>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all">
            <Download size={14} />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value="all">All Tiers</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 grid grid-cols-4 gap-2 border-b border-gray-100 bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{summary.totalMembers}</p>
          <p className="text-[10px] text-gray-500">Total Members</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{summary.totalPoints.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Total Points</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">{summary.avgPoints}</p>
          <p className="text-[10px] text-gray-500">Avg Points</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-600">{summary.activeMembers}</p>
          <p className="text-[10px] text-gray-500">Active (30d)</p>
        </div>
      </div>

      {/* Members Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Points</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Spent</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedMembers.map((member, index) => {
              const tierBadge = getTierBadge(member.tier)
              return (
                <tr
                  key={member.id}
                  className={`member-row transition-all ${hoveredRow === member.id ? 'bg-gray-50' : ''}`}
                  onMouseEnter={() => setHoveredRow(member.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-600 font-semibold">{member.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">ID: #{member.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Mail size={10} className="text-gray-400" />
                        <span className="truncate max-w-[120px]">{member.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone size={10} className="text-gray-400" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-primary-600">{member.points}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${tierBadge.bg} ${tierBadge.text}`}>
                      {tierBadge.icon}
                      {member.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">₹{member.totalSpent.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{member.orders}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={10} className="text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(member.joined)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                        <Eye size={14} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-primary-600 rounded-lg">
                        <Edit size={14} />
                      </button>
                    </div>
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
          <p className="text-[10px] text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
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