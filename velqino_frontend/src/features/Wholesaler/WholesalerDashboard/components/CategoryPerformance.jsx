"use client"

import React, { useState } from 'react'
import { PieChart, Grid, TrendingUp, ArrowUpRight } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/CategoryPerformance.scss'
import { useGetCategoryPerformanceQuery } from '@/redux/wholesaler/slices/statsSlice';

export default function CategoryPerformance() {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { data: performanceData, isLoading } = useGetCategoryPerformanceQuery();
  
  const categories = performanceData?.data?.categories || [];
  const totalRevenue = performanceData?.data?.total_revenue || '₹0';
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-light p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

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
      {/* Donut Chart Segments */}
      <svg className="donut-chart-svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-primary)" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="calc(251.2 - (251.2 * 45) / 100)" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-success)" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="calc(251.2 - (251.2 * 30) / 100)" transform="rotate(-162 50 50)" />
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-accent)" strokeWidth="16" strokeDasharray="251.2" strokeDashoffset="calc(251.2 - (251.2 * 20) / 100)" transform="rotate(-270 50 50)" />
      </svg>
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
            className="category-item"
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            <div className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full bg-${category.color}-500`} />
              <span className="flex-1 text-sm font-medium text-primary">{category.name}</span>
              <span className="text-sm font-semibold text-primary">{category.value}%</span>
              <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded-full flex items-center gap-0.5">
                <ArrowUpRight size={10} />
                {category.trend}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full bg-${category.color}-500 transition-all duration-300`}
                style={{ width: `${category.value}%` }}
              />
            </div>
            
            {/* Amount on hover */}
            {hoveredCategory === category.id && (
              <div className="mt-1 text-xs text-tertiary">
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
      <span className="text-xs text-secondary">Best seller: {categories[0]?.name || 'N/A'} ({categories[0]?.value || 0}%)</span>
    </div>
    <div className="text-xs text-tertiary">
      Updated today
    </div>
  </div>
</div>
  )
}