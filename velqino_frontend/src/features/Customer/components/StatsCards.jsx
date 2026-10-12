"use client";

import React from 'react';
import { Package, Wallet, Clock, CheckCircle, Truck, CreditCard, ShieldCheck } from '../../../utils/icons';

export default function StatsCards({ totalOrders, totalSpent, pendingOrders, deliveredOrders }) {
  const stats = [
    { 
      label: 'Lifetime Orders',
      value: totalOrders,
      subtext: 'Verified checkout history',
      icon: <Package size={20} />,
      iconBubble: 'bg-primary-50 text-primary-600',
      badgeColor: 'text-primary-600',
      subIcon: <CheckCircle size={10} />
    },
    { 
      label: 'Gross Shopping Spent',
      value: `₹${Number(totalSpent || 0).toLocaleString('en-IN')}`,
      subtext: 'Net invoice purchases',
      icon: <Wallet size={20} />,
      iconBubble: 'bg-emerald-50 text-emerald-600',
      badgeColor: 'text-emerald-600',
      subIcon: <ShieldCheck size={10} />
    },
    { 
      label: 'In Fulfillment',
      value: pendingOrders,
      subtext: 'Dispatched & processing',
      icon: <Clock size={20} />,
      iconBubble: 'bg-amber-50 text-amber-600',
      badgeColor: 'text-amber-700',
      subIcon: <Truck size={10} />
    },
    { 
      label: 'Delivered Safely',
      value: deliveredOrders,
      subtext: 'Completed handovers',
      icon: <CheckCircle size={20} />,
      iconBubble: 'bg-blue-50 text-blue-600',
      badgeColor: 'text-blue-600',
      subIcon: <CheckCircle size={10} />
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
              {stat.value}
            </h3>
            <span className={`text-[10px] ${stat.badgeColor} font-semibold mt-0.5 inline-flex items-center gap-1`}>
              {stat.subIcon}
              <span>{stat.subtext}</span>
            </span>
          </div>
          <div className={`w-11 h-11 rounded-2xl ${stat.iconBubble} flex items-center justify-center shrink-0`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
