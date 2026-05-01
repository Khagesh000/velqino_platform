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
  CheckCircle
} from '../../../../utils/icons';
import '../../../../styles/Wholesaler/Customers/CustomersTable.scss';
import { useBlockRetailerMutation, useUnblockRetailerMutation } from '@/redux/retailer/slices/retailerSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomersTable({ customers = [], isLoading = false, onSelectCustomer, onSelectCustomers }) {
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [blockRetailer] = useBlockRetailerMutation();
  const [unblockRetailer] = useUnblockRetailerMutation();

  const getLoyaltyTier = (spent) => {
    if (spent >= 2000000) return 'Platinum';
    if (spent >= 1000000) return 'Gold';
    if (spent >= 500000) return 'Silver';
    return 'Bronze';
  };

  // Sort customers
  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'total_spent') {
        aVal = a.total_spent || 0;
        bVal = b.total_spent || 0;
      } else if (sortConfig.key === 'orders') {
        aVal = a.orders || 0;
        bVal = b.orders || 0;
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
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
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
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
      if (onSelectCustomers) onSelectCustomers([]);
    } else {
      const allIds = paginatedCustomers.map(c => c.user_id);
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

  const getStatusBadge = (status) => {
    return status === 'active' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-700';
  };

  const getLoyaltyBadge = (tier) => {
    const tiers = {
      Platinum: 'bg-purple-100 text-purple-700',
      Gold: 'bg-warning-100 text-warning-700',
      Silver: 'bg-gray-100 text-gray-700',
      Bronze: 'bg-orange-100 text-orange-700'
    };
    return tiers[tier] || 'bg-gray-100 text-gray-700';
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
  const confirmMsg = isCurrentlyActive ? 'Are you sure you want to block this customer?' : 'Are you sure you want to unblock this customer?';
  
  console.log('Customer ID being passed:', customerId);
  
  if (!customerId) {
    console.error('Customer ID is undefined');
    toast.error('Customer ID not found!');
    return;
  }
  
  if (!confirm(confirmMsg)) return;
  
  try {
    if (isCurrentlyActive) {
      await blockRetailer(customerId).unwrap();
      toast.success('Customer blocked successfully!');
    } else {
      await unblockRetailer(customerId).unwrap();
      toast.success('Customer unblocked successfully!');
    }
    // Refresh data after 1.5 seconds
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (error) {
    toast.error(error?.data?.message || 'Action failed. Please try again.');
  }
};

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Loader2 size={32} className="animate-spin text-primary-500 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading customers...</p>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Users size={32} className="text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500">No customers found</p>
      </div>
    );
  }

  return (
    <div className="customers-table-container bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Customer List</h3>
          <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
            {customers.length} customers
          </span>
        </div>
        {selectedCustomers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{selectedCustomers.length} selected</span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="customers-table w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedCustomers.length === paginatedCustomers.length && paginatedCustomers.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('name')}>
                Customer {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('orders')}>
                Orders {sortConfig.key === 'orders' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer" onClick={() => handleSort('total_spent')}>
                Total Spent {sortConfig.key === 'total_spent' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loyalty</th>
              <th className="w-20 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedCustomers.map((customer, index) => (
              <tr
                key={customer.id || index}
                className={`customers-table-row ${hoveredRow === customer.id ? 'customers-table-row-hover' : ''} ${
                  selectedCustomers.includes(customer.id) ? 'bg-primary-50/30' : ''
                }`}
                onMouseEnter={() => setHoveredRow(customer.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.user_id)}
                    onChange={() => toggleCustomerSelection(customer.user_id)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                 </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium text-sm">
                      {customer.name?.substring(0, 2).toUpperCase() || 'RE'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                      <p className="text-xs text-gray-500">{customer.business_name}</p>
                    </div>
                  </div>
                 </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Mail size={12} className="text-gray-400" />
                      <span className="truncate max-w-[150px]">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                 </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="text-xs">{customer.city}, {customer.state}</span>
                  </div>
                 </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{customer.orders}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(customer.total_spent)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock size={12} className="text-gray-400" />
                    <span>{formatDate(customer.last_order)}</span>
                  </div>
                 </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(customer.status)}`}>
                    {customer.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                 </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Award size={14} className="text-warning-500" />
                    <span className={`text-xs font-medium ${getLoyaltyBadge(getLoyaltyTier(customer.total_spent))}`}>
                      {getLoyaltyTier(customer.total_spent)}
                    </span>
                  </div>
                 </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onSelectCustomer(customer)} className="...">
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleBlockCustomer(customer.user_id, customer.status === 'active')}
                      className={`p-1.5 rounded-lg transition-all ${
                        customer.status === 'active' 
                          ? 'text-gray-400 hover:text-error-600 hover:bg-error-50' 
                          : 'text-success-600 hover:text-success-700 hover:bg-success-50'
                      }`}
                    >
                      {customer.status === 'active' ? <Ban size={16} /> : <CheckCircle size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 order-2 sm:order-1">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, customers.length)} of {customers.length} customers
          </p>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <button
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
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
                  className={`w-8 h-8 text-sm rounded-lg transition-all ${
                    currentPage === pageNum
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}