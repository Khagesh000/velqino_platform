"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star, X } from '../../../../../utils/icons';
import '../../../../../styles/common/Products/ProductsListingPage/ProductFilters.scss'

export default function ProductFilters() {
  const [openCategories, setOpenCategories] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openBrands, setOpenBrands] = useState(true);
  const [openRating, setOpenRating] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);

  const categories = [
    { id: 'all', name: 'All Products', count: 45 },
    { id: 'electronics', name: 'Electronics', count: 12 },
    { id: 'clothing', name: 'Clothing', count: 8 },
    { id: 'accessories', name: 'Accessories', count: 10 },
    { id: 'sports', name: 'Sports', count: 6 },
    { id: 'home', name: 'Home & Living', count: 9 },
  ];

  const brands = [
    { id: 'nike', name: 'Nike', count: 12 },
    { id: 'adidas', name: 'Adidas', count: 8 },
    { id: 'apple', name: 'Apple', count: 6 },
    { id: 'samsung', name: 'Samsung', count: 5 },
    { id: 'sony', name: 'Sony', count: 4 },
  ];

  const handleBrandToggle = (brandId) => {
    setSelectedBrands(prev =>
      prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: 0, max: 50000 });
    setSelectedBrands([]);
    setSelectedRating(0);
  };

  const appliedFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + selectedBrands.length + (selectedRating > 0 ? 1 : 0);

  return (
    <aside className="w-72 flex-shrink-0 animate-fadeIn">
      <div className="bg-white rounded-xl border border-gray-100 sticky top-24">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {appliedFiltersCount > 0 && (
            <button onClick={clearAllFilters} className="text-xs text-primary-500 hover:text-primary-600 transition-all">
              Clear All ({appliedFiltersCount})
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => setOpenCategories(!openCategories)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all"
          >
            <span>Categories</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${openCategories ? 'rotate-180' : ''}`} />
          </button>
          <div className={`px-4 pb-3 space-y-2 overflow-hidden transition-all duration-200 ${openCategories ? 'max-h-96' : 'max-h-0'}`}>
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat.id}
                    onChange={() => setSelectedCategory(cat.id)}
                    className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">{cat.name}</span>
                </div>
                <span className="text-xs text-gray-400">({cat.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => setOpenPrice(!openPrice)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all"
          >
            <span>Price Range</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${openPrice ? 'rotate-180' : ''}`} />
          </button>
          <div className={`px-4 pb-3 overflow-hidden transition-all duration-200 ${openPrice ? 'max-h-24' : 'max-h-0'}`}>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>₹0</span>
              <span>₹{priceRange.max.toLocaleString()}+</span>
            </div>
          </div>
        </div>

        {/* Brands */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => setOpenBrands(!openBrands)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all"
          >
            <span>Brands</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${openBrands ? 'rotate-180' : ''}`} />
          </button>
          <div className={`px-4 pb-3 space-y-2 overflow-hidden transition-all duration-200 ${openBrands ? 'max-h-60' : 'max-h-0'}`}>
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => handleBrandToggle(brand.id)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-primary-600 transition-colors">{brand.name}</span>
                </div>
                <span className="text-xs text-gray-400">({brand.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div className="border-b border-gray-100">
          <button
            onClick={() => setOpenRating(!openRating)}
            className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-all"
          >
            <span>Customer Rating</span>
            <ChevronDown size={16} className={`transition-transform duration-200 ${openRating ? 'rotate-180' : ''}`} />
          </button>
          <div className={`px-4 pb-3 space-y-2 overflow-hidden transition-all duration-200 ${openRating ? 'max-h-60' : 'max-h-0'}`}>
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating)}
                  className="w-4 h-4 text-primary-500 focus:ring-primary-500"
                />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-500 group-hover:text-primary-600 transition-colors">& above</span>
              </label>
            ))}
          </div>
        </div>

        {/* Applied Filters */}
        {appliedFiltersCount > 0 && (
          <div className="p-4 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-700 mb-2">Applied Filters</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full animate-tagIn">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-primary-800">
                    <X size={10} />
                  </button>
                </span>
              )}
              {selectedBrands.map(brandId => (
                <span key={brandId} className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full animate-tagIn">
                  {brands.find(b => b.id === brandId)?.name}
                  <button onClick={() => handleBrandToggle(brandId)} className="hover:text-primary-800">
                    <X size={10} />
                  </button>
                </span>
              ))}
              {selectedRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-600 text-xs rounded-full animate-tagIn">
                  {selectedRating}★ & above
                  <button onClick={() => setSelectedRating(0)} className="hover:text-primary-800">
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}