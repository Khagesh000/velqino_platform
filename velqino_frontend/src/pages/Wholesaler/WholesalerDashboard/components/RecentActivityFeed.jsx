"use client"

import React, { useState } from 'react'
import { Bell, Package, Wallet, MessageCircle, ShoppingBag, ChevronRight, Clock } from 'lucide-react'
import '../../../../styles/Wholesaler/WholesalerDashboard/RecentActivityFeed.scss'

export default function RecentActivityFeed() {
  const [hoveredItem, setHoveredItem] = useState(null)

  const activities = [
    { id: 1, type: 'order', message: 'New order received #12345', time: '2 min ago', amount: '₹4,500', status: 'pending', icon: <Package size={16} />, color: 'primary' },
    { id: 2, type: 'payment', message: 'Payment received from John Doe', time: '15 min ago', amount: '₹2,800', status: 'completed', icon: <Wallet size={16} />, color: 'success' },
    { id: 3, type: 'inquiry', message: 'New customer inquiry about bulk order', time: '1 hour ago', amount: null, status: 'new', icon: <MessageCircle size={16} />, color: 'accent' },
    { id: 4, type: 'order', message: 'Order #12342 marked as processing', time: '3 hours ago', amount: '₹1,200', status: 'processing', icon: <Package size={16} />, color: 'primary' },
    { id: 5, type: 'payment', message: 'Withdrawal request processed', time: '5 hours ago', amount: '₹15,000', status: 'completed', icon: <Wallet size={16} />, color: 'success' },
    { id: 6, type: 'inquiry', message: 'Price quote requested for bulk items', time: 'Yesterday', amount: null, status: 'responded', icon: <MessageCircle size={16} />, color: 'accent' },
    { id: 7, type: 'order', message: 'Order #12339 delivered successfully', time: 'Yesterday', amount: '₹4,800', status: 'delivered', icon: <ShoppingBag size={16} />, color: 'success' },
    { id: 8, type: 'alert', message: 'Low stock alert: Wireless Headphones', time: 'Yesterday', amount: null, status: 'urgent', icon: <Bell size={16} />, color: 'warning' }
  ]

  const getActivityIcon = (activity) => {
    return (
      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        activity.color === 'primary' ? 'bg-primary-100 text-primary-600' :
        activity.color === 'success' ? 'bg-success-100 text-success-600' :
        activity.color === 'accent' ? 'bg-accent-100 text-accent-600' :
        'bg-warning-100 text-warning-600'
      }`}>
        {activity.icon}
      </div>
    )
  }

  const getStatusDot = (status) => {
    switch(status) {
      case 'pending': return 'bg-warning-500'
      case 'processing': return 'bg-primary-500'
      case 'delivered': return 'bg-success-500'
      case 'completed': return 'bg-success-500'
      case 'new': return 'bg-accent-500'
      case 'responded': return 'bg-secondary-500'
      case 'urgent': return 'bg-error-500'
      default: return 'bg-tertiary'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-accent-100 flex items-center justify-center text-accent-600">
            <Bell size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Recent Activity</h3>
            <p className="text-xs lg:text-sm text-tertiary">Live updates from your store</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-1 bg-primary-100 text-primary-600 rounded-full text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse" />
            <span>8 new</span>
          </span>
        </div>
      </div>

      {/* Activity Feed */}
     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`group relative flex items-start gap-3 p-3 lg:p-4 bg-surface-1 rounded-xl border border-light transition-all hover:shadow-md ${
              hoveredItem === activity.id ? 'scale-[1.01]' : ''
            }`}
            onMouseEnter={() => setHoveredItem(activity.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {/* Status Indicator Line */}
            <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
              activity.color === 'primary' ? 'bg-primary-500' :
              activity.color === 'success' ? 'bg-success-500' :
              activity.color === 'accent' ? 'bg-accent-500' :
              'bg-warning-500'
            }`} />

            {/* Icon */}
            <div className="relative">
              {getActivityIcon(activity)}
              <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusDot(activity.status)}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs lg:text-sm font-medium text-primary line-clamp-1">
                  {activity.message}
                </p>
                {activity.amount && (
                  <span className="text-xs lg:text-sm font-semibold text-primary whitespace-nowrap">
                    {activity.amount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-tertiary">
                  <Clock size={12} className="lg:w-3 lg:h-3" />
                  <span className="text-xs text-tertiary">{activity.time}</span>
                </div>
                <span className="w-1 h-1 rounded-full bg-border-light" />
                <span className={`text-xs capitalize ${
                  activity.status === 'urgent' ? 'text-error-600 font-medium' : 'text-secondary'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-white rounded-lg">
              <ChevronRight size={16} className="text-tertiary group-hover:text-primary-600" />
            </button>

            {/* Hover Glow */}
            {hoveredItem === activity.id && (
              <div className={`absolute inset-0 rounded-xl opacity-5 blur-lg pointer-events-none ${
                activity.color === 'primary' ? 'bg-primary-500' :
                activity.color === 'success' ? 'bg-success-500' :
                activity.color === 'accent' ? 'bg-accent-500' :
                'bg-warning-500'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="flex items-center justify-between mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-light">
        <div className="flex items-center gap-3 text-xs text-tertiary">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            New orders
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
            Payments
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
            Inquiries
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs lg:text-sm text-primary-600 hover:text-primary-700 transition-all hover:gap-2">
          <span>View all</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}