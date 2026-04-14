"use client"

import React, { useState, useEffect } from 'react'
import { Users, UserPlus, TrendingUp, Star, MessageCircle, Phone, Mail, MoreHorizontal, Eye, Award } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerDashboard/CustomerActivity.scss'

export default function CustomerActivity() {
  const [mounted, setMounted] = useState(false)
  const [hoveredCustomer, setHoveredCustomer] = useState(null)
  const [timeFilter, setTimeFilter] = useState('today')

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const customers = [
    { id: 1, name: 'Rajesh Kumar', type: 'repeat', visits: 12, lastVisit: 'Today, 10:30 AM', amount: 2450, phone: '+91 98765 43210', email: 'rajesh@example.com', status: 'active', avatar: 'RK' },
    { id: 2, name: 'Priya Sharma', type: 'new', visits: 1, lastVisit: 'Today, 10:15 AM', amount: 1890, phone: '+91 87654 32109', email: 'priya@example.com', status: 'active', avatar: 'PS' },
    { id: 3, name: 'Amit Singh', type: 'repeat', visits: 8, lastVisit: 'Today, 09:45 AM', amount: 5670, phone: '+91 76543 21098', email: 'amit@example.com', status: 'active', avatar: 'AS' },
    { id: 4, name: 'Sneha Reddy', type: 'walk-in', visits: 3, lastVisit: 'Today, 09:20 AM', amount: 899, phone: '+91 65432 10987', email: 'sneha@example.com', status: 'new', avatar: 'SR' },
    { id: 5, name: 'Vikram Mehta', type: 'repeat', visits: 25, lastVisit: 'Yesterday', amount: 3420, phone: '+91 54321 09876', email: 'vikram@example.com', status: 'vip', avatar: 'VM' },
  ]

  const filteredCustomers = timeFilter === 'all' ? customers : customers.filter(c => {
    if (timeFilter === 'today') return c.lastVisit.includes('Today')
    if (timeFilter === 'repeat') return c.type === 'repeat'
    if (timeFilter === 'new') return c.type === 'new'
    return true
  })

  const getTypeIcon = (type) => {
    switch(type) {
      case 'repeat': return <Star size={12} className="text-yellow-500" />
      case 'new': return <UserPlus size={12} className="text-green-500" />
      case 'walk-in': return <Users size={12} className="text-blue-500" />
      default: return null
    }
  }

  const getTypeBadge = (type) => {
    switch(type) {
      case 'repeat': return 'bg-yellow-100 text-yellow-700'
      case 'new': return 'bg-green-100 text-green-700'
      case 'walk-in': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const newCustomers = customers.filter(c => c.type === 'new').length
  const repeatCustomers = customers.filter(c => c.type === 'repeat').length
  const totalVisits = customers.reduce((sum, c) => sum + c.visits, 0)

  return (
    <div className="customer-activity bg-white rounded-xl p-5 shadow-sm border border-gray-100 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Users size={18} className="text-primary-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Customer Activity</h3>
            <p className="text-xs text-gray-500 mt-0.5">Recent customers & engagement</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${timeFilter === 'today' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setTimeFilter('today')}
            >
              Today
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${timeFilter === 'repeat' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setTimeFilter('repeat')}
            >
              Repeat
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${timeFilter === 'new' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setTimeFilter('new')}
            >
              New
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${timeFilter === 'all' ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              onClick={() => setTimeFilter('all')}
            >
              All
            </button>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-green-50 rounded-xl p-3 transition-all hover:shadow-md">
          <p className="text-[11px] text-green-600 font-medium mb-1">New Customers</p>
          <p className="text-xl font-bold text-green-700">{newCustomers}</p>
          <p className="text-[10px] text-green-500 mt-0.5">+2 vs yesterday</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3 transition-all hover:shadow-md">
          <p className="text-[11px] text-yellow-600 font-medium mb-1">Repeat Visitors</p>
          <p className="text-xl font-bold text-yellow-700">{repeatCustomers}</p>
          <p className="text-[10px] text-yellow-500 mt-0.5">+15% loyalty</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-3 transition-all hover:shadow-md">
          <p className="text-[11px] text-blue-600 font-medium mb-1">Total Visits</p>
          <p className="text-xl font-bold text-blue-700">{totalVisits}</p>
          <p className="text-[10px] text-blue-500 mt-0.5">This week</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-3 transition-all hover:shadow-md">
          <p className="text-[11px] text-purple-600 font-medium mb-1">Avg. Spend</p>
          <p className="text-lg font-bold text-purple-700">₹2,890</p>
          <p className="text-[10px] text-purple-500 mt-0.5">Per customer</p>
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1 custom-scroll">
        {filteredCustomers.map((customer, index) => (
          <div
            key={customer.id}
            className={`customer-item p-3 rounded-xl transition-all duration-200 border border-gray-100 hover:border-primary-200 ${
              hoveredCustomer === customer.id ? 'bg-primary-50/30 border-primary-200 shadow-sm' : 'bg-white'
            }`}
            onMouseEnter={() => setHoveredCustomer(customer.id)}
            onMouseLeave={() => setHoveredCustomer(null)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                customer.status === 'vip' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' : 'bg-primary-100 text-primary-700'
              }`}>
                {customer.avatar}
              </div>

              {/* Customer Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900">{customer.name}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getTypeBadge(customer.type)} flex items-center gap-0.5`}>
                      {getTypeIcon(customer.type)}
                      <span>{customer.type}</span>
                    </span>
                    {customer.status === 'vip' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 flex items-center gap-0.5">
                        <Award size={10} />
                        <span>VIP</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{customer.visits} visits</span>
                    <span>•</span>
                    <span>₹{customer.amount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <Phone size={10} className="text-gray-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail size={10} className="text-gray-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={10} className="text-gray-400" />
                    <span>Last: {customer.lastVisit}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all text-xs flex items-center gap-1">
                    <MessageCircle size={12} />
                    <span className="hidden sm:inline">Message</span>
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all text-xs flex items-center gap-1">
                    <Phone size={12} />
                    <span className="hidden sm:inline">Call</span>
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                    <Eye size={12} />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-1 flex-shrink-0">
                <button className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all" title="Add to Loyalty">
                  <Star size={14} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Create Order">
                  <TrendingUp size={14} />
                </button>
              </div>
            </div>

            {/* Recent Purchase Indicator */}
            {customer.lastVisit.includes('Today') && (
              <div className="mt-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-600">Active today</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <button className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-all flex items-center gap-1">
          View All Customers
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <TrendingUp size={12} className="text-green-500" />
          <span className="text-[10px] text-gray-500">+8 new this week</span>
        </div>
      </div>
    </div>
  )
}