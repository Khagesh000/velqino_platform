"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Star, 
  Award,
  X,
  Sparkles
} from '../../../../utils/icons';

export default function CustomersList({ 
  customers = [], 
  selectedCustomer, 
  setSelectedCustomer, 
  refreshTrigger, 
  isLoading = false 
}) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterTier]);

  if (!mounted) return null;

  const getTierBadge = (tier) => {
    switch(tier) {
      case 'Platinum':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white border border-slate-700 shadow-2xs">
            <Award size={11} className="text-amber-400" />
            <span>Platinum</span>
          </span>
        );
      case 'Gold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Star size={11} className="text-amber-500" />
            <span>Gold</span>
          </span>
        );
      case 'Silver':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Star size={11} className="text-indigo-500" />
            <span>Silver</span>
          </span>
        );
      case 'Bronze':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <Star size={11} className="text-gray-400" />
            <span>Bronze</span>
          </span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Recent';
    try {
      return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch {
      return 'Recent';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const customerName = customer.full_name || customer.name || '';
    const customerPhone = customer.phone || customer.mobile || '';
    const customerEmail = customer.email || '';
    const customerTier = customer.tier || 'Bronze';
    
    const matchesSearch = searchQuery === '' || 
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerPhone.includes(searchQuery) ||
      customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = filterTier === 'all' || customerTier.toLowerCase() === filterTier.toLowerCase();
    
    return matchesSearch && matchesTier;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const tierTabs = [
    { key: 'all', label: 'All Customers' },
    { key: 'Platinum', label: 'Platinum' },
    { key: 'Gold', label: 'Gold' },
    { key: 'Silver', label: 'Silver' },
    { key: 'Bronze', label: 'Bronze' },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-2xs text-center flex flex-col items-center justify-center min-h-[450px]">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-primary-600 border-t-transparent mb-3" />
        <p className="text-xs font-semibold text-gray-500">Loading customer dossiers...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header & Controls */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Customer Directory</h3>
              <p className="text-[11px] text-gray-400">Buyers registered with and shopping from your store</p>
            </div>
            <span className="text-xs font-bold text-primary-800 bg-primary-50 border border-primary-200/70 px-2.5 py-0.5 rounded-full ml-1">
              {filteredCustomers.length} total
            </span>
          </div>
          
          {/* Search Box */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl w-48 sm:w-60 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Tier Tabs Strip */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-1.5 overflow-x-auto">
          {tierTabs.map((tab) => {
            const isActive = filterTier.toLowerCase() === tab.key.toLowerCase();
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterTier(tab.key)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-primary-600 shadow-2xs border border-gray-200/80'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Table Content */}
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-semibold text-gray-700">No customers match this search</p>
            <p className="text-[11px] text-gray-400 mt-1">Try clearing your filters or search keywords</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/40 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-5">Customer Dossier</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4 text-center">Orders</th>
                  <th className="py-3 px-4 text-right">Lifetime Spend</th>
                  <th className="py-3 px-4">Tier Status</th>
                  <th className="py-3 px-4 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {paginatedCustomers.map((customer) => {
                  const customerName = customer.full_name || customer.name || 'Customer';
                  const customerPhone = customer.phone || customer.mobile || '—';
                  const customerEmail = customer.email || '—';
                  const customerVisits = customer.visits || customer.order_count || 0;
                  const customerTotalSpent = customer.totalSpent || customer.total_spent || 0;
                  const customerTier = customer.tier || 'Bronze';
                  const customerPoints = customer.points || Math.floor(customerTotalSpent / 10);
                  const customerId = customer.id || customer.user_id;
                  
                  const isSelected = selectedCustomer && (
                    selectedCustomer.id === customer.id || 
                    selectedCustomer.user_id === customer.user_id
                  );
                  
                  return (
                    <tr
                      key={customerId}
                      onClick={() => {
                        if (setSelectedCustomer) setSelectedCustomer(customer);
                      }}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-primary-50/60 font-medium' 
                          : 'hover:bg-gray-50/60'
                      }`}
                    >
                      <td className="py-3 px-4 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                            isSelected 
                              ? 'bg-primary-600 text-white' 
                              : 'bg-primary-50 text-primary-600 border border-primary-100'
                          }`}>
                            {customerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-900 truncate max-w-[140px] sm:max-w-[180px]">
                              {customerName}
                            </p>
                            <span className="text-[10px] text-gray-400 block">
                              Last active: {formatDate(customer.lastVisit || customer.last_visit)}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-gray-700 font-mono text-[11px]">
                            <Phone size={11} className="text-gray-400 shrink-0" />
                            <span>{customerPhone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                            <Mail size={11} className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[140px]">{customerEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg text-xs">
                          {customerVisits}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">
                          ₹{customerTotalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {getTierBadge(customerTier)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="font-bold text-primary-600">
                          {customerPoints.toLocaleString('en-IN')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs">
          <p className="text-gray-400 text-[11px]">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 text-xs font-bold text-gray-700">
              {currentPage} / {totalPages}
            </span>
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
  );
}