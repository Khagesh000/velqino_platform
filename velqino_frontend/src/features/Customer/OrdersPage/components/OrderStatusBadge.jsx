"use client";

import React from 'react';
import { Clock, CheckCircle, Truck, XCircle, Package } from '../../../../utils/icons';

export default function OrderStatusBadge({ status }) {
  const normalized = (status || '').toLowerCase().trim();

  const getStatusConfig = (val) => {
    switch (val) {
      case 'pending':
        return { 
          icon: Clock, 
          label: 'Pending', 
          classes: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500'
        };
      case 'confirmed':
        return { 
          icon: CheckCircle, 
          label: 'Confirmed', 
          classes: 'bg-blue-50 text-blue-700 border-blue-200/80',
          dot: 'bg-blue-500'
        };
      case 'processing':
        return { 
          icon: Package, 
          label: 'Processing', 
          classes: 'bg-purple-50 text-purple-700 border-purple-200/80',
          dot: 'bg-purple-500'
        };
      case 'shipped':
        return { 
          icon: Truck, 
          label: 'Shipped', 
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          dot: 'bg-indigo-500'
        };
      case 'out_for_delivery':
        return { 
          icon: Truck, 
          label: 'Out for Delivery', 
          classes: 'bg-sky-50 text-sky-700 border-sky-200/80',
          dot: 'bg-sky-500'
        };
      case 'delivered':
        return { 
          icon: CheckCircle, 
          label: 'Delivered', 
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500'
        };
      case 'cancelled':
        return { 
          icon: XCircle, 
          label: 'Cancelled', 
          classes: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500'
        };
      default:
        return { 
          icon: Package, 
          label: status || 'Order Placed', 
          classes: 'bg-gray-50 text-gray-700 border-gray-200/80',
          dot: 'bg-gray-400'
        };
    }
  };

  const config = getStatusConfig(normalized);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.classes} shadow-2xs shrink-0 capitalize`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon size={12} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
