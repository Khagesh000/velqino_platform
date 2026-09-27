"use client";

import React from 'react';
import { Clock, CheckCircle, Truck, XCircle, Package } from '@/utils/icons';

export default function OrderStatusBadge({ status }) {
  const getStatusConfig = (rawStatus) => {
    const s = String(rawStatus || '').toLowerCase();
    switch (s) {
      case 'pending':
        return { 
          icon: Clock, 
          label: 'Order Placed', 
          color: 'bg-amber-50 text-amber-800 border-amber-200/90', 
          dot: 'bg-amber-500' 
        };
      case 'confirmed':
        return { 
          icon: CheckCircle, 
          label: 'Mill Confirmed', 
          color: 'bg-primary-50 text-primary-900 border-primary-200/90', 
          dot: 'bg-primary-600' 
        };
      case 'processing':
        return { 
          icon: Package, 
          label: 'Packing Lot', 
          color: 'bg-purple-50 text-purple-900 border-purple-200/90', 
          dot: 'bg-purple-600' 
        };
      case 'shipped':
        return { 
          icon: Truck, 
          label: 'In Transit', 
          color: 'bg-sky-50 text-sky-900 border-sky-200/90', 
          dot: 'bg-sky-500' 
        };
      case 'out_for_delivery':
        return { 
          icon: Truck, 
          label: 'Out for Delivery', 
          color: 'bg-orange-50 text-orange-900 border-orange-200/90', 
          dot: 'bg-orange-500' 
        };
      case 'delivered':
        return { 
          icon: CheckCircle, 
          label: 'Delivered & Verified', 
          color: 'bg-emerald-50 text-emerald-900 border-emerald-200/90', 
          dot: 'bg-emerald-600' 
        };
      case 'cancelled':
        return { 
          icon: XCircle, 
          label: 'Cancelled', 
          color: 'bg-rose-50 text-rose-800 border-rose-200/90', 
          dot: 'bg-rose-500' 
        };
      default:
        return { 
          icon: Package, 
          label: rawStatus || 'Order Active', 
          color: 'bg-gray-50 text-gray-800 border-gray-200', 
          dot: 'bg-gray-500' 
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs tracking-wide ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon size={12} className="flex-shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
