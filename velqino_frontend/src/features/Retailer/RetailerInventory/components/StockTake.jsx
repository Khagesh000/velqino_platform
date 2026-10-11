"use client";

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Minus, 
  Save, 
  X, 
  RefreshCw, 
  Sparkles
} from '../../../../utils/icons';
import { toast } from 'react-toastify';

export default function StockTake({ onComplete }) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const products = [
    { id: 1, name: 'Premium Cotton T-Shirt', sku: 'CT-001', systemStock: 45, location: 'Aisle A-12' },
    { id: 2, name: 'Wireless Headphones', sku: 'WH-002', systemStock: 12, location: 'Shelf B-05' },
    { id: 3, name: 'Smart Watch Pro', sku: 'SW-003', systemStock: 8, location: 'Locker C-08' },
    { id: 4, name: 'Leather Wallet', sku: 'LW-004', systemStock: 23, location: 'Rack D-03' },
    { id: 5, name: 'Running Shoes', sku: 'RS-005', systemStock: 15, location: 'Bay E-07' },
    { id: 6, name: 'Coffee Mug Ceramic', sku: 'CM-006', systemStock: 45, location: 'Counter F-02' },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountChange = (productId, val) => {
    const num = parseInt(val) || 0;
    setCounts(prev => ({ ...prev, [productId]: num }));
  };

  const incrementCount = (productId, system) => {
    const current = counts[productId] !== undefined ? counts[productId] : system;
    setCounts(prev => ({ ...prev, [productId]: current + 1 }));
  };

  const decrementCount = (productId, system) => {
    const current = counts[productId] !== undefined ? counts[productId] : system;
    setCounts(prev => ({ ...prev, [productId]: Math.max(0, current - 1) }));
  };

  const getVariance = (productId, systemStock) => {
    const actual = counts[productId] !== undefined ? counts[productId] : systemStock;
    return actual - systemStock;
  };

  const handleReset = () => {
    setCounts({});
    setSearchQuery('');
  };

  const handleSubmitAudit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSubmitting(false);

    toast.success('Physical stock count committed! System inventory balances adjusted.');
    if (onComplete) onComplete();
    setCounts({});
  };

  const adjustedCount = Object.keys(counts).length;

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs overflow-hidden flex flex-col justify-between h-full flex-1">
      <div>
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <ClipboardList size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 tracking-tight">Physical Stock Audit</h3>
              <p className="text-[11px] text-gray-400">Reconcile physical floor counts with system stock</p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary-800 bg-primary-50 border border-primary-200/70 px-2.5 py-0.5 rounded-full">
            {adjustedCount} Adjusted
          </span>
        </div>

        {/* Search & Reset */}
        <div className="p-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Find product or SKU to audit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
          {adjustedCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-gray-500 hover:text-gray-900 px-2.5 py-1 rounded-lg hover:bg-gray-200 transition-all shrink-0"
            >
              Reset
            </button>
          )}
        </div>

        {/* Products Counting Grid */}
        <div className="p-4 sm:p-5 max-h-[300px] overflow-y-auto space-y-2.5">
          {filteredProducts.map((p) => {
            const actual = counts[p.id] !== undefined ? counts[p.id] : p.systemStock;
            const variance = getVariance(p.id, p.systemStock);
            const isChanged = counts[p.id] !== undefined;

            return (
              <div 
                key={p.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isChanged && variance !== 0
                    ? 'border-amber-300 bg-amber-50/30' 
                    : 'border-gray-200/80 bg-white hover:border-gray-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-400 font-mono">
                    SKU: {p.sku} • {p.location}
                  </p>
                  <span className="text-[11px] text-gray-500 mt-0.5 block">
                    System Stock: <strong className="text-gray-900">{p.systemStock}</strong>
                  </span>
                </div>

                {/* Counter & Variance */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-2xs overflow-hidden">
                    <button
                      type="button"
                      onClick={() => decrementCount(p.id, p.systemStock)}
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
                    >
                      <Minus size={11} />
                    </button>
                    <input
                      type="number"
                      value={actual}
                      onChange={(e) => handleCountChange(p.id, e.target.value)}
                      className="w-12 text-center text-xs font-bold text-gray-900 border-x border-gray-100 py-1 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => incrementCount(p.id, p.systemStock)}
                      className="px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Variance pill */}
                  <div className="w-12 text-right">
                    {variance === 0 ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        Match
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        variance > 0 ? 'text-emerald-700 bg-emerald-100' : 'text-rose-700 bg-rose-100'
                      }`}>
                        {variance > 0 ? `+${variance}` : variance}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Commit Audit Bar */}
      <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
        <span className="text-[11px] font-medium text-gray-500">
          Ready to reconcile floor count
        </span>

        <button
          type="button"
          onClick={handleSubmitAudit}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 disabled:opacity-40 transition-all shadow-xs flex items-center gap-1.5"
        >
          {isSubmitting ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
          <span>Commit Audit</span>
        </button>
      </div>
    </div>
  );
}
