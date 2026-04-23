"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, Calendar, IndianRupeeIcon, ChevronRight } from '../../../../../utils/icons';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrderCard({ order }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Order #</span>
            <span className="font-mono font-semibold text-gray-900">{order.order_number}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{formatDate(order.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupeeIcon size={14} />
              <span>{order.total_amount}</span>
            </div>
          </div>
        </div>
        
        {/* Items Preview */}
        <div className="border-t border-gray-100 pt-3 mb-3">
          <p className="text-xs text-gray-400 mb-2">{order.items_count} item(s)</p>
          {/* You can add item images preview here if needed */}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link
            href={`/product/orderconfirmation/${order.order_number}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all"
          >
            <Eye size={16} />
            View Details
            <ChevronRight size={14} />
          </Link>
          {order.status === 'delivered' && (
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
              Buy Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}