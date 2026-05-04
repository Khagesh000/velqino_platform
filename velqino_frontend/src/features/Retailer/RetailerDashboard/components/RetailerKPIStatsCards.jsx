"use client"

import React, { useState, useEffect } from 'react'
import '../../../../styles/Retailer/RetailerDashboard/RetailerKPIStatsCards.scss'
import { MoreHorizontal, ArrowUpRight, ArrowDownRight, Info, DollarSign, ShoppingBag, Package, Star } from '../../../../utils/icons';

export default function RetailerKPIStatsCards() {
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [showTooltip, setShowTooltip] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const statsData = [
    {
      id: 'todaySales',
      title: "Today's Sales",
      value: '₹12,450',
      change: '+8.2%',
      trend: 'up',
      period: 'vs yesterday',
      icon: <DollarSign size={22} />
    },
    {
      id: 'pendingOrders',
      title: 'Pending Orders',
      value: '8',
      change: '+2',
      trend: 'up',
      period: 'vs yesterday',
      icon: <ShoppingBag size={22} />,
      urgent: '3'
    },
    {
      id: 'lowStock',
      title: 'Low Stock Items',
      value: '12',
      change: '-3',
      trend: 'down',
      period: 'vs yesterday',
      icon: <Package size={22} />
    },
    {
      id: 'loyaltyPoints',
      title: 'Loyalty Points',
      value: '2,450',
      change: '+450',
      trend: 'up',
      period: 'this month',
      icon: <Star size={22} />
    }
  ]

  return (
    <div className="retailer-kpi-stats animate-fadeInUp">
      <div className="stats-header">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Store Performance</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Real-time overview of your retail store</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Last updated: Today 10:30 AM</span>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-all">
            <MoreHorizontal size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {statsData.map((stat, index) => (
          <div
            key={stat.id}
            className={`stats-card bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-cardAppear delay-${index + 1}`}
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-gray-100 text-gray-600 transition-all duration-300 hover-scale">
                {stat.icon}
              </div>
              
              <div className="flex items-center gap-2">
                {stat.urgent && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full animate-pulse">
                    {stat.urgent} urgent
                  </span>
                )}
                
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowTooltip(showTooltip === stat.id ? null : stat.id)
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <Info size={16} className="text-gray-400" />
                  </button>
                  
                  {showTooltip === stat.id && (
                    <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-10 animate-fadeInUp">
                      <p className="text-xs text-gray-600">{stat.tooltip}</p>
                      <div className="absolute -top-1 right-3 w-2 h-2 bg-white border-t border-l border-gray-200 transform rotate-45" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</span>
                <div className={`flex items-center gap-0.5 mb-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight size={14} className="animate-bounce-x" />
                  ) : (
                    <ArrowDownRight size={14} className="animate-bounce-x" />
                  )}
                  <span className="text-sm font-semibold">{stat.change}</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">{stat.period}</p>
            </div>

            {stat.id === 'pendingOrders' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 overflow-hidden rounded-b-2xl">
                <div 
                  className="h-full bg-orange-500 progress-fill"
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