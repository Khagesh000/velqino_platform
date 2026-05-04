"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, Menu, TrendingUp, Sparkles, Flame, Tag, Store, HelpCircle } from '../../../../utils/icons';
import '../../../../styles/common/HomePage/CategoriesMegaMenu.scss'

export default function CategoriesMegaMenu() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const megaMenuRef = useRef(null);
  const timeoutRef = useRef(null);

  const categories = [
    { id: 1, name: 'Electronics', slug: 'electronics', icon: '📱', subcategories: ['Mobiles', 'Laptops', 'Headphones', 'Speakers', 'Wearables'] },
    { id: 2, name: 'Clothing', slug: 'clothing', icon: '👕', subcategories: ['Men', 'Women', 'Kids', 'Winter Wear', 'Summer Collection'] },
    { id: 3, name: 'Home & Living', slug: 'home-living', icon: '🏠', subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Lighting'] },
    { id: 4, name: 'Beauty & Health', slug: 'beauty-health', icon: '💄', subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Wellness'] },
    { id: 5, name: 'Sports & Fitness', slug: 'sports-fitness', icon: '⚽', subcategories: ['Gym Equipment', 'Sportswear', 'Accessories', 'Nutrition'] },
  ];

  const quickLinks = [
    { name: 'Trending', icon: <TrendingUp size={14} />, href: '/trending', color: 'text-orange-500' },
    { name: 'New Arrivals', icon: <Sparkles size={14} />, href: '/new-arrivals', color: 'text-green-500' },
    { name: 'Best Sellers', icon: <Flame size={14} />, href: '/best-sellers', color: 'text-red-500' },
    { name: 'Deals of the Day', icon: <Tag size={14} />, href: '/deals', color: 'text-yellow-500' },
    { name: 'Brand Store', icon: <Store size={14} />, href: '/brands', color: 'text-purple-500' },
    { name: 'Help & Support', icon: <HelpCircle size={14} />, href: '/support', color: 'text-blue-500' },
  ];

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
      setActiveCategory(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="categories-mega-menu bg-gradient-to-br from-primary-50 to-secondary-50 border-b border-gray-100 shadow-sm z-40">
  <div className="container mx-auto px-3 sm:px-4 lg:px-6">
    
    {/* Main Row - Flex with proper spacing */}
    <div className="flex flex-wrap items-center justify-between gap-2 py-2 sm:py-3">
      
      {/* Categories Dropdown Button */}
      <div 
        ref={megaMenuRef}
        className="relative flex-shrink-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all font-medium text-xs sm:text-sm whitespace-nowrap min-w-[100px] sm:min-w-[120px]">
          <Menu size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">All Categories</span>
          <span className="sm:hidden">Categories</span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Mega Menu Dropdown */}
        {isMegaMenuOpen && (
          <div className="absolute top-full left-0 mt-2 w-screen max-w-[95vw] sm:max-w-[800px] lg:max-w-[900px] bg-white rounded-xl shadow-xl border border-gray-100 z-50 animate-slideDown">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 sm:p-5 max-h-[80vh] overflow-y-auto">
              {/* Categories Column */}
              <div className="border-b sm:border-b-0 sm:border-r border-gray-100 pb-3 sm:pb-0 sm:pr-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => setActiveCategory(cat.id)}
                  >
                    <Link
                      href={`/category/${cat.slug}`}
                      className={`flex items-center justify-between py-2.5 px-2 rounded-lg transition-all text-sm ${
                        activeCategory === cat.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg">{cat.icon}</span>
                        <span className="text-xs sm:text-sm font-medium">{cat.name}</span>
                      </div>
                      <ChevronRight size={14} className={`${activeCategory === cat.id ? 'text-primary-500' : 'text-gray-400'}`} />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Subcategories Column - 2 items per row on all screens */}
              <div className="col-span-2 px-0 sm:px-4">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`transition-all duration-200 ${activeCategory === cat.id ? 'block' : 'hidden'}`}
                  >
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                      Shop By {cat.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                      {cat.subcategories.map((sub, idx) => (
                        <Link
                          key={idx}
                          href={`/category/${cat.slug}/${sub.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-xs text-gray-600 hover:text-primary-600 py-1.5 transition-all hover:translate-x-1 duration-200 block truncate"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Links Column */}
              <div className="col-span-1 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 sm:pl-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  Quick Links
                </h4>
                <div className="space-y-2">
                  {quickLinks.map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 py-2 transition-all hover:translate-x-1 duration-200"
                    >
                      <span className={link.color}>{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  ))}
                </div>
                
                {/* Offer Banner */}
                <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg">
                  <p className="text-xs font-semibold text-primary-700">🔥 Limited Time Offer</p>
                  <p className="text-[10px] text-primary-600 mt-0.5">Up to 40% off on first purchase</p>
                  <Link href="/offers" className="text-[10px] text-primary-600 font-medium mt-1 inline-block hover:underline">
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 px-2 sm:px-3">
  {/* Mobile: Show first 2 quick links, Desktop: Show all 6 */}
  <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 sm:gap-2">
    {quickLinks.slice(0, 2).map((link, idx) => (
      <Link
        key={idx}
        href={link.href}
        className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2 py-1.5 text-[11px] sm:text-xs lg:text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all whitespace-nowrap"
      >
        <span className={link.color}>{link.icon}</span>
        <span className="text-gray-700">{link.name}</span>
      </Link>
    ))}
    {/* Desktop only: Show remaining 4 quick links */}
    <div className="hidden sm:contents">
      {quickLinks.slice(2, 6).map((link, idx) => (
        <Link
          key={idx}
          href={link.href}
          className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2 py-1.5 text-[11px] sm:text-xs lg:text-sm text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all whitespace-nowrap"
        >
          <span className={link.color}>{link.icon}</span>
          <span className="text-gray-700">{link.name}</span>
        </Link>
      ))}
    </div>
  </div>
</div>
    </div>
  </div>

  {/* Mobile Categories Bar - Horizontal Scroll (Only on mobile, below the main bar) */}
  <div className="lg:hidden border-t border-gray-100 bg-gray-50">
  <div className="container mx-auto px-3">
    {/* Horizontal scroll container - visible scrollbar on mobile */}
    <div className="flex overflow-x-auto gap-2 py-2 pb-3">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-lg shadow-sm min-w-[70px] hover:shadow-md transition-all flex-shrink-0"
        >
          <span className="text-lg">{cat.icon}</span>
          <span className="text-[10px] font-medium text-gray-700 text-center truncate w-full max-w-[70px]">{cat.name}</span>
        </Link>
      ))}
      {quickLinks.slice(0, 3).map((link, idx) => (
        <Link
          key={idx}
          href={link.href}
          className="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-lg shadow-sm min-w-[70px] hover:shadow-md transition-all flex-shrink-0"
        >
          <span className={link.color}>{link.icon}</span>
          <span className="text-[10px] font-medium text-gray-700 text-center truncate w-full max-w-[70px]">{link.name}</span>
        </Link>
      ))}
    </div>
  </div>
</div>
</div>
  );
}