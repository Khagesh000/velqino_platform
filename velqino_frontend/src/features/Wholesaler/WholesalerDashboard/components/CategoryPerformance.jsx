"use client"

import React, { useState } from 'react'
import { PieChart, Grid, TrendingUp, ArrowUpRight } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/CategoryPerformance.scss'

export default function CategoryPerformance({ data, isLoading }) {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  // ✅ Extract data from API response
  const categories = data || [];
  const totalRevenue = categories.reduce((sum, cat) => sum + (cat.total_revenue || 0), 0);
  
  // ✅ Calculate percentages
  const categoriesWithPercentage = categories.map(cat => ({
    ...cat,
    percentage: totalRevenue > 0 ? (cat.total_revenue / totalRevenue) * 100 : 0
  }));

  // Colors for categories
  const colors = ['primary', 'success', 'accent', 'warning', 'info', 'error'];
  
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

  if (!categories || categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-light p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <PieChart size={32} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No category data yet</h4>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Complete orders to see category performance here.
          </p>
        </div>
      </div>
    );
  }

  // Prepare donut chart data (top 5 categories)
  const topCategories = categoriesWithPercentage.slice(0, 5);
  const circumference = 2 * Math.PI * 40; // r=40
  let cumulativePercent = 0;

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
            <p className="text-xs sm:text-sm text-tertiary">Top categories by sales</p>
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
          <svg className="donut-chart-svg" viewBox="0 0 100 100">
            {topCategories.map((category, index) => {
              const percentage = category.percentage;
              const dashArray = (percentage / 100) * circumference;
              const offset = circumference - cumulativePercent * circumference / 100;
              cumulativePercent += percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={getColor(index)}
                  strokeWidth="16"
                  strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                  strokeDashoffset={offset}
                  transform={`rotate(-90 50 50)`}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-tertiary">total revenue</span>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 w-full">
          <div className="space-y-3">
            {categoriesWithPercentage.map((category, index) => {
              const color = colors[index % colors.length];
              return (
                <div
                  key={category.category || index}
                  className="category-item"
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full bg-${color}-500`} />
                    <span className="flex-1 text-sm font-medium text-primary">{category.category}</span>
                    <span className="text-sm font-semibold text-primary">{category.percentage.toFixed(1)}%</span>
                    <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded-full flex items-center gap-0.5">
                      <ArrowUpRight size={10} />
                      {category.product_count} products
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-${color}-500 transition-all duration-300`}
                      style={{ width: `${Math.max(category.percentage, 5)}%` }}
                    />
                  </div>
                  
                  {/* Amount on hover */}
                  {hoveredCategory === index && (
                    <div className="mt-1 text-xs text-tertiary">
                      Revenue: ₹{category.total_revenue.toLocaleString()} | Sold: {category.total_sold} units
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-light">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-primary-500" />
          <span className="text-xs text-secondary">
            Best seller: {categoriesWithPercentage[0]?.category || 'N/A'} 
            ({categoriesWithPercentage[0]?.percentage.toFixed(1) || 0}%)
          </span>
        </div>
        <div className="text-xs text-tertiary">
          {categories.length} categories
        </div>
      </div>
    </div>
  )
}

// Helper function to get color
function getColor(index) {
  const colors = ['#CE8E6A', '#2D9B4E', '#F5A623', '#6C5CE7', '#00B5D8', '#E53E3E'];
  return colors[index % colors.length];
}