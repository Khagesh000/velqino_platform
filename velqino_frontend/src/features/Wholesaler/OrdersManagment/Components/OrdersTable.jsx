"use client";

import React, { useState, useEffect } from 'react';
import { 
  MoreVertical, Download, Printer, Eye, ChevronLeft, ChevronRight,
  Loader2
} from '../../../../utils/icons';
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice';
import '../../../../styles/Wholesaler/OrdersManagment/OrdersTable.scss';

export default function OrdersTable({ onSelectOrder, filters = {} }) {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Build query params from filters
  const queryParams = {
    page: currentPage,
    per_page: pageSize,
    ...(filters.status && filters.status !== 'all' && { status: filters.status }),
    ...(filters.payment && filters.payment !== 'all' && { payment_status: filters.payment }),
    ...(filters.searchQuery && { search: filters.searchQuery }),
    ...(filters.dateRange && filters.dateRange !== '30' && { days: filters.dateRange }),
    ...(filters.amountRange?.min && { min_amount: filters.amountRange.min }),
    ...(filters.amountRange?.max && { max_amount: filters.amountRange.max }),
  };

  const { data: ordersData, isLoading, refetch } = useGetOrdersQuery(queryParams);
  
  const orders = ordersData?.data || [];
  const pagination = ordersData?.pagination || {};
  const totalOrders = pagination.total || 0;
  const totalPages = pagination.total_pages || 1;
  const currentPageNum = pagination.page || 1;

  useEffect(() => {
    refetch();
  }, [filters, currentPage, pageSize, refetch]);

  const getPaymentBadge = (status) => {
    const styles = {
      paid: 'bg-success-50 text-success-700',
      pending: 'bg-warning-50 text-warning-700',
      failed: 'bg-error-50 text-error-700',
      refunded: 'bg-gray-100 text-gray-700'
    };
    return styles[status] || 'bg-gray-50 text-gray-700';
  };

  const getFulfillmentBadge = (status) => {
    const styles = {
      delivered: 'bg-success-50 text-success-700',
      shipped: 'bg-info-50 text-info-700',
      processing: 'bg-warning-50 text-warning-700',
      pending: 'bg-warning-50 text-warning-700',
      confirmed: 'bg-primary-50 text-primary-700',
      cancelled: 'bg-error-50 text-error-700'
    };
    return styles[status] || 'bg-gray-50 text-gray-700';
  };

  const getPriorityBadge = (total) => {
    if (total > 100000) return 'bg-error-50 text-error-700';
    if (total > 50000) return 'bg-warning-50 text-warning-700';
    return 'bg-success-50 text-success-700';
  };

  const getPriorityLabel = (total) => {
    if (total > 100000) return 'High';
    if (total > 50000) return 'Medium';
    return 'Low';
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.order_number));
    }
  };

  const toggleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Loader2 size={32} className="animate-spin text-primary-500 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Eye size={32} className="text-gray-400" />
        </div>
        <h4 className="text-lg font-semibold text-gray-900 mb-1">No orders found</h4>
        <p className="text-sm text-gray-500">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Table Header with Actions */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Orders Table</h3>
          {selectedOrders.length > 0 && (
            <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
              {selectedOrders.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Download size={18} />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
            <Printer size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-10 px-4 py-3">
                <input 
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="w-10 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr 
                key={order.order_number}
                className={`orders-table-row cursor-pointer ${hoveredRow === order.order_number ? 'orders-table-row-hover' : ''} ${
                  selectedOrders.includes(order.order_number) ? 'bg-primary-50/30' : ''
                }`}
                onMouseEnter={() => setHoveredRow(order.order_number)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={() => onSelectOrder && onSelectOrder(order.order_number)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox"
                    checked={selectedOrders.includes(order.order_number)}
                    onChange={() => toggleSelectOrder(order.order_number)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-primary-600">{order.order_number}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                      {order.customer_name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer_name || 'Customer'}</p>
                      <p className="text-xs text-gray-500">{order.customer_email || ''}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-700">{order.items_count || 0} items</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{order.total_amount?.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPaymentBadge(order.payment_status)}`}>
                      {order.payment_status || 'Pending'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getFulfillmentBadge(order.status)}`}>
                    {order.status || 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityBadge(order.total_amount)}`}>
                    {getPriorityLabel(order.total_amount)}
                  </span>
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all">
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Showing {(currentPageNum - 1) * pageSize + 1} to {Math.min(currentPageNum * pageSize, totalOrders)} of {totalOrders} orders
        </p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handlePageChange(currentPageNum - 1)}
            disabled={currentPageNum === 1}
            className="p-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPageNum <= 3) {
                pageNum = i + 1;
              } else if (currentPageNum >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPageNum - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 text-sm rounded-lg transition-all ${
                    currentPageNum === pageNum
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button 
            onClick={() => handlePageChange(currentPageNum + 1)}
            disabled={currentPageNum === totalPages}
            className="p-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={16} />
          </button>
          
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-2 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
}