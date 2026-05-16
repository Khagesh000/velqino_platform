'use client';

import React, { useState } from 'react';
import { Filter, X, Check, Search, DollarSign, Tag, Box } from '../../../../../utils/icons';

export default function ProductsFilter({ onApply, onClose, isOpen, categories = [] }) {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockStatus, setStockStatus] = useState('');
  const [sortBy, setSortBy] = useState('');

  const handleApply = () => {
    onApply({
      min_price: priceRange.min,
      max_price: priceRange.max,
      category_id: selectedCategory,
      stock_status: stockStatus,
      sort: sortBy
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-primary-500" />
            <h3 className="text-base font-semibold text-gray-900">Filter Products</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-all">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Price Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Price Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-500">Min Price</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    placeholder="0"
                    className="w-full pl-6 pr-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-500">Max Price</label>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    placeholder="10000"
                    className="w-full pl-6 pr-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Stock Status */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Stock Status</label>
            <div className="flex gap-2">
              <button
                onClick={() => setStockStatus('')}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${!stockStatus ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                All
              </button>
              <button
                onClick={() => setStockStatus('in_stock')}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${stockStatus === 'in_stock' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                In Stock
              </button>
              <button
                onClick={() => setStockStatus('low_stock')}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${stockStatus === 'low_stock' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Low Stock
              </button>
              <button
                onClick={() => setStockStatus('out_of_stock')}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${stockStatus === 'out_of_stock' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Out of Stock
              </button>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border rounded-lg focus:outline-none focus:border-primary-500"
            >
              <option value="">Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="stock_asc">Stock: Low to High</option>
              <option value="stock_desc">Stock: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-gray-100">
          <button onClick={handleReset} className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
            Reset
          </button>
          <button onClick={handleApply} className="flex-1 px-3 py-2 text-xs font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 flex items-center justify-center gap-1">
            <Check size={14} />
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}