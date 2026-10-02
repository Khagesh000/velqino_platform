"use client";

import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Percent,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Info
} from '@/utils/icons';
import '../../../../styles/Wholesaler/AnalyticsReports/OverviewCards.scss';

export default function OverviewCards({ dateRange, customDate, isLoading = false, statsData }) {
  // Extract data from API response structure
  const stats = statsData?.stats || statsData || {};
  const orderStatusDistribution = Array.isArray(statsData?.orderStatusDistribution) 
    ? statsData.orderStatusDistribution 
    : [];

  const totalRevenue = Number(stats.total_revenue) || 0;
  const periodRevenue = Number(stats.period_revenue) || 0;
  const growthPercentage = Number(stats.growth_percentage) || 0;

  // Calculate order metrics
  const totalOrders = Number(stats.total_orders) || orderStatusDistribution.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  const deliveredItem = orderStatusDistribution.find(s => s.status?.toLowerCase() === 'delivered');
  const deliveredOrders = deliveredItem ? Number(deliveredItem.count) : (Number(stats.period_orders) || 0);
  const pendingItem = orderStatusDistribution.find(s => s.status?.toLowerCase() === 'pending');
  const pendingOrders = pendingItem ? Number(pendingItem.count) : 0;

  // Completion rate (percentage of total orders delivered)
  const completionRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

  // Average order value
  const avgOrderValue = Number(stats.avg_order_value) > 0 
    ? Number(stats.avg_order_value) 
    : (totalOrders > 0 && totalRevenue > 0 ? Math.round(totalRevenue / totalOrders) : 0);

  // Products and inventory
  const totalProducts = Number(stats.total_products) || 0;
  const lowStockCount = Number(stats.low_stock_count) || 0;

  // Format date range text
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
    return rangeMap[dateRange] || 'Last 30 days';
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

  const cards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      subtitle: periodRevenue > 0 ? `₹${formatNumber(periodRevenue)} in selected period` : `Overall business sales`,
      change: `${growthPercentage >= 0 ? '+' : ''}${growthPercentage}%`,
      trend: growthPercentage >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'primary',
      theme: {
        gradient: 'from-primary-50/70 via-white to-white',
        border: 'border-primary-200/80 hover:border-primary-400',
        iconBg: 'bg-primary-500 text-white',
        text: 'text-primary-800',
        badge: growthPercentage >= 0 ? 'text-emerald-700 bg-emerald-100/80' : 'text-rose-700 bg-rose-100/80',
        accentBar: 'bg-primary-500'
      }
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: formatNumber(totalOrders),
      subtitle: `${deliveredOrders} Delivered · ${pendingOrders} Pending`,
      change: `${totalOrders} orders`,
      trend: 'up',
      icon: ShoppingBag,
      color: 'emerald',
      theme: {
        gradient: 'from-emerald-50/70 via-white to-white',
        border: 'border-emerald-200/80 hover:border-emerald-400',
        iconBg: 'bg-emerald-500 text-white',
        text: 'text-emerald-800',
        badge: 'text-emerald-700 bg-emerald-100/80',
        accentBar: 'bg-emerald-500'
      }
    },
    {
      id: 'avgOrder',
      title: 'Avg. Order Value',
      value: formatCurrency(avgOrderValue),
      subtitle: `Calculated across ${totalOrders} orders`,
      change: avgOrderValue > 0 ? 'Optimal' : '0.0',
      trend: avgOrderValue > 0 ? 'up' : 'down',
      icon: TrendingUp,
      color: 'blue',
      theme: {
        gradient: 'from-blue-50/70 via-white to-white',
        border: 'border-blue-200/80 hover:border-blue-400',
        iconBg: 'bg-blue-500 text-white',
        text: 'text-blue-800',
        badge: 'text-blue-700 bg-blue-100/80',
        accentBar: 'bg-blue-500'
      }
    },
    {
      id: 'completion',
      title: 'Fulfillment Rate',
      value: `${completionRate.toFixed(1)}%`,
      subtitle: `${deliveredOrders} of ${totalOrders} successfully completed`,
      change: `${deliveredOrders} fulfilled`,
      trend: completionRate >= 50 ? 'up' : 'down',
      icon: Percent,
      color: 'amber',
      theme: {
        gradient: 'from-amber-50/70 via-white to-white',
        border: 'border-amber-200/80 hover:border-amber-400',
        iconBg: 'bg-amber-500 text-white',
        text: 'text-amber-800',
        badge: 'text-amber-700 bg-amber-100/80',
        accentBar: 'bg-amber-500'
      }
    },
    {
      id: 'products',
      title: 'Catalog Products',
      value: formatNumber(totalProducts),
      subtitle: `Active wholesale catalog items`,
      change: 'Active SKUs',
      trend: 'up',
      icon: Package,
      color: 'purple',
      theme: {
        gradient: 'from-purple-50/70 via-white to-white',
        border: 'border-purple-200/80 hover:border-purple-400',
        iconBg: 'bg-purple-500 text-white',
        text: 'text-purple-800',
        badge: 'text-purple-700 bg-purple-100/80',
        accentBar: 'bg-purple-500'
      }
    },
    {
      id: 'stockAlert',
      title: 'Stock Health',
      value: `${lowStockCount} Low Stock`,
      subtitle: lowStockCount > 0 ? `Items need replenishment` : `All inventory healthy`,
      change: lowStockCount > 0 ? 'Attention' : 'Healthy',
      trend: lowStockCount > 0 ? 'down' : 'up',
      icon: AlertTriangle,
      color: lowStockCount > 0 ? 'rose' : 'emerald',
      theme: lowStockCount > 0 ? {
        gradient: 'from-rose-50/70 via-white to-white',
        border: 'border-rose-200/80 hover:border-rose-400',
        iconBg: 'bg-rose-500 text-white',
        text: 'text-rose-800',
        badge: 'text-rose-700 bg-rose-100/80',
        accentBar: 'bg-rose-500'
      } : {
        gradient: 'from-emerald-50/70 via-white to-white',
        border: 'border-emerald-200/80 hover:border-emerald-400',
        iconBg: 'bg-emerald-500 text-white',
        text: 'text-emerald-800',
        badge: 'text-emerald-700 bg-emerald-100/80',
        accentBar: 'bg-emerald-500'
      }
    }
  ];

  if (isLoading && !statsData?.stats) {
    return (
      <div className="overview-cards-loading">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-[150px] bg-white rounded-2xl border border-slate-200/70 p-4 flex flex-col justify-between animate-pulse shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-200" />
                <div className="w-14 h-5 rounded-md bg-slate-100" />
              </div>
              <div className="space-y-2 mt-2">
                <div className="w-24 h-6 rounded-md bg-slate-200" />
                <div className="w-16 h-3.5 rounded-md bg-slate-100" />
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overview-cards">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const theme = card.theme;
          const isUp = card.trend === 'up';

          return (
            <div
              key={card.id}
              className={`
                overview-card group relative overflow-hidden rounded-2xl p-4 sm:p-4.5
                bg-gradient-to-br ${theme.gradient} border ${theme.border}
                shadow-2xs hover:shadow-md transition-all duration-300 hover:-translate-y-1
                flex flex-col justify-between
              `}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Header: Icon & Badge */}
              <div className="flex items-start justify-between mb-2.5">
                <div className={`p-2.5 rounded-xl ${theme.iconBg} shadow-xs transition-transform duration-300 group-hover:scale-105`}>
                  <Icon size={18} />
                </div>
                
                <div className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${theme.badge}`}>
                  {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  <span>{card.change}</span>
                </div>
              </div>

              {/* Main Metric Value & Title */}
              <div>
                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {card.value}
                </h4>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{card.title}</p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1" title={card.subtitle}>
                  {card.subtitle}
                </p>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">{getDateRangeText()}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${theme.accentBar}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}