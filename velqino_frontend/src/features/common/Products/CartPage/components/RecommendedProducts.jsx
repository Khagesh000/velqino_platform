"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Package, 
  CheckCircle,
  ArrowRight
} from '@/utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice';

export default function RecommendedProducts() {
  const scrollRef = useRef(null);
  const { data: response, isLoading } = useGetProductsQuery({ limit: 10 });
  
  // Safely extract products array from all backend response formats
  let products = [];
  if (Array.isArray(response?.data?.products)) {
    products = response.data.products;
  } else if (Array.isArray(response?.data?.results)) {
    products = response.data.results;
  } else if (Array.isArray(response?.products)) {
    products = response.products;
  } else if (Array.isArray(response?.results)) {
    products = response.results;
  } else if (Array.isArray(response?.data)) {
    products = response.data;
  } else if (Array.isArray(response)) {
    products = response;
  }
  
  const resolveImageUrl = (img) => {
    if (!img) return '/images/placeholder.jpg';
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    return `${BASE_IMAGE_URL}${img}`;
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  if (isLoading || products.length === 0) return null;
  
  return (
    <div className="mt-10 sm:mt-14 pt-8 border-t border-primary-100">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1 text-primary-700">
            <Sparkles size={14} className="text-primary-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700">
              Curated Direct Mill Lots
            </span>
          </div>
          <h3 className="text-base sm:text-xl font-bold text-gray-900 leading-tight">
            Wholesale Lots You May Also Need
          </h3>
        </div>

        {/* Carousel Arrows */}
        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            onClick={() => scroll('left')} 
            className="w-8 h-8 bg-white border border-primary-200/80 rounded-xl hover:bg-primary-50 text-gray-700 flex items-center justify-center transition-colors shadow-2xs"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            type="button"
            onClick={() => scroll('right')} 
            className="w-8 h-8 bg-white border border-primary-200/80 rounded-xl hover:bg-primary-50 text-gray-700 flex items-center justify-center transition-colors shadow-2xs"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div 
        ref={scrollRef} 
        className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => {
          const price = parseFloat(product.display_price || product.price || product.discounted_price || 0);
          const comparePrice = parseFloat(product.retail_price || product.compare_price || 0);
          const hasDiscount = comparePrice > price && comparePrice > 0;
          const discountPercent = hasDiscount ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
          
          const rawImg = product.primary_image || product.images?.[0]?.image || product.image;
          const imgUrl = resolveImageUrl(rawImg);
          const categoryName = product.category_name || product.category || 'Wholesale Lot';
          const minOrder = product.min_order_qty || product.display_min_order;

          return (
            <Link 
              key={product.id} 
              href={`/productdetail/${product.id}`} 
              className="flex-shrink-0 w-48 sm:w-56 bg-white rounded-2xl border border-primary-200/70 p-3 hover:border-primary-400 hover:shadow-lg transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                {/* Image Container */}
                <div className="aspect-square bg-primary-50/30 rounded-xl mb-2.5 overflow-hidden border border-primary-100 relative">
                  <img 
                    src={imgUrl}
                    alt={product.name || 'Wholesale Product'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                  
                  {discountPercent > 0 && (
                    <span className="absolute top-2 left-2 text-[9px] font-extrabold bg-primary-600 text-white px-1.5 py-0.5 rounded shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}

                  {product.stock > 0 && (
                    <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200/80">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Category & Attributes */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider truncate">
                    {categoryName}
                  </span>
                  {minOrder > 1 && (
                    <span className="text-[9px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                      MOQ: {minOrder}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1 group-hover:text-primary-700 transition-colors">
                  {product.name}
                </h4>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-sm sm:text-base font-black text-gray-900">
                    ₹{price.toLocaleString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] text-gray-400 line-through">
                      ₹{comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Strip */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-primary-700 group-hover:text-primary-800">
                <span>Inspect Lot</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}

