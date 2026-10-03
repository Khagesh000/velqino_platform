'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Package, 
  TrendingUp, 
  Clock, 
  RefreshCw, 
  ShoppingCart, 
  Eye, 
  Bell, 
  CheckCircle, 
  Filter, 
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from '../../../../utils/icons';
import { useGetRetailerLowStockAlertsQuery } from '@/redux/retailer/slices/statsSlice';
import StockAlertsFilter from './filters/StockAlertsFilter';

export default function StockAlerts() {
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const itemsPerPage = 3;
  const [filterParams, setFilterParams] = useState({});

  const { data: response, isLoading, isFetching, refetch } = useGetRetailerLowStockAlertsQuery(filterParams);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const alerts = response?.data || [];
  
  // Filter based on type
  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => {
    if (filter === 'critical') return a.status === 'critical';
    if (filter === 'low') return a.status === 'warning';
    if (filter === 'out') return a.currentStock === 0;
    if (filter === 'expiring') return a.type === 'expiring';
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / itemsPerPage));
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const alertCounts = {
    critical: alerts.filter(a => a.status === 'critical').length,
    low: alerts.filter(a => a.status === 'warning').length,
    out: alerts.filter(a => a.currentStock === 0).length,
  };

  const totalUrgent = alertCounts.critical + alertCounts.out;

  const handleApplyFilters = (filters) => {
    setFilterParams(filters);
    setCurrentPage(1);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-2xs animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="h-8 bg-gray-100 rounded-xl w-32" />
        </div>
      </div>
    );
  }

  // If no alerts at all, show a sleek clean status bar
  if (alerts.length === 0) {
    return (
      <div className="bg-emerald-50/60 rounded-3xl border border-emerald-200/70 p-4 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={18} />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-900">Inventory Levels Optimal</h4>
            <p className="text-[11px] text-emerald-700">All catalog products are stocked above reorder thresholds.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="p-2 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors"
          title="Refresh Alerts"
        >
          <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden transition-all duration-300">
      {/* Executive Header Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            totalUrgent > 0 ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}>
            <Bell size={18} className={totalUrgent > 0 ? 'animate-bounce' : ''} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight">
                Stock Attention Needed
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                totalUrgent > 0 
                  ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {alerts.length} Items
              </span>
            </div>
            <p className="text-[11px] text-gray-500">
              Low inventory threshold alerts detected across your store catalog.
            </p>
          </div>
        </div>

        {/* Filter Pills & Controls */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
          <div className="flex items-center bg-gray-50 p-1 rounded-2xl border border-gray-200/80 gap-1">
            <button
              type="button"
              onClick={() => { setFilter('all'); setCurrentPage(1); }}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                filter === 'all' 
                  ? 'bg-white text-gray-900 shadow-2xs' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => { setFilter('critical'); setCurrentPage(1); }}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                filter === 'critical' 
                  ? 'bg-rose-600 text-white shadow-2xs' 
                  : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              Critical ({alertCounts.critical})
            </button>
            <button
              type="button"
              onClick={() => { setFilter('low'); setCurrentPage(1); }}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                filter === 'low' 
                  ? 'bg-amber-600 text-white shadow-2xs' 
                  : 'text-amber-600 hover:bg-amber-50'
              }`}
            >
              Low ({alertCounts.low})
            </button>
            <button
              type="button"
              onClick={() => { setFilter('out'); setCurrentPage(1); }}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all ${
                filter === 'out' 
                  ? 'bg-gray-800 text-white shadow-2xs' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Out ({alertCounts.out})
            </button>
          </div>

          <button 
            type="button"
            onClick={() => setShowFilterModal(true)}
            className="p-2 text-gray-500 hover:text-primary-700 bg-gray-50 hover:bg-primary-50 rounded-xl border border-gray-200 transition-colors"
            title="Filter Alerts"
          >
            <Filter size={14} />
          </button>

          <button 
            type="button"
            onClick={() => refetch()} 
            disabled={isFetching}
            className="p-2 text-gray-500 hover:text-primary-700 bg-gray-50 hover:bg-primary-50 rounded-xl border border-gray-200 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} className={isFetching ? 'animate-spin text-primary-600' : ''} />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <span>{isExpanded ? 'Hide' : 'Show'}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Collapsible Alerts Content */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-gray-50/40">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle size={28} className="text-emerald-500 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-gray-800">No alerts matching this filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {paginatedAlerts.map((alert) => {
                const isCritical = alert.status === 'critical';
                const isWarning = alert.status === 'warning';
                const isOut = alert.currentStock === 0;
                const stockPercent = alert.reorderLevel ? Math.min(100, Math.round((alert.currentStock / alert.reorderLevel) * 100)) : 0;

                return (
                  <div
                    key={alert.id}
                    className={`bg-white rounded-2xl p-4 border transition-all hover:shadow-md flex flex-col justify-between ${
                      isCritical 
                        ? 'border-rose-200 ring-1 ring-rose-100' 
                        : isOut 
                        ? 'border-gray-300 ring-1 ring-gray-100'
                        : 'border-amber-200 ring-1 ring-amber-100'
                    }`}
                  >
                    <div>
                      {/* Top Row: Thumbnail + Title & Status Badge */}
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center border border-gray-200/80">
                          {alert.image_url ? (
                            <img 
                              src={alert.image_url} 
                              alt={alert.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <Package size={20} className="text-gray-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isCritical 
                                ? 'bg-rose-100 text-rose-700' 
                                : isOut 
                                ? 'bg-gray-800 text-white' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {isCritical ? 'Critical' : isOut ? 'Out of Stock' : 'Low Stock'}
                            </span>
                            <span className="text-[10px] font-bold text-gray-900">
                              ₹{alert.price || 0}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                            {alert.name}
                          </h4>
                          <p className="text-[10px] font-mono text-gray-400">
                            {alert.sku}
                          </p>
                        </div>
                      </div>

                      {/* Stock Level Progress Bar */}
                      <div className="mt-3 bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                        <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                          <span className="text-gray-500">Current Stock</span>
                          <span className={isCritical ? 'text-rose-700' : isOut ? 'text-gray-800' : 'text-amber-700'}>
                            {alert.currentStock} / {alert.reorderLevel} units
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCritical ? 'bg-rose-500' : isOut ? 'bg-gray-400' : 'bg-amber-500'
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Info & Quick Action */}
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px]">
                      <span className="text-gray-400">
                        Supplier: <strong className="text-gray-700 font-semibold">{alert.supplier || 'Velqino Direct'}</strong>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          const query = alert.name || alert.sku;
                          const el = document.getElementById('barcode-printing-section');
                          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }}
                        className="px-2.5 py-1 text-xs font-bold rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <ShoppingCart size={11} />
                        <span>Restock</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Compact Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-gray-200/80">
              <span className="text-gray-400 text-[11px]">
                Showing {Math.min(filteredAlerts.length, (currentPage - 1) * itemsPerPage + 1)} - {Math.min(currentPage * itemsPerPage, filteredAlerts.length)} of {filteredAlerts.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 font-bold disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  Prev
                </button>
                <span className="px-2.5 py-1 rounded-lg bg-primary-600 text-white font-bold text-xs shadow-2xs">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 font-bold disabled:opacity-40 hover:bg-gray-100 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <StockAlertsFilter 
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
        />
      )}
    </div>
  );
}