"use client"

import React, { useState } from 'react'
import {
  Filter,
  ChevronDown,
  X,
  Search,
  Users,
  MapPin,
  ShoppingBag,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle
} from '../../../../utils/icons'
import '../../../../styles/Wholesaler/Customers/CustomerFilters.scss'

export default function CustomerFilters({ filters, onFilterChange }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [tempFilters, setTempFilters] = useState(filters)

  const customerTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'wholesaler', label: 'Wholesaler' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'distributor', label: 'Distributor' }
  ]

  const locations = [
    { value: 'all', label: 'All Locations' },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'ahmedabad', label: 'Ahmedabad' }
  ]

  const orderCounts = [
    { value: 'all', label: 'All Orders' },
    { value: '0-10', label: '0-10 Orders' },
    { value: '11-25', label: '11-25 Orders' },
    { value: '26-50', label: '26-50 Orders' },
    { value: '51+', label: '51+ Orders' }
  ]

  const lastOrderOptions = [
    { value: 'all', label: 'Any Time' },
    { value: 'last7', label: 'Last 7 Days' },
    { value: 'last30', label: 'Last 30 Days' },
    { value: 'last90', label: 'Last 90 Days' },
    { value: 'lastYear', label: 'Last Year' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status', icon: CheckCircle },
    { value: 'active', label: 'Active', icon: CheckCircle },
    { value: 'inactive', label: 'Inactive', icon: XCircle }
  ]

  const handleApply = () => {
    onFilterChange(tempFilters)
    setIsExpanded(false)
  }

  const handleReset = () => {
    const resetFilters = {
      type: 'all',
      status: 'all',
      location: 'all',
      orderRange: 'all',
      spendRange: { min: '', max: '' },
      lastOrder: 'all',
      searchQuery: ''
    }
    setTempFilters(resetFilters)
    onFilterChange(resetFilters)
    setIsExpanded(false)
  }

  const activeFilterCount = () => {
    let count = 0
    if (tempFilters.type !== 'all') count++
    if (tempFilters.status !== 'all') count++
    if (tempFilters.location !== 'all') count++
    if (tempFilters.orderRange !== 'all') count++
    if (tempFilters.spendRange.min || tempFilters.spendRange.max) count++
    if (tempFilters.lastOrder !== 'all') count++
    if (tempFilters.searchQuery) count++
    return count
  }

  return (
    <div className="customer-filters bg-white rounded-xl border border-gray-200">
      {/* Search Bar and Filter Toggle */}
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="sm:w-[18px] sm:h-[18px] absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={tempFilters.searchQuery}
              onChange={(e) => setTempFilters({ ...tempFilters, searchQuery: e.target.value })}
              className="w-full pl-9 sm:pl-10 pr-8 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            />
            {tempFilters.searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100"
                onClick={() => setTempFilters({ ...tempFilters, searchQuery: '' })}
              >
                <X size={12} className="sm:w-3.5 sm:h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          <button
            className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              isExpanded ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter size={14} className="sm:w-4 sm:h-4" />
            <span>Filters</span>
            {activeFilterCount() > 0 && (
              <span className="px-1 sm:px-1.5 py-0.5 bg-primary-500 text-white text-xxs sm:text-xs rounded-full">
                {activeFilterCount()}
              </span>
            )}
            <ChevronDown size={12} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="filters-panel px-3 sm:px-4 pb-4 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Customer Type */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <Users size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Customer Type</span>
              </label>
              <select
                value={tempFilters.type}
                onChange={(e) => setTempFilters({ ...tempFilters, type: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
              >
                {customerTypes.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Location</span>
              </label>
              <select
                value={tempFilters.location}
                onChange={(e) => setTempFilters({ ...tempFilters, location: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
              >
                {locations.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Order Count */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <ShoppingBag size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Order Count</span>
              </label>
              <select
                value={tempFilters.orderRange}
                onChange={(e) => setTempFilters({ ...tempFilters, orderRange: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
              >
                {orderCounts.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Spend Range */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <DollarSign size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Spend Range (₹)</span>
              </label>
              <div className="flex items-center gap-1 sm:gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={tempFilters.spendRange.min}
                  onChange={(e) => setTempFilters({ ...tempFilters, spendRange: { ...tempFilters.spendRange, min: e.target.value } })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                />
                <span className="text-gray-400 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={tempFilters.spendRange.max}
                  onChange={(e) => setTempFilters({ ...tempFilters, spendRange: { ...tempFilters.spendRange, max: e.target.value } })}
                  className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            {/* Last Order */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Last Order</span>
              </label>
              <select
                value={tempFilters.lastOrder}
                onChange={(e) => setTempFilters({ ...tempFilters, lastOrder: e.target.value })}
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-primary-500"
              >
                {lastOrderOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="filter-group">
              <label className="flex items-center gap-1 text-xxs sm:text-xs font-medium text-gray-500 mb-1">
                <CheckCircle size={12} className="sm:w-3.5 sm:h-3.5" />
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

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="text-xxs sm:text-xs text-gray-500 hover:text-gray-700 transition-all"
            >
              Reset all
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-2.5 sm:px-4 py-1 sm:py-1.5 text-xxs sm:text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-2.5 sm:px-4 py-1 sm:py-1.5 text-xxs sm:text-xs font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFilterCount() > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
          {tempFilters.type !== 'all' && (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-50 text-primary-700 text-xxs sm:text-xs rounded-full">
              Type: {customerTypes.find(t => t.value === tempFilters.type)?.label}
              <button onClick={() => setTempFilters({ ...tempFilters, type: 'all' })} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={10} className="sm:w-2.5 sm:h-2.5" />
              </button>
            </span>
          )}
          {tempFilters.location !== 'all' && (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-50 text-primary-700 text-xxs sm:text-xs rounded-full">
              Location: {locations.find(l => l.value === tempFilters.location)?.label}
              <button onClick={() => setTempFilters({ ...tempFilters, location: 'all' })} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={10} />
              </button>
            </span>
          )}
          {tempFilters.orderRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-50 text-primary-700 text-xxs sm:text-xs rounded-full">
              Orders: {orderCounts.find(o => o.value === tempFilters.orderRange)?.label}
              <button onClick={() => setTempFilters({ ...tempFilters, orderRange: 'all' })} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={10} />
              </button>
            </span>
          )}
          {(tempFilters.spendRange.min || tempFilters.spendRange.max) && (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-50 text-primary-700 text-xxs sm:text-xs rounded-full">
              Spend: ₹{tempFilters.spendRange.min || '0'} - ₹{tempFilters.spendRange.max || '∞'}
              <button onClick={() => setTempFilters({ ...tempFilters, spendRange: { min: '', max: '' } })} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={10} />
              </button>
            </span>
          )}
          {tempFilters.lastOrder !== 'all' && (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-50 text-primary-700 text-xxs sm:text-xs rounded-full">
              Last Order: {lastOrderOptions.find(l => l.value === tempFilters.lastOrder)?.label}
              <button onClick={() => setTempFilters({ ...tempFilters, lastOrder: 'all' })} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={10} />
              </button>
            </span>
          )}
          {tempFilters.status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-50 text-primary-700 text-xxs sm:text-xs rounded-full">
              Status: {statusOptions.find(s => s.value === tempFilters.status)?.label}
              <button onClick={() => setTempFilters({ ...tempFilters, status: 'all' })} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={10} />
              </button>
            </span>
          )}
          {tempFilters.searchQuery && (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-50 text-primary-700 text-xxs sm:text-xs rounded-full">
              Search: {tempFilters.searchQuery}
              <button onClick={() => setTempFilters({ ...tempFilters, searchQuery: '' })} className="p-0.5 hover:bg-primary-100 rounded-full">
                <X size={10} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}