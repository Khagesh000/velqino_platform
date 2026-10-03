"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Package, 
  Truck, 
  ArrowRight,
  ExternalLink 
} from '../../../../utils/icons';

export default function LowStockAlerts({ data = [], isLoading }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'warning'

  const items = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(item => (item.status || '').toLowerCase() === filter);
  }, [items, filter]);

  const criticalCount = useMemo(() => {
    return items.filter(i => (i.status || '').toLowerCase() === 'critical').length;
  }, [items]);

  const warningCount = useMemo(() => {
    return items.filter(i => (i.status || '').toLowerCase() === 'warning').length;
  }, [items]);

  const totalDeficitUnits = useMemo(() => {
    return items.reduce((acc, i) => acc + Math.max(0, (i.reorderLevel || 10) - (i.currentStock || 0)), 0);
  }, [items]);

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

  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <Bell size={18} />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Low Stock Alerts</h3>
              <p className="text-xs text-gray-500">Inventory items fallen below reorder threshold</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                filter === 'all' 
                  ? 'bg-white text-gray-900 shadow-2xs' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                filter === 'critical' 
                  ? 'bg-white text-rose-700 shadow-2xs' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                filter === 'warning' 
                  ? 'bg-white text-amber-700 shadow-2xs' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Warning ({warningCount})
            </button>
          </div>
        </div>

        {/* Top Mini Badges */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
            <span className="text-[10px] font-bold uppercase text-rose-600 block">Critical (0 units)</span>
            <span className="text-base font-black text-rose-800 mt-0.5 block">{criticalCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <span className="text-[10px] font-bold uppercase text-amber-600 block">Low Stock</span>
            <span className="text-base font-black text-amber-800 mt-0.5 block">{warningCount}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-primary-50/60 border border-primary-100">
            <span className="text-[10px] font-bold uppercase text-primary-700 block">Units Deficit</span>
            <span className="text-base font-black text-primary-900 mt-0.5 block">+{totalDeficitUnits} pcs</span>
          </div>
        </div>

        {/* List of Items */}
        {filtered.length === 0 ? (
          <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-2xs">
              <CheckCircle size={22} />
            </div>
            <p className="text-sm font-bold text-gray-800">Inventory Healthy</p>
            <p className="text-xs text-gray-500 mt-0.5">All products are currently above their reorder thresholds.</p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filtered.map((item) => {
              const isCritical = (item.status || '').toLowerCase() === 'critical';
              const stock = item.currentStock || 0;
              const reorder = item.reorderLevel || 10;
              const stockPercent = Math.min(100, Math.round((stock / reorder) * 100));

              return (
                <div
                  key={item.id}
                  className={`
                    p-3 rounded-xl border transition-all duration-200 flex items-center gap-3.5
                    ${isCritical 
                      ? 'bg-rose-50/30 border-rose-200/80 hover:border-rose-300' 
                      : 'bg-amber-50/20 border-amber-200/80 hover:border-amber-300'
                    }
                  `}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {item.image_url ? (
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
                      />
                    ) : (
                      <Package size={20} className="text-gray-400" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <span className={`
                        text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0
                        ${isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}
                      `}>
                        {isCritical ? 'Out of Stock' : `${stock} left`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1.5">
                      <span className="font-mono text-gray-400">{item.sku}</span>
                      <span>•</span>
                      <span>Target: {reorder} pcs</span>
                    </div>

                    {/* Mini Stock Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-amber-500'}`}
                        style={{ width: `${Math.max(5, stockPercent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Reorder Button */}
                  <Link
                    href={`/product/productlistingpage?search=${encodeURIComponent(item.name)}`}
                    className="p-2 rounded-xl bg-white border border-gray-200 text-primary-600 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 transition-colors flex-shrink-0 shadow-2xs"
                    title="Source from Factory Lots"
                  >
                    <Truck size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-gray-400">
          {items.length} SKUs require procurement
        </span>
        <Link 
          href="/product/productlistingpage" 
          className="font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
        >
          <span>Wholesale Catalog</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
