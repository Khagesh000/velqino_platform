"use client";

import React, { useState } from 'react';
import {
  Filter,
  ChevronDown,
  X,
  Search,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/Customers/CustomerFilters.scss';

export default function CustomerFilters({ onFilterChange, onSearch, locations = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    status: '',
    city: 'all',
    min_orders: '',
    max_orders: '',
    min_spent: '',
    max_spent: '',
    last_order_days: '',
    searchQuery: ''
  });

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...locations.map(city => ({ value: city, label: city }))
  ];

  const orderCounts = [
    { value: '', label: 'All Orders' },
    { value: '0-500', label: '0-500 Orders' },
    { value: '500-700', label: '500-700 Orders' },
    { value: '700-1000', label: '700-1000 Orders' },
    { value: '1000+', label: '1000+ Orders' }
  ];

  const lastOrderOptions = [
    { value: '', label: 'Any Time' },
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '365', label: 'Last Year' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status', icon: CheckCircle },
    { value: 'active', label: 'Active', icon: CheckCircle },
    { value: 'inactive', label: 'Inactive', icon: XCircle }
  ];

  const handleSearchChange = (value) => {
    setTempFilters({ ...tempFilters, searchQuery: value });
    if (onSearch) onSearch(value);
  };

  const handleOrderRangeChange = (value) => {
    if (!value || value === '') {
      setTempFilters({ ...tempFilters, min_orders: '', max_orders: '' });
    } else if (value === '0-500') {
      setTempFilters({ ...tempFilters, min_orders: 0, max_orders: 500 });
    } else if (value === '500-700') {
      setTempFilters({ ...tempFilters, min_orders: 500, max_orders: 700 });
    } else if (value === '700-1000') {
      setTempFilters({ ...tempFilters, min_orders: 700, max_orders: 1000 });
    } else if (value === '1000+') {
      setTempFilters({ ...tempFilters, min_orders: 1000, max_orders: '' });
    }
  };

  const handleApply = () => {
    const finalFilters = {};
    
    if (tempFilters.status && tempFilters.status !== '') finalFilters.status = tempFilters.status;
    if (tempFilters.city && tempFilters.city !== 'all') finalFilters.city = tempFilters.city;
    if (tempFilters.min_orders !== '' && tempFilters.min_orders !== null) finalFilters.min_orders = tempFilters.min_orders;
    if (tempFilters.max_orders !== '' && tempFilters.max_orders !== null) finalFilters.max_orders = tempFilters.max_orders;
    if (tempFilters.min_spent !== '' && tempFilters.min_spent !== null) finalFilters.min_spent = tempFilters.min_spent;
    if (tempFilters.max_spent !== '' && tempFilters.max_spent !== null) finalFilters.max_spent = tempFilters.max_spent;
    if (tempFilters.last_order_days && tempFilters.last_order_days !== '') finalFilters.last_order_days = tempFilters.last_order_days;
    
    console.log('📤 Sending filters to parent:', finalFilters);
    onFilterChange(finalFilters);
    setIsExpanded(false);
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      city: 'all',
      min_orders: '',
      max_orders: '',
      min_spent: '',
      max_spent: '',
      last_order_days: '',
      searchQuery: ''
    };
    setTempFilters(resetFilters);
    onFilterChange({});
    if (onSearch) onSearch('');
    setIsExpanded(false);
  };

  const activeFilterCount = () => {
    let count = 0;
    if (tempFilters.status && tempFilters.status !== '') count++;
    if (tempFilters.city && tempFilters.city !== 'all') count++;
    if (tempFilters.min_orders !== '' && tempFilters.min_orders !== null) count++;
    if (tempFilters.min_spent !== '' && tempFilters.min_spent !== null) count++;
    if (tempFilters.max_spent !== '' && tempFilters.max_spent !== null) count++;
    if (tempFilters.last_order_days && tempFilters.last_order_days !== '') count++;
    if (tempFilters.searchQuery) count++;
    return count;
  };

  const getOrderRangeValue = () => {
    if (tempFilters.min_orders === 0 && tempFilters.max_orders === 500) return '0-500';
    if (tempFilters.min_orders === 500 && tempFilters.max_orders === 700) return '500-700';
    if (tempFilters.min_orders === 700 && tempFilters.max_orders === 1000) return '700-1000';
    if (tempFilters.min_orders === 1000 && tempFilters.max_orders === '') return '1000+';
    return '';
  };

  return (
    <div className="customer-filters bg-white rounded-xl border border-gray-200">
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={tempFilters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
            />
            {tempFilters.searchQuery && (
              <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => handleSearchChange('')}>
                <X size={12} className="text-gray-400" />
              </button>
            )}
          </div>

          <button
            className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              isExpanded ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter size={14} />
            <span>Filters</span>
            {activeFilterCount() > 0 && (
              <span className="px-1 sm:px-1.5 py-0.5 bg-primary-500 text-white text-xxs rounded-full">
                {activeFilterCount()}
              </span>
            )}
            <ChevronDown size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="filters-panel px-3 sm:px-4 pb-4 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <MapPin size={12} />
                <span>Location</span>
              </label>
              <select
                value={tempFilters.city}
                onChange={(e) => setTempFilters({ ...tempFilters, city: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
              >
                {locationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <ShoppingBag size={12} />
                <span>Order Count</span>
              </label>
              <select
                value={getOrderRangeValue()}
                onChange={(e) => handleOrderRangeChange(e.target.value)}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
              >
                {orderCounts.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <DollarSign size={12} />
                <span>Spend Range (₹)</span>
              </label>
              <div className="flex items-center gap-1 sm:gap-2">
                <input type="number" placeholder="Min" value={tempFilters.min_spent} onChange={(e) => setTempFilters({ ...tempFilters, min_spent: e.target.value })} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500" />
                <span className="text-gray-400 text-xs">-</span>
                <input type="number" placeholder="Max" value={tempFilters.max_spent} onChange={(e) => setTempFilters({ ...tempFilters, max_spent: e.target.value })} className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500" />
              </div>
            </div>

            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <Calendar size={12} />
                <span>Last Order</span>
              </label>
              <select
                value={tempFilters.last_order_days}
                onChange={(e) => setTempFilters({ ...tempFilters, last_order_days: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
              >
                {lastOrderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <CheckCircle size={12} />
                <span>Status</span>
              </label>
              <select
                value={tempFilters.status}
                onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
            <button onClick={handleReset} className="text-xxs sm:text-xs text-gray-500 hover:text-gray-700">Reset all</button>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsExpanded(false)} className="px-2.5 sm:px-4 py-1 sm:py-1.5 text-xxs sm:text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleApply} className="px-2.5 sm:px-4 py-1 sm:py-1.5 text-xxs sm:text-xs font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600">Apply Filters</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}