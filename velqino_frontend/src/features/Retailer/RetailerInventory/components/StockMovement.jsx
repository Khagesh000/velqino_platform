"use client";

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Truck, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  X
} from '../../../../utils/icons';

export default function StockMovement() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const movements = [
    { id: 1, type: 'inward', product: 'Premium Cotton T-Shirt', sku: 'CT-001', quantity: 100, date: '2026-04-14', reference: 'PO-001', status: 'completed', party: 'Fashion Hub Supplier' },
    { id: 2, type: 'outward', product: 'Wireless Headphones', sku: 'WH-002', quantity: 25, date: '2026-04-14', reference: 'SO-045', status: 'completed', party: 'Customer Sale #45' },
    { id: 3, type: 'damaged', product: 'Smart Watch Pro', sku: 'SW-003', quantity: 2, date: '2026-04-13', reference: 'DMG-003', status: 'pending', party: 'Warehouse Inspection: Screen damage' },
    { id: 4, type: 'returned', product: 'Leather Wallet', sku: 'LW-004', quantity: 1, date: '2026-04-13', reference: 'RET-002', status: 'completed', party: 'Customer Return #2' },
    { id: 5, type: 'inward', product: 'Running Shoes', sku: 'RS-005', quantity: 50, date: '2026-04-12', reference: 'PO-002', status: 'completed', party: 'SportFit Wholesaler' },
    { id: 6, type: 'outward', product: 'Coffee Mug Ceramic', sku: 'CM-006', quantity: 30, date: '2026-04-12', reference: 'SO-046', status: 'completed', party: 'Customer Sale #46' },
    { id: 7, type: 'damaged', product: 'Leather Wallet', sku: 'LW-004', quantity: 1, date: '2026-04-11', reference: 'DMG-004', status: 'completed', party: 'Defective Stitching' },
    { id: 8, type: 'returned', product: 'Wireless Headphones', sku: 'WH-002', quantity: 1, date: '2026-04-11', reference: 'RET-003', status: 'pending', party: 'Customer Return #3' },
  ];

  const getTypeBadge = (type) => {
    switch(type) {
      case 'inward':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Truck size={11} className="text-emerald-500" />
            <span>Inward Restock</span>
          </span>
        );
      case 'outward':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Package size={11} className="text-indigo-500" />
            <span>Customer Outward</span>
          </span>
        );
      case 'damaged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle size={11} className="text-rose-500" />
            <span>Damaged / Write-off</span>
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <RefreshCw size={11} className="text-amber-500" />
            <span>Customer Return</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <Package size={11} />
            <span className="capitalize">{type}</span>
          </span>
        );
    }
  };

  const filteredMovements = movements.filter(m => {
    const matchesSearch = searchQuery === '' || 
      m.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === 'all' || m.type === activeTab;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage) || 1;
  const paginatedMovements = filteredMovements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const tabs = [
    { key: 'all', label: 'All Movements' },
    { key: 'inward', label: 'Inward' },
    { key: 'outward', label: 'Outward' },
    { key: 'damaged', label: 'Damaged' },
    { key: 'returned', label: 'Returned' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Header & Controls */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Stock Movement Ledger</h3>
              <p className="text-[11px] text-gray-400">Track inbound, outbound, customer returns, and damaged stock</p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search product, SKU, reference..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-7 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl w-48 sm:w-60 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
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
        {filteredMovements.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-semibold text-gray-700">No stock movements found</p>
            <p className="text-[11px] text-gray-400 mt-1">Adjust search terms or movement type filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/40 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-5">Product SKU</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4">Reference / Destination</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {paginatedMovements.map((m) => {
                  const isPositive = m.type === 'inward' || m.type === 'returned';
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/60 transition-all">
                      <td className="py-3 px-4 sm:px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-xs shrink-0">
                            <Package size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 truncate max-w-[180px] sm:max-w-[220px]">
                              {m.product}
                            </p>
                            <span className="text-[10px] text-gray-400 font-mono">
                              SKU: {m.sku}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getTypeBadge(m.type)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-lg font-bold text-xs ${
                          isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {isPositive ? '+' : '-'}{m.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-800 font-mono text-[11px] block">{m.reference}</span>
                        <span className="text-[10px] text-gray-400 truncate max-w-[180px] block">{m.party}</span>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500 font-mono text-[11px]">
                        {new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredMovements.length)} of {filteredMovements.length}
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
