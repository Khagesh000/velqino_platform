"use client"

import React, { useState } from 'react'
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
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/AnalyticsReports/ComparisonTool.scss'

export default function ComparisonTool({ dateRange, customDate, onCompareChange }) {
  const [compareType, setCompareType] = useState('previous')
  const [showDetails, setShowDetails] = useState(false)
  const [hoveredMetric, setHoveredMetric] = useState(null)

  const comparisonData = {
    current: {
      revenue: 1245750,
      orders: 345,
      aov: 3610,
      conversion: 3.2,
      customers: 89,
      products: 156
    },
    previous: {
      revenue: 1082450,
      orders: 312,
      aov: 3470,
      conversion: 3.5,
      customers: 76,
      products: 142
    },
    lastYear: {
      revenue: 956800,
      orders: 278,
      aov: 3442,
      conversion: 3.1,
      customers: 65,
      products: 128
    }
  }

  const metrics = [
    { id: 'revenue', label: 'Total Revenue', format: 'currency', icon: TrendingUp, color: 'primary' },
    { id: 'orders', label: 'Total Orders', format: 'number', icon: BarChart3, color: 'success' },
    { id: 'aov', label: 'Avg Order Value', format: 'currency', icon: TrendingUp, color: 'info' },
    { id: 'conversion', label: 'Conversion Rate', format: 'percent', icon: PieChart, color: 'warning' },
    { id: 'customers', label: 'New Customers', format: 'number', icon: TrendingUp, color: 'purple' },
    { id: 'products', label: 'Products Sold', format: 'number', icon: BarChart3, color: 'indigo' }
  ]

  const getCompareData = () => {
    switch(compareType) {
      case 'previous':
        return { current: comparisonData.current, compare: comparisonData.previous, label: 'Previous Period' }
      case 'lastYear':
        return { current: comparisonData.current, compare: comparisonData.lastYear, label: 'Same Period Last Year' }
      default:
        return { current: comparisonData.current, compare: comparisonData.previous, label: 'Previous Period' }
    }
  }

  const formatValue = (value, format) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value)
    }
    if (format === 'percent') {
      return `${value}%`
    }
    return new Intl.NumberFormat('en-IN').format(value)
  }

  const calculateChange = (current, compare) => {
    const change = ((current - compare) / compare) * 100
    return {
      value: Math.abs(change).toFixed(1),
      trend: change >= 0 ? 'up' : 'down',
      isPositive: change >= 0
    }
  }

  const { current, compare, label } = getCompareData()

  const getTrendColor = (trend, isPositive = true) => {
    if (trend === 'up') return isPositive ? 'text-success-600' : 'text-error-600'
    return isPositive ? 'text-error-600' : 'text-success-600'
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

          {/* Compare Type Selector */}
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

        {/* Period Info */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>Current: {dateRange === 'custom' ? `${customDate.start} to ${customDate.end}` : dateRange}</span>
          </div>
          <span>•</span>
          <span>{label}: Previous period</span>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="comparison-grid p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            const currentValue = current[metric.id]
            const compareValue = compare[metric.id]
            const change = calculateChange(currentValue, compareValue)
            
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
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-${metric.color}-50 flex items-center justify-center text-${metric.color}-600`}>
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

                {/* Values */}
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-900">{formatValue(currentValue, metric.format)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{label}:</span>
                    <span className="font-medium text-gray-700">{formatValue(compareValue, metric.format)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">Performance</span>
                    <span className={`font-medium ${getTrendColor(change.trend, metric.id !== 'conversion' ? change.isPositive : !change.isPositive)}`}>
                      {change.trend === 'up' ? '+' : '-'}{change.value}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        change.trend === 'up' ? 'bg-success-500' : 'bg-error-500'
                      }`}
                      style={{ 
                        width: `${Math.min(Math.abs((currentValue / compareValue) * 100), 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Hover Info */}
                {hoveredMetric === metric.id && (
                  <div className="absolute inset-0 rounded-xl opacity-10 blur-xl pointer-events-none bg-gray-900" />
                )}
              </div>
            )
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
              <th className="pb-2 px-4 text-right font-medium text-gray-600 whitespace-nowrap">{label}</th>
              <th className="pb-2 pl-4 text-right font-medium text-gray-600 whitespace-nowrap">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {metrics.map(metric => {
              const currentValue = current[metric.id]
              const compareValue = compare[metric.id]
              const change = calculateChange(currentValue, compareValue)
              
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
              )
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
          <span>Comparison based on {dateRange === 'custom' ? 'custom range' : dateRange}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            Current Period
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}