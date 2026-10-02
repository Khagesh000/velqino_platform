"use client";

import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Package,
  Clock,
  Check,
  Copy,
  Loader2
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/OrdersManagment/OrdersTable.scss';

export default function OrdersTable({ 
  orders = [], 
  isLoading = false,
  totalOrders = 0,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  onSelectOrder 
}) {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const getOptimizedThumb = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.includes('/upload/')) {
      return url.replace('/upload/', '/upload/w_100,h_100,c_fill,q_auto,f_auto/');
    }
    return url;
  };

  const handleCopyOrderNumber = (e, orderNumber) => {
    e.stopPropagation();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(orderNumber);
      setCopiedId(orderNumber);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getPaymentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200/80';
      case 'failed':
        return 'bg-rose-50 text-rose-700 border border-rose-200/80';
      case 'refunded':
        return 'bg-slate-100 text-slate-700 border border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const getFulfillmentBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
      case 'confirmed':
        return 'bg-primary-50 text-primary-700 border border-primary-200/80';
      case 'processing':
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200/80';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200/80';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200/80';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  const getPriorityBadge = (total) => {
    if (total > 5000) return 'bg-rose-50 text-rose-700 border border-rose-200/80';
    if (total > 1000) return 'bg-amber-50 text-amber-700 border border-amber-200/80';
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
  };

  const getPriorityLabel = (total) => {
    if (total > 5000) return 'High';
    if (total > 1000) return 'Medium';
    return 'Normal';
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(o => o.order_number || o.id));
    }
  };

  const toggleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs">
        <Loader2 size={32} className="animate-spin text-primary-600 mx-auto mb-3" />
        <p className="text-sm font-medium text-slate-500">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center shadow-xs">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Eye size={28} />
        </div>
        <h4 className="text-base font-bold text-slate-900 mb-1">No orders found</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Try adjusting your search criteria or filter tags.
        </p>
      </div>
    );
  }

  const effectiveTotal = totalOrders || orders.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden orders-table-container">
      {/* Table Header with Actions */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">Orders Table</h3>
          {selectedOrders.length > 0 && (
            <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-200/80">
              {selectedOrders.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 shadow-2xs"
            title="Download CSV"
          >
            <Download size={16} />
          </button>
          <button 
            type="button"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-200 shadow-2xs"
            title="Print Orders"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="w-10 px-4 py-3.5">
                <input 
                  type="checkbox"
                  checked={selectedOrders.length === orders.length && orders.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="px-4 py-3.5">Order & Product</th>
              <th className="px-4 py-3.5">Customer / Retailer</th>
              <th className="px-4 py-3.5">Items</th>
              <th className="px-4 py-3.5">Total Amount</th>
              <th className="px-4 py-3.5">Payment</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Order Date</th>
              <th className="px-4 py-3.5">Priority</th>
              <th className="w-12 px-4 py-3.5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {orders.map((order) => {
              const orderId = order.order_number || order.id;
              const isSelected = selectedOrders.includes(orderId);
              const items = Array.isArray(order.items) ? order.items : [];
              const firstItem = items[0];
              const rawImg = firstItem?.product_images?.[0] || firstItem?.image || firstItem?.image_url;
              const thumbUrl = getOptimizedThumb(rawImg);
              const initial = order.customer_name ? order.customer_name.charAt(0).toUpperCase() : 'C';

              return (
                <tr 
                  key={orderId}
                  className={`orders-table-row cursor-pointer transition-colors duration-150 ${
                    hoveredRow === orderId ? 'orders-table-row-hover bg-slate-50/80' : 'bg-white'
                  } ${isSelected ? 'bg-primary-50/40' : ''}`}
                  onMouseEnter={() => setHoveredRow(orderId)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onSelectOrder?.(orderId)}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOrder(orderId)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4 cursor-pointer"
                    />
                  </td>

                  {/* Order ID & Product Thumbnail */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-2xs">
                        {thumbUrl ? (
                          <img src={thumbUrl} alt="product" className="w-full h-full object-cover" />
                        ) : (
                          <Package size={16} className="text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary-600">
                            {order.order_number}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyOrderNumber(e, order.order_number)}
                            className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title="Copy Order ID"
                          >
                            {copiedId === order.order_number ? (
                              <Check size={11} className="text-emerald-600" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        </div>
                        <span className="text-[11px] text-slate-500 truncate block max-w-[150px]">
                          {firstItem?.product_name || 'Standard Order'}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Customer / Retailer */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {initial}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {order.retailer_name || order.customer_name || 'Retailer'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[150px]">
                          {order.customer_email || ''}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Items */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded-md text-[11px]">
                      {order.items_count || items.length || 1} items
                    </span>
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3.5">
                    <span className="font-extrabold text-slate-900 text-sm">
                      ₹{Number(order.total_amount || 0).toLocaleString()}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${getPaymentBadge(order.payment_status)}`}>
                      {order.payment_status || 'Pending'}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getFulfillmentBadge(order.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{order.status || 'Pending'}</span>
                    </span>
                  </td>

                  {/* Order Date */}
                  <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap">
                    {formatDate(order.created_at)}
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${getPriorityBadge(order.total_amount)}`}>
                      {getPriorityLabel(order.total_amount)}
                    </span>
                  </td>

                  {/* View Details Action */}
                  <td className="px-4 py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                    <button 
                      type="button"
                      onClick={() => onSelectOrder?.(orderId)}
                      className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-200"
                      title="View Order Details"
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Pagination */}
      <div className="px-4 sm:px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs bg-slate-50/50">
        <p className="text-slate-500 font-medium">
          Showing {Math.min((currentPage - 1) * pageSize + 1, effectiveTotal)} to {Math.min(currentPage * pageSize, effectiveTotal)} of {effectiveTotal} orders
        </p>
        
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
          >
            <ChevronLeft size={15} />
          </button>
          
          <div className="flex items-center gap-1 font-semibold">
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange?.(pageNum)}
                  className={`w-7 h-7 text-xs rounded-lg transition-all font-semibold ${
                    currentPage === pageNum
                      ? 'bg-primary-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white border border-transparent hover:border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button 
            type="button"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 text-slate-600 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
          >
            <ChevronRight size={15} />
          </button>
          
          {onPageSizeChange && (
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="ml-2 px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-primary-500 font-semibold text-slate-700"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
