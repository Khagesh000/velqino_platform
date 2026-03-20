"use client"

import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Percent,
  Star,
  Users,
  ArrowUp,
  ArrowDown,
  MoreVertical
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/AnalyticsReports/OverviewCards.scss'

export default function OverviewCards({ dateRange, customDate, isLoading = false }) {
  const [metrics, setMetrics] = useState({
    totalRevenue: { value: 0, change: 0, trend: 'up' },
    totalOrders: { value: 0, change: 0, trend: 'up' },
    avgOrderValue: { value: 0, change: 0, trend: 'up' },
    conversionRate: { value: 0, change: 0, trend: 'down' },
    topProduct: { value: 'Loading...', change: 0, trend: 'up' },
    newCustomers: { value: 0, change: 0, trend: 'up' }
  })

  // Simulate data loading
  useEffect(() => {
    if (!isLoading) {
      setMetrics({
        totalRevenue: { value: 1245750, change: 12.5, trend: 'up' },
        totalOrders: { value: 345, change: 8.2, trend: 'up' },
        avgOrderValue: { value: 3610, change: 3.8, trend: 'up' },
        conversionRate: { value: 3.2, change: 0.5, trend: 'down' },
        topProduct: { value: 'Wireless Headphones', change: 23, trend: 'up' },
        newCustomers: { value: 89, change: 15.3, trend: 'up' }
      })
    }
  }, [isLoading, dateRange, customDate])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value)
  }

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
  }

  const getTrendColor = (trend, isPositive = true) => {
    if (trend === 'up') return isPositive ? 'text-success-600' : 'text-error-600'
    return isPositive ? 'text-error-600' : 'text-success-600'
  }

  const cards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue.value),
      change: metrics.totalRevenue.change,
      trend: metrics.totalRevenue.trend,
      icon: DollarSign,
      color: 'primary',
      period: 'vs last period'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: formatNumber(metrics.totalOrders.value),
      change: metrics.totalOrders.change,
      trend: metrics.totalOrders.trend,
      icon: ShoppingBag,
      color: 'success',
      period: 'vs last period'
    },
    {
      id: 'avgOrder',
      title: 'Avg Order Value',
      value: formatCurrency(metrics.avgOrderValue.value),
      change: metrics.avgOrderValue.change,
      trend: metrics.avgOrderValue.trend,
      icon: TrendingUp,
      color: 'info',
      period: 'vs last period'
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: `${metrics.conversionRate.value}%`,
      change: metrics.conversionRate.change,
      trend: metrics.conversionRate.trend,
      icon: Percent,
      color: 'warning',
      period: 'vs last period',
      invertTrend: true // Lower conversion rate is bad
    },
    {
      id: 'topProduct',
      title: 'Top Product',
      value: metrics.topProduct.value,
      change: metrics.topProduct.change,
      trend: metrics.topProduct.trend,
      icon: Star,
      color: 'purple',
      period: 'sales increase'
    },
    {
      id: 'customers',
      title: 'New Customers',
      value: formatNumber(metrics.newCustomers.value),
      change: metrics.newCustomers.change,
      trend: metrics.newCustomers.trend,
      icon: Users,
      color: 'indigo',
      period: 'vs last period'
    }
  ]

  const getCardColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-primary-50',
        text: 'text-primary-700',
        icon: 'text-primary-500',
        border: 'border-primary-200',
        hover: 'hover:border-primary-300'
      },
      success: {
        bg: 'bg-success-50',
        text: 'text-success-700',
        icon: 'text-success-500',
        border: 'border-success-200',
        hover: 'hover:border-success-300'
      },
      info: {
        bg: 'bg-info-50',
        text: 'text-info-700',
        icon: 'text-info-500',
        border: 'border-info-200',
        hover: 'hover:border-info-300'
      },
      warning: {
        bg: 'bg-warning-50',
        text: 'text-warning-700',
        icon: 'text-warning-500',
        border: 'border-warning-200',
        hover: 'hover:border-warning-300'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        icon: 'text-purple-500',
        border: 'border-purple-200',
        hover: 'hover:border-purple-300'
      },
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        icon: 'text-indigo-500',
        border: 'border-indigo-200',
        hover: 'hover:border-indigo-300'
      }
    }
    return colors[color] || colors.primary
  }

  if (isLoading) {
    return (
      <div className="overview-cards-loading">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[140px] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overview-cards">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon
          const colors = getCardColorClasses(card.color)
          const isPositive = card.trend === 'up'
          const trendColor = getTrendColor(card.trend, card.invertTrend ? !isPositive : isPositive)

          return (
            <div
              key={card.id}
              className={`overview-card relative bg-white rounded-xl border-2 ${colors.border} ${colors.hover} p-4 transition-all group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.icon}`}>
                  <Icon size={20} />
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </div>

              {/* Value */}
              <div className="mb-2">
                <h4 className="text-2xl font-bold text-gray-900">
                  {card.value}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{card.title}</p>
              </div>

              {/* Change Indicator */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
                  {getTrendIcon(card.trend)}
                  <span>{card.change}%</span>
                </div>
                <span className="text-xs text-gray-400">{card.period}</span>
              </div>

              {/* Sparkline (decorative) */}
              <div className="absolute bottom-4 right-4 opacity-20">
                {card.trend === 'up' ? '📈' : '📉'}
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 blur-xl pointer-events-none transition-opacity ${colors.bg}`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}