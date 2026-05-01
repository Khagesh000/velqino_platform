"use client";

import React from 'react';
import { Package, Wallet, Clock, CheckCircle } from '../../../utils/icons';

export default function StatsCards({ totalOrders, totalSpent, pendingOrders, deliveredOrders }) {
  const stats = [
    { 
      icon: <Package size={20} className="text-primary-500" />,
      label: 'Total Orders',
      value: totalOrders,
      color: 'bg-primary-50'
    },
    { 
      icon: <Wallet size={20} className="text-green-500" />,
      label: 'Total Spent',
      value: `₹${totalSpent.toLocaleString()}`,
      color: 'bg-green-50'
    },
    { 
      icon: <Clock size={20} className="text-orange-500" />,
      label: 'Pending',
      value: pendingOrders,
      color: 'bg-orange-50'
    },
    { 
      icon: <CheckCircle size={20} className="text-green-500" />,
      label: 'Delivered',
      value: deliveredOrders,
      color: 'bg-green-50'
    },
  ];
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.color} rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-2">
            {stat.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}