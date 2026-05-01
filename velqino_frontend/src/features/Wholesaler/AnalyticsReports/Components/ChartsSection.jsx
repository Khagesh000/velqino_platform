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
  MoreVertical,
  Maximize2,
  Loader2
} from '../../../../utils/icons';
import { useGetSalesAnalyticsQuery, useGetWholesalerStatsQuery, useGetCategoryPerformanceQuery, useGetTopProductsQuery, useGetGeographicSalesQuery, useGetHourlySalesQuery } from '@/redux/wholesaler/slices/statsSlice';
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
  <div className="h-64 flex items-center justify-center">
    <Loader2 size={32} className="animate-spin text-primary-500" />
  </div>
);

export default function ChartsSection({ dateRange, customDate, showComparison = false }) {
  const [activeChart, setActiveChart] = useState('revenue');
  
  // ✅ Lazy load data - ONLY for active chart
  const { data: statsData } = useGetWholesalerStatsQuery(undefined, { skip: activeChart !== 'orders' && activeChart !== 'customers' });
  const { data: salesData } = useGetSalesAnalyticsQuery('weekly', { skip: activeChart !== 'revenue' });
  const { data: categoryData } = useGetCategoryPerformanceQuery(undefined, { skip: activeChart !== 'category' });
  const { data: topProductsData } = useGetTopProductsQuery(undefined, { skip: activeChart !== 'products' });
  const { data: geoData } = useGetGeographicSalesQuery(undefined, { skip: activeChart !== 'geographic' });
  const { data: hourlyData } = useGetHourlySalesQuery(undefined, { skip: activeChart !== 'hourly' });

  const charts = [
    { id: 'revenue', title: 'Revenue Over Time', icon: TrendingUp, description: 'Daily/weekly/monthly revenue trends', color: 'primary', component: RevenueChart, props: { data: salesData } },
    { id: 'orders', title: 'Orders by Status', icon: PieChart, description: 'Order status distribution', color: 'success', component: OrdersPieChart, props: { data: statsData } },
    { id: 'products', title: 'Top Products', icon: BarChart3, description: 'Best selling products', color: 'warning', component: TopProductsChart, props: { data: topProductsData } },
    { id: 'category', title: 'Category Performance', icon: BarChart3, description: 'Sales by product category', color: 'info', component: CategoryChart, props: { data: categoryData } },
    { id: 'customers', title: 'Customer Growth', icon: Users, description: 'New vs returning customers', color: 'purple', component: CustomerChart, props: { data: statsData } },
    { id: 'geographic', title: 'Geographic Sales', icon: MapPin, description: 'Sales by region', color: 'indigo', component: GeographicChart, props: { data: geoData } },
    { id: 'hourly', title: 'Hourly Sales', icon: Clock, description: 'Peak sales hours', color: 'pink', component: HourlyChart, props: { data: hourlyData } }
  ];

  const ActiveChartComponent = charts.find(c => c.id === activeChart)?.component;
  const chartProps = charts.find(c => c.id === activeChart)?.props || {};

  const getBgColorClass = (color) => {
    const colors = {
      primary: 'bg-primary-50',
      success: 'bg-success-50',
      warning: 'bg-warning-50',
      info: 'bg-info-50',
      purple: 'bg-purple-50',
      indigo: 'bg-indigo-50',
      pink: 'bg-pink-50'
    };
    return colors[color] || colors.primary;
  };

  const getTextColorClass = (color) => {
    const colors = {
      primary: 'text-primary-600',
      success: 'text-success-600',
      warning: 'text-warning-600',
      info: 'text-info-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
      pink: 'text-pink-600'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="charts-section">
      {/* Chart Type Selector */}
      <div className="chart-tabs mb-4 flex flex-wrap gap-2">
        {charts.map(chart => {
          const Icon = chart.icon;
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
          );
        })}
      </div>

      {/* Main Chart - Only renders active chart */}
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

        <div className="chart-wrapper">
          <Suspense fallback={<ChartPlaceholder />}>
            {ActiveChartComponent && <ActiveChartComponent {...chartProps} showComparison={showComparison} dateRange={dateRange} customDate={customDate} />}
          </Suspense>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: Today</span>
          <span>Data for {dateRange === 'custom' ? `${customDate.start} to ${customDate.end}` : dateRange}</span>
        </div>
      </div>

      {/* Small Chart Previews */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mt-4">
        {charts.map(chart => {
          const Icon = chart.icon;
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
          );
        })}
      </div>
    </div>
  );
}