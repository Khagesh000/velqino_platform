"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, ArrowRight, Tag } from '../../../../utils/icons';

export default function CategoryGrid({ categories = [], productsData = {}, loading = false }) {
  const sectionRef = useRef(null);

  // Helper function to get icon based on category name
  const getCategoryIcon = (name = '') => {
    const lower = name.toLowerCase();
    if (lower.includes('pant') || lower.includes('jeans')) return '👖';
    if (lower.includes('shirt') || lower.includes('tshirt')) return '👕';
    if (lower.includes('saree')) return '🥻';
    if (lower.includes('dress') || lower.includes('punjabi')) return '👗';
    if (lower.includes('jacket')) return '🧥';
    return '🛍️';
  };

  // Formatted categories list
  const formattedCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    const list = categories.data || categories.results || categories;
    if (!Array.isArray(list)) return [];

    const products = [
      ...(productsData?.bestSelling || []),
      ...(productsData?.newArrivals || []),
      ...(productsData?.dealsOfDay || [])
    ];

    return list.map((category) => {
      const match = products.find(p => p.category === category.name);
      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        productCount: category.product_count || 10,
        icon: getCategoryIcon(category.name),
        image: match?.image || category.image || '/images/products/placeholder.jpg',
      };
    });
  }, [categories, productsData]);

  // Amazon-style multi-product department cards
  const departmentHubs = useMemo(() => {
    const products = [
      ...(productsData?.bestSelling || []),
      ...(productsData?.newArrivals || []),
      ...(productsData?.dealsOfDay || [])
    ];

    return [
      {
        id: 'ethnic-wear',
        title: 'Women Ethnic & Sarees',
        subtitle: 'Starting ₹499 | Bulk Discounts',
        badge: 'Trending',
        items: products.filter(p => p.category === 'Saree' || p.category === 'Punjabi Dresses').slice(0, 4),
        fallbackImages: [
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785047503/retailer/products/2026/07/RET-CC8ABFD8_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785047597/retailer/products/2026/07/RET-FAC92F52_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785047623/retailer/products/2026/07/RET-BA71757B_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785049553/products/2026/07/PROD-0B138866_image_1'
        ],
        link: '/product/productlistingpage?category=saree',
        linkText: 'Explore Ethnic Catalog'
      },
      {
        id: 'mens-bottomwear',
        title: 'Men Jeans & Baggy Pants',
        subtitle: 'Heavy GSM Denim & Trackpants',
        badge: 'Bestseller',
        items: products.filter(p => p.category === 'Pant' || p.category === 'Track Pants').slice(0, 4),
        fallbackImages: [
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048593/retailer/products/2026/07/RET-84B74D80_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048584/retailer/products/2026/07/RET-49E33B7C_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048578/retailer/products/2026/07/RET-D74EE782_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785050400/products/2026/07/PROD-B834A209_image_1'
        ],
        link: '/product/productlistingpage?category=pant',
        linkText: 'See All Bottomwear'
      },
      {
        id: 'winter-jackets',
        title: 'Outerwear & Jackets',
        subtitle: 'Up to 50% Off | Winter Stock',
        badge: 'Seasonal',
        items: products.filter(p => p.category === 'Jacket').slice(0, 4),
        fallbackImages: [
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048693/retailer/products/2026/07/RET-80409D4B_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1784806670/products/2026/07/PROD-37F52CDB_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048693/retailer/products/2026/07/RET-80409D4B_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1784806670/products/2026/07/PROD-37F52CDB_image_1'
        ],
        link: '/product/productlistingpage?category=jacket',
        linkText: 'Shop Outerwear'
      },
      {
        id: 'daily-essentials',
        title: 'T-Shirts & Daily Wear',
        subtitle: 'Wholesale Bundles from ₹299',
        badge: 'Hot Deal',
        items: products.filter(p => p.category === 'Tshirt' || p.category === 'Shirt').slice(0, 4),
        fallbackImages: [
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1784804663/products/2026/07/PROD-8A5EA90E_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785050400/products/2026/07/PROD-B834A209_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1784804663/products/2026/07/PROD-8A5EA90E_image_1',
          'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785050400/products/2026/07/PROD-B834A209_image_1'
        ],
        link: '/product/productlistingpage?category=tshirt',
        linkText: 'Explore Daily Basics'
      }
    ];
  }, [productsData]);

  if (loading) {
    return (
      <div className="container py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (formattedCategories.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-4 sm:py-5 lg:py-6 bg-gray-50/70 border-b border-gray-100">
      <div className="container">
        
        {/* Amazon-Style 4-Card Multi-Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-5 sm:mb-6">
          {departmentHubs.map((hub) => (
            <div 
              key={hub.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/70 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Hub Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug line-clamp-1">
                      {hub.title}
                    </h3>
                    <p className="text-xs text-primary-600 font-semibold mt-0.5">
                      {hub.subtitle}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200 whitespace-nowrap">
                    {hub.badge}
                  </span>
                </div>

                {/* 2x2 Image Quad */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[0, 1, 2, 3].map((idx) => {
                    const item = hub.items[idx];
                    const imgUrl = item?.image || hub.fallbackImages[idx];
                    const label = item?.name || `${hub.title} Style ${idx + 1}`;
                    const price = item?.price ? `₹${item.price}` : 'Wholesale';

                    return (
                      <Link 
                        key={idx}
                        href={item ? `/product/productlistingpage?product_id=${item.id}` : hub.link}
                        className="group/quad relative block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-primary-300 transition-colors"
                      >
                        <div className="relative aspect-square w-full overflow-hidden bg-white p-1.5 flex items-center justify-center">
                          <img
                            src={imgUrl}
                            alt={label}
                            loading="lazy"
                            onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover/quad:scale-105"
                          />
                        </div>
                        <div className="p-1.5 bg-gray-50/80 border-t border-gray-100 text-center">
                          <p className="text-[11px] font-medium text-gray-700 truncate group-hover/quad:text-primary-600">
                            {label}
                          </p>
                          <span className="text-[10px] font-bold text-gray-900 block">
                            {price}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Hub Bottom CTA */}
              <Link 
                href={hub.link}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 pt-1 group"
              >
                <span>{hub.linkText}</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Flipkart-Style Horizontal Category Scroll Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-200/70 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-primary-600" />
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                Explore All Apparel & Textile Categories
              </span>
            </div>
            <Link 
              href="/product/productlistingpage" 
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div 
            className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {formattedCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/product/productlistingpage?category=${encodeURIComponent(cat.slug || cat.name)}`}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200/80 hover:border-primary-400 hover:bg-primary-50/40 transition-all group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <div className="text-left">
                  <span className="text-xs font-semibold text-gray-800 group-hover:text-primary-600 block leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-gray-400 block">
                    {cat.productCount} Items
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
