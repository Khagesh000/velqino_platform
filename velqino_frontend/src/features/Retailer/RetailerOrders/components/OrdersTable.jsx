'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle,
  X,
  CreditCard,
  User,
  Calendar,
  Sparkles
} from '../../../../utils/icons';

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
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    switch(s) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={12} className="text-emerald-500" />
            <span>Delivered</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck size={12} className="text-indigo-500" />
            <span>Shipped</span>
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-50 text-accent-800 border border-accent-200">
            <Truck size={12} className="text-accent-600" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'processing':
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={12} className="text-amber-500" />
            <span className="capitalize">{s}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={12} className="text-rose-500" />
            <span>Cancelled</span>
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <RefreshCw size={12} className="text-gray-500" />
            <span>Returned</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-50 text-gray-600 border border-gray-200">
            <Package size={12} className="text-gray-400" />
            <span className="capitalize">{s}</span>
          </span>
        );
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
    onPageChange(1);
  };

  const handleStatusFilterClick = (statusKey) => {
    setStatusFilter(statusKey);
    onStatusFilter(statusKey === 'all' ? '' : statusKey);
    onPageChange(1);
  };

  const filterTabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header & Controls */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Package size={18} />
            </span>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">
              Store Orders
            </h3>
            <span className="text-xs font-bold text-primary-800 bg-primary-50 border border-primary-200/70 px-2.5 py-0.5 rounded-full">
              {totalOrders} total
            </span>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl w-48 sm:w-64 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    onSearch('');
                    onPageChange(1);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Tabs Strip */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-1.5 overflow-x-auto">
          {filterTabs.map(tab => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleStatusFilterClick(tab.key)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-white text-gray-900 shadow-2xs border border-gray-200' 
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 px-4 bg-gray-50/40">
              <Package size={40} className="text-gray-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-800">No Orders Found</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No orders match your filter criteria. When customer purchases are finalized, they will appear here in real time.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Grand Total</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;
                  const orderNum = order.order_number || `#ORD-${order.id}`;
                  const customerName = order.customer_name || order.customer?.name || 'Walk-in Customer';
                  const customerContact = order.customer_phone || order.customer_email || order.customer?.phone || null;
                  const total = Number(order.grand_total ?? order.total_amount ?? 0);
                  const itemCount = Array.isArray(order.items) ? order.items.length : 1;
                  const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }) : 'Recent';

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`
                        cursor-pointer transition-colors
                        ${isSelected 
                          ? 'bg-primary-50/60 font-semibold' 
                          : 'hover:bg-gray-50/80'
                        }
                      `}
                    >
                      {/* Order Number */}
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-md border border-gray-200">
                          {orderNum}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-bold text-gray-900">{customerName}</p>
                          {customerContact && (
                            <p className="text-[10px] text-gray-400">{customerContact}</p>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                        {orderDate}
                      </td>

                      {/* Items */}
                      <td className="py-3 px-4 text-gray-700">
                        <span className="inline-flex items-center gap-1 font-bold">
                          <Package size={13} className="text-gray-400" />
                          <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3 px-4 font-black text-gray-900 text-sm whitespace-nowrap">
                        ₹{total.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Payment */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          {order.payment_method || 'CASH'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className={`
                            p-1.5 rounded-xl transition-all border
                            ${isSelected 
                              ? 'bg-primary-600 text-white border-primary-600 shadow-2xs' 
                              : 'bg-white text-gray-500 hover:text-primary-700 hover:bg-primary-50 border-gray-200'
                            }
                          `}
                          title="Inspect Order"
                        >
                          <Eye size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 sm:p-5 border-t border-gray-100 flex items-center justify-between text-xs bg-gray-50/50">
          <span className="text-gray-500">
            Showing {(currentPage - 1) * 20 + 1} - {Math.min(currentPage * 20, totalOrders)} of {totalOrders} orders
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 bg-primary-600 text-white font-bold rounded-xl shadow-2xs">
              {currentPage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-xl font-bold text-gray-700 disabled:opacity-40 hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}