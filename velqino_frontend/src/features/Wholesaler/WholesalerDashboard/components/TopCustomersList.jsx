"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Mail, Phone, ChevronRight, Award, TrendingUp, Loader2 } from '../../../../utils/icons';
import '../../../../styles/Wholesaler/WholesalerDashboard/TopCustomersList.scss';

export default function TopCustomersList({ customers, isLoading, currentPage, totalPages, totalCount, totalSpent, growth, onPageChange }) {
  const router = useRouter();
  const [hoveredCustomer, setHoveredCustomer] = useState(null);
  const customersList = Array.isArray(customers) ? customers : (customers?.items || customers?.data || []);
  const perPage = 6;
  const hasMore = currentPage < totalPages;

  // Support both preformatted and raw API total_spent values
  const rawTotalSpent = customersList.reduce((sum, c) => sum + (Number(c.total_spent) || 0), 0);
  const displayTotalSpent = totalSpent && totalSpent !== '₹0' 
    ? totalSpent 
    : (rawTotalSpent > 0 ? `₹${rawTotalSpent.toLocaleString()}` : '₹0');

  const getAvatarBg = (color) => {
    switch(color) {
      case 'primary': return 'bg-primary-100 text-primary-700';
      case 'success': return 'bg-emerald-100 text-emerald-700';
      case 'accent': return 'bg-amber-100 text-amber-700';
      case 'warning': return 'bg-amber-100 text-amber-700';
      default: return 'bg-primary-100 text-primary-700';
    }
  };

  const getTypeBadge = (type) => {
    switch(type?.toLowerCase()) {
      case 'wholesaler': return 'bg-primary-50 text-primary-700 border-primary-100';
      case 'retailer': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-center py-10">
          <Loader2 size={28} className="animate-spin text-primary-600 mb-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 lg:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 lg:mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-bold text-slate-900">Top Customers</h3>
              <p className="text-xs text-slate-500">Highest purchase value partners</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 border border-primary-200/60 rounded-full text-xs font-semibold shadow-2xs">
              <Award size={13} />
              <span>{displayTotalSpent}</span>
            </span>

            <button
              type="button"
              onClick={() => router.push('/wholesaler/customers')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200/80 rounded-xl text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-all shadow-2xs group"
            >
              <span>All Customers</span>
              <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Empty State */}
        {customersList.length === 0 && (
          <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-xs flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Users size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">No customers yet</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">When retailers place orders, top spenders will appear here</p>
            <button
              type="button"
              onClick={() => router.push('/wholesaler/customers')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-50 text-primary-700 border border-primary-200/80 rounded-xl text-xs font-semibold hover:bg-primary-100 transition-all shadow-2xs"
            >
              <span>Partner Directory</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Customers List */}
        {customersList.length > 0 && (
          <div className="space-y-3">
            {customersList.map((customer, index) => {
              const rank = customer.rank || index + 1;
              const formattedSpent = customer.spent_formatted || (customer.total_spent !== undefined ? `₹${Number(customer.total_spent).toLocaleString()}` : '₹0');
              const orderCount = customer.orders ?? customer.order_count ?? 0;
              const initial = customer.avatar || (customer.name ? customer.name[0].toUpperCase() : 'C');
              const customerType = customer.type || 'Retailer';

              return (
                <div
                  key={customer.id || index}
                  className={`group relative bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 ${
                    hoveredCustomer === (customer.id || index) ? 'translate-y-[-2px] border-primary-200' : ''
                  }`}
                  onMouseEnter={() => setHoveredCustomer(customer.id || index)}
                  onMouseLeave={() => setHoveredCustomer(null)}
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                    {rank}
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-start gap-3.5">
                    {/* Avatar */}
                    <div className={`relative w-11 h-11 rounded-xl ${getAvatarBg(customer.color)} flex items-center justify-center font-bold text-base flex-shrink-0 shadow-2xs`}>
                      {initial}
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-500" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                            {customer.name}
                          </h4>
                          <p className="text-xs text-slate-500 truncate">{customer.email}</p>
                        </div>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${getTypeBadge(customerType)} flex-shrink-0`}>
                          {customerType}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 bg-slate-50/60 rounded-xl p-2">
                        <div>
                          <p className="text-[11px] font-medium text-slate-400">Total Spent</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{formattedSpent}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-slate-400">Orders</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900">{orderCount} orders</p>
                        </div>
                      </div>

                      {/* Contact Actions */}
                      <div className="flex items-center gap-2 mt-2.5">
                        {customer.email && (
                          <a 
                            href={`mailto:${customer.email}`} 
                            className="p-1.5 bg-slate-50 border border-slate-200/80 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all text-slate-500"
                            title={`Email ${customer.name}`}
                          >
                            <Mail size={13} />
                          </a>
                        )}
                        {customer.phone && (
                          <a 
                            href={`tel:${customer.phone}`} 
                            className="p-1.5 bg-slate-50 border border-slate-200/80 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-all text-slate-500"
                            title={`Call ${customer.name}`}
                          >
                            <Phone size={13} />
                          </a>
                        )}
                        {customer.since && (
                          <span className="text-[11px] text-slate-400 ml-auto">
                            Since {customer.since}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-400 font-medium">{customersList.length} partners listed</span>
        <button
          type="button"
          onClick={() => router.push('/wholesaler/customers')}
          className="flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700 transition-all hover:gap-1.5"
        >
          <span>View Partner Directory</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

