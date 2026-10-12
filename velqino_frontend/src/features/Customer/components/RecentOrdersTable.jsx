"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, ChevronRight, Package, ShoppingBag, ArrowRight } from '../../../utils/icons';

export default function RecentOrdersTable({ orders = [] }) {
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': 
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'shipped': 
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending': 
      case 'processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled': 
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default: 
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };
  
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs p-8 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto shadow-2xs">
          <ShoppingBag size={26} />
        </div>
        <h4 className="text-base font-extrabold text-gray-900">No Orders Found</h4>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          You haven't placed any orders yet. Discover trending products, electronics, and fashion items right now.
        </p>
        <div className="pt-2">
          <Link 
            href="/product/productlistingpage" 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-xs transition-all"
          >
            <span>Start Shopping Now</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Table Card Header */}
      <div className="p-5 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50/60 via-white to-gray-50/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 shadow-2xs shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">Recent Order History</h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary-700 border border-primary-200">
                Latest 5
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Real-time status updates and order tracking details</p>
          </div>
        </div>

        <Link 
          href="/customer/orderslist" 
          className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>View All Orders</span>
          <ChevronRight size={14} />
        </Link>
      </div>
      
      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Order Reference</th>
              <th className="py-3 px-4">Date Placed</th>
              <th className="py-3 px-4">Total Amount</th>
              <th className="py-3 px-4">Fulfillment Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Invoice &amp; View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-gray-900">
                  {order.order_number || `#ORD-${order.id}`}
                </td>
                <td className="py-3.5 px-4 text-gray-600">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                </td>
                <td className="py-3.5 px-4 font-bold text-gray-900">
                  ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(order.status)}`}>
                    {order.status || 'Processing'}
                  </span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-right">
                  <Link 
                    href={`/order-confirmation/${order.order_number || order.id}`} 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-primary-700 bg-primary-50/80 hover:bg-primary-100 border border-primary-200/60 transition-all shadow-2xs"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
