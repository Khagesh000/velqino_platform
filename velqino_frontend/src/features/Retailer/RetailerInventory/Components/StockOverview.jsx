"use client"

import React, { useState, useEffect } from 'react'
import { Package, AlertCircle, TrendingUp, TrendingDown, Truck, Clock, RefreshCw } from '../../../../utils/icons'
import '../../../../styles/Retailer/RetailerInventory/StockOverview.scss'

export default function StockOverview({ refreshTrigger }) {
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const stockStats = [
    {
      id: 'total',
      title: 'Total Products',
      value: '2,450',
      change: '+12%',
      trend: 'up',
      icon: <Package size={20} />,
      color: 'primary',
      description: 'Active products in inventory'
    },
    {
      id: 'low',
      title: 'Low Stock',
      value: '23',
      change: '-5',
      trend: 'down',
      icon: <AlertCircle size={20} />,
      color: 'warning',
      description: 'Below reorder level'
    },
    {
      id: 'out',
      title: 'Out of Stock',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: <Package size={20} />,
      color: 'error',
      description: 'Need immediate restock'
    },
    {
      id: 'incoming',
      title: 'Incoming Stock',
      value: '450',
      change: '+150',
      trend: 'up',
      icon: <Truck size={20} />,
      color: 'success',
      description: 'Expected in 7 days'
    },
  ]

  const getColorClasses = (color) => {
    const colors = {
      primary: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-100' },
      warning: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
      error: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
      success: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
    }
    return colors[color] || colors.primary
  }

  return (
    <div className="stock-overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stockStats.map((stat, index) => {
          const colors = getColorClasses(stat.color)
          return (
            <div
              key={stat.id}
              className={`stock-card bg-white rounded-xl p-4 border ${colors.border} shadow-sm transition-all duration-300 ${
                hoveredCard === stat.id ? 'transform -translate-y-1 shadow-lg' : ''
              }`}
              onMouseEnter={() => setHoveredCard(stat.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm font-medium text-gray-700 mt-1">{stat.title}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}