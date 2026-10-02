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
  XCircle,
  RotateCcw
} from '@/utils/icons';
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
    { value: '1+', label: '1+ Orders' },
    { value: '5+', label: '5+ Orders' },
    { value: '10+', label: '10+ Orders' },
    { value: '50+', label: '50+ High Volume' }
  ];

  const lastOrderOptions = [
    { value: '', label: 'Any Time' },
    { value: '7', label: 'Last 7 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: '365', label: 'Past Year' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active Retailers' },
    { value: 'inactive', label: 'Inactive / Blocked' }
  ];

  const handleSearchChange = (value) => {
    setTempFilters(prev => ({ ...prev, searchQuery: value }));
    if (onSearch) onSearch(value);
  };

  const handleOrderRangeChange = (value) => {
    if (!value || value === '') {
      setTempFilters(prev => ({ ...prev, min_orders: '', max_orders: '' }));
    } else if (value === '1+') {
      setTempFilters(prev => ({ ...prev, min_orders: 1, max_orders: '' }));
    } else if (value === '5+') {
      setTempFilters(prev => ({ ...prev, min_orders: 5, max_orders: '' }));
    } else if (value === '10+') {
      setTempFilters(prev => ({ ...prev, min_orders: 10, max_orders: '' }));
    } else if (value === '50+') {
      setTempFilters(prev => ({ ...prev, min_orders: 50, max_orders: '' }));
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
    return count;
  };

  const getOrderRangeValue = () => {
    if (tempFilters.min_orders === 1) return '1+';
    if (tempFilters.min_orders === 5) return '5+';
    if (tempFilters.min_orders === 10) return '10+';
    if (tempFilters.min_orders === 50) return '50+';
    return '';
  };

  const removeFilter = (key) => {
    const updated = { ...tempFilters, [key]: key === 'city' ? 'all' : '' };
    if (key === 'orders') {
      updated.min_orders = '';
      updated.max_orders = '';
    }
    if (key === 'spent') {
      updated.min_spent = '';
      updated.max_spent = '';
    }
    setTempFilters(updated);
    
    const finalFilters = {};
    if (updated.status) finalFilters.status = updated.status;
    if (updated.city && updated.city !== 'all') finalFilters.city = updated.city;
    if (updated.min_orders) finalFilters.min_orders = updated.min_orders;
    if (updated.min_spent) finalFilters.min_spent = updated.min_spent;
    if (updated.last_order_days) finalFilters.last_order_days = updated.last_order_days;
    onFilterChange(finalFilters);
  };

  const activeCount = activeFilterCount();

  return (
    <div className="customer-filters bg-white rounded-2xl border border-slate-200/80 shadow-xs transition-all">
      {/* Search Bar & Action Trigger */}
      <div className="p-3.5 sm:p-4">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search retailers by name, business, email, phone..."
              value={tempFilters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
            />
            {tempFilters.searchQuery && (
              <button 
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                onClick={() => handleSearchChange('')}
              >
                <X size={13} />
              </button>
            )}
          </div>

          <button
            className={`
              flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 border rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shadow-2xs
              ${isExpanded || activeCount > 0
                ? 'bg-primary-50 border-primary-300 text-primary-700 ring-2 ring-primary-100' 
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
            `}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter size={14} className={isExpanded || activeCount > 0 ? 'text-primary-600' : 'text-slate-400'} />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[11px] font-extrabold flex items-center justify-center">
                {activeCount}
              </span>
            )}
            <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Active Filter Chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">Active filters:</span>
            
            {tempFilters.status && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs">
                Status: {tempFilters.status}
                <button onClick={() => removeFilter('status')} className="hover:text-emerald-950"><X size={12} /></button>
              </span>
            )}

            {tempFilters.city && tempFilters.city !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-xs">
                City: {tempFilters.city}
                <button onClick={() => removeFilter('city')} className="hover:text-blue-950"><X size={12} /></button>
              </span>
            )}

            {tempFilters.min_orders && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-semibold text-xs">
                Orders: {tempFilters.min_orders}+
                <button onClick={() => removeFilter('orders')} className="hover:text-purple-950"><X size={12} /></button>
              </span>
            )}

            {(tempFilters.min_spent || tempFilters.max_spent) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-xs">
                Spend: ₹{tempFilters.min_spent || 0} - ₹{tempFilters.max_spent || '∞'}
                <button onClick={() => removeFilter('spent')} className="hover:text-amber-950"><X size={12} /></button>
              </span>
            )}

            {tempFilters.last_order_days && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs">
                Within: {tempFilters.last_order_days} days
                <button onClick={() => removeFilter('last_order_days')} className="hover:text-slate-950"><X size={12} /></button>
              </span>
            )}

            <button
              onClick={handleReset}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline ml-1"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* Expandable Advanced Filters Drawer */}
      {isExpanded && (
        <div className="filters-panel px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
            {/* Location Filter */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                <MapPin size={12} className="text-slate-400" />
                <span>Shipping Location</span>
              </label>
              <select
                value={tempFilters.city}
                onChange={(e) => setTempFilters({ ...tempFilters, city: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-primary-500 shadow-2xs"
              >
                {locationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Order Count Filter */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                <ShoppingBag size={12} className="text-slate-400" />
                <span>Order Volume</span>
              </label>
              <select
                value={getOrderRangeValue()}
                onChange={(e) => handleOrderRangeChange(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-primary-500 shadow-2xs"
              >
                {orderCounts.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Spend Range Filter */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                <DollarSign size={12} className="text-slate-400" />
                <span>Gross Spend (₹)</span>
              </label>
              <div className="flex items-center gap-1">
                <input 
                  type="number" 
                  placeholder="Min ₹" 
                  value={tempFilters.min_spent} 
                  onChange={(e) => setTempFilters({ ...tempFilters, min_spent: e.target.value })} 
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-primary-500 shadow-2xs" 
                />
                <span className="text-slate-400 text-xs">-</span>
                <input 
                  type="number" 
                  placeholder="Max ₹" 
                  value={tempFilters.max_spent} 
                  onChange={(e) => setTempFilters({ ...tempFilters, max_spent: e.target.value })} 
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-primary-500 shadow-2xs" 
                />
              </div>
            </div>

            {/* Last Order Recency */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                <Calendar size={12} className="text-slate-400" />
                <span>Last Order Recency</span>
              </label>
              <select
                value={tempFilters.last_order_days}
                onChange={(e) => setTempFilters({ ...tempFilters, last_order_days: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-primary-500 shadow-2xs"
              >
                {lastOrderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Account Status */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mb-1">
                <CheckCircle size={12} className="text-slate-400" />
                <span>Account Status</span>
              </label>
              <select
                value={tempFilters.status}
                onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:border-primary-500 shadow-2xs"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-slate-200">
            <button 
              onClick={handleReset} 
              className="text-xs font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1"
            >
              <RotateCcw size={13} />
              <span>Reset Filters</span>
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsExpanded(false)} 
                className="px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleApply} 
                className="px-4 py-1.5 text-xs font-bold text-white bg-primary-500 hover:bg-primary-600 rounded-lg shadow-xs transition-colors"
              >
                Apply Criteria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
