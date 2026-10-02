"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  Package, 
  Wallet, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight,
  Info 
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/KPIstatscards.scss';

export default function KPIStatsCards({ stats = {}, isLoading }) {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);

  const statsDataList = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: `₹${Number(stats.total_revenue || 0).toLocaleString()}`,
      change: `${(stats.revenue_change ?? 0) >= 0 ? '+' : ''}${stats.revenue_change ?? 0}%`,
      trend: (stats.revenue_change ?? 0) >= 0 ? 'up' : 'down',
      icon: <TrendingUp size={22} />,
      colorTheme: {
        bg: 'bg-primary-500',
        gradient: 'from-primary-50/60 to-white',
        border: 'border-primary-200/90',
        text: 'text-primary-700',
        actionBg: 'bg-primary-50 text-primary-700 hover:bg-primary-100'
      },
      route: '/wholesaler/analyticsreports',
      actionLabel: 'Explore Analytics',
      tooltip: 'Total earnings from fulfilled customer orders'
    },
    {
      id: 'pending',
      title: 'Pending Orders',
      value: stats.pending_orders ?? 0,
      change: `${(stats.pending_change ?? 0) >= 0 ? '+' : ''}${stats.pending_change ?? 0}`,
      trend: (stats.pending_change ?? 0) >= 0 ? 'up' : 'down',
      icon: <Clock size={22} />,
      colorTheme: {
        bg: 'bg-amber-500',
        gradient: 'from-amber-50/60 to-white',
        border: 'border-amber-200/90',
        text: 'text-amber-700',
        actionBg: 'bg-amber-50 text-amber-700 hover:bg-amber-100'
      },
      route: '/wholesaler/ordermanagment',
      actionLabel: 'Fulfill Orders',
      tooltip: 'Buyer orders requiring confirmation and packing'
    },
    {
      id: 'products',
      title: 'Products Listed',
      value: stats.total_products ?? 0,
      change: `${(stats.products_change ?? 0) >= 0 ? '+' : ''}${stats.products_change ?? 0}`,
      trend: (stats.products_change ?? 0) >= 0 ? 'up' : 'down',
      icon: <Package size={22} />,
      colorTheme: {
        bg: 'bg-emerald-500',
        gradient: 'from-emerald-50/60 to-white',
        border: 'border-emerald-200/90',
        text: 'text-emerald-700',
        actionBg: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
      },
      route: '/wholesaler/productcatalog',
      actionLabel: 'Manage Catalog',
      tooltip: 'Active SKUs currently listed in your catalog'
    },
    {
      id: 'customers',
      title: 'Total Customers',
      value: stats.total_customers ?? 0,
      change: `${(stats.customers_change ?? 0) >= 0 ? '+' : ''}${stats.customers_change ?? 0}`,
      trend: (stats.customers_change ?? 0) >= 0 ? 'up' : 'down',
      icon: <Wallet size={22} />,
      colorTheme: {
        bg: 'bg-indigo-500',
        gradient: 'from-indigo-50/60 to-white',
        border: 'border-indigo-200/90',
        text: 'text-indigo-700',
        actionBg: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
      },
      route: '/wholesaler/customers',
      actionLabel: 'Partner Directory',
      tooltip: 'Verified retailers and buyer accounts'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {statsDataList.map((stat) => {
        const theme = stat.colorTheme;
        const isHovered = hoveredCard === stat.id;

        return (
          <div
            key={stat.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(stat.route)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push(stat.route);
              }
            }}
            onMouseEnter={() => setHoveredCard(stat.id)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`
              group relative overflow-hidden rounded-2xl p-5 sm:p-6 cursor-pointer
              bg-gradient-to-br ${theme.gradient} border ${theme.border}
              shadow-2xs hover:shadow-lg transition-all duration-300
              ${isHovered ? '-translate-y-1' : ''}
              flex flex-col justify-between
            `}
          >
            <div>
              {/* Header with Icon & Info Tooltip */}
              <div className="flex items-start justify-between mb-3.5">
                <div className={`p-3 rounded-xl ${theme.bg} text-white shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                  {stat.icon}
                </div>
                
                <div className="flex items-center gap-1.5">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTooltip(showTooltip === stat.id ? null : stat.id);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white/80 transition-colors"
                      title="Information"
                    >
                      <Info size={15} />
                    </button>
                    
                    {showTooltip === stat.id && (
                      <div 
                        className="absolute right-0 top-7 w-48 bg-slate-900 text-white text-xs rounded-xl shadow-xl p-3 z-30 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-slate-200 leading-relaxed">{stat.tooltip}</p>
                        <div className="absolute -top-1 right-2.5 w-2 h-2 bg-slate-900 transform rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title & Metrics */}
              <div>
                <p className="text-xs sm:text-sm text-slate-500 mb-1 font-medium">{stat.title}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                  <div className={`
                    inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-md
                    ${stat.trend === 'up' ? 'text-emerald-700 bg-emerald-100/70' : 'text-rose-700 bg-rose-100/70'}
                  `}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Footer with Hover Animation */}
            <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold">
              <span className={`${theme.text} flex items-center gap-1.5 group-hover:underline`}>
                <span>{stat.actionLabel}</span>
              </span>
              <span className={`w-6 h-6 rounded-lg ${theme.actionBg} flex items-center justify-center transition-transform group-hover:translate-x-1`}>
                <ArrowRight size={13} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
