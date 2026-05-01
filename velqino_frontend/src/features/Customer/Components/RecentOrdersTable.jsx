"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, ChevronRight, Package } from '../../../utils/icons';

export default function RecentOrdersTable({ orders }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 text-center">
        <Package size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No orders yet</p>
        <Link href="/product/productlistingpage" className="text-primary-500 text-sm mt-2 inline-block">
          Start Shopping →
        </Link>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Recent Orders</h2>
        <Link href="/product/orderslist" className="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1">
          View All <ChevronRight size={14} />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 text-xs font-medium text-gray-500">Order ID</th>
              <th className="text-left p-3 text-xs font-medium text-gray-500">Date</th>
              <th className="text-left p-3 text-xs font-medium text-gray-500">Total</th>
              <th className="text-left p-3 text-xs font-medium text-gray-500">Status</th>
              <th className="text-left p-3 text-xs font-medium text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 text-sm font-mono">{order.order_number}</td>
                <td className="p-3 text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-sm font-medium">₹{order.total_amount}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  <Link href={`/order-confirmation/${order.order_number}`} className="text-primary-500 hover:text-primary-600">
                    <Eye size={16} />
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