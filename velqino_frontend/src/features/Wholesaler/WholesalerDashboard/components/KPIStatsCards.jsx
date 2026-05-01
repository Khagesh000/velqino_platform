"use client"

import React, { useState, useEffect } from 'react'
import '../../../../styles/Wholesaler/WholesalerDashboard/KPIstatscards.scss'
import { TrendingUp,  Package,  Wallet, Clock,  MoreHorizontal, ArrowUpRight, ArrowDownRight, Info } from '../../../../utils/icons';
import { useGetWholesalerStatsQuery } from '../../../../redux/wholesaler/slices/statsSlice';

export default function KPIStatsCards() {
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [showTooltip, setShowTooltip] = useState(null)
  const { data: statsData, isLoading, error } = useGetWholesalerStatsQuery()
  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

    const stats = statsData?.data || {}

    const statsDataList = [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: `₹${stats.total_revenue?.toLocaleString() || '0'}`,
        change: `${stats.revenue_change >= 0 ? '+' : ''}${stats.revenue_change || 0}%`,
        trend: stats.revenue_trend || 'up',
        icon: <TrendingUp size={24} />,
        color: 'primary',
        tooltip: 'Revenue from delivered orders'
      },
      {
        id: 'pending',
        title: 'Pending Orders',
        value: stats.pending_orders || 0,
        change: `${stats.pending_change >= 0 ? '+' : ''}${stats.pending_change || 0}`,
        trend: stats.pending_change >= 0 ? 'up' : 'down',
        icon: <Clock size={24} />,
        color: 'warning',
        tooltip: 'Orders awaiting processing'
      },
      {
        id: 'products',
        title: 'Products Listed',
        value: stats.total_products || 0,
        change: `${stats.products_change >= 0 ? '+' : ''}${stats.products_change || 0}`,
        trend: stats.products_change >= 0 ? 'up' : 'down',
        icon: <Package size={24} />,
        color: 'success',
        tooltip: 'Active products in your catalog'
      },
      {
        id: 'customers',
        title: 'Total Customers',
        value: stats.total_customers || 0,
        change: `${stats.customers_change >= 0 ? '+' : ''}${stats.customers_change || 0}`,
        trend: stats.customers_change >= 0 ? 'up' : 'down',
        icon: <Wallet size={24} />,
        color: 'accent',
        tooltip: 'Unique retailers who bought from you'
      }
    ]

  

  return (
    <div className="p-4 lg:p-6">
  {/* Section Header */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
  {/* Left Section */}
  <div className="w-full text-center sm:text-left">
  <h2 className="text-2xl sm:text-xl lg:text-2xl font-bold text-gray-900">
    Dashboard Overview
</h2>
  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
    Welcome back! Here's your business performance
  </p>
</div>

  {/* Right Section */}
  <div className="flex items-center gap-2 sm:gap-3">
    <span className="text-[10px] sm:text-xs text-tertiary bg-secondary-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap">
      Last updated: Today 10:30 AM
    </span>
    <button className="p-1.5 sm:p-2 hover:bg-secondary-100 rounded-lg transition-fast flex-shrink-0">
      <MoreHorizontal size={16} className="sm:w-[18px] sm:h-[18px] text-tertiary" />
    </button>
  </div>
</div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsDataList.map((stat) => (
        <div
          key={stat.id}
          className={`
            group relative overflow-hidden rounded-2xl p-6 cursor-pointer
            transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl
            ${stat.color === 'primary' ? 'bg-gradient-to-br from-primary-50 to-white border border-primary-200 hover:shadow-primary-100/50' : ''}
            ${stat.color === 'warning' ? 'bg-gradient-to-br from-warning-50 to-white border border-warning-200 hover:shadow-warning-100/50' : ''}
            ${stat.color === 'success' ? 'bg-gradient-to-br from-success-50 to-white border border-success-200 hover:shadow-success-100/50' : ''}
            ${stat.color === 'accent' ? 'bg-gradient-to-br from-accent-50 to-white border border-accent-200 hover:shadow-accent-100/50' : ''}
          `}
          onMouseEnter={() => setHoveredCard(stat.id)}
          onMouseLeave={() => setHoveredCard(null)}
          role="button"
          tabIndex={0}
          onClick={() => console.log(`Navigate to ${stat.id}`)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              console.log(`Navigate to ${stat.id}`)
            }
          }}
        >
          {/* Header with Icon */}
          <div className="flex items-start justify-between mb-4">
            <div className={`
              p-3 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
              ${stat.color === 'primary' ? 'bg-primary-500 text-white shadow-lg shadow-primary-200' : ''}
              ${stat.color === 'warning' ? 'bg-warning-500 text-white shadow-lg shadow-warning-200' : ''}
              ${stat.color === 'success' ? 'bg-success-500 text-white shadow-lg shadow-success-200' : ''}
              ${stat.color === 'accent' ? 'bg-accent-500 text-white shadow-lg shadow-accent-200' : ''}
            `}>
              {stat.icon}
            </div>
            
            <div className="flex items-center gap-2">
              {stat.urgent && (
                <span className="px-2 py-1 bg-error-100 text-error-600 text-xs font-semibold rounded-full animate-pulse">
                  {stat.urgent} urgent
                </span>
              )}
              
              {/* Info Button */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowTooltip(showTooltip === stat.id ? null : stat.id)
                  }}
                  className="p-1 hover:bg-surface-2 rounded-full transition-fast"
                >
                  <Info size={16} className="text-tertiary" />
                </button>
                
                {showTooltip === stat.id && (
                  <div className="absolute right-0 top-8 w-48 bg-white border border-medium rounded-xl shadow-xl p-3 z-10 animate-fadeIn">
                    <p className="text-xs text-secondary">{stat.tooltip}</p>
                    <div className="absolute -top-1 right-3 w-2 h-2 bg-white border-t border-l border-medium transform rotate-45" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs sm:text-sm text-secondary mb-1 font-medium">{stat.title}</p>
            <div className="flex items-end gap-1 sm:gap-2 mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary tracking-tight">
                {stat.value}
              </span>
              <div className={`
                flex items-center gap-0.5 sm:gap-1 mb-1
                ${stat.trend === 'up' ? 'text-success-600' : 'text-error-600'}
              `}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={14} className="sm:w-[18px] sm:h-[18px] animate-bounce-x" />
                ) : (
                  <ArrowDownRight size={14} className="sm:w-[18px] sm:h-[18px] animate-bounce-x" />
                )}
                <span className="text-xs sm:text-sm font-semibold">{stat.change}</span>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-tertiary flex items-center gap-1">
              <span className="inline-block w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-tertiary/50" />
              {stat.period}
            </p>
          </div>

          {/* Progress Bar for Pending Orders */}
          {stat.id === 'pending' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-2 overflow-hidden">
              <div 
                className="h-full bg-warning-500 transition-all duration-1000"
                style={{ width: hoveredCard === stat.id ? '75%' : '60%' }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
</div>
  )
}