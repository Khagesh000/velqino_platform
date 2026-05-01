"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, ChevronDown, Search, Package, X, SlidersHorizontal,
  Wallet, Users, Tag, Clock, Loader2
} from '../../../../utils/icons';
import { useGetOrdersQuery } from '@/redux/wholesaler/slices/ordersSlice';
import '../../../../styles/Wholesaler/OrdersManagment/OrdersFilters.scss';

export default function OrdersFilters({ onFilterChange, totalOrders = 0 }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [status, setStatus] = useState('all');
  const [payment, setPayment] = useState('all');
  const [customerType, setCustomerType] = useState('all');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Fetch orders for stats
  const { data: ordersData, isLoading } = useGetOrdersQuery();
  const orders = ordersData?.data || [];
  const totalOrdersCount = totalOrders || orders.length;

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const paymentOptions = [
    { value: 'all', label: 'All Payments' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const customerTypeOptions = [
    { value: 'all', label: 'All Customers' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'wholesaler', label: 'Wholesaler' },
    { value: 'customer', label: 'Customer' }
  ];

  const dateOptions = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '365', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const clearFilters = () => {
    setStatus('all');
    setPayment('all');
    setCustomerType('all');
    setAmountRange({ min: '', max: '' });
    setDateRange('30');
    setSearchQuery('');
    setActiveFiltersCount(0);
    applyFiltersToParent({
      status: 'all',
      payment: 'all',
      customerType: 'all',
      amountRange: { min: '', max: '' },
      dateRange: '30',
      searchQuery: ''
    });
  };

  const applyFiltersToParent = (filters) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const applyFilters = () => {
    let count = 0;
    if (status !== 'all') count++;
    if (payment !== 'all') count++;
    if (customerType !== 'all') count++;
    if (amountRange.min || amountRange.max) count++;
    if (dateRange !== '30') count++;
    if (searchQuery) count++;
    setActiveFiltersCount(count);
    
    applyFiltersToParent({
      status,
      payment,
      customerType,
      amountRange,
      dateRange,
      searchQuery
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
            <Package size={20} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-sm text-gray-500">Manage and track all your orders in one place</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Total Orders: <span className="font-semibold text-primary-600">{totalOrdersCount}</span>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer, Email or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 transition-all"
              onClick={() => setSearchQuery('')}
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>
        
        <button 
          className={`flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium transition-all hover:bg-primary-50 hover:border-primary-200 hover:text-primary-600 ${
            isExpanded ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white text-gray-700'
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <SlidersHorizontal size={18} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
          <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded Filters Section */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <Tag size={14} className="text-gray-400" />
                <span>Order Status</span>
              </label>
              <div className="relative">
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white cursor-pointer"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Payment Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <Wallet size={14} className="text-gray-400" />
                <span>Payment Status</span>
              </label>
              <div className="relative">
                <select 
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white cursor-pointer"
                >
                  {paymentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Customer Type Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <Users size={14} className="text-gray-400" />
                <span>Customer Type</span>
              </label>
              <div className="relative">
                <select 
                  value={customerType}
                  onChange={(e) => setCustomerType(e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white cursor-pointer"
                >
                  {customerTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <Calendar size={14} className="text-gray-400" />
                <span>Date Range</span>
              </label>
              <div className="relative">
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full appearance-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white cursor-pointer"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Amount Range Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <Wallet size={14} className="text-gray-400" />
                <span>Amount Range (₹)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            {/* Quick Date Filters */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <Clock size={14} className="text-gray-400" />
                <span>Quick Select</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {['Today', 'Yesterday', '7 days', '30 days'].map((label, i) => (
                  <button
                    key={i}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      (i === 0 && dateRange === 'today') || 
                      (i === 1 && dateRange === 'yesterday') ||
                      (i === 2 && dateRange === '7') ||
                      (i === 3 && dateRange === '30')
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-primary-50 hover:border-primary-200'
                    }`}
                    onClick={() => {
                      if (i === 0) setDateRange('today');
                      if (i === 1) setDateRange('yesterday');
                      if (i === 2) setDateRange('7');
                      if (i === 3) setDateRange('30');
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                  </span>
                  <button 
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-error-600 transition-all"
                    onClick={clearFilters}
                  >
                    <X size={14} />
                    Clear all
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                onClick={() => setIsExpanded(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
              Status: {statusOptions.find(o => o.value === status)?.label}
              <button onClick={() => setStatus('all')} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={12} />
              </button>
            </span>
          )}
          {payment !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
              Payment: {payment}
              <button onClick={() => setPayment('all')} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={12} />
              </button>
            </span>
          )}
          {customerType !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
              Customer: {customerType}
              <button onClick={() => setCustomerType('all')} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={12} />
              </button>
            </span>
          )}
          {dateRange !== '30' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
              Date: {dateOptions.find(o => o.value === dateRange)?.label || dateRange}
              <button onClick={() => setDateRange('30')} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={12} />
              </button>
            </span>
          )}
          {(amountRange.min || amountRange.max) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
              Amount: {amountRange.min || '0'} - {amountRange.max || '∞'}
              <button onClick={() => setAmountRange({ min: '', max: '' })} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={12} />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}