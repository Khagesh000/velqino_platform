"use client"

import React, { useState } from 'react'
import { PieChart, Grid, TrendingUp, ArrowUpRight } from 'lucide-react'
import '../../../../styles/Wholesaler/WholesalerDashboard/CategoryPerformance.scss'

export default function CategoryPerformance() {
  const [hoveredCategory, setHoveredCategory] = useState(null)

  const categories = [
    { id: 1, name: 'Electronics', value: 45, color: 'primary', amount: '₹1,82,500', trend: '+12%' },
    { id: 2, name: 'Clothing', value: 30, color: 'success', amount: '₹1,24,800', trend: '+8%' },
    { id: 3, name: 'Home Decor', value: 15, color: 'accent', amount: '₹62,300', trend: '+5%' },
    { id: 4, name: 'Beauty', value: 7, color: 'warning', amount: '₹28,900', trend: '+3%' },
    { id: 5, name: 'Others', value: 3, color: 'info', amount: '₹12,400', trend: '+1%' }
  ]

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center text-accent-600">
            <PieChart size={20} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-primary">Category Performance</h3>
            <p className="text-xs sm:text-sm text-tertiary">Top 5 categories by sales</p>
          </div>
        </div>
        <button className="text-xs text-tertiary hover:text-primary-600 transition-fast flex items-center gap-1">
          <Grid size={14} />
          View all
        </button>
      </div>

      {/* Chart and Categories */}
      <div className="flex flex-col lg:flex-row items-center gap-8">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 lg:w-56 lg:h-56 flex-shrink-0">
          <div className="donut-chart">
            <div className="donut-segment donut-primary" style={{ '--percent': '45%' }} />
            <div className="donut-segment donut-success" style={{ '--percent': '30%' }} />
            <div className="donut-segment donut-accent" style={{ '--percent': '15%' }} />
            <div className="donut-segment donut-warning" style={{ '--percent': '7%' }} />
            <div className="donut-segment donut-info" style={{ '--percent': '3%' }} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary">100%</span>
            <span className="text-xs text-tertiary">total sales</span>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 w-full">
          <div className="space-y-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`category-item category-${category.color} ${
                  hoveredCategory === category.id ? 'hovered' : ''
                }`}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center gap-3">
                  <span className={`category-dot category-dot-${category.color}`} />
                  <span className="flex-1 text-sm font-medium text-primary">{category.name}</span>
                  <span className="text-sm font-semibold text-primary">{category.value}%</span>
                  <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded-full flex items-center gap-0.5">
                    <ArrowUpRight size={10} />
                    {category.trend}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="category-progress">
                  <div 
                    className={`category-progress-bar category-progress-${category.color}`}
                    style={{ width: `${category.value}%` }}
                  />
                </div>
                
                {/* Amount on hover */}
                {hoveredCategory === category.id && (
                  <div className="category-amount">
                    {category.amount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-light">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-primary-500" />
          <span className="text-xs text-secondary">Best seller: Electronics (45%)</span>
        </div>
        <div className="text-xs text-tertiary">
          Updated today
        </div>
      </div>
    </div>
  )
}