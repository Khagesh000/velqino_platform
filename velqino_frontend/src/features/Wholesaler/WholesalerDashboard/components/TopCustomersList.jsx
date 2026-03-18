"use client"

import React, { useState } from 'react'
import { Users, Mail, Phone, ChevronRight, Award, TrendingUp } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/TopCustomersList.scss'

export default function TopCustomersList() {
  const [hoveredCustomer, setHoveredCustomer] = useState(null)

  const customers = [
    { id: 1, name: 'ABC Retail Store', contact: 'Rahul Sharma', email: 'rahul@abcretail.com', phone: '+91 98765 4321', orders: 45, spent: '₹12,45,000', type: 'wholesaler', since: '2023', avatar: 'RS', color: 'primary' },
    { id: 2, name: 'XYZ Enterprises', contact: 'Priya Patel', email: 'priya@xyz.com', phone: '+91 98765 4322', orders: 38, spent: '₹9,80,000', type: 'retailer', since: '2023', avatar: 'PP', color: 'success' },
    { id: 3, name: 'City Mart', contact: 'Amit Kumar', email: 'amit@citymart.com', phone: '+91 98765 4323', orders: 32, spent: '₹8,25,000', type: 'retailer', since: '2024', avatar: 'AK', color: 'accent' },
    { id: 4, name: 'Metro Stores', contact: 'Neha Singh', email: 'neha@metro.com', phone: '+91 98765 4324', orders: 28, spent: '₹6,90,000', type: 'wholesaler', since: '2024', avatar: 'NS', color: 'warning' },
    { id: 5, name: 'Star Trading Co.', contact: 'Vikram Mehta', email: 'vikram@startrade.com', phone: '+91 98765 4325', orders: 25, spent: '₹5,75,000', type: 'distributor', since: '2024', avatar: 'VM', color: 'info' }
  ]

  const getAvatarBg = (color) => {
    switch(color) {
      case 'primary': return 'bg-primary-100 text-primary-600'
      case 'success': return 'bg-success-100 text-success-600'
      case 'accent': return 'bg-accent-100 text-accent-600'
      case 'warning': return 'bg-warning-100 text-warning-600'
      case 'info': return 'bg-info-100 text-info-600'
      default: return 'bg-surface-2 text-secondary'
    }
  }

  const getTypeBadge = (type) => {
    switch(type) {
      case 'wholesaler': return 'bg-primary-100 text-primary-600'
      case 'retailer': return 'bg-success-100 text-success-600'
      case 'distributor': return 'bg-accent-100 text-accent-600'
      default: return 'bg-surface-2 text-secondary'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <Users size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Top Customers</h3>
            <p className="text-xs lg:text-sm text-tertiary">Highest purchase value</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-1 bg-accent-100 text-accent-600 rounded-full text-xs">
            <Award size={12} />
            <span>This month</span>
          </span>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className={`group relative bg-surface-1 rounded-xl p-3 lg:p-4 border border-light transition-all hover:shadow-md ${
              hoveredCustomer === customer.id ? 'scale-[1.01]' : ''
            }`}
            onMouseEnter={() => setHoveredCustomer(customer.id)}
            onMouseLeave={() => setHoveredCustomer(null)}
          >
            {/* Rank Badge */}
            <div className="absolute -top-1 -left-1 w-5 h-5 lg:w-6 lg:h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {customer.id}
            </div>

            {/* Customer Info */}
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className={`relative w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${getAvatarBg(customer.color)} flex items-center justify-center font-semibold text-sm lg:text-base flex-shrink-0`}>
                {customer.avatar}
                <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  customer.type === 'wholesaler' ? 'bg-primary-500' :
                  customer.type === 'retailer' ? 'bg-success-500' : 'bg-accent-500'
                }`} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm lg:text-base font-semibold text-primary truncate">{customer.name}</h4>
                    <p className="text-xs text-secondary truncate">{customer.contact}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadge(customer.type)}`}>
                    {customer.type}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-xs text-tertiary">Total spent</p>
                    <p className="text-sm font-semibold text-primary">{customer.spent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-tertiary">Orders</p>
                    <p className="text-sm font-medium text-primary">{customer.orders}</p>
                  </div>
                </div>

                {/* Contact Info - Hidden on Mobile, Shown on Hover */}
                <div className="hidden lg:flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-all">
                  <a href={`mailto:${customer.email}`} className="p-1.5 bg-white rounded-lg border border-light hover:bg-primary-50 transition-all">
                    <Mail size={14} className="text-tertiary group-hover:text-primary-600" />
                  </a>
                  <a href={`tel:${customer.phone}`} className="p-1.5 bg-white rounded-lg border border-light hover:bg-primary-50 transition-all">
                    <Phone size={14} className="text-tertiary group-hover:text-primary-600" />
                  </a>
                  <span className="text-xs text-tertiary ml-auto">Since {customer.since}</span>
                </div>

                {/* Mobile Contact Icons - Always Visible on Mobile */}
                <div className="flex lg:hidden items-center gap-2 mt-2">
                  <a href={`mailto:${customer.email}`} className="p-1.5 bg-white rounded-lg border border-light">
                    <Mail size={12} className="text-tertiary" />
                  </a>
                  <a href={`tel:${customer.phone}`} className="p-1.5 bg-white rounded-lg border border-light">
                    <Phone size={12} className="text-tertiary" />
                  </a>
                  <span className="text-xs text-tertiary ml-auto">Since {customer.since}</span>
                </div>
              </div>
            </div>

            {/* Hover Glow */}
            {hoveredCustomer === customer.id && (
              <div className={`absolute inset-0 rounded-xl opacity-5 blur-lg pointer-events-none ${
                customer.color === 'primary' ? 'bg-primary-500' :
                customer.color === 'success' ? 'bg-success-500' :
                customer.color === 'accent' ? 'bg-accent-500' :
                customer.color === 'warning' ? 'bg-warning-500' : 'bg-info-500'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-light">
        <div className="flex items-center gap-2 text-xs text-tertiary">
          <TrendingUp size={14} className="text-success-500" />
          <span>↑ 23% vs last month</span>
        </div>
        <button className="flex items-center gap-1 text-xs lg:text-sm text-primary-600 hover:text-primary-700 transition-all hover:gap-2">
          <span>View all customers</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}