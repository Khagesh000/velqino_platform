"use client";

import React, { useState, useMemo } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  User,
  Star,
  MoreVertical,
  Eye,
  Edit,
  Ban,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Award,
  Clock,
  Loader2,
  CheckCircle,
  Copy,
  ShoppingBag,
  ExternalLink,
  FilterX
} from '@/utils/icons';
import '../../../../styles/Wholesaler/Customers/CustomersTable.scss';
import { useBlockRetailerMutation, useUnblockRetailerMutation } from '@/redux/retailer/slices/retailerSlice';

export default function CustomersTable({ 
  customers = [], 
  isLoading = false, 
  onSelectCustomer, 
  onSelectCustomers,
  onResetFilters 
}) {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'orders', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const itemsPerPage = 10;

  const [blockRetailer] = useBlockRetailerMutation();
  const [unblockRetailer] = useUnblockRetailerMutation();

  const getLoyaltyTier = (spent) => {
    if (spent >= 50000) return 'Platinum';
    if (spent >= 20000) return 'Gold';
    if (spent >= 5000) return 'Silver';
    return 'Bronze';
  };

  // Sort customers
  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'total_spent') {
        aVal = Number(a.total_spent) || 0;
        bVal = Number(b.total_spent) || 0;
      } else if (sortConfig.key === 'orders') {
        aVal = Number(a.orders) || 0;
        bVal = Number(b.orders) || 0;
      }
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortConfig.direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }, [customers, sortConfig]);

  // Paginate
  const totalPages = Math.max(Math.ceil(sortedCustomers.length / itemsPerPage), 1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = sortedCustomers.slice(startIndex, startIndex + itemsPerPage);

  const toggleCustomerSelection = (customerId) => {
    const newSelection = selectedCustomers.includes(customerId) 
      ? selectedCustomers.filter(id => id !== customerId) 
      : [...selectedCustomers, customerId];
    setSelectedCustomers(newSelection);
    if (onSelectCustomers) onSelectCustomers(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0) {
      setSelectedCustomers([]);
      if (onSelectCustomers) onSelectCustomers([]);
    } else {
      const allIds = paginatedCustomers.map(c => c.id || c.user_id);
      setSelectedCustomers(allIds);
      if (onSelectCustomers) onSelectCustomers(allIds);
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleCopy = (text, id) => {
    if (!text || text === 'N/A') return;
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-200' 
      : 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  const getLoyaltyBadge = (tier) => {
    const tiers = {
      Platinum: 'bg-purple-100/80 text-purple-800 border-purple-200',
      Gold: 'bg-amber-100/80 text-amber-800 border-amber-200',
      Silver: 'bg-slate-100 text-slate-700 border-slate-200',
      Bronze: 'bg-orange-100/80 text-orange-800 border-orange-200'
    };
    return tiers[tier] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const handleBlockCustomer = async (customerId, isCurrentlyActive) => {
    const action = isCurrentlyActive ? 'block' : 'unblock';
    const confirmMsg = isCurrentlyActive 
      ? 'Are you sure you want to block this customer from placing orders?' 
      : 'Are you sure you want to unblock this customer?';
    
    if (!customerId) return;
    if (!window.confirm(confirmMsg)) return;
    
    try {
      if (isCurrentlyActive) {
        await blockRetailer(customerId).unwrap();
        alert('Customer blocked successfully.');
      } else {
        await unblockRetailer(customerId).unwrap();
        alert('Customer unblocked successfully.');
      }
    } catch (error) {
      alert(error?.data?.message || 'Operation failed. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No orders yet';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading && customers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center shadow-xs animate-pulse">
        <Loader2 size={32} className="animate-spin text-primary-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-700">Loading retailer customer directory...</p>
        <p className="text-xs text-slate-400 mt-1">Fetching verified retail accounts and order histories</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center shadow-xs flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3.5 shadow-2xs">
          <Users size={28} />
        </div>
        <h3 className="text-base font-bold text-slate-800">No Retailers Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          No customer accounts matched your search or active filter settings. Clear your search or reset filters to see all retail accounts.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <FilterX size={15} />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  const isAllSelected = selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0;

  return (
    <div className="customers-table-container bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
      {/* Table Header Bar */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            <Users size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Wholesale Retailer Accounts</h3>
            <p className="text-[11px] text-slate-500">Verified retail buyers and order statistics</p>
          </div>
          <span className="ml-2 px-2.5 py-0.5 bg-slate-200/80 text-slate-700 text-xs font-bold rounded-full">
            {customers.length} Accounts
          </span>
        </div>

        {selectedCustomers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200">
              {selectedCustomers.length} Selected
            </span>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="customers-table w-full text-xs">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="w-10 px-4 py-3 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:text-slate-800 transition-colors" 
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span>Retailer / Business</span>
                  {sortConfig.key === 'name' && (
                    <span className="text-primary-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left">Contact Info</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:text-slate-800 transition-colors" 
                onClick={() => handleSort('orders')}
              >
                <div className="flex items-center gap-1">
                  <span>Orders</span>
                  {sortConfig.key === 'orders' && (
                    <span className="text-primary-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left cursor-pointer hover:text-slate-800 transition-colors" 
                onClick={() => handleSort('total_spent')}
              >
                <div className="flex items-center gap-1">
                  <span>Total Spent</span>
                  {sortConfig.key === 'total_spent' && (
                    <span className="text-primary-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left">Last Order</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Loyalty Tier</th>
              <th className="w-24 px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedCustomers.map((customer, index) => {
              const custId = customer.id || customer.user_id;
              const isSelected = selectedCustomers.includes(custId);
              const initials = (customer.name || customer.business_name || 'RT')
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();
              const spent = Number(customer.total_spent) || 0;
              const tier = getLoyaltyTier(spent);

              return (
                <tr
                  key={custId || index}
                  className={`
                    customers-table-row transition-colors
                    ${isSelected ? 'bg-primary-50/40' : 'hover:bg-slate-50/80'}
                  `}
                  onMouseEnter={() => setHoveredRow(custId)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {/* Select Checkbox */}
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleCustomerSelection(custId)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </td>

                  {/* Customer / Business Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 text-primary-800 flex items-center justify-center font-bold text-xs shadow-2xs flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <button
                          onClick={() => onSelectCustomer?.(customer)}
                          className="text-sm font-bold text-slate-900 hover:text-primary-600 transition-colors truncate block text-left max-w-[180px] sm:max-w-xs"
                        >
                          {customer.name}
                        </button>
                        <p className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                          {customer.business_name || 'Retail Partner'}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {customer.email && customer.email !== 'N/A' && (
                        <div 
                          onClick={() => handleCopy(customer.email, `email-${custId}`)}
                          className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 cursor-pointer group/copy"
                          title="Click to copy email"
                        >
                          <Mail size={12} className="text-slate-400" />
                          <span className="truncate max-w-[140px] text-xs font-medium">{customer.email}</span>
                          {copiedId === `email-${custId}` && (
                            <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                          )}
                        </div>
                      )}
                      {customer.phone && customer.phone !== 'N/A' && (
                        <div 
                          onClick={() => handleCopy(customer.phone, `phone-${custId}`)}
                          className="flex items-center gap-1.5 text-slate-600 hover:text-primary-600 cursor-pointer group/copy"
                          title="Click to copy phone"
                        >
                          <Phone size={12} className="text-slate-400" />
                          <span className="text-xs font-medium">{customer.phone}</span>
                          {copiedId === `phone-${custId}` && (
                            <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-slate-700">
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="text-xs font-medium truncate max-w-[120px]">
                        {customer.city || 'Regional'}{customer.state ? `, ${customer.state}` : ''}
                      </span>
                    </div>
                  </td>

                  {/* Order Count */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md font-extrabold text-xs bg-slate-100 text-slate-800">
                      {customer.orders} orders
                    </span>
                  </td>

                  {/* Total Spent */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                      {formatCurrency(customer.total_spent)}
                    </span>
                  </td>

                  {/* Last Order Date */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                      <Clock size={12} className="text-slate-400" />
                      <span>{formatDate(customer.last_order)}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full ${getStatusBadge(customer.status)}`}>
                      {customer.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Loyalty Tier */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Award size={13} className="text-amber-500" />
                      <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md border ${getLoyaltyBadge(tier)}`}>
                        {tier}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button 
                        onClick={() => onSelectCustomer?.(customer)} 
                        title="View retailer profile"
                        className="p-1.5 text-slate-500 hover:text-primary-700 hover:bg-primary-50 rounded-lg border border-slate-200 hover:border-primary-200 transition-all shadow-2xs"
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        onClick={() => handleBlockCustomer(custId, customer.status === 'active')}
                        title={customer.status === 'active' ? 'Block customer' : 'Unblock customer'}
                        className={`p-1.5 rounded-lg border transition-all shadow-2xs ${
                          customer.status === 'active' 
                            ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200' 
                            : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200'
                        }`}
                      >
                        {customer.status === 'active' ? <Ban size={14} /> : <CheckCircle size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p className="order-2 sm:order-1 font-medium">
            Showing <strong className="text-slate-700">{startIndex + 1}</strong> to{' '}
            <strong className="text-slate-700">{Math.min(startIndex + itemsPerPage, customers.length)}</strong> of{' '}
            <strong className="text-slate-700">{customers.length}</strong> retailers
          </p>

          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={15} />
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 text-xs font-bold rounded-lg transition-all ${
                      currentPage === pageNum
                        ? 'bg-primary-500 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white border border-transparent hover:border-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
            <button
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-2xs"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
