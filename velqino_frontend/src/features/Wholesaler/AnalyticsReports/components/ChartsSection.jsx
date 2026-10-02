"use client";

import React, { useState, lazy, Suspense } from 'react';
import {
  TrendingUp,
  PieChart,
  BarChart3,
  MapPin,
  Users,
  Clock,
  Download,
  Loader2,
  Calendar,
  Grid
} from '@/utils/icons';
import '../../../../styles/Wholesaler/AnalyticsReports/ChartsSection.scss';

// Lazy load chart components
const RevenueChart = lazy(() => import('./Charts/RevenueChart'));
const OrdersPieChart = lazy(() => import('./Charts/OrdersPieChart'));
const TopProductsChart = lazy(() => import('./Charts/TopProductsChart'));
const CategoryChart = lazy(() => import('./Charts/CategoryChart'));
const CustomerChart = lazy(() => import('./Charts/CustomerChart'));
const GeographicChart = lazy(() => import('./Charts/GeographicChart'));
const HourlyChart = lazy(() => import('./Charts/HourlyChart'));

const ChartPlaceholder = () => (
  <div className="h-72 flex flex-col items-center justify-center gap-3">
    <Loader2 size={32} className="animate-spin text-primary-500" />
    <span className="text-xs font-semibold text-slate-400">Loading chart analytics...</span>
  </div>
);

export default function ChartsSection({ 
  dateRange, 
  customDate, 
  showComparison = false,
  statsData = {},
  salesData = {},
  categoryData = [],
  topProductsData = [],
  geoData = [],
  orderStatusData = [],
  hourlyData = []
}) {
  const [activeChart, setActiveChart] = useState('orders'); // Default to 'orders' or 'revenue' - 'orders' has immediate rich data (2 delivered, 2 pending)!

  const totalOrdersCount = Array.isArray(orderStatusData) 
    ? orderStatusData.reduce((acc, curr) => acc + (Number(curr.count) || 0), 0)
    : (Number(statsData?.total_orders) || 0);

  const charts = [
    { 
      id: 'orders', 
      title: 'Orders by Status', 
      icon: PieChart, 
      description: 'Order fulfillment status breakdown and delivery progress', 
      badge: totalOrdersCount > 0 ? `${totalOrdersCount} Orders` : null,
      theme: {
        active: 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-100',
        iconActive: 'text-emerald-600',
        cardBorder: 'hover:border-emerald-300'
      },
      component: OrdersPieChart, 
      props: { data: orderStatusData, stats: statsData } 
    },
    { 
      id: 'revenue', 
      title: 'Revenue Over Time', 
      icon: TrendingUp, 
      description: 'Daily, weekly, and monthly sales performance trajectory', 
      badge: statsData?.total_revenue ? `₹${Number(statsData.total_revenue).toLocaleString()}` : null,
      theme: {
        active: 'bg-primary-50 text-primary-800 border-primary-300 ring-2 ring-primary-100',
        iconActive: 'text-primary-600',
        cardBorder: 'hover:border-primary-300'
      },
      component: RevenueChart, 
      props: { data: salesData, stats: statsData } 
    },
    { 
      id: 'products', 
      title: 'Top Products', 
      icon: BarChart3, 
      description: 'Highest grossing and best-selling wholesale SKUs', 
      badge: topProductsData?.length > 0 ? `${topProductsData.length} SKUs` : null,
      theme: {
        active: 'bg-amber-50 text-amber-800 border-amber-300 ring-2 ring-amber-100',
        iconActive: 'text-amber-600',
        cardBorder: 'hover:border-amber-300'
      },
      component: TopProductsChart, 
      props: { data: topProductsData } 
    },
    { 
      id: 'category', 
      title: 'Category Performance', 
      icon: Grid, 
      description: 'Revenue and product volume breakdown by category', 
      badge: categoryData?.length > 0 ? `${categoryData.length} Categories` : null,
      theme: {
        active: 'bg-blue-50 text-blue-800 border-blue-300 ring-2 ring-blue-100',
        iconActive: 'text-blue-600',
        cardBorder: 'hover:border-blue-300'
      },
      component: CategoryChart, 
      props: { data: categoryData } 
    },
    { 
      id: 'customers', 
      title: 'Customer Growth', 
      icon: Users, 
      description: 'Retailer acquisition and purchasing frequency trends', 
      badge: statsData?.total_customers ? `${statsData.total_customers} Retailers` : null,
      theme: {
        active: 'bg-purple-50 text-purple-800 border-purple-300 ring-2 ring-purple-100',
        iconActive: 'text-purple-600',
        cardBorder: 'hover:border-purple-300'
      },
      component: CustomerChart, 
      props: { data: statsData, statsData: statsData } 
    },
    { 
      id: 'geographic', 
      title: 'Geographic Sales', 
      icon: MapPin, 
      description: 'Regional delivery insights and destination analysis', 
      badge: geoData?.length > 0 ? `${geoData.length} Cities` : null,
      theme: {
        active: 'bg-indigo-50 text-indigo-800 border-indigo-300 ring-2 ring-indigo-100',
        iconActive: 'text-indigo-600',
        cardBorder: 'hover:border-indigo-300'
      },
      component: GeographicChart, 
      props: { data: geoData } 
    },
    { 
      id: 'hourly', 
      title: 'Hourly Sales', 
      icon: Clock, 
      description: 'Peak purchasing hours and daily shopping patterns', 
      badge: null,
      theme: {
        active: 'bg-pink-50 text-pink-800 border-pink-300 ring-2 ring-pink-100',
        iconActive: 'text-pink-600',
        cardBorder: 'hover:border-pink-300'
      },
      component: HourlyChart, 
      props: { data: hourlyData } 
    }
  ];

  const currentChart = charts.find(c => c.id === activeChart) || charts[0];
  const ActiveChartComponent = currentChart.component;
  const chartProps = currentChart.props || {};

  const getDateRangeLabel = () => {
    if (dateRange === 'custom' && customDate?.start && customDate?.end) {
      return `${customDate.start} to ${customDate.end}`;
    }
    const map = {
      today: 'Today',
      yesterday: 'Yesterday',
      last7days: 'Last 7 days',
      last30days: 'Last 30 days',
      thisMonth: 'This Month',
      lastMonth: 'Last Month',
      thisQuarter: 'This Quarter',
      lastQuarter: 'Last Quarter',
      thisYear: 'This Year',
      lastYear: 'Last Year'
    };
    return map[dateRange] || 'Last 30 days';
  };

  return (
    <div className="charts-section">
      {/* Chart Selector Pills */}
      <div className="chart-tabs mb-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {charts.map(chart => {
          const Icon = chart.icon;
          const isActive = activeChart === chart.id;
          
          return (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`
                chart-tab px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 border transition-all whitespace-nowrap
                ${isActive 
                  ? `${chart.theme.active} shadow-xs font-bold` 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
              `}
            >
              <Icon size={16} className={isActive ? chart.theme.iconActive : 'text-slate-400'} />
              <span>{chart.title}</span>
              {chart.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  isActive ? 'bg-white/80 text-slate-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {chart.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Chart Card */}
      <div className="chart-main bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 sm:p-6 transition-all">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {currentChart.title}
              </h3>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                <Calendar size={12} className="text-slate-400" />
                {getDateRangeLabel()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentChart.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
              Interactive View
            </span>
          </div>
        </div>

        {/* Dynamic Chart Body */}
        <div className="chart-wrapper min-h-[280px]">
          <Suspense fallback={<ChartPlaceholder />}>
            {ActiveChartComponent && (
              <ActiveChartComponent 
                {...chartProps} 
                showComparison={showComparison} 
                dateRange={dateRange} 
                customDate={customDate} 
              />
            )}
          </Suspense>
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Real-time wholesaler analytics</span>
          </div>
          <span className="text-slate-400">
            Active Filter: <strong className="text-slate-600 font-semibold">{getDateRangeLabel()}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
