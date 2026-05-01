"use client"
import React, { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Download, ArrowUpRight, ArrowDownRight } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/SalesAnalyticsChart.scss'
import { useGetSalesAnalyticsQuery } from '@/redux/wholesaler/slices/statsSlice';

export default function SalesAnalyticsChart() {
  const [activePeriod, setActivePeriod] = useState('weekly');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  const { data: analyticsData, isLoading, refetch } = useGetSalesAnalyticsQuery(activePeriod);
  
  useEffect(() => {
    refetch();
  }, [activePeriod, refetch]);
  
  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];
  
  // ✅ Extract data from API response
  const chartData = analyticsData?.data || {};
  const dataPoints = chartData.values || [];
  const labels = chartData.labels || [];
  const maxValue = chartData.max_value || 1; // Avoid division by zero
  const totalRevenue = chartData.total || 0;
  const currentTotal = totalRevenue;
  const previousTotal = 0;
  const currentChange = 0;
  const previousChange = 0;
  const projectedTotal = 0;
  const projectedChange = 0;
  const avgOrderValue = dataPoints.length > 0 ? totalRevenue / dataPoints.length : 0;
  
  if (isLoading) {
    return <div className="bg-white rounded-2xl p-6">Loading chart...</div>;
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
            onClick={() => setActivePeriod(period.id)}
          >
            {period.label}
          </button>
        ))}
      </div>
      
      <button className="p-2 hover:bg-surface-2 rounded-lg transition-fast text-tertiary">
        <Download size={16} />
      </button>
    </div>
  </div>

  {/* Stats from API */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <div className="bg-surface-1 rounded-xl p-4">
      <p className="text-xs text-tertiary mb-1">Current period</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">₹{currentTotal.toLocaleString()}</span>
        <span className="flex items-center gap-1 text-xs font-medium text-success-600 bg-success-100 px-2 py-1 rounded-full">
          <ArrowUpRight size={12} />
          {currentChange}%
        </span>
      </div>
    </div>
    
    <div className="bg-surface-1 rounded-xl p-4">
      <p className="text-xs text-tertiary mb-1">Previous period</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">₹{previousTotal.toLocaleString()}</span>
        <span className="flex items-center gap-1 text-xs font-medium text-error-600 bg-error-100 px-2 py-1 rounded-full">
          <ArrowDownRight size={12} />
          {previousChange}%
        </span>
      </div>
    </div>
    
    <div className="bg-surface-1 rounded-xl p-4">
      <p className="text-xs text-tertiary mb-1">Projected</p>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">₹{projectedTotal.toLocaleString()}</span>
        <span className="text-xs font-medium text-accent-600 bg-accent-100 px-2 py-1 rounded-full">
          +{projectedChange}%
        </span>
      </div>
    </div>
  </div>

  {/* Chart Area with Mobile Scroll */}
  <div className="relative mb-6">
    {/* Y-axis labels */}
    <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-right pr-2 z-10 bg-white">
      {['50k', '40k', '30k', '20k', '10k', '0'].map((label) => (
        <span key={label} className="text-xs text-tertiary">{label}</span>
      ))}
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
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            return (
              <div
                key={index}
                className="relative w-full max-w-[30px] group"
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <div 
                  className={`w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-300 group-hover:from-primary-600 group-hover:to-primary-500 cursor-pointer`}
                  style={{ height: `${height}%` }}
                >
                  {hoveredPoint === index && (
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
            <span key={i}>{label}</span>
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