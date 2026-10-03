"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Star, 
  ArrowRight,
  Phone,
  Mail 
} from '../../../../utils/icons';

export default function CustomerActivity({ data = [], isLoading }) {
  const customers = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-44 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Users size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Customer Activity</h3>
              <p className="text-xs text-gray-500">Live store visits & repeat buyers</p>
            </div>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2.5 text-emerald-600 shadow-2xs">
              <UserPlus size={20} />
            </div>
            <p className="text-sm font-bold text-gray-800">No New Visits Today</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              Buyer engagement and checkout loyalty entries will log here in real-time as customers purchase from your store.
            </p>
            <Link
              href="/retailer/retailercustomers"
              className="inline-flex items-center gap-1.5 mt-3 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              <Users size={13} />
              <span>Customer Directory</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {customers.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50/70 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    {(c.name || 'Customer').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900">{c.name}</h4>
                    <p className="text-[11px] text-gray-400">{c.phone || c.email || 'Walk-in buyer'}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {c.type || 'Repeat'}
                  </span>
                  <p className="text-[11px] text-gray-400 mt-0.5">{c.lastVisit || 'Today'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-400">Buyer Retention CRM</span>
        <Link 
          href="/retailer/retailercustomers" 
          className="font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
        >
          <span>All Customers</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
