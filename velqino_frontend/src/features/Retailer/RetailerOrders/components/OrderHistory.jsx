"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Package, 
  Eye, 
  TrendingUp, 
  Calendar, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  User,
  Phone,
  Mail,
  Sparkles,
  CheckCircle,
  Truck,
  CreditCard,
  DollarSign
} from '../../../../utils/icons';

export default function OrderHistory({ selectedOrder, orders = [] }) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCustomerKey, setActiveCustomerKey] = useState(null);
  const itemsPerPage = 4;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update active customer when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      setActiveCustomerKey(selectedOrder.customer_email || selectedOrder.customer_name);
      setCurrentPage(1);
    }
  }, [selectedOrder]);

  // Aggregate all unique customers from orders data
  const customerMap = useMemo(() => {
    const map = new Map();
    if (!orders || orders.length === 0) return map;

    orders.forEach(order => {
      const key = order.customer_email || order.customer_name || `cust_${order.id}`;
      if (!map.has(key)) {
        map.set(key, {
          key,
          name: order.customer_name || 'Guest Buyer',
          phone: order.customer_phone || 'N/A',
          email: order.customer_email || 'N/A',
          firstDate: order.created_at,
          orders: []
        });
      }
      const data = map.get(key);
      data.orders.push(order);
      // Track earliest date
      if (order.created_at && (!data.firstDate || new Date(order.created_at) < new Date(data.firstDate))) {
        data.firstDate = order.created_at;
      }
    });

    return map;
  }, [orders]);

  // Sorted top customers by total spending
  const topCustomers = useMemo(() => {
    return Array.from(customerMap.values())
      .map(cust => {
        const totalSpent = cust.orders.reduce((sum, o) => sum + parseFloat(o.grand_total || 0), 0);
        return {
          ...cust,
          totalSpent,
          orderCount: cust.orders.length
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);
  }, [customerMap]);

  // Determine current customer
  const currentCustomer = useMemo(() => {
    if (activeCustomerKey && customerMap.has(activeCustomerKey)) {
      const cust = customerMap.get(activeCustomerKey);
      const totalSpent = cust.orders.reduce((sum, o) => sum + parseFloat(o.grand_total || 0), 0);
      const avgOrderValue = cust.orders.length > 0 ? (totalSpent / cust.orders.length) : 0;
      return {
        ...cust,
        totalSpent,
        avgOrderValue,
        orderCount: cust.orders.length,
        since: cust.firstDate ? new Date(cust.firstDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent'
      };
    }

    if (topCustomers.length > 0) {
      const top = topCustomers[0];
      const avgOrderValue = top.orderCount > 0 ? (top.totalSpent / top.orderCount) : 0;
      return {
        ...top,
        avgOrderValue,
        since: top.firstDate ? new Date(top.firstDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent'
      };
    }

    return null;
  }, [activeCustomerKey, customerMap, topCustomers]);

  if (!mounted) return null;

  if (!currentCustomer) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-2xs h-full flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3 shadow-2xs">
          <Clock size={26} />
        </div>
        <h4 className="text-sm sm:text-base font-bold text-gray-900">Customer Purchase History</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Customer purchase frequency, lifetime value metrics, and order recurrence will display here.
        </p>
      </div>
    );
  }

  // Filter orders by search
  const filteredOrders = currentCustomer.orders.filter(order => {
    const id = String(order.order_number || order.id).toLowerCase();
    const query = searchQuery.toLowerCase();
    return id.includes(query) || (order.payment_method || '').toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    switch (s) {
      case 'delivered':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Delivered</span>;
      case 'shipped':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">Shipped</span>;
      case 'processing':
      case 'confirmed':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 capitalize">{s}</span>;
      case 'cancelled':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">Cancelled</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 capitalize">{s}</span>;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full flex-1">
      {/* Header */}
      <div>
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Customer Timeline & Intelligence</h3>
              <p className="text-[11px] text-gray-400">Lifetime analytics and repeat purchase records</p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary-800 bg-primary-50 border border-primary-200/70 px-2.5 py-0.5 rounded-full">
            {currentCustomer.orderCount} Orders
          </span>
        </div>

        {/* Customer Profile Card */}
        <div className="p-4 sm:p-5 bg-gradient-to-br from-gray-50 via-white to-gray-50/50 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-primary-500 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                {currentCustomer.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
                  <span>{currentCustomer.name}</span>
                  {currentCustomer.orderCount >= 3 && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <Sparkles size={10} /> VIP Buyer
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail size={11} className="text-gray-400" />
                    <span>{currentCustomer.email}</span>
                  </span>
                  {currentCustomer.phone !== 'N/A' && (
                    <span className="flex items-center gap-1">
                      <Phone size={11} className="text-gray-400" />
                      <span>{currentCustomer.phone}</span>
                    </span>
                  )}
                  <span className="text-gray-400">Customer since {currentCustomer.since}</span>
                </div>
              </div>
            </div>

            {/* Total Spending Stat */}
            <div className="sm:text-right shrink-0 bg-white sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-gray-100">
              <p className="text-[11px] font-medium text-gray-400">Lifetime Spending (LTV)</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                ₹{currentCustomer.totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[10px] text-gray-500">
                Avg order: ₹{currentCustomer.avgOrderValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>

        {/* Search Orders */}
        <div className="p-3 sm:px-5 border-b border-gray-100 flex items-center justify-between gap-3 bg-white">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search buyer's order history..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
            />
          </div>
          <span className="text-[11px] text-gray-400 font-medium shrink-0">
            Showing {filteredOrders.length} records
          </span>
        </div>

        {/* Orders Timeline List */}
        <div className="p-4 sm:p-5 space-y-2.5 max-h-[300px] overflow-y-auto">
          {paginatedOrders.length === 0 ? (
            <div className="py-8 text-center">
              <Package size={28} className="mx-auto text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">No orders match this search</p>
            </div>
          ) : (
            paginatedOrders.map((ord, idx) => {
              const isSelected = selectedOrder && (selectedOrder.id === ord.id || selectedOrder.order_number === ord.order_number);
              return (
                <div 
                  key={idx}
                  className={`p-3 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'border-primary-400 bg-primary-50/40 shadow-2xs' 
                      : 'border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900 font-mono">
                        {ord.order_number || `#ORD-${ord.id}`}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Calendar size={11} />
                        <span>{ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-IN') : 'N/A'}</span>
                      </span>
                    </div>
                    {getStatusBadge(ord.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Package size={11} className="text-gray-400" />
                        <span className="font-semibold text-gray-700">{ord.items?.length || 1} item(s)</span>
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="capitalize">{ord.payment_method || 'Online'}</span>
                    </div>

                    <span className="font-bold text-gray-900 text-xs sm:text-sm">
                      ₹{parseFloat(ord.grand_total || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 sm:px-5 py-2.5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-[11px] text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Customer Quick Selectors Footer */}
      {topCustomers.length > 1 && (
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-1.5 mb-2.5">
            <TrendingUp size={13} className="text-primary-600" />
            <h5 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Top Spenders</h5>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {topCustomers.map((cust, i) => {
              const isActive = (currentCustomer?.key === cust.key);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setActiveCustomerKey(cust.key);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-left shrink-0 transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white border-primary-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300 hover:bg-primary-50/40'
                  }`}
                >
                  <p className="text-xs font-bold truncate max-w-[120px]">{cust.name}</p>
                  <p className={`text-[10px] ${isActive ? 'text-primary-100' : 'text-gray-400'}`}>
                    ₹{cust.totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })} • {cust.orderCount} ord
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}