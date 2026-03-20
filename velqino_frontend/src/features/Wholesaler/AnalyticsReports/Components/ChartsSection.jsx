"use client"

import React, { useState } from 'react'
import {
  TrendingUp,
  PieChart,
  BarChart3,
  MapPin,
  Users,
  Clock,
  Download,
  MoreVertical,
  Maximize2
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/AnalyticsReports/ChartsSection.scss'

export default function ChartsSection({ dateRange, customDate, showComparison = false }) {
  const [activeChart, setActiveChart] = useState('revenue')
  const [fullscreenChart, setFullscreenChart] = useState(null)

  const charts = [
    {
      id: 'revenue',
      title: 'Revenue Over Time',
      type: 'line',
      icon: TrendingUp,
      description: 'Daily revenue trends',
      color: 'primary'
    },
    {
      id: 'orders',
      title: 'Orders by Status',
      type: 'pie',
      icon: PieChart,
      description: 'Order status distribution',
      color: 'success'
    },
    {
      id: 'products',
      title: 'Top Products',
      type: 'bar',
      icon: BarChart3,
      description: 'Best selling products',
      color: 'warning'
    },
    {
      id: 'category',
      title: 'Sales by Category',
      type: 'bar',
      icon: BarChart3,
      description: 'Category performance',
      color: 'info'
    },
    {
      id: 'customers',
      title: 'Customer Growth',
      type: 'area',
      icon: Users,
      description: 'New vs returning customers',
      color: 'purple'
    },
    {
      id: 'geographic',
      title: 'Geographic Sales',
      type: 'map',
      icon: MapPin,
      description: 'Sales by region',
      color: 'indigo'
    },
    {
      id: 'hourly',
      title: 'Hourly Sales',
      type: 'heatmap',
      icon: Clock,
      description: 'Peak sales hours',
      color: 'pink'
    }
  ]

  // Mock data for different chart types
  const mockLineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'This Period',
        data: [45000, 52000, 48000, 61000, 58000, 72000, 69000],
        color: 'primary'
      },
      ...(showComparison ? [{
        label: 'Previous Period',
        data: [38000, 42000, 40000, 53000, 50000, 64000, 60000],
        color: 'gray'
      }] : [])
    ]
  }

  const mockPieData = [
    { label: 'Pending', value: 45, color: 'warning' },
    { label: 'Processing', value: 78, color: 'info' },
    { label: 'Shipped', value: 112, color: 'primary' },
    { label: 'Delivered', value: 245, color: 'success' },
    { label: 'Cancelled', value: 23, color: 'error' }
  ]

  const mockBarData = {
    labels: ['Wireless Headphones', 'Cotton T-Shirt', 'Yoga Mat', 'Desk Lamp', 'Notebook Set'],
    datasets: [
      {
        label: 'Units Sold',
        data: [128, 89, 67, 42, 34],
        color: 'warning'
      }
    ]
  }

  const mockCategoryData = {
    labels: ['Electronics', 'Clothing', 'Home Decor', 'Fitness', 'Stationery'],
    datasets: [
      {
        label: 'Revenue',
        data: [245000, 189000, 156000, 98000, 67000],
        color: 'info'
      }
    ]
  }

  const mockAreaData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'New Customers',
        data: [45, 52, 48, 61],
        color: 'success'
      },
      {
        label: 'Returning Customers',
        data: [78, 82, 85, 91],
        color: 'primary'
      }
    ]
  }

  const mockGeoData = [
    { region: 'North', value: 45 },
    { region: 'South', value: 38 },
    { region: 'East', value: 42 },
    { region: 'West', value: 51 },
    { region: 'Central', value: 29 }
  ]

  const mockHeatmapData = [
    { hour: '6-9', mon: 12, tue: 15, wed: 14, thu: 18, fri: 22, sat: 28, sun: 25 },
    { hour: '9-12', mon: 28, tue: 32, wed: 30, thu: 35, fri: 42, sat: 48, sun: 38 },
    { hour: '12-15', mon: 45, tue: 48, wed: 52, thu: 55, fri: 62, sat: 71, sun: 58 },
    { hour: '15-18', mon: 38, tue: 42, wed: 45, thu: 48, fri: 52, sat: 62, sun: 48 },
    { hour: '18-21', mon: 52, tue: 58, wed: 62, thu: 68, fri: 82, sat: 95, sun: 72 },
    { hour: '21-24', mon: 32, tue: 35, wed: 38, thu: 42, fri: 51, sat: 62, sun: 45 }
  ]

  const getColorClass = (color) => {
    const colors = {
      primary: 'bg-primary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      info: 'bg-info-500',
      error: 'bg-error-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
      pink: 'bg-pink-500',
      gray: 'bg-gray-400'
    }
    return colors[color] || colors.primary
  }

  const getTextColorClass = (color) => {
    const colors = {
      primary: 'text-primary-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      info: 'text-info-600',
      error: 'text-error-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
      pink: 'text-pink-600'
    }
    return colors[color] || colors.primary
  }

  const getBgColorClass = (color) => {
    const colors = {
      primary: 'bg-primary-50',
      success: 'bg-success-50',
      warning: 'bg-warning-50',
      info: 'bg-info-50',
      error: 'bg-error-50',
      purple: 'bg-purple-50',
      indigo: 'bg-indigo-50',
      pink: 'bg-pink-50'
    }
    return colors[color] || colors.primary
  }

  const renderLineChart = () => (
    <div className="chart-container">
      <div className="chart-header">
        <div className="flex items-center gap-4">
          <h4 className="text-sm font-medium text-gray-700">Revenue Trend</h4>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              <span className="text-xs text-gray-500">This Period</span>
            </div>
            {showComparison && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                <span className="text-xs text-gray-500">Previous Period</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="chart-body h-64 relative">
        {/* SVG Line Chart */}
        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="40" y1="20" x2="40" y2="180" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="40" y1="100" x2="460" y2="100" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4" />
          <line x1="40" y1="180" x2="460" y2="180" stroke="#e5e7eb" strokeWidth="1" />
          
          {/* Previous period line (if comparison) */}
          {showComparison && (
            <polyline
              points="40,160 100,140 160,150 220,120 280,130 340,100 400,110"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeDasharray="4"
              className="chart-line"
            />
          )}
          
          {/* Current period line */}
          <polyline
            points="40,140 100,120 160,130 220,100 280,110 340,80 400,90"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            className="chart-line"
          />
          
          {/* Data points */}
          <circle cx="40" cy="140" r="4" fill="#3b82f6" className="chart-point" />
          <circle cx="100" cy="120" r="4" fill="#3b82f6" className="chart-point" />
          <circle cx="160" cy="130" r="4" fill="#3b82f6" className="chart-point" />
          <circle cx="220" cy="100" r="4" fill="#3b82f6" className="chart-point" />
          <circle cx="280" cy="110" r="4" fill="#3b82f6" className="chart-point" />
          <circle cx="340" cy="80" r="4" fill="#3b82f6" className="chart-point" />
          <circle cx="400" cy="90" r="4" fill="#3b82f6" className="chart-point" />
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-xs text-gray-500">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  )

  const renderPieChart = () => (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="text-sm font-medium text-gray-700">Order Status Distribution</h4>
      </div>
      <div className="chart-body flex items-center justify-center gap-8 h-64">
        {/* Donut chart */}
        <div className="relative w-40 h-40">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-40 h-40">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="15" />
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="15" 
              strokeDasharray={`${(45/503) * 251.2} 251.2`}
              strokeDashoffset="0"
              className="chart-segment"
            />
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="#3b82f6" 
              strokeWidth="15" 
              strokeDasharray={`${(78/503) * 251.2} 251.2`}
              strokeDashoffset={`-${(45/503) * 251.2}`}
              className="chart-segment"
            />
            <circle 
              cx="50" cy="50" r="40" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="15" 
              strokeDasharray={`${(112/503) * 251.2} 251.2`}
              strokeDashoffset={`-${(45+78)/503 * 251.2}`}
              className="chart-segment"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">503</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-2">
          {mockPieData.map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getColorClass(item.color)}`}></span>
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBarChart = (data, title, color) => (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
      </div>
      <div className="chart-body h-64 relative">
        {/* Bar chart */}
        <div className="absolute inset-0 flex items-end justify-around px-4">
          {data.labels.map((label, i) => (
            <div key={label} className="flex flex-col items-center w-12">
              <div 
                className={`w-8 ${getColorClass(color)} rounded-t-lg chart-bar`}
                style={{ height: `${(data.datasets[0].data[i] / Math.max(...data.datasets[0].data)) * 150}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2 truncate w-full text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderAreaChart = () => (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="text-sm font-medium text-gray-700">Customer Growth</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success-500"></span>
            <span className="text-xs text-gray-500">New</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            <span className="text-xs text-gray-500">Returning</span>
          </div>
        </div>
      </div>
      <div className="chart-body h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
          {/* Area for new customers */}
          <polygon
            points="40,160 100,150 160,155 220,130 280,140 340,110 400,120 400,180 40,180"
            fill="#10b981"
            fillOpacity="0.2"
            className="chart-area"
          />
          {/* Area for returning customers */}
          <polygon
            points="40,140 100,130 160,135 220,110 280,120 340,90 400,100 400,180 40,180"
            fill="#3b82f6"
            fillOpacity="0.2"
            className="chart-area"
          />
          {/* Lines */}
          <polyline
            points="40,160 100,150 160,155 220,130 280,140 340,110 400,120"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            className="chart-line"
          />
          <polyline
            points="40,140 100,130 160,135 220,110 280,120 340,90 400,100"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            className="chart-line"
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 text-xs text-gray-500">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
        </div>
      </div>
    </div>
  )

  const renderMap = () => (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="text-sm font-medium text-gray-700">Geographic Sales</h4>
      </div>
      <div className="chart-body h-64 relative bg-gray-50 rounded-lg flex items-center justify-center">
        {/* Simple map representation */}
        <div className="grid grid-cols-3 gap-2 w-full p-4">
          {mockGeoData.map(region => (
            <div key={region.region} className="text-center">
              <div className={`h-16 ${getColorClass('primary')} rounded-lg opacity-${region.value} chart-region`}></div>
              <span className="text-xs text-gray-600 mt-1 block">{region.region}</span>
              <span className="text-xs font-medium text-gray-900">{region.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderHeatmap = () => (
    <div className="chart-container">
      <div className="chart-header">
        <h4 className="text-sm font-medium text-gray-700">Hourly Sales Heatmap</h4>
      </div>
      <div className="chart-body h-64 overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-8 gap-1">
            <div className="col-span-1"></div>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-600 py-2">{day}</div>
            ))}
            
            {mockHeatmapData.map(row => (
              <React.Fragment key={row.hour}>
                <div className="text-xs text-gray-600 flex items-center">{row.hour}</div>
                <div className={`h-8 rounded ${getColorClass('primary')} opacity-20 chart-heat-cell`}></div>
                <div className={`h-8 rounded ${getColorClass('primary')} opacity-30 chart-heat-cell`}></div>
                <div className={`h-8 rounded ${getColorClass('primary')} opacity-20 chart-heat-cell`}></div>
                <div className={`h-8 rounded ${getColorClass('primary')} opacity-40 chart-heat-cell`}></div>
                <div className={`h-8 rounded ${getColorClass('primary')} opacity-60 chart-heat-cell`}></div>
                <div className={`h-8 rounded ${getColorClass('primary')} opacity-80 chart-heat-cell`}></div>
                <div className={`h-8 rounded ${getColorClass('primary')} opacity-50 chart-heat-cell`}></div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderChart = () => {
    switch(activeChart) {
      case 'revenue':
        return renderLineChart()
      case 'orders':
        return renderPieChart()
      case 'products':
        return renderBarChart(mockBarData, 'Top Products', 'warning')
      case 'category':
        return renderBarChart(mockCategoryData, 'Sales by Category', 'info')
      case 'customers':
        return renderAreaChart()
      case 'geographic':
        return renderMap()
      case 'hourly':
        return renderHeatmap()
      default:
        return renderLineChart()
    }
  }

  return (
    <div className="charts-section">
      {/* Chart Type Selector */}
      <div className="chart-tabs mb-4 flex flex-wrap gap-2">
        {charts.map(chart => {
          const Icon = chart.icon
          return (
            <button
              key={chart.id}
              className={`chart-tab px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                activeChart === chart.id
                  ? `${getBgColorClass(chart.color)} ${getTextColorClass(chart.color)}`
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveChart(chart.id)}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{chart.title}</span>
            </button>
          )
        })}
      </div>

      {/* Main Chart */}
      <div className="chart-main bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {charts.find(c => c.id === activeChart)?.title}
            </h3>
            <p className="text-sm text-gray-500">
              {charts.find(c => c.id === activeChart)?.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <Download size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <Maximize2 size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="chart-wrapper">
          {renderChart()}
        </div>

        {/* Chart Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: Today at 10:30 AM</span>
          <span>Data for {dateRange === 'custom' ? `${customDate.start} to ${customDate.end}` : dateRange}</span>
        </div>
      </div>

      {/* Small Chart Previews */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
        {charts.slice(0, 6).map(chart => {
          const Icon = chart.icon
          return (
            <button
              key={chart.id}
              className={`chart-preview p-3 rounded-lg border transition-all ${
                activeChart === chart.id
                  ? `border-${chart.color}-500 bg-${chart.color}-50`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setActiveChart(chart.id)}
            >
              <Icon size={20} className={activeChart === chart.id ? getTextColorClass(chart.color) : 'text-gray-400'} />
              <p className={`text-xs mt-1 font-medium ${activeChart === chart.id ? 'text-gray-900' : 'text-gray-600'}`}>
                {chart.title}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}