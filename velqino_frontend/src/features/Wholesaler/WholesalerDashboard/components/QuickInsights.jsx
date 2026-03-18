"use client"

import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, Calendar, DollarSign, ShoppingBag, Users, Package } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/QuickInsights.scss'

export default function QuickInsights() {
  const [hoveredCard, setHoveredCard] = useState(null)

  const insights = [
    {
      id: 1,
      title: 'Total Revenue',
      value: '₹2,45,000',
      previous: '₹2,12,000',
      change: '+15.6%',
      trend: 'up',
      icon: <DollarSign size={20} />,
      color: 'primary',
      comparison: 'vs last week',
      chart: [45, 52, 48, 55, 62, 58, 65]
    },
    {
      id: 2,
      title: 'Total Orders',
      value: '156',
      previous: '142',
      change: '+9.9%',
      trend: 'up',
      icon: <ShoppingBag size={20} />,
      color: 'success',
      comparison: 'vs last week',
      chart: [12, 15, 11, 18, 14, 16, 19]
    },
    {
      id: 3,
      title: 'New Customers',
      value: '28',
      previous: '24',
      change: '+16.7%',
      trend: 'up',
      icon: <Users size={20} />,
      color: 'accent',
      comparison: 'vs last week',
      chart: [3, 5, 4, 6, 5, 7, 8]
    },
    {
      id: 4,
      title: 'Avg. Order Value',
      value: '₹1,570',
      previous: '₹1,490',
      change: '+5.4%',
      trend: 'up',
      icon: <Package size={20} />,
      color: 'info',
      comparison: 'vs last week',
      chart: [1450, 1520, 1480, 1580, 1620, 1550, 1650]
    }
  ]

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <ArrowUpRight size={16} />
      case 'down': return <ArrowDownRight size={16} />
      default: return <Minus size={16} />
    }
  }

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'up': return 'text-success-600 bg-success-100'
      case 'down': return 'text-error-600 bg-error-100'
      default: return 'text-tertiary bg-surface-2'
    }
  }

  return (
    <div className="quick-insights bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-accent-100 flex items-center justify-center text-accent-600">
            <TrendingUp size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Quick Insights</h3>
            <p className="text-xs lg:text-sm text-tertiary">This week vs last week performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-surface-1 rounded-lg text-xs text-secondary">
            <Calendar size={12} />
            <span>Mar 10 - Mar 16</span>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`group relative bg-surface-1 rounded-xl p-4 border border-light transition-all hover:shadow-md ${
              hoveredCard === insight.id ? 'scale-[1.02]' : ''
            }`}
            onMouseEnter={() => setHoveredCard(insight.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg ${
                  insight.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  insight.color === 'success' ? 'bg-success-100 text-success-600' :
                  insight.color === 'accent' ? 'bg-accent-100 text-accent-600' :
                  'bg-info-100 text-info-600'
                } flex items-center justify-center`}>
                  {insight.icon}
                </div>
                <div>
                  <p className="text-xs text-tertiary">{insight.title}</p>
                  <p className="text-lg lg:text-xl font-bold text-primary">{insight.value}</p>
                </div>
              </div>
              
              {/* Change Badge */}
              <span className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(insight.trend)}`}>
                {getTrendIcon(insight.trend)}
                {insight.change}
              </span>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="flex items-end h-8 gap-0.5 mb-3">
              {insight.chart.map((value, i) => {
                const max = Math.max(...insight.chart)
                const height = (value / max) * 100
                return (
                  <div
                    key={i}
                    className="flex-1 group/chart"
                  >
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        insight.color === 'primary' ? 'bg-primary-200 group-hover/chart:bg-primary-400' :
                        insight.color === 'success' ? 'bg-success-200 group-hover/chart:bg-success-400' :
                        insight.color === 'accent' ? 'bg-accent-200 group-hover/chart:bg-accent-400' :
                        'bg-info-200 group-hover/chart:bg-info-400'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Comparison Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-tertiary">This week</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-surface-3" />
                  <span className="text-tertiary">Last week</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-medium">{insight.value}</span>
                <span className="text-tertiary">vs</span>
                <span className="text-tertiary">{insight.previous}</span>
              </div>
            </div>

            {/* Hover Details */}
            {hoveredCard === insight.id && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20">
                <div className="flex items-center gap-3">
                  <span>This week: {insight.value}</span>
                  <span>Last week: {insight.previous}</span>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-900 rotate-45" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-light">
        <div className="text-center">
          <p className="text-xs text-tertiary mb-1">Growth rate</p>
          <p className="text-sm font-semibold text-success-600">+12.8%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-tertiary mb-1">Best day</p>
          <p className="text-sm font-semibold text-primary">Saturday</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-tertiary mb-1">Peak time</p>
          <p className="text-sm font-semibold text-primary">6-8 PM</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-tertiary mb-1">Projected</p>
          <p className="text-sm font-semibold text-accent-600">₹2,85,000</p>
        </div>
      </div>
    </div>
  )
}