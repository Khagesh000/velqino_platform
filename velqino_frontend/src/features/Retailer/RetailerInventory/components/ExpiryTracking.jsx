"use client";

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Tag, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function ExpiryTracking() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const expiringProducts = [
    { id: 1, name: 'Organic Herbal Tea Blend', sku: 'TEA-001', batch: 'BATCH-401', expiryDate: '2026-04-20', daysLeft: 15, quantity: 45, location: 'Shelf A-12', status: 'critical' },
    { id: 2, name: 'Scented Soy Candle Pack', sku: 'CND-004', batch: 'BATCH-402', expiryDate: '2026-05-02', daysLeft: 27, quantity: 23, location: 'Bay D-03', status: 'warning' },
    { id: 3, name: 'Artisanal Coffee Beans 500g', sku: 'COF-006', batch: 'BATCH-403', expiryDate: '2026-04-14', daysLeft: 9, quantity: 15, location: 'Rack F-02', status: 'critical' },
    { id: 4, name: 'Natural Lip Balm Set', sku: 'LIP-005', batch: 'BATCH-404', expiryDate: '2026-05-18', daysLeft: 43, quantity: 8, location: 'Bin E-07', status: 'warning' },
    { id: 5, name: 'Essential Cedarwood Oil', sku: 'OIL-002', batch: 'BATCH-405', expiryDate: '2026-06-25', daysLeft: 81, quantity: 12, location: 'Cabinet B-05', status: 'healthy' },
  ];

  const filteredProducts = expiringProducts.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'critical') return p.daysLeft <= 15;
    if (filter === 'warning') return p.daysLeft > 15 && p.daysLeft <= 45;
    if (filter === 'healthy') return p.daysLeft > 45;
    return true;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusBadge = (daysLeft) => {
    if (daysLeft <= 15) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle size={10} className="text-rose-500" />
          <span>Critical ({daysLeft}d left)</span>
        </span>
      );
    }
    if (daysLeft <= 45) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
          <Clock size={10} className="text-amber-500" />
          <span>Expiring Soon ({daysLeft}d)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle size={10} className="text-emerald-500" />
        <span>Healthy ({daysLeft}d)</span>
      </span>
    );
  };

  const handleClearance = (product) => {
    toast.success(`Discount clearance promo applied to ${product.name} (Batch: ${product.batch})!`);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full flex-1">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Batch Expiry Control</h3>
              <p className="text-[11px] text-gray-400">Shelf-life inspection & markdown triggers</p>
            </div>
          </div>

          <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
            {expiringProducts.filter(p => p.daysLeft <= 30).length} Imminent
          </span>
        </div>

        {/* Filter Pills */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-1.5 overflow-x-auto">
          {[
            { key: 'all', label: 'All Batches' },
            { key: 'critical', label: '≤ 15 Days' },
            { key: 'warning', label: '16 - 45 Days' },
            { key: 'healthy', label: 'Safe' },
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === tab.key
                  ? 'bg-white text-primary-600 shadow-2xs border border-gray-200/80'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List of Expiring Products */}
        <div className="p-4 sm:p-5 space-y-2.5 max-h-56 overflow-y-auto">
          {paginatedProducts.map(p => (
            <div
              key={p.id}
              className="p-3 rounded-2xl border border-gray-200/80 bg-white hover:border-rose-300 transition-all flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                  <span className="font-mono text-gray-700">{p.batch}</span>
                  <span>•</span>
                  <span>{p.quantity} units</span>
                  <span>•</span>
                  <span>{p.location}</span>
                </div>
                <div className="mt-1">
                  {getStatusBadge(p.daysLeft)}
                </div>
              </div>

              {p.daysLeft <= 30 && (
                <button
                  type="button"
                  onClick={() => handleClearance(p)}
                  className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-xs font-bold border border-amber-200 shrink-0 flex items-center gap-1 transition-all active:scale-95"
                >
                  <Tag size={11} />
                  <span>Markdown</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-4 sm:px-5 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs">
          <span className="text-gray-400 text-[11px]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
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
