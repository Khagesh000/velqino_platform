"use client";

import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight, 
  Calendar, DollarSign, ShoppingBag, Users, Package, Loader2 
} from '../../../../utils/icons';
import { useGetWholesalerStatsQuery, useGetOrderStatsQuery } from '@/redux/wholesaler/slices/statsSlice';
import '../../../../styles/Wholesaler/WholesalerDashboard/QuickInsights.scss';

export default function QuickInsights() {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // ✅ Fetch only once - data already cached by Redux
  const { data: statsData, isLoading: statsLoading } = useGetWholesalerStatsQuery();
  const { data: orderStatsData, isLoading: ordersLoading } = useGetOrderStatsQuery();
  
  const isLoading = statsLoading || ordersLoading;
  
  // ✅ Extract real data
  const totalRevenue = statsData?.data?.total_revenue || 0;
  const totalOrders = orderStatsData?.data?.total || 0;
  const totalCustomers = statsData?.data?.total_customers || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // ✅ Mock previous week data (from cache or calculate)
  const previousRevenue = totalRevenue * 0.85; // Mock 15% growth
  const previousOrders = totalOrders * 0.91; // Mock 9% growth
  const previousCustomers = totalCustomers * 0.83; // Mock 17% growth
  const previousAvgValue = previousRevenue / previousOrders;
  
  // ✅ Calculate changes
  const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  const ordersChange = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0;
  const customersChange = previousCustomers > 0 ? ((totalCustomers - previousCustomers) / previousCustomers) * 100 : 0;
  const avgValueChange = previousAvgValue > 0 ? ((avgOrderValue - previousAvgValue) / previousAvgValue) * 100 : 0;
  
  // ✅ Mock chart data (can be from revenue-over-time endpoint later)
  const chartData = {
    revenue: [45, 52, 48, 55, 62, 58, 65],
    orders: [12, 15, 11, 18, 14, 16, 19],
    customers: [3, 5, 4, 6, 5, 7, 8],
    avgValue: [1450, 1520, 1480, 1580, 1620, 1550, 1650]
  };
  
  const insights = [
    {
      id: 1,
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      previous: `₹${previousRevenue.toLocaleString()}`,
      change: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`,
      trend: revenueChange >= 0 ? 'up' : 'down',
      icon: <DollarSign size={20} />,
      color: 'primary',
      comparison: 'vs last week',
      chart: chartData.revenue
    },
    {
      id: 2,
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      previous: previousOrders.toLocaleString(),
      change: `${ordersChange >= 0 ? '+' : ''}${ordersChange.toFixed(1)}%`,
      trend: ordersChange >= 0 ? 'up' : 'down',
      icon: <ShoppingBag size={20} />,
      color: 'success',
      comparison: 'vs last week',
      chart: chartData.orders
    },
    {
      id: 3,
      title: 'New Customers',
      value: totalCustomers.toLocaleString(),
      previous: previousCustomers.toLocaleString(),
      change: `${customersChange >= 0 ? '+' : ''}${customersChange.toFixed(1)}%`,
      trend: customersChange >= 0 ? 'up' : 'down',
      icon: <Users size={20} />,
      color: 'accent',
      comparison: 'vs last week',
      chart: chartData.customers
    },
    {
      id: 4,
      title: 'Avg. Order Value',
      value: `₹${Math.round(avgOrderValue).toLocaleString()}`,
      previous: `₹${Math.round(previousAvgValue).toLocaleString()}`,
      change: `${avgValueChange >= 0 ? '+' : ''}${avgValueChange.toFixed(1)}%`,
      trend: avgValueChange >= 0 ? 'up' : 'down',
      icon: <Package size={20} />,
      color: 'info',
      comparison: 'vs last week',
      chart: chartData.avgValue
    }
  ];

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <ArrowUpRight size={16} />;
      case 'down': return <ArrowDownRight size={16} />;
      default: return <Minus size={16} />;
    }
  };

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'up': return 'text-success-600 bg-success-100';
      case 'down': return 'text-error-600 bg-error-100';
      default: return 'text-tertiary bg-surface-2';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-light p-6 text-center">
        <Loader2 size={32} className="animate-spin text-primary-500 mx-auto mb-3" />
        <p className="text-sm text-tertiary">Loading insights...</p>
      </div>
    );
  }

  return (
    <div className="quick-insights bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-accent-100 flex items-center justify-center text-accent-600">
            <TrendingUp size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Quick Insights</h3>
            <p className="text-xs lg:text-sm text-tertiary">This week vs last week performance</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-surface-1 rounded-lg text-xs text-secondary">
            <Calendar size={12} />
            <span>Last 7 days</span>
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`group relative bg-surface-1 rounded-xl p-4 border border-light transition-all hover:shadow-md ${
              hoveredCard === insight.id ? 'scale-[1.02]' : ''
            }`}
            onMouseEnter={() => setHoveredCard(insight.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg ${
                  insight.color === 'primary' ? 'bg-primary-100 text-primary-600' :
                  insight.color === 'success' ? 'bg-success-100 text-success-600' :
                  insight.color === 'accent' ? 'bg-accent-100 text-accent-600' :
                  'bg-info-100 text-info-600'
                } flex items-center justify-center`}>
                  {insight.icon}
                </div>
                <div>
                  <p className="text-xs text-tertiary">{insight.title}</p>
                  <p className="text-lg lg:text-xl font-bold text-primary">{insight.value}</p>
                </div>
              </div>
              
              {/* Change Badge */}
              <span className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(insight.trend)}`}>
                {getTrendIcon(insight.trend)}
                {insight.change}
              </span>
            </div>

            {/* Mini Sparkline Chart */}
            <div className="flex items-end h-8 gap-0.5 mb-3">
              {insight.chart.map((value, i) => {
                const max = Math.max(...insight.chart);
                const height = (value / max) * 100;
                return (
                  <div key={i} className="flex-1 group/chart">
                    <div 
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        insight.color === 'primary' ? 'bg-primary-200 group-hover/chart:bg-primary-400' :
                        insight.color === 'success' ? 'bg-success-200 group-hover/chart:bg-success-400' :
                        insight.color === 'accent' ? 'bg-accent-200 group-hover/chart:bg-accent-400' :
                        'bg-info-200 group-hover/chart:bg-info-400'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Comparison Stats */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                  <span className="text-tertiary">This week</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-surface-3" />
                  <span className="text-tertiary">Last week</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary font-medium">{insight.value}</span>
                <span className="text-tertiary">vs</span>
                <span className="text-tertiary">{insight.previous}</span>
              </div>
            </div>

            {/* Hover Details */}
            {hoveredCard === insight.id && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20">
                <div className="flex items-center gap-3">
                  <span>This week: {insight.value}</span>
                  <span>Last week: {insight.previous}</span>
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary-900 rotate-45" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-light">
        <div className="text-center">
          <p className="text-xs text-tertiary mb-1">Growth rate</p>
          <p className="text-sm font-semibold text-success-600">
            {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-tertiary mb-1">Best day</p>
          <p className="text-sm font-semibold text-primary">Saturday</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-tertiary mb-1">Peak time</p>
          <p className="text-sm font-semibold text-primary">6-8 PM</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-tertiary mb-1">Projected</p>
          <p className="text-sm font-semibold text-accent-600">
            ₹{Math.round(totalRevenue * 1.15).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}