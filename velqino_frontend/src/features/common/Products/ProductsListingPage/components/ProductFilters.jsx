"use client";

import React, { useState } from 'react';
import { ChevronDown, Star, X } from '../../../../../utils/icons';

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

  const appliedFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) + selectedBrands.length + (selectedRating > 0 ? 1 : 0);

  const SectionHeader = ({ label, isOpen, onToggle }) => (
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold text-gray-800
        hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 group"
    >
      <span>{label}</span>
      <ChevronDown
        size={15}
        className={`text-gray-400 group-hover:text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-primary-500 rounded-full" />
          <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Filters</h3>
          {appliedFiltersCount > 0 && (
            <span className="bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {appliedFiltersCount}
            </span>
          )}
        </div>
        {appliedFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-primary-600 hover:text-primary-700 font-semibold hover:underline underline-offset-2 transition-all"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Applied Filter Tags */}
      {appliedFiltersCount > 0 && (
        <div className="px-5 py-3 border-b border-dashed border-gray-100 bg-primary-50/40 flex flex-wrap gap-1.5">
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-white border border-primary-200 text-primary-700 text-xs font-medium rounded-full">
              {categories.find(c => c.id === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory('all')}
                className="w-4 h-4 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
              >
                <X size={9} />
              </button>
            </span>
          )}
          {selectedBrands.map(brandId => (
            <span key={brandId} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-white border border-primary-200 text-primary-700 text-xs font-medium rounded-full">
              {brands.find(b => b.id === brandId)?.name}
              <button
                onClick={() => handleBrandToggle(brandId)}
                className="w-4 h-4 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
              >
                <X size={9} />
              </button>
            </span>
          ))}
          {selectedRating > 0 && (
            <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-white border border-primary-200 text-primary-700 text-xs font-medium rounded-full">
              {selectedRating}★ & above
              <button
                onClick={() => setSelectedRating(0)}
                className="w-4 h-4 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors"
              >
                <X size={9} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Categories */}
      <div className="border-b border-gray-100">
        <SectionHeader label="Categories" isOpen={openCategories} onToggle={() => setOpenCategories(!openCategories)} />
        <div className={`overflow-hidden transition-all duration-200 ${openCategories ? 'max-h-80' : 'max-h-0'}`}>
          <div className="px-5 pb-4 space-y-1">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-xl transition-all group
                  ${selectedCategory === cat.id
                    ? 'bg-primary-50 border border-primary-100'
                    : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${selectedCategory === cat.id
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300 group-hover:border-primary-300'}`}
                  >
                    {selectedCategory === cat.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors
                    ${selectedCategory === cat.id ? 'text-primary-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {cat.name}
                  </span>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium transition-colors
                  ${selectedCategory === cat.id ? 'text-primary-600 bg-primary-100' : 'text-gray-400 bg-gray-100'}`}>
                  {cat.count}
                </span>
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.id}
                  onChange={() => setSelectedCategory(cat.id)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-100">
        <SectionHeader label="Price Range" isOpen={openPrice} onToggle={() => setOpenPrice(!openPrice)} />
        <div className={`overflow-hidden transition-all duration-200 ${openPrice ? 'max-h-32' : 'max-h-0'}`}>
          <div className="px-5 pb-5">
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-primary-500 bg-gray-200"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">₹0</span>
              <span className="text-xs font-bold text-primary-600 bg-primary-50 border border-primary-100 px-2.5 py-1 rounded-lg">
                ₹{priceRange.max.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="border-b border-gray-100">
        <SectionHeader label="Brands" isOpen={openBrands} onToggle={() => setOpenBrands(!openBrands)} />
        <div className={`overflow-hidden transition-all duration-200 ${openBrands ? 'max-h-72' : 'max-h-0'}`}>
          <div className="px-5 pb-4 space-y-1">
            {brands.map((brand) => (
              <label
                key={brand.id}
                className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-xl transition-all group
                  ${selectedBrands.includes(brand.id)
                    ? 'bg-primary-50 border border-primary-100'
                    : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${selectedBrands.includes(brand.id)
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300 group-hover:border-primary-300'}`}
                  >
                    {selectedBrands.includes(brand.id) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors
                    ${selectedBrands.includes(brand.id) ? 'text-primary-700' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {brand.name}
                  </span>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium transition-colors
                  ${selectedBrands.includes(brand.id) ? 'text-primary-600 bg-primary-100' : 'text-gray-400 bg-gray-100'}`}>
                  {brand.count}
                </span>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandToggle(brand.id)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <SectionHeader label="Customer Rating" isOpen={openRating} onToggle={() => setOpenRating(!openRating)} />
        <div className={`overflow-hidden transition-all duration-200 ${openRating ? 'max-h-64' : 'max-h-0'}`}>
          <div className="px-5 pb-4 space-y-1">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl transition-all group
                  ${selectedRating === rating
                    ? 'bg-primary-50 border border-primary-100'
                    : 'hover:bg-gray-50 border border-transparent'}`}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                  ${selectedRating === rating
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-gray-300 group-hover:border-primary-300'}`}
                >
                  {selectedRating === rating && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`}
                    />
                  ))}
                </div>
                <span className={`text-xs font-medium transition-colors
                  ${selectedRating === rating ? 'text-primary-600' : 'text-gray-500 group-hover:text-gray-700'}`}>
                  & above
                </span>
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === rating}
                  onChange={() => setSelectedRating(rating)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}