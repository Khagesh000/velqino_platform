"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight, 
  Info 
} from '../../../../utils/icons';

export default function RetailerKPIStatsCards({ stats = {}, isLoading }) {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-44 bg-white/70 border border-gray-200/80 rounded-2xl animate-pulse p-5">
            <div className="w-10 h-10 bg-gray-200 rounded-xl mb-4" />
            <div className="w-24 h-4 bg-gray-200 rounded mb-2" />
            <div className="w-32 h-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const todaySalesVal = Number(stats?.today_sales?.value || 0);
  const totalOrdersVal = Number(stats?.total_orders?.value || 0);
  const totalCustomersVal = Number(stats?.total_customers?.value || 0);
  const totalProductsVal = Number(stats?.total_products?.value || 0);

  const statsList = [
    {
      id: 'today_sales',
      title: "Today's POS Sales",
      value: `₹${todaySalesVal.toLocaleString('en-IN')}`,
      change: `${(stats?.today_sales?.change ?? 0) >= 0 ? '+' : ''}${stats?.today_sales?.change || 0}%`,
      trend: stats?.today_sales?.trend || 'up',
      icon: <TrendingUp size={22} />,
      theme: {
        bg: 'bg-primary-500',
        gradient: 'from-primary-50/60 to-white',
        border: 'border-primary-200/90',
        text: 'text-primary-700',
        actionBg: 'bg-primary-50 text-primary-700 hover:bg-primary-100',
        iconColor: 'text-white'
      },
      route: '/retailer/possales',
      actionLabel: 'Open POS Register',
      tooltip: 'Real-time revenue collected across all counter checkouts and orders today'
    },
    {
      id: 'total_orders',
      title: 'Total Store Orders',
      value: totalOrdersVal.toLocaleString('en-IN'),
      change: '+100%',
      trend: 'up',
      icon: <ShoppingBag size={22} />,
      theme: {
        bg: 'bg-amber-500',
        gradient: 'from-amber-50/60 to-white',
        border: 'border-amber-200/90',
        text: 'text-amber-700',
        actionBg: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
        iconColor: 'text-white'
      },
      route: '/retailer/retailerorders',
      actionLabel: 'Manage Orders',
      tooltip: 'Total customer purchases placed and fulfilled in your retail system'
    },
    {
      id: 'total_customers',
      title: 'Verified Buyers',
      value: totalCustomersVal.toLocaleString('en-IN'),
      change: '+12%',
      trend: 'up',
      icon: <Users size={22} />,
      theme: {
        bg: 'bg-emerald-500',
        gradient: 'from-emerald-50/60 to-white',
        border: 'border-emerald-200/90',
        text: 'text-emerald-700',
        actionBg: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
        iconColor: 'text-white'
      },
      route: '/retailer/retailercustomers',
      actionLabel: 'Customer Directory',
      tooltip: 'Active registered clients and retail buyer profiles'
    },
    {
      id: 'total_products',
      title: 'Store Inventory SKUs',
      value: totalProductsVal.toLocaleString('en-IN'),
      change: '+38 items',
      trend: 'up',
      icon: <Package size={22} />,
      theme: {
        bg: 'bg-indigo-500',
        gradient: 'from-indigo-50/60 to-white',
        border: 'border-indigo-200/90',
        text: 'text-indigo-700',
        actionBg: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
        iconColor: 'text-white'
      },
      route: '/retailer/retailerproducts',
      actionLabel: 'View Products',
      tooltip: 'Catalog items and product lots stocked in your retail inventory'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {statsList.map((stat) => {
        const theme = stat.theme;
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
                <div className={`p-3 rounded-xl ${theme.bg} ${theme.iconColor} shadow-xs transition-transform duration-300 group-hover:scale-105`}>
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
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white/80 transition-colors"
                      title="Information"
                      aria-label="Info"
                    >
                      <Info size={15} />
                    </button>
                    
                    {showTooltip === stat.id && (
                      <div 
                        className="absolute right-0 top-7 w-48 bg-gray-900 text-white text-xs rounded-xl shadow-xl p-3 z-30 animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <p className="text-gray-200 leading-relaxed">{stat.tooltip}</p>
                        <div className="absolute -top-1 right-2.5 w-2 h-2 bg-gray-900 transform rotate-45" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title & Metrics */}
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">{stat.title}</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
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
            <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs font-semibold">
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
