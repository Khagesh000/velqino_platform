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
    <div className="flex flex-col gap-3 mb-6">
      
      {/* Row 1: Breadcrumb + Search (Desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Breadcrumb - Left */}
        <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
          <Link href="/" className="text-primary-600 hover:text-primary-700 transition-colors font-medium">Home</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-800 font-semibold">Products</span>
        </div>

        {/* Search Bar - Center */}
        <div className="w-full lg:max-w-md xl:max-w-lg">
        <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-11 pr-24 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 text-sm"
            />
            {searchQuery && (
            <button
                onClick={() => setSearchQuery('')}
                className="absolute right-16 top-1/2 -translate-y-1/2"
            >
                <X size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
            )}
            <button
            onClick={handleSearch}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-all"
            >
            Search
            </button>
        </div>
        </div>

        {/* Sort & View Toggle - Desktop */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          {/* <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              <List size={14} />
            </button>
          </div> */}
         <div className="flex items-center gap-2">
  <span className="text-xs text-gray-500 font-medium">Sort by:</span>
  <div className="relative">
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="appearance-none text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 cursor-pointer hover:border-primary-300 transition-all"
    >
      <option value="newest">Newest First</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
</div>
        </div>
      </div>

      {/* Row 2: Mobile Only - Filter Button + Sort + View Toggle */}
      <div className="flex sm:hidden items-center justify-between gap-2">
        {/* Filter Button */}
        <button
          onClick={onMobileFilterClick}
          className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 flex-1"
        >
          <Filter size={14} />
          Filters
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 flex-1">
  <span className="text-xs text-gray-500 font-medium">Sort:</span>
  <div className="relative flex-1">
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="w-full appearance-none text-sm bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 cursor-pointer hover:border-primary-300 transition-all"
    >
      <option value="newest">Newest First</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="rating">Top Rated</option>
    </select>
    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
</div>

        {/* View Toggle */}
        {/* <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            <Grid size={14} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-500'}`}
          >
            <List size={14} />
          </button>
        </div> */}
      </div>
    </div>
  );
}