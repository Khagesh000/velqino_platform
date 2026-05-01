"use client";

import React, { useState } from 'react';
import { useGetRecentOrdersQuery } from '@/redux/wholesaler/slices/statsSlice';
import { Eye, MoreHorizontal, ChevronRight, Package, Clock, CheckCircle, XCircle, Loader2 } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/RecentOrdersTable.scss';

export default function RecentOrdersTable() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  
  const { data: ordersData, isLoading, refetch } = useGetRecentOrdersQuery({ page, per_page: perPage });
  
  const orders = ordersData?.data || [];
  const hasMore = ordersData?.has_next || false;
  const totalCount = ordersData?.count || 0;
  const currentPage = ordersData?.page || 1;
  const totalPages = ordersData?.total_pages || 1;

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock size={14} />;
      case 'processing': return <Package size={14} />;
      case 'delivered': return <CheckCircle size={14} />;
      case 'cancelled': return <XCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-warning-100 text-warning-600';
      case 'processing': return 'bg-primary-100 text-primary-600';
      case 'delivered': return 'bg-success-100 text-success-600';
      case 'cancelled': return 'bg-error-100 text-error-600';
      default: return 'bg-surface-2 text-tertiary';
    }
  };

  const getPaymentClass = (payment) => {
    switch(payment) {
      case 'paid': return 'bg-success-100 text-success-600';
      case 'pending': return 'bg-warning-100 text-warning-600';
      case 'refunded': return 'bg-error-100 text-error-600';
      default: return 'bg-surface-2 text-tertiary';
    }
  };

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const loadPrevious = () => {
    if (currentPage > 1) {
      setPage(prev => prev - 1);
    }
  };

  if (isLoading && page === 1) {
    return (
      <div className="bg-white rounded-2xl border border-light p-6 text-center">
        <Loader2 size={32} className="animate-spin text-primary-500 mx-auto mb-3" />
        <p className="text-sm text-tertiary">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-light p-4 lg:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <Package size={18} className="lg:w-5 lg:h-5" />
          </div>
          <div>
            <h3 className="text-base lg:text-lg xl:text-xl font-semibold text-primary">Recent Orders</h3>
            <p className="text-xs lg:text-sm text-tertiary">Latest orders from your store</p>
          </div>
        </div>
      </div>

      {orders.length === 0 && (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={32} className="text-gray-400" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h4>
        <p className="text-sm text-gray-500">When retailers place orders, they will appear here</p>
      </div>
    )}

      {/* Desktop Table */}
      {orders.length > 0 && (
       <>
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-light">
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Order ID</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Customer</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Items</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Total</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Date</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Status</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary">Payment</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-tertiary"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr 
                key={order.id}
                className={`border-b border-light/50 transition-colors ${hoveredRow === index ? 'bg-surface-1' : ''}`}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="py-3 px-4">
                  <span className={`text-sm font-medium transition-colors ${hoveredRow === index ? 'text-primary-600' : 'text-primary'}`}>
                    {order.id}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-medium text-primary">{order.customer}</td>
                <td className="py-3 px-4">
                  <span className="inline-block px-2 py-1 bg-surface-2 rounded-full text-xs text-secondary">
                    {order.items}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm font-semibold text-primary">₹{order.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-xs text-tertiary">{order.date}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getPaymentClass(order.payment)}`}>
                    {order.payment}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-surface-2 rounded-lg transition-fast text-tertiary">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 hover:bg-surface-2 rounded-lg transition-fast text-tertiary">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Cards */}
      <div className="lg:hidden space-y-3">
        {orders.map((order, index) => (
          <div 
            key={order.id}
            className={`bg-surface-1 rounded-xl p-4 border border-light transition-all ${hoveredRow === index ? 'shadow-md' : ''}`}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => setHoveredRow(null)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">{order.id}</span>
                <span className="text-xs text-tertiary">{order.date}</span>
              </div>
              <button className="p-1 hover:bg-surface-2 rounded-lg transition-fast">
                <MoreHorizontal size={16} className="text-tertiary" />
              </button>
            </div>
            
            <div className="mb-3">
              <p className="text-xs text-tertiary mb-0.5">Customer</p>
              <p className="text-sm font-medium text-primary">{order.customer}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-tertiary mb-0.5">Items</p>
                <p className="text-sm font-medium text-primary">{order.items}</p>
              </div>
              <div>
                <p className="text-xs text-tertiary mb-0.5">Total</p>
                <p className="text-sm font-semibold text-primary">₹{order.amount.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </span>
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${getPaymentClass(order.payment)}`}>
                  {order.payment}
                </span>
              </div>
              <button className="p-1.5 bg-white border border-light rounded-lg hover:bg-primary-50 transition-fast">
                <Eye size={14} className="text-tertiary" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalCount > perPage && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-light">
          <div className="text-xs text-tertiary">
            Showing {orders.length} of {totalCount} orders
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadPrevious}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs rounded-lg border border-light hover:bg-surface-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-xs text-tertiary">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={loadMore}
              disabled={!hasMore}
              className="px-3 py-1.5 text-xs rounded-lg border border-light hover:bg-surface-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
            
          </div>
          
        </div>
        )}
      </>
    )}
  </div>
);

  
}