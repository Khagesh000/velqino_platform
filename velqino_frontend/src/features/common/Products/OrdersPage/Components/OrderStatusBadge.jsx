"use client";

import React from 'react';
import { Clock, CheckCircle, Truck, XCircle, Package } from '../../../../../utils/icons';

export default function OrderStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'pending':
        return { icon: Clock, label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
      case 'confirmed':
        return { icon: CheckCircle, label: 'Confirmed', color: 'bg-blue-100 text-blue-700' };
      case 'processing':
        return { icon: Package, label: 'Processing', color: 'bg-purple-100 text-purple-700' };
      case 'shipped':
        return { icon: Truck, label: 'Shipped', color: 'bg-indigo-100 text-indigo-700' };
      case 'out_for_delivery':
        return { icon: Truck, label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700' };
      case 'delivered':
        return { icon: CheckCircle, label: 'Delivered', color: 'bg-green-100 text-green-700' };
      case 'cancelled':
        return { icon: XCircle, label: 'Cancelled', color: 'bg-red-100 text-red-700' };
      default:
        return { icon: Package, label: status, color: 'bg-gray-100 text-gray-700' };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} />
      {config.label}
    </span>
  );
}