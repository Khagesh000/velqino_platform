"use client";

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown, 
  Truck, 
  DollarSign,
  Sparkles,
  CheckCircle,
  XCircle
} from '../../../../utils/icons';

export default function StockOverview({ refreshTrigger }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const stockStats = [
    {
      id: 'total',
      title: 'Total SKU Units',
      value: '2,450',
      change: '+12% vs last mo',
      trend: 'up',
      icon: Package,
      colorClass: 'text-primary-600 bg-primary-50 border-primary-100',
      badge: 'Active Stock',
      description: 'Active items in warehouse'
    },
    {
      id: 'low',
      title: 'Low Stock Triggers',
      value: '23',
      change: 'Needs Reorder',
      trend: 'warning',
      icon: AlertCircle,
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
      badge: 'Threshold Alert',
      description: 'Below minimum safety level'
    },
    {
      id: 'out',
      title: 'Depleted / Out of Stock',
      value: '8',
      change: 'Critical Attention',
      trend: 'down',
      icon: XCircle,
      colorClass: 'text-rose-600 bg-rose-50 border-rose-100',
      badge: 'Stock-out',
      description: 'Zero units remaining'
    },
    {
      id: 'incoming',
      title: 'Inward Consignments',
      value: '450',
      change: '5 Shipments',
      trend: 'up',
      icon: Truck,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      badge: 'En Route',
      description: 'Expected within 48-72h'
    },
    {
      id: 'valuation',
      title: 'Inventory Valuation',
      value: '₹14.8L',
      change: '+8.4% asset value',
      trend: 'up',
      icon: DollarSign,
      colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      badge: 'Asset Value',
      description: 'Total wholesale capital locked'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {stockStats.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <div
            key={stat.id}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-gray-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-2xl border flex items-center justify-center shrink-0 ${stat.colorClass}`}>
                <IconComponent size={18} />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {stat.badge}
              </span>
            </div>

            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {stat.title}
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                {stat.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
