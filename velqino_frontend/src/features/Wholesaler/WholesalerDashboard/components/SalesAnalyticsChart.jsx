"use client"
import React, { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/SalesAnalyticsChart.scss'
import ExportButton from '@/shared/ExportButton';

export default function SalesAnalyticsChart({ data, isLoading, activePeriod, onPeriodChange }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  
  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];
  
  // ✅ Extract data from API response
  const dataPoints = data?.values || [];
  const labels = data?.labels || [];
  const maxValue = data?.max_value || 1;
  const totalRevenue = data?.total || 0;
  
  // ✅ Calculate current period total (last non-zero value or sum of all)
  const currentTotal = dataPoints.reduce((sum, val) => sum + val, 0);
  
  // ✅ Calculate previous period (shifted by one)
  const previousTotal = dataPoints.length > 1 ? dataPoints.slice(0, -1).reduce((sum, val) => sum + val, 0) : 0;
  const currentChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
  const previousChange = currentTotal > 0 ? ((previousTotal - currentTotal) / currentTotal) * 100 : 0;
  
  // ✅ Projected (estimate based on average growth)
  const projectedTotal = currentTotal * (1 + (currentChange / 100));
  const projectedChange = currentChange;
  
  const avgOrderValue = dataPoints.length > 0 ? totalRevenue / dataPoints.length : 0;
  
  // ✅ Find the maximum value for scaling (ensure bars are visible)
  const chartMaxValue = Math.max(maxValue, 1000); // Minimum 1000 for visibility

  const exportData = labels.map((label, index) => ({
    period: label,
    revenue: dataPoints[index] || 0
  }));

  const exportColumns = [
    { key: 'period', label: 'Period' },
    { key: 'revenue', label: 'Revenue (₹)' }
  ];
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-light p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  // If no data, show message
  if (dataPoints.length === 0 || totalRevenue === 0) {
    return (
      <div className="bg-white rounded-2xl border border-light p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <TrendingUp size={32} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No sales data yet</h4>
          <p className="text-sm text-gray-500 text-center max-w-md">
            Complete orders and mark them as "delivered" to see your sales analytics here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-primary">Sales Analytics</h3>
            <p className="text-xs sm:text-sm text-tertiary">Revenue performance over time</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Period Tabs */}
          <div className="flex items-center gap-1 p-1 bg-surface-2 rounded-lg">
            {periods.map((period) => (
              <button
                key={period.id}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activePeriod === period.id 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-tertiary hover:text-secondary'
                }`}
                onClick={() => onPeriodChange(period.id)}
              >
                {period.label}
              </button>
            ))}
          </div>
          
          <ExportButton 
              data={exportData} 
              filename="sales_analytics" 
              columns={exportColumns}
              title="Sales Analytics Report"
            />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-1 rounded-xl p-4">
          <p className="text-xs text-tertiary mb-1">Current period</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">₹{currentTotal.toLocaleString()}</span>
            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              currentChange >= 0 ? 'bg-success-100 text-success-600' : 'bg-error-100 text-error-600'
            }`}>
              {currentChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(currentChange).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="bg-surface-1 rounded-xl p-4">
          <p className="text-xs text-tertiary mb-1">Previous period</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">₹{previousTotal.toLocaleString()}</span>
            <span className="flex items-center gap-1 text-xs font-medium text-error-600 bg-error-100 px-2 py-1 rounded-full">
              <ArrowDownRight size={12} />
              {Math.abs(previousChange).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="bg-surface-1 rounded-xl p-4">
          <p className="text-xs text-tertiary mb-1">Projected</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary">₹{projectedTotal.toLocaleString()}</span>
            <span className="text-xs font-medium text-accent-600 bg-accent-100 px-2 py-1 rounded-full">
              +{Math.abs(projectedChange).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Chart Area with Mobile Scroll */}
      <div className="relative mb-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-right pr-2 z-10 bg-white">
          <span className="text-xs text-tertiary">50k</span>
          <span className="text-xs text-tertiary">40k</span>
          <span className="text-xs text-tertiary">30k</span>
          <span className="text-xs text-tertiary">20k</span>
          <span className="text-xs text-tertiary">10k</span>
          <span className="text-xs text-tertiary">0</span>
        </div>

        {/* Scrollable Chart Container */}
        <div className="ml-12 overflow-x-auto overflow-y-visible pb-2 hide-scrollbar">
          <div className="relative h-64" style={{ minWidth: '700px' }}>
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border-b border-light/30 w-full h-0" />
              ))}
            </div>

            {/* Bars container */}
            <div className="absolute inset-0 flex items-end justify-around gap-1">
              {dataPoints.map((value, index) => {
                // Calculate height percentage based on max value in chart data
                const maxDataValue = Math.max(...dataPoints, 1);
                const height = maxDataValue > 0 ? (value / maxDataValue) * 100 : 0;
                
                return (
                  <div
                    key={index}
                    className="relative w-full max-w-[30px] group"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <div 
                      className={`w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-300 group-hover:from-primary-600 group-hover:to-primary-500 cursor-pointer`}
                      style={{ height: `${height}%`,
                      backgroundColor: '#CE8E6A',  // ✅ Add this to force visibility
                      minHeight: value > 0 ? '4px' : '0px' }}
                      >
                      {hoveredPoint === index && value > 0 && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20">
                          <div className="font-medium">{labels[index]}</div>
                          <div className="text-primary-200">₹{value.toLocaleString()}</div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-900 rotate-45" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-around text-xs text-tertiary">
              {labels.map((label, i) => (
                <span key={i} className="text-center w-full">{label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-light">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-500" />
          <span className="text-xs text-secondary">Total revenue: ₹{totalRevenue.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-500" />
          <span className="text-xs text-secondary">Avg. order value: ₹{avgOrderValue.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-tertiary" />
          <span className="text-xs text-secondary">Last {labels.length} {activePeriod === 'daily' ? 'days' : activePeriod === 'weekly' ? 'weeks' : 'months'}</span>
        </div>
      </div>
    </div>
  )
}