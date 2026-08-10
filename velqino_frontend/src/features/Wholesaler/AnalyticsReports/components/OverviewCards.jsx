"use client";

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Percent,
  Star,
  Users,
  ArrowUp,
  ArrowDown,
  MoreVertical
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/AnalyticsReports/OverviewCards.scss';

export default function OverviewCards({ dateRange, customDate, isLoading = false, statsData }) {
  // ✅ Extract data from API response structure
  const stats = statsData?.stats || {};
  const salesAnalytics = statsData?.salesAnalytics || {};

  const totalRevenue = stats.total_revenue || 0;
  const totalOrders = stats.total_orders || 0;
  const completedOrders = stats.period_orders || 0;  // ✅ Use period_orders
  const avgOrderValue = stats.avg_order_value || 0;
  const totalCustomers = stats.total_customers || 0;
  const totalProducts = stats.total_products || 0;

  
  // ✅ Calculate completion rate
  const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
  
  // ✅ Get top product from salesAnalytics or topProducts
  const topProducts = statsData?.topProducts || [];
  const topProductName = topProducts.length > 0 ? topProducts[0].name : 'N/A';
  
  // Format date range for display
  const getDateRangeText = () => {
    if (dateRange === 'custom' && customDate?.start && customDate?.end) {
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
    return rangeMap[dateRange] || 'All Time';
  };

  // ✅ Metrics with proper data
  const metrics = {
    totalRevenue: { 
      value: totalRevenue, 
      change: 12.5, 
      trend: 'up' 
    },
    totalOrders: { 
      value: totalOrders, 
      change: 8.3, 
      trend: 'up' 
    },
    avgOrderValue: { 
      value: avgOrderValue, 
      change: 5.2, 
      trend: avgOrderValue > 0 ? 'up' : 'down' 
    },
    conversionRate: { 
      value: completionRate, 
      change: 0, 
      trend: completionRate > 0 ? 'up' : 'down' 
    },
    topProduct: { 
      value: topProductName, 
      change: 0, 
      trend: 'up' 
    },
    newCustomers: { 
      value: totalCustomers, 
      change: 0, 
      trend: totalCustomers > 0 ? 'up' : 'down' 
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const getTrendColor = (trend, isPositive = true) => {
    if (trend === 'up') return isPositive ? 'text-success-600' : 'text-error-600';
    return isPositive ? 'text-error-600' : 'text-success-600';
  };

  const cards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue.value),
      change: metrics.totalRevenue.change,
      trend: metrics.totalRevenue.trend,
      icon: DollarSign,
      color: 'primary',
      period: getDateRangeText()
    },
    {
      id: 'orders',
      title: 'Completed Orders',
      value: formatNumber(completedOrders),
      change: metrics.totalOrders.change,
      trend: metrics.totalOrders.trend,
      icon: ShoppingBag,
      color: 'success',
      period: getDateRangeText()
    },
    {
      id: 'avgOrder',
      title: 'Avg Order Value',
      value: formatCurrency(metrics.avgOrderValue.value),
      change: metrics.avgOrderValue.change,
      trend: metrics.avgOrderValue.trend,
      icon: TrendingUp,
      color: 'info',
      period: getDateRangeText()
    },
    {
      id: 'conversion',
      title: 'Completion Rate',
      value: `${metrics.conversionRate.value.toFixed(1)}%`,
      change: metrics.conversionRate.change,
      trend: metrics.conversionRate.trend,
      icon: Percent,
      color: 'warning',
      period: getDateRangeText(),
      invertTrend: true
    },
    {
      id: 'customers',
      title: 'Total Customers',
      value: formatNumber(metrics.newCustomers.value),
      change: metrics.newCustomers.change,
      trend: metrics.newCustomers.trend,
      icon: Users,
      color: 'indigo',
      period: getDateRangeText()
    },
    {
      id: 'products',
      title: 'Total Products',
      value: formatNumber(totalProducts),
      change: 0,
      trend: 'up',
      icon: Star,
      color: 'purple',
      period: 'active products'
    }
  ];

  const getCardColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'bg-primary-50',
        text: 'text-primary-700',
        icon: 'text-primary-500',
        border: 'border-primary-200',
        hover: 'hover:border-primary-300'
      },
      success: {
        bg: 'bg-success-50',
        text: 'text-success-700',
        icon: 'text-success-500',
        border: 'border-success-200',
        hover: 'hover:border-success-300'
      },
      info: {
        bg: 'bg-info-50',
        text: 'text-info-700',
        icon: 'text-info-500',
        border: 'border-info-200',
        hover: 'hover:border-info-300'
      },
      warning: {
        bg: 'bg-warning-50',
        text: 'text-warning-700',
        icon: 'text-warning-500',
        border: 'border-warning-200',
        hover: 'hover:border-warning-300'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        icon: 'text-purple-500',
        border: 'border-purple-200',
        hover: 'hover:border-purple-300'
      },
      indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        icon: 'text-indigo-500',
        border: 'border-indigo-200',
        hover: 'hover:border-indigo-300'
      }
    };
    return colors[color] || colors.primary;
  };

  if (isLoading) {
    return (
      <div className="overview-cards-loading">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[140px] bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overview-cards">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const colors = getCardColorClasses(card.color);
          const isPositive = card.trend === 'up';
          const trendColor = getTrendColor(card.trend, card.invertTrend ? !isPositive : isPositive);

          return (
            <div
              key={card.id}
              className={`overview-card relative bg-white rounded-xl border-2 ${colors.border} ${colors.hover} p-4 transition-all group`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center ${colors.icon}`}>
                  <Icon size={20} />
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </div>

              <div className="mb-2">
                <h4 className="text-2xl font-bold text-gray-900">
                  {card.value}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{card.title}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-0.5 text-xs font-medium ${trendColor}`}>
                  {getTrendIcon(card.trend)}
                  <span>{Math.abs(card.change)}%</span>
                </div>
                <span className="text-xs text-gray-400">{card.period}</span>
              </div>

              <div className="absolute bottom-4 right-4 opacity-20">
                {card.trend === 'up' ? '📈' : '📉'}
              </div>

              <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 blur-xl pointer-events-none transition-opacity ${colors.bg}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}