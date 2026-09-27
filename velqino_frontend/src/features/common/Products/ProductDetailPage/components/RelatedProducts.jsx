"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Sparkles } from '@/utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice';

export default function RelatedProducts({ currentProductId, categoryId, subcategoryId }) {
  const scrollRef = useRef(null);
  
  const params = {
    ...(subcategoryId && { subcategory_id: subcategoryId }),
    ...(categoryId && !subcategoryId && { category_id: categoryId }),
    exclude: currentProductId,
    limit: 8
  };
  
  const { data: response, isLoading } = useGetProductsQuery(params);
  
  let products = [];
  if (response?.data?.products && Array.isArray(response.data.products)) {
    products = response.data.products;
  } else if (response?.data?.results && Array.isArray(response.data.results)) {
    products = response.data.results;
  } else if (response?.data && Array.isArray(response.data)) {
    products = response.data;
  } else if (response?.results && Array.isArray(response.results)) {
    products = response.results;
  } else if (Array.isArray(response)) {
    products = response;
  }

  const resolveImg = (prod) => {
    const raw = prod?.primary_image || prod?.images?.[0]?.image || prod?.image;
    if (!raw) return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    return `${BASE_IMAGE_URL}${raw}`;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -320 : 320,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Related Wholesale Lots</span>
            <span className="text-xs bg-primary-100 text-primary-900 font-bold px-2 py-0.5 rounded-full hidden sm:inline">
              Verified Mill Batches
            </span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Explore similar bulk items in the same fabric category</p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            className="w-9 h-9 rounded-full bg-white border border-primary-200 text-primary-900 flex items-center justify-center shadow-xs hover:border-primary-400 hover:shadow-sm transition-all cursor-pointer"
            title="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className="w-9 h-9 rounded-full bg-white border border-primary-200 text-primary-900 flex items-center justify-center shadow-xs hover:border-primary-400 hover:shadow-sm transition-all cursor-pointer"
            title="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
      >
        {products.map((prod) => {
          const price = parseFloat(prod.price || 0);
          const comparePrice = parseFloat(prod.compare_price || 0);
          const hasDiscount = comparePrice > price;

          return (
            <Link
              key={prod.id}
              href={`/productdetail/${prod.id}`}
              className="flex-shrink-0 w-64 sm:w-72 bg-white rounded-2xl border border-primary-100 overflow-hidden hover:border-primary-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <img
                  src={resolveImg(prod)}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80';
                  }}
                />

                {hasDiscount && (
                  <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                    Wholesale Deal
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider block">
                    {prod.category_name || 'Direct Mill'}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
                    {prod.name}
                  </h3>
                </div>

                <div className="flex items-baseline justify-between pt-1 border-t border-gray-100">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-primary-900">
                      ₹{price.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{comparePrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">
                    View Spec →
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
