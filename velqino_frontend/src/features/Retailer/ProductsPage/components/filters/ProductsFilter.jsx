'use client';

import React, { useState } from 'react';
import { Filter, X, Check, Search, DollarSign, Tag, Box, RotateCcw } from '../../../../../utils/icons';

export default function ProductsFilter({ onApply, onClose, isOpen, categories = [] }) {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleApply = () => {
    onApply({
      min_price: priceRange.min || undefined,
      max_price: priceRange.max || undefined,
      category_id: selectedCategory || undefined,
      stock_status: stockStatus || undefined,
      sort: sortBy || undefined
    });
    onClose();
  };

  const handleReset = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedCategory('');
    setStockStatus('');
    setSortBy('');
    onApply({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary-50 text-primary-600">
              <Filter size={16} />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">Filter Products</h3>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Min</span>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                  />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Max</span>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    placeholder="10000"
                    className="w-full pl-7 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Stock Status */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Stock Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-gray-50 p-1 rounded-2xl border border-gray-200 text-xs">
              <button
                type="button"
                onClick={() => setStockStatus('')}
                className={`py-1.5 font-bold rounded-xl transition-all ${
                  !stockStatus ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStockStatus('in_stock')}
                className={`py-1.5 font-bold rounded-xl transition-all ${
                  stockStatus === 'in_stock' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                In Stock
              </button>
              <button
                type="button"
                onClick={() => setStockStatus('low_stock')}
                className={`py-1.5 font-bold rounded-xl transition-all ${
                  stockStatus === 'low_stock' ? 'bg-amber-600 text-white shadow-2xs' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Low
              </button>
              <button
                type="button"
                onClick={() => setStockStatus('out_of_stock')}
                className={`py-1.5 font-bold rounded-xl transition-all ${
                  stockStatus === 'out_of_stock' ? 'bg-rose-600 text-white shadow-2xs' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                Out
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Sort Catalog</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white"
            >
              <option value="">Default Order</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="stock_asc">Stock: Low to High</option>
              <option value="stock_desc">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2.5 p-4 sm:p-5 border-t border-gray-100 bg-gray-50/50">
          <button 
            type="button"
            onClick={handleReset} 
            className="flex-1 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
          <button 
            type="button"
            onClick={handleApply} 
            className="flex-1 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Check size={14} />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
}