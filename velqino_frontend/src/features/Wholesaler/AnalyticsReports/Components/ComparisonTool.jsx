"use client";

import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  Calendar,
  ChevronDown,
  RefreshCw,
  Download,
  Info
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/AnalyticsReports/ComparisonTool.scss';

export default function ComparisonTool({ dateRange, customDate, statsData }) {
  const [compareType, setCompareType] = useState('previous');
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  // ✅ Use real API data from statsData prop
  const apiData = statsData?.data || {};
  
  // Current period data from API
  const current = {
    revenue: apiData.total_revenue || 0,
    orders: apiData.completed_orders || 0,
    aov: apiData.avg_order_value || 0,
    conversion: apiData.completion_rate || 0,
    customers: apiData.total_customers || 0,
    products: apiData.total_products || 0
  };

  // Calculate previous period values (using change percentages from API)
  const calculatePreviousValue = (currentValue, changePercent) => {
    if (changePercent === 0 || currentValue === 0) return 0;
    return currentValue / (1 + changePercent / 100);
  };

  const previous = {
    revenue: calculatePreviousValue(current.revenue, apiData.revenue_change || 0),
    orders: current.orders,
    aov: current.aov,
    conversion: current.conversion,
    customers: calculatePreviousValue(current.customers, apiData.customers_change || 0),
    products: calculatePreviousValue(current.products, apiData.products_change || 0)
  };

  const getDateRangeText = () => {
    if (dateRange === 'custom' && customDate.start && customDate.end) {
      return `${customDate.start} to ${customDate.end}`;
    }
    const rangeMap = {
      'today': 'Today',
      'yesterday': 'Yesterday',
      'last7days': 'Last 7 days',
      'last30days': 'Last 30 days',
      'thisMonth': 'This Month',
      'lastMonth': 'Last Month',
      'thisQuarter': 'This Quarter',
      'lastQuarter': 'Last Quarter',
      'thisYear': 'This Year',
      'lastYear': 'Last Year'
    };
    return rangeMap[dateRange] || 'Selected Period';
  };

  const metrics = [
    { id: 'revenue', label: 'Total Revenue', format: 'currency', icon: TrendingUp, color: 'primary' },
    { id: 'orders', label: 'Completed Orders', format: 'number', icon: BarChart3, color: 'success' },
    { id: 'aov', label: 'Avg Order Value', format: 'currency', icon: TrendingUp, color: 'info' },
    { id: 'conversion', label: 'Completion Rate', format: 'percent', icon: PieChart, color: 'warning' },
    { id: 'customers', label: 'Total Customers', format: 'number', icon: TrendingUp, color: 'purple' },
    { id: 'products', label: 'Total Products', format: 'number', icon: BarChart3, color: 'indigo' }
  ];

  const formatValue = (value, format) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    if (format === 'percent') {
      return `${value}%`;
    }
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const calculateChange = (currentVal, previousVal) => {
    if (previousVal === 0) return { value: 0, trend: 'up', isPositive: true };
    const change = ((currentVal - previousVal) / previousVal) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      trend: change >= 0 ? 'up' : 'down',
      isPositive: change >= 0
    };
  };

  const getTrendColor = (trend, isPositive = true) => {
    if (trend === 'up') return isPositive ? 'text-success-600' : 'text-error-600';
    return isPositive ? 'text-error-600' : 'text-success-600';
  };

  const getCardColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-50 text-primary-600',
      success: 'bg-success-50 text-success-600',
      info: 'bg-info-50 text-info-600',
      warning: 'bg-warning-50 text-warning-600',
      purple: 'bg-purple-50 text-purple-600',
      indigo: 'bg-indigo-50 text-indigo-600'
    };
    return colors[color] || colors.primary;
  };

  const getProgressBarColor = (trend, metricId) => {
    if (metricId === 'conversion') {
      return trend === 'up' ? 'bg-error-500' : 'bg-success-500';
    }
    return trend === 'up' ? 'bg-success-500' : 'bg-error-500';
  };

  const getProgressWidth = (currentVal, previousVal) => {
    if (previousVal === 0) return 50;
    const percentage = (currentVal / previousVal) * 100;
    return Math.min(percentage, 100);
  };

  if (!apiData.total_revenue && apiData.total_revenue !== 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500">Loading comparison data...</p>
      </div>
    );
  }

  return (
    <div className="comparison-tool bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="comparison-header px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Comparison</h3>
              <p className="text-sm text-gray-500">Compare metrics across periods</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={compareType}
              onChange={(e) => setCompareType(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="previous">vs Previous Period</option>
              <option value="lastYear">vs Same Period Last Year</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <RefreshCw size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Period: {getDateRangeText()}</span>
          </div>
          <span>•</span>
          <span>Comparing with previous period</span>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="comparison-grid p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const currentValue = current[metric.id];
            const compareValue = previous[metric.id];
            const change = calculateChange(currentValue, compareValue);
            const iconColor = getCardColorClasses(metric.color);
            
            return (
              <div
                key={metric.id}
                className={`comparison-card relative bg-white rounded-xl border-2 p-4 transition-all hover:shadow-lg ${
                  hoveredMetric === metric.id ? `border-${metric.color}-300 scale-[1.02]` : 'border-gray-200'
                }`}
                onMouseEnter={() => setHoveredMetric(metric.id)}
                onMouseLeave={() => setHoveredMetric(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    change.trend === 'up' 
                      ? 'bg-success-50 text-success-700' 
                      : 'bg-error-50 text-error-700'
                  }`}>
                    {change.trend === 'up' ? <ArrowUp size={12} className="inline" /> : <ArrowDown size={12} className="inline" />}
                    {change.value}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-900">{formatValue(currentValue, metric.format)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Previous period:</span>
                    <span className="font-medium text-gray-700">{formatValue(compareValue, metric.format)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Performance</span>
                    <span className={`font-medium ${getTrendColor(change.trend, metric.id !== 'conversion' ? change.isPositive : !change.isPositive)}`}>
                      {change.trend === 'up' ? '+' : '-'}{change.value}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(change.trend, metric.id)}`}
                      style={{ width: `${getProgressWidth(currentValue, compareValue)}%` }}
                    />
                  </div>
                </div>

                {hoveredMetric === metric.id && (
                  <div className="absolute inset-0 rounded-xl opacity-10 blur-xl pointer-events-none bg-gray-900" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="comparison-details px-4 sm:px-6 pb-6">
        <button
          className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 mb-3"
          onClick={() => setShowDetails(!showDetails)}
        >
          <ChevronDown size={16} className={`transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          {showDetails ? 'Hide Details' : 'View Detailed Comparison'}
        </button>

        {showDetails && (
          <div className="details-table bg-gray-50 rounded-xl p-4 overflow-x-auto">
            <div className="min-w-[500px] sm:min-w-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-2 pr-4 text-left font-medium text-gray-600 whitespace-nowrap">Metric</th>
                    <th className="pb-2 px-4 text-right font-medium text-gray-600 whitespace-nowrap">Current</th>
                    <th className="pb-2 px-4 text-right font-medium text-gray-600 whitespace-nowrap">Previous</th>
                    <th className="pb-2 pl-4 text-right font-medium text-gray-600 whitespace-nowrap">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {metrics.map(metric => {
                    const currentValue = current[metric.id];
                    const compareValue = previous[metric.id];
                    const change = calculateChange(currentValue, compareValue);
                    
                    return (
                      <tr key={metric.id} className="hover:bg-white transition-all">
                        <td className="py-2 pr-4 text-gray-700 whitespace-nowrap">{metric.label}</td>
                        <td className="py-2 px-4 text-right font-medium text-gray-900 whitespace-nowrap">
                          {formatValue(currentValue, metric.format)}
                        </td>
                        <td className="py-2 px-4 text-right text-gray-600 whitespace-nowrap">
                          {formatValue(compareValue, metric.format)}
                        </td>
                        <td className={`py-2 pl-4 text-right font-medium whitespace-nowrap ${
                          getTrendColor(change.trend, metric.id !== 'conversion' ? change.isPositive : !change.isPositive)
                        }`}>
                          {change.trend === 'up' ? '+' : '-'}{change.value}%
                        </td>
                       </tr>
                    );
                  })}
                </tbody>
               </table>
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="comparison-footer px-4 sm:px-6 py-3 border-t border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Info size={14} />
          <span>Comparison based on {getDateRangeText()}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            Current Period
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            Previous Period
          </span>
        </div>
      </div>
    </div>
  );
}