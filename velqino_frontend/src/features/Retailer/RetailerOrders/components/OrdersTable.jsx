'use client';

import React, { useState, useEffect } from 'react';
import { Package, Eye, Truck, CheckCircle, Clock, XCircle, RefreshCw, Search, Filter, ChevronLeft, ChevronRight, AlertCircle } from '../../../../utils/icons';

export default function OrdersTable({ 
  orders = [], 
  totalOrders = 0,
  totalPages = 1,
  currentPage = 1,
  isLoading = false,
  selectedOrder = null,
  setSelectedOrder = () => {},
  onPageChange = () => {},
  onSearch = () => {},
  onStatusFilter = () => {},
  refreshTrigger = 0
}) {
  const [mounted, setMounted] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      // Refresh logic if needed
    }
  }, [refreshTrigger]);

  if (!mounted) return null;

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return <CheckCircle size={14} className="text-green-500" />;
      case 'shipped': return <Truck size={14} className="text-blue-500" />;
      case 'processing': return <Clock size={14} className="text-yellow-500" />;
      case 'cancelled': return <XCircle size={14} className="text-red-500" />;
      case 'returned': return <RefreshCw size={14} className="text-orange-500" />;
      default: return <Package size={14} className="text-gray-400" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'returned': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
    onPageChange(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    onStatusFilter(e.target.value);
    onPageChange(1);
  };

  const statusCounts = {
    all: totalOrders,
    delivered: orders.filter(o => o.status === 'delivered').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    processing: orders.filter(o => o.status === 'processing').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    returned: orders.filter(o => o.status === 'returned').length,
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="orders-table-container bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="overflow-x-auto">
          <div className="p-8 text-center">
            <RefreshCw size={32} className="mx-auto text-gray-300 animate-spin" />
            <p className="mt-2 text-sm text-gray-500">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div className="orders-table-container bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-primary-500" />
              <h3 className="text-base font-semibold text-gray-900">All Orders</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                0 orders
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-40 focus:outline-none focus:border-primary-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
              >
                <option value="all">All (0)</option>
                <option value="delivered">Delivered (0)</option>
                <option value="shipped">Shipped (0)</option>
                <option value="processing">Processing (0)</option>
                <option value="cancelled">Cancelled (0)</option>
                <option value="returned">Returned (0)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No orders found</p>
          <p className="text-xs text-gray-400 mt-1">Orders will appear here once customers place orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-table-container bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">All Orders</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {totalOrders} orders
            </span>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg w-40 focus:outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="all">All ({statusCounts.all})</option>
              <option value="delivered">Delivered ({statusCounts.delivered})</option>
              <option value="shipped">Shipped ({statusCounts.shipped})</option>
              <option value="processing">Processing ({statusCounts.processing})</option>
              <option value="cancelled">Cancelled ({statusCounts.cancelled})</option>
              <option value="returned">Returned ({statusCounts.returned})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr className="text-left text-xs font-medium text-gray-500">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`order-row cursor-pointer transition-all ${selectedOrder?.id === order.id ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedOrder(order)}
                onMouseEnter={() => setHoveredRow(order.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">{order.order_number || order.id}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-700">{order.customer_name || order.customer?.name || 'Guest'}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{order.items?.length || 0} items</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-gray-900">₹{(order.grand_total || order.total_amount || 0).toLocaleString()}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(order.status)}
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusClass(order.status)}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">{order.payment_method || 'N/A'}</span>
                </td>
                <td className="px-4 py-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                    className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg transition-all"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalOrders)} of {totalOrders} orders
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-3 py-1 text-sm text-gray-600">{currentPage} / {totalPages}</span>
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-50 rounded-lg transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}