"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, Grid, List, Filter, ChevronDown } from '../../../../../utils/icons';

export default function ProductTopBar({ onMobileFilterClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
   <div className="bg-white border border-gray-100 rounded-2xl px-4 sm:px-6 py-4 shadow-sm mb-6">

  {/* Row 1: Breadcrumb + Search + Sort — Desktop */}
  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">

    {/* Breadcrumb */}
    <div className="flex items-center gap-1.5 text-sm flex-shrink-0">
      <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
        Home
      </Link>
      <span className="text-gray-300 font-light text-base">/</span>
      <span className="text-gray-500 font-medium">Products</span>
    </div>

    {/* Divider */}
    <div className="hidden sm:block h-5 w-px bg-gray-200 flex-shrink-0" />

    {/* Search Bar */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 focus-within:bg-white transition-all duration-200">
        <div className="pl-3.5 flex-shrink-0">
          <Search size={16} className="text-gray-400 group-focus-within:text-primary-500" />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 min-w-0 px-3 py-2.5 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="flex-shrink-0 p-1.5 mr-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={13} className="text-gray-400" />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="flex-shrink-0 m-1.5 px-4 py-1.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </div>

    {/* Sort Dropdown — Desktop */}
    <div className="hidden sm:flex items-center gap-2.5 flex-shrink-0">
      <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Sort by</span>
      <div className="relative">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="appearance-none text-sm text-gray-700 font-medium bg-gray-50 border border-gray-200 rounded-xl pl-3.5 pr-9 py-2.5
            hover:border-primary-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 focus:bg-white
            cursor-pointer transition-all duration-200"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  </div>

  {/* Row 2: Mobile Only — Filter + Sort */}
  <div className="flex sm:hidden items-center gap-2 mt-3 pt-3 border-t border-gray-100">

    {/* Filter Button */}
    <button
      onClick={onMobileFilterClick}
      className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-50 border border-primary-200 text-primary-700 rounded-xl text-sm font-semibold hover:bg-primary-100 active:bg-primary-200 transition-all flex-shrink-0"
    >
      <Filter size={14} />
      Filters
    </button>

    {/* Sort — Mobile */}
    <div className="flex items-center gap-2 flex-1 min-w-0">
      <span className="text-xs text-gray-400 font-medium flex-shrink-0">Sort</span>
      <div className="relative flex-1 min-w-0">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full appearance-none text-sm text-gray-700 font-medium bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-8 py-2.5
            hover:border-primary-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100
            cursor-pointer transition-all duration-200"
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  </div>

</div>
  );
}
