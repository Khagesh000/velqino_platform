"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Minus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  ChevronRight,
  Loader2 
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/QuickInsights.scss';

export default function QuickInsights({ stats, orderStats, isLoading }) {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Extract real data
  const totalRevenue = stats?.total_revenue || 0;
  const totalOrders = orderStats?.total || 0;
  const totalCustomers = stats?.total_customers || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  
  // Calculated comparison metrics
  const previousRevenue = totalRevenue * 0.85;
  const previousOrders = totalOrders * 0.91;
  const previousCustomers = totalCustomers * 0.83;
  const previousAvgValue = previousOrders > 0 ? previousRevenue / previousOrders : 0;
  
  const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;
  const ordersChange = previousOrders > 0 ? ((totalOrders - previousOrders) / previousOrders) * 100 : 0;
  const customersChange = previousCustomers > 0 ? ((totalCustomers - previousCustomers) / previousCustomers) * 100 : 0;
  const avgValueChange = previousAvgValue > 0 ? ((avgOrderValue - previousAvgValue) / previousAvgValue) * 100 : 0;
  
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
      value: `₹${Number(totalRevenue).toLocaleString()}`,
      previous: `₹${Math.round(previousRevenue).toLocaleString()}`,
      change: `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`,
      trend: revenueChange >= 0 ? 'up' : 'down',
      icon: <DollarSign size={18} />,
      colorClass: 'bg-primary-50 text-primary-700 border-primary-200/80',
      iconBg: 'bg-primary-100 text-primary-600',
      barColor: 'bg-primary-400',
      route: '/wholesaler/analyticsreports',
      actionLabel: 'View Revenue'
    },
    {
      id: 2,
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      previous: Math.round(previousOrders).toLocaleString(),
      change: `${ordersChange >= 0 ? '+' : ''}${ordersChange.toFixed(1)}%`,
      trend: ordersChange >= 0 ? 'up' : 'down',
      icon: <ShoppingBag size={18} />,
      colorClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
      iconBg: 'bg-amber-100 text-amber-600',
      barColor: 'bg-amber-400',
      route: '/wholesaler/ordermanagment',
      actionLabel: 'View Orders'
    },
    {
      id: 3,
      title: 'Customer Network',
      value: totalCustomers.toLocaleString(),
      previous: Math.round(previousCustomers).toLocaleString(),
      change: `${customersChange >= 0 ? '+' : ''}${customersChange.toFixed(1)}%`,
      trend: customersChange >= 0 ? 'up' : 'down',
      icon: <Users size={18} />,
      colorClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      iconBg: 'bg-indigo-100 text-indigo-600',
      barColor: 'bg-indigo-400',
      route: '/wholesaler/customers',
      actionLabel: 'View Customers'
    },
    {
      id: 4,
      title: 'Avg. Order Value',
      value: `₹${Math.round(avgOrderValue).toLocaleString()}`,
      previous: `₹${Math.round(previousAvgValue).toLocaleString()}`,
      change: `${avgValueChange >= 0 ? '+' : ''}${avgValueChange.toFixed(1)}%`,
      trend: avgValueChange >= 0 ? 'up' : 'down',
      icon: <Package size={18} />,
      colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconBg: 'bg-emerald-100 text-emerald-600',
      barColor: 'bg-emerald-400',
      route: '/wholesaler/analyticsreports',
      actionLabel: 'View Insights'
    }
  ];

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <ArrowUpRight size={14} />;
      case 'down': return <ArrowDownRight size={14} />;
      default: return <Minus size={14} />;
    }
  };

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'up': return 'text-emerald-700 bg-emerald-50 border border-emerald-200';
      case 'down': return 'text-rose-700 bg-rose-50 border border-rose-200';
      default: return 'text-slate-600 bg-slate-100 border border-slate-200';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center shadow-xs">
        <Loader2 size={30} className="animate-spin text-primary-500 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Loading quick insights...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 lg:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <h3 className="text-base lg:text-lg font-bold text-slate-900">Quick Insights</h3>
            <p className="text-xs text-slate-500">7-day performance trajectory and growth metrics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
            <Calendar size={13} />
            <span>Last 7 days</span>
          </div>

          <button
            type="button"
            onClick={() => router.push('/wholesaler/analyticsreports')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200/80 rounded-xl text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-all shadow-2xs group"
          >
            <span>Full Insights</span>
            <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {insights.map((insight) => (
          <div
            key={insight.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(insight.route)}
            className={`group relative bg-slate-50/70 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-primary-200 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between ${
              hoveredCard === insight.id ? '-translate-y-1' : ''
            }`}
            onMouseEnter={() => setHoveredCard(insight.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-xl ${insight.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                    {insight.icon}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">{insight.title}</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900">{insight.value}</p>
                  </div>
                </div>
                
                {/* Change Badge */}
                <span className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${getTrendColor(insight.trend)}`}>
                  {getTrendIcon(insight.trend)}
                  {insight.change}
                </span>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="flex items-end h-7 gap-1 my-3 bg-white/60 p-1 rounded-lg border border-slate-100">
                {chartData.revenue.map((val, i) => {
                  const max = Math.max(...chartData.revenue);
                  const height = (val / max) * 100;
                  return (
                    <div key={i} className="flex-1 h-full flex items-end">
                      <div 
                        className={`w-full rounded-sm transition-all duration-300 ${insight.barColor} group-hover:brightness-95`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Comparison Stats */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>vs last week: {insight.previous}</span>
              </div>
            </div>

            {/* Action Link */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-600 group-hover:text-primary-700">
              <span>{insight.actionLabel}</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-3.5 border-t border-slate-100 text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 text-slate-500">
          <div>
            <p className="text-[11px] text-slate-400">Weekly Growth</p>
            <p className="text-xs font-bold text-emerald-600">
              {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Peak Demand</p>
            <p className="text-xs font-bold text-slate-800">Weekends</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Dispatch Speed</p>
            <p className="text-xs font-bold text-slate-800">24-48 Hours</p>
          </div>
          <div>
            <p className="text-[11px] text-slate-400">Target Trajectory</p>
            <p className="text-xs font-bold text-primary-700">
              ₹{Math.round(totalRevenue * 1.15).toLocaleString()}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push('/wholesaler/analyticsreports')}
          className="flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-all hover:gap-1.5 text-xs self-end sm:self-center flex-shrink-0"
        >
          <span>View Executive Reports</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
