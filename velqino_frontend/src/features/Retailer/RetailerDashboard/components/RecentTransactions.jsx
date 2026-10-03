"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  CreditCard
} from '../../../../utils/icons';

export default function RecentTransactions({ data = [], isLoading }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'completed' | 'pending'

  const transactionsList = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const filtered = useMemo(() => {
    if (filter === 'all') return transactionsList;
    return transactionsList.filter(t => (t.status || '').toLowerCase() === filter);
  }, [transactionsList, filter]);

  const totalVolume = useMemo(() => {
    return transactionsList.reduce((acc, t) => acc + Number(t.amount || 0), 0);
  }, [transactionsList]);

  const pendingCount = useMemo(() => {
    return transactionsList.filter(t => (t.status || '').toLowerCase() === 'pending').length;
  }, [transactionsList]);

  const completedCount = useMemo(() => {
    return transactionsList.filter(t => (t.status || '').toLowerCase() === 'completed').length;
  }, [transactionsList]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-44 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'success') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle size={12} />
          <span>Completed</span>
        </span>
      );
    }
    if (s === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <Clock size={12} />
          <span>Pending</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle size={12} />
        <span>{status || 'Failed'}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <ShoppingBag size={18} />
            </span>
            <h3 className="text-base font-bold text-gray-900">Recent Transactions</h3>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Live store checkouts & digital invoices</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'all' 
                ? 'bg-white text-gray-900 shadow-2xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            All ({transactionsList.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'completed' 
                ? 'bg-white text-emerald-700 shadow-2xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Completed ({completedCount})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              filter === 'pending' 
                ? 'bg-white text-amber-700 shadow-2xs' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
          <span className="text-[10px] font-bold uppercase text-gray-400 block">Total Volume</span>
          <span className="text-base sm:text-lg font-black text-gray-900 mt-0.5 block">
            ₹{totalVolume.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
          <span className="text-[10px] font-bold uppercase text-gray-400 block">Orders</span>
          <span className="text-base sm:text-lg font-black text-gray-900 mt-0.5 block">
            {transactionsList.length}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
          <span className="text-[10px] font-bold uppercase text-amber-600 block">Pending Clearance</span>
          <span className="text-base sm:text-lg font-black text-amber-800 mt-0.5 block">
            {pendingCount}
          </span>
        </div>
      </div>

      {/* Table Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400 shadow-2xs">
            <ShoppingBag size={20} />
          </div>
          <p className="text-sm font-bold text-gray-800">No Transactions Found</p>
          <p className="text-xs text-gray-500 mt-0.5">Transactions processed through the POS register will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-1">Txn ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 pr-1 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item, idx) => {
                const customerInitials = (item.customer || 'Customer')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr key={item.id || idx} className="hover:bg-primary-50/30 transition-colors">
                    <td className="py-3 pl-1 font-mono font-bold text-primary-700">
                      {item.id}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold text-[10px] flex items-center justify-center">
                          {customerInitials}
                        </div>
                        <span className="font-semibold text-gray-900">{item.customer}</span>
                      </div>
                    </td>
                    <td className="py-3 font-extrabold text-gray-900">
                      ₹{Number(item.amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-3 pr-1 text-right font-medium text-gray-400">
                      {item.time || 'Today'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-400">
          Showing {filtered.length} of {transactionsList.length} transactions
        </span>
        <Link 
          href="/retailer/retailerorders" 
          className="font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
        >
          <span>All Orders</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
