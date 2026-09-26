"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  TrendingUp,
  Sparkles,
  Flame,
  Tag,
  Store,
  HelpCircle,
  ArrowRight,
  Shield,
  Package,
  X
} from '../../../../utils/icons';
import '../../../../styles/common/HomePage/CategoriesMegaMenu.scss';

// Curated wholesale subcategories map for realistic, high-converting browsing
const defaultSubcategoriesMap = {
  'pant': [
    { name: 'Formal Trousers', query: 'formal' },
    { name: 'Casual Chinos', query: 'chino' },
    { name: 'Baggy Cargo Jeans', query: 'cargo' },
    { name: 'Slim Fit Denim', query: 'slim fit' },
    { name: 'Stretch Denim', query: 'stretch' },
    { name: 'Cotton Slacks', query: 'cotton' },
  ],
  'shirt': [
    { name: 'Casual Button-Down', query: 'casual' },
    { name: 'Formal Office Shirts', query: 'formal' },
    { name: 'Linen Breezy Shirts', query: 'linen' },
    { name: 'Checkered Flannels', query: 'check' },
    { name: 'Cuban Collar Streetwear', query: 'cuban' },
    { name: 'Oxford Cotton Fits', query: 'oxford' },
  ],
  'tshirt': [
    { name: 'Oversized Streetwear Tees', query: 'oversized' },
    { name: 'Heavyweight 240+ GSM', query: 'heavyweight' },
    { name: 'Classic Solid Crewneck', query: 'crewneck' },
    { name: 'Premium Pique Polo', query: 'polo' },
    { name: 'Vintage Acid Wash', query: 'acid wash' },
    { name: 'Minimalist Pocket Tees', query: 'pocket' },
  ],
  'jacket': [
    { name: 'Denim Sherpa Jackets', query: 'sherpa' },
    { name: 'Bomber & Flight Jackets', query: 'bomber' },
    { name: 'Fleece Windbreakers', query: 'fleece' },
    { name: 'Structured Blazers', query: 'blazer' },
    { name: 'Corduroy Overcoats', query: 'corduroy' },
    { name: 'Water-Resistant Outerwear', query: 'outerwear' },
  ],
  'saree': [
    { name: 'Kanjeevaram Silk Sarees', query: 'silk' },
    { name: 'Banarasi Brocade Weave', query: 'banarasi' },
    { name: 'Lightweight Georgette', query: 'georgette' },
    { name: 'Daily Handloom Cotton', query: 'cotton' },
    { name: 'Festive Embroidered', query: 'festive' },
    { name: 'Contemporary Party Wear', query: 'party' },
  ],
  'punjabi dresses': [
    { name: 'Anarkali Suit Sets', query: 'anarkali' },
    { name: 'Straight Cut Salwar', query: 'straight' },
    { name: 'Embroidered Dupatta Sets', query: 'embroidered' },
    { name: 'Festive Sharara Suits', query: 'sharara' },
    { name: 'Casual Cotton Kurtis', query: 'kurti' },
    { name: 'Designer Party Suits', query: 'designer' },
  ],
  'track pants': [
    { name: 'Heavy Fleece Joggers', query: 'joggers' },
    { name: 'Technical Cargo Trackpants', query: 'cargo' },
    { name: 'Athletic Training Pants', query: 'athletic' },
    { name: 'Slim Fit Cotton Sweatpants', query: 'sweatpants' },
    { name: 'Straight-Leg Trackers', query: 'straight' },
    { name: 'Moisture-Wicking Activewear', query: 'active' },
  ]
};

export default function CategoriesMegaMenu({ categories = [], quickLinksData = {}, loading = false }) {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);
  const megaMenuRef = useRef(null);
  const timeoutRef = useRef(null);

  // Transform categories from backend
  const formattedCategories = useMemo(() => {
    const getCategoryIcon = (categoryName) => {
      const iconMap = {
        'shirt': '👕',
        'pant': '👖',
        'tshirt': '👕',
        'track pants': '🏃',
        'saree': '🥻',
        'punjabi dresses': '👗',
        'dress': '👗',
        'jacket': '🧥',
        'short': '🩳',
        'jean': '👖',
        'hoodie': '👕',
        'sweater': '🧥',
        'skirt': '👗',
        'blazer': '👔',
        'suit': '👔',
        'default': '📁'
      };

      const lowerName = categoryName?.toLowerCase() || '';
      if (iconMap[lowerName]) return iconMap[lowerName];
      for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerName.includes(key)) return icon;
      }
      return iconMap.default;
    };

    const getSubcategories = (catName, existingSubs) => {
      if (Array.isArray(existingSubs) && existingSubs.length > 0) {
        return existingSubs;
      }
      const lower = catName?.toLowerCase() || '';
      for (const [key, list] of Object.entries(defaultSubcategoriesMap)) {
        if (lower.includes(key)) return list;
      }
      return [
        { name: 'Fresh Mill Lots', query: 'fresh' },
        { name: 'Wholesale Packs', query: 'pack' },
        { name: 'Bulk Cartons', query: 'bulk' },
        { name: 'New Season In', query: 'new' },
        { name: 'Factory Drops', query: 'drop' },
        { name: 'Assorted Sizes', query: 'assorted' },
      ];
    };

    if (!categories) return [];

    const list = Array.isArray(categories)
      ? categories
      : (categories.data || categories.results || []);

    if (Array.isArray(list)) {
      return list.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: getCategoryIcon(category.name),
        productCount: category.product_count || 12,
        subcategories: getSubcategories(category.name, category.children || category.subcategories),
        image: category.image,
      }));
    }

    return [];
  }, [categories]);

  // Always have a valid active category so subcategories are NEVER empty or blank
  const currentActiveCatId = activeCategory || formattedCategories[0]?.id;
  const currentActiveCat = formattedCategories.find(c => c.id === currentActiveCatId) || formattedCategories[0];

  const quickLinks = useMemo(() => {
    return [
      {
        name: 'Trending',
        icon: <TrendingUp size={14} />,
        href: '/product/productlistingpage?sort=-total_sold',
        color: 'text-orange-500',
        count: quickLinksData?.trending_count || null
      },
      {
        name: 'New Arrivals',
        icon: <Sparkles size={14} />,
        href: '/product/productlistingpage?sort=-created_at',
        color: 'text-green-500',
        count: quickLinksData?.new_arrivals_count || null
      },
      {
        name: 'Best Sellers',
        icon: <Flame size={14} />,
        href: '/product/productlistingpage?sort=-total_sold',
        color: 'text-red-500',
        count: quickLinksData?.best_sellers_count || null
      },
      {
        name: 'Deals of the Day',
        icon: <Tag size={14} />,
        href: '/product/productlistingpage?deals_of_day=true',
        color: 'text-yellow-500',
        count: quickLinksData?.deals_count || null
      },
      {
        name: 'Brand Store',
        icon: <Store size={14} />,
        href: '/product/productlistingpage',
        color: 'text-purple-500',
        count: quickLinksData?.brands_count || null
      },
      {
        name: 'Help & Support',
        icon: <HelpCircle size={14} />,
        href: '/support',
        color: 'text-blue-500',
        count: null
      },
    ];
  }, [quickLinksData]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 220);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false);
      }
    };
    if (isMegaMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMegaMenuOpen]);

  // Show loading skeleton
  if (loading) {
    return (
      <div className="categories-mega-menu bg-white border-b-2 border-primary-200/80 shadow-xs z-40">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2 py-2 sm:py-3">
            <div className="flex-shrink-0 w-[120px] h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1 grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-mega-menu bg-white border-b-2 border-primary-200/90 shadow-xs z-40">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">

        {/* Main Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 sm:py-2.5">

          {/* Categories Dropdown Button */}
          <div
            ref={megaMenuRef}
            className="relative flex-shrink-0"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsMegaMenuOpen(prev => !prev)}
              className="flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all font-bold text-xs sm:text-sm whitespace-nowrap min-w-[100px] sm:min-w-[125px] shadow-xs hover:shadow-md cursor-pointer"
            >
              <Menu size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">All Categories</span>
              <span className="sm:hidden">Categories</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Ultra-Premium Responsive Mega Dropdown */}
            {isMegaMenuOpen && (
              <>
                {/* Mobile Backdrop */}
                <div
                  className="sm:hidden fixed inset-0 bg-primary-950/40 backdrop-blur-[1px] z-40"
                  onClick={() => setIsMegaMenuOpen(false)}
                />

                <div
                  className="categories-mega-dropdown"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Desktop 2-Panel View (hidden on mobile, visible on sm and up) */}
                  <div className="hidden sm:flex divide-x divide-primary-100 min-h-[380px]">

                    {/* Left Column: Wholesale Categories List */}
                    <div className="w-60 md:w-64 flex-shrink-0 p-3 bg-primary-50/25 overflow-y-auto max-h-[75vh]">
                      <div className="flex items-center justify-between px-3 py-1.5 mb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary-900/60">
                          Wholesale Catalog
                        </span>
                        <span className="text-[10px] font-bold text-primary-700 bg-primary-100/80 px-2 py-0.5 rounded-full">
                          {formattedCategories.length} Types
                        </span>
                      </div>

                      <div className="space-y-1">
                        {formattedCategories.map((cat) => {
                          const isActive = currentActiveCatId === cat.id;
                          return (
                            <div
                              key={cat.id}
                              onMouseEnter={() => setActiveCategory(cat.id)}
                              onClick={() => setActiveCategory(cat.id)}
                            >
                              <Link
                                href={`/product/productlistingpage?category_id=${cat.id}&category=${encodeURIComponent(cat.name)}`}
                                onClick={() => setIsMegaMenuOpen(false)}
                                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-xs font-semibold ${isActive ? 'cat-item-active' : 'cat-item-inactive'
                                  }`}
                              >
                                <div className="flex items-center gap-2.5 truncate">
                                  <span className="text-base flex-shrink-0">{cat.icon}</span>
                                  <span className="cat-name truncate">{cat.name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  {cat.productCount && (
                                    <span className="cat-badge text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                      {cat.productCount}
                                    </span>
                                  )}
                                  <ChevronRight size={13} className={isActive ? 'text-white' : 'text-gray-400'} />
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Column: Active Category Subcategories & Direct Wholesale Lots */}
                    {currentActiveCat ? (
                      <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto max-h-[75vh]">
                        <div>
                          {/* Category Title & Badge */}
                          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-primary-100">
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">{currentActiveCat.icon}</span>
                              <div>
                                <h3 className="text-base font-bold text-gray-900 leading-tight">
                                  {currentActiveCat.name} Wholesale Lots
                                </h3>
                                <span className="text-[11px] text-gray-500 mt-0.5 inline-block">
                                  Direct Mill Pricing · Zero Middleman Markup
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-md">
                              {currentActiveCat.productCount || 10}+ Ready Lots
                            </span>
                          </div>

                          {/* Subcategories Grid */}
                          <div className="mb-4">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                              Popular Wholesale Cuts & Styles
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                              {currentActiveCat.subcategories.map((sub, idx) => {
                                const subName = typeof sub === 'string' ? sub : (sub.name || '');
                                return (
                                  <Link
                                    key={idx}
                                    href={`/product/productlistingpage?category_id=${currentActiveCat.id}&search=${encodeURIComponent(subName)}`}
                                    onClick={() => setIsMegaMenuOpen(false)}
                                    className="subcat-pill group/item flex items-center justify-between p-3 rounded-xl"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className="subcat-dot w-2 h-2 rounded-full flex-shrink-0" />
                                      <span className="subcat-name text-xs truncate">
                                        {subName}
                                      </span>
                                    </div>
                                    <ChevronRight size={13} className="subcat-arrow flex-shrink-0" />
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Bar: Direct Mill Guarantees & View All Button */}
                        <div className="pt-3 border-t border-primary-100 flex items-center justify-between gap-3 bg-gradient-to-r from-primary-50/50 via-white to-primary-50/30 -mx-5 -mb-5 p-4 rounded-b-2xl">
                          <div className="flex items-center gap-3 text-[11px] text-gray-600">
                            <div className="flex items-center gap-1">
                              <Sparkles size={13} className="text-accent-600" />
                              <span className="font-semibold text-gray-800">Tier-1 Mill QC</span>
                            </div>
                            <span className="text-primary-200">·</span>
                            <div className="flex items-center gap-1">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>Escrow Protected</span>
                            </div>
                          </div>

                          <Link
                            href={`/product/productlistingpage?category_id=${currentActiveCat.id}&category=${encodeURIComponent(currentActiveCat.name)}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="explore-all-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0"
                          >
                            <span>Explore All {currentActiveCat.name}</span>
                            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>

                      </div>
                    ) : null}

                  </div>

                  {/* Mobile Accordion View (visible on mobile screens sm:hidden) */}
                  <div className="sm:hidden flex flex-col max-h-[calc(85vh-125px)]">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-primary-100 bg-primary-50/50">
                      <div className="flex items-center gap-2">
                        <Menu size={16} className="text-primary-600" />
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                          Wholesale Categories
                        </span>
                        <span className="text-[10px] font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
                          {formattedCategories.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setIsMegaMenuOpen(false)}
                        className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-white transition-colors"
                        aria-label="Close categories menu"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* Mobile Categories List (Accordion) */}
                    <div className="overflow-y-auto divide-y divide-primary-100/60 p-2">
                      {formattedCategories.map((cat) => {
                        const isExpanded = expandedMobileCat === cat.id;
                        return (
                          <div key={cat.id} className="py-1">
                            <button
                              type="button"
                              onClick={() => setExpandedMobileCat(isExpanded ? null : cat.id)}
                              className={`mobile-cat-header-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${isExpanded ? 'mobile-cat-header-btn-expanded' : ''
                                }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-base">{cat.icon}</span>
                                <span className="mobile-cat-name">{cat.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {cat.productCount && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-primary-100 text-primary-800 rounded-full font-bold">
                                    {cat.productCount}
                                  </span>
                                )}
                                <ChevronDown
                                  size={14}
                                  className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-primary-600' : 'text-gray-400'}`}
                                />
                              </div>
                            </button>

                            {/* Expanded Subcategories for Mobile */}
                            {isExpanded && (
                              <div className="mt-2 mb-1 p-2.5 bg-primary-50/30 rounded-xl border border-primary-100 space-y-2">
                                <div className="grid grid-cols-2 gap-1.5">
                                  {cat.subcategories.map((sub, idx) => {
                                    const subName = typeof sub === 'string' ? sub : (sub.name || '');
                                    return (
                                      <Link
                                        key={idx}
                                        href={`/product/productlistingpage?category_id=${cat.id}&search=${encodeURIComponent(subName)}`}
                                        onClick={() => setIsMegaMenuOpen(false)}
                                        className="mobile-subcat-pill text-[11px] font-medium px-2 py-1.5 rounded-lg truncate flex items-center gap-1.5"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                                        <span className="truncate">{subName}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                                <Link
                                  href={`/product/productlistingpage?category_id=${cat.id}&category=${encodeURIComponent(cat.name)}`}
                                  onClick={() => setIsMegaMenuOpen(false)}
                                  className="explore-all-btn flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-bold"
                                >
                                  <span>View All {cat.name} Lots</span>
                                  <ArrowRight size={12} />
                                </Link>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>

          {/* Quick Links Navigation */}
          <div className="flex-1 min-w-0 px-2 sm:px-3">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 sm:gap-2">
              {quickLinks.slice(0, 2).map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2 py-1.5 text-[11px] sm:text-xs lg:text-sm text-gray-700 hover:text-primary-700 hover:bg-primary-50/80 rounded-lg transition-all whitespace-nowrap font-medium"
                >
                  <span className={link.color}>{link.icon}</span>
                  <span className="text-gray-700">{link.name}</span>
                  {link.count && (
                    <span className="hidden sm:inline-block text-[10px] bg-primary-600 text-white px-1.5 rounded-full font-bold shadow-2xs">
                      {link.count}
                    </span>
                  )}
                </Link>
              ))}
              {/* Desktop only: Show remaining 4 quick links */}
              <div className="hidden sm:contents">
                {quickLinks.slice(2, 6).map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    className="flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-2 py-1.5 text-[11px] sm:text-xs lg:text-sm text-gray-700 hover:text-primary-700 hover:bg-primary-50/80 rounded-lg transition-all whitespace-nowrap font-medium"
                  >
                    <span className={link.color}>{link.icon}</span>
                    <span className="text-gray-700">{link.name}</span>
                    {link.count && (
                      <span className="text-[10px] bg-primary-600 text-white px-1.5 rounded-full font-bold shadow-2xs">
                        {link.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Categories Bar - Horizontal Scroll */}
      <div className="lg:hidden border-t border-primary-100 bg-primary-50/30">
        <div className="container mx-auto px-3">
          <div className="flex overflow-x-auto gap-2 py-2 pb-3 hide-scrollbar">
            {formattedCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/product/productlistingpage?category_id=${cat.id}&category=${encodeURIComponent(cat.name)}`}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-xl border border-primary-100 shadow-2xs min-w-[70px] hover:border-primary-300 transition-all flex-shrink-0"
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="text-[10px] font-medium text-gray-700 text-center truncate w-full max-w-[70px]">{cat.name}</span>
              </Link>
            ))}
            {quickLinks.slice(0, 3).map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="flex flex-col items-center gap-1 px-3 py-2 bg-white rounded-xl border border-primary-100 shadow-2xs min-w-[70px] hover:border-primary-300 transition-all flex-shrink-0"
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