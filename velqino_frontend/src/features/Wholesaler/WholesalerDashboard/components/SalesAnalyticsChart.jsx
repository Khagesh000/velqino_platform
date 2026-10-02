"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight,
  BarChart3 
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/SalesAnalyticsChart.scss';
import ExportButton from '@/shared/ExportButton';

export default function SalesAnalyticsChart({ data, isLoading, activePeriod, onPeriodChange }) {
  const router = useRouter();
  const [hoveredPoint, setHoveredPoint] = useState(null);
  
  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' }
  ];
  
  // Extract data from API response
  const dataPoints = data?.daily?.map(item => item.revenue) || data?.values || [];
  const labels = data?.daily?.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }) || data?.labels || [];
  
  const totalRevenue = data?.total_revenue || data?.total || 0;
  const currentTotal = dataPoints.reduce((sum, val) => sum + val, 0);
  const previousTotal = dataPoints.length > 1 ? dataPoints.slice(0, -1).reduce((sum, val) => sum + val, 0) : 0;
  const currentChange = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
  const previousChange = currentTotal > 0 ? ((previousTotal - currentTotal) / currentTotal) * 100 : 0;
  const projectedTotal = currentTotal * (1 + (currentChange / 100));
  const projectedChange = currentChange;
  const avgOrderValue = dataPoints.length > 0 ? totalRevenue / dataPoints.length : 0;

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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3" />
          <div className="h-44 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  // Header JSX with navigation button
  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
          <TrendingUp size={20} />
        </div>
        <div>
          <h3 className="text-base lg:text-lg font-bold text-slate-900">Sales Analytics</h3>
          <p className="text-xs text-slate-500">Revenue performance and velocity over time</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl">
          {periods.map((period) => (
            <button
              key={period.id}
              type="button"
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activePeriod === period.id 
                  ? 'bg-white text-primary-700 shadow-2xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              onClick={() => onPeriodChange(period.id)}
            >
              {period.label}
            </button>
          ))}
        </div>
        
        {exportData.length > 0 && (
          <ExportButton 
            data={exportData} 
            filename="sales_analytics" 
            columns={exportColumns}
            title="Sales Analytics Report"
          />
        )}

        {/* View Full Analytics CTA */}
        <button
          type="button"
          onClick={() => router.push('/wholesaler/analyticsreports')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200/80 rounded-xl text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-all shadow-2xs group"
        >
          <span>Full Analytics</span>
          <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );

  // If no data, show formatted empty state with persistent header
  if (dataPoints.length === 0 || totalRevenue === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 lg:p-6 shadow-xs flex flex-col justify-between h-full">
        {renderHeader()}
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3 text-slate-400">
            <BarChart3 size={24} />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">No sales data recorded yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            Complete and dispatch buyer orders to view revenue analytics and trend projections here.
          </p>
          <button
            type="button"
            onClick={() => router.push('/wholesaler/analyticsreports')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-700 border border-primary-200/80 rounded-xl text-xs font-semibold hover:bg-primary-100 transition-all shadow-2xs"
          >
            <span>Explore Analytics Reports</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 lg:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {renderHeader()}

        {/* Metric Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1 font-medium">Current Period</p>
            <div className="flex items-center justify-between">
              <span className="text-base lg:text-lg font-bold text-slate-900">₹{currentTotal.toLocaleString()}</span>
              <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                currentChange >= 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {currentChange >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(currentChange).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1 font-medium">Previous Period</p>
            <div className="flex items-center justify-between">
              <span className="text-base lg:text-lg font-bold text-slate-900">₹{previousTotal.toLocaleString()}</span>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-full">
                <ArrowDownRight size={12} />
                {Math.abs(previousChange).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1 font-medium">Projected Trend</p>
            <div className="flex items-center justify-between">
              <span className="text-base lg:text-lg font-bold text-slate-900">₹{Math.round(projectedTotal).toLocaleString()}</span>
              <span className="text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
                +{Math.abs(projectedChange).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative mb-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 w-10 flex flex-col justify-between text-right pr-2 z-10 bg-white/90 text-slate-400 font-medium text-[11px]">
            <span>50k</span>
            <span>40k</span>
            <span>30k</span>
            <span>20k</span>
            <span>10k</span>
            <span>0</span>
          </div>

          {/* Scrollable Chart Container */}
          <div className="ml-12 overflow-x-auto overflow-y-visible pb-2 hide-scrollbar">
            <div className="relative h-60" style={{ minWidth: '600px' }}>
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="border-b border-slate-100 w-full h-0" />
                ))}
              </div>

              {/* Bars container */}
              <div className="absolute inset-0 flex items-end justify-around gap-1.5 px-2">
                {dataPoints.map((value, index) => {
                  const maxDataValue = Math.max(...dataPoints, 1);
                  const height = maxDataValue > 0 ? (value / maxDataValue) * 100 : 0;
                  
                  return (
                    <div
                      key={index}
                      className="relative w-full max-w-[32px] group"
                      onMouseEnter={() => setHoveredPoint(index)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <div 
                        className="w-full rounded-t-lg transition-all duration-300 cursor-pointer bg-primary-500 hover:bg-primary-600"
                        style={{ 
                          height: `${height}%`,
                          minHeight: value > 0 ? '4px' : '0px'
                        }}
                      >
                        {hoveredPoint === index && value > 0 && (
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs rounded-xl px-3 py-1.5 whitespace-nowrap z-20 shadow-xl">
                            <div className="font-semibold">{labels[index]}</div>
                            <div className="text-primary-300 font-bold">₹{value.toLocaleString()}</div>
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="absolute -bottom-6 left-0 right-0 flex justify-around text-[11px] text-slate-400 font-medium">
                {labels.map((label, i) => (
                  <span key={i} className="text-center w-full">{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-4 flex-wrap text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
            <span className="font-medium text-slate-700">Total: ₹{totalRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="font-medium text-slate-700">Avg. Order: ₹{Math.round(avgOrderValue).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar size={13} />
            <span>Last {labels.length} {activePeriod === 'daily' ? 'days' : activePeriod === 'weekly' ? 'weeks' : 'months'}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push('/wholesaler/analyticsreports')}
          className="flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-all hover:gap-1.5 ml-auto"
        >
          <span>Explore Detailed Reports</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}