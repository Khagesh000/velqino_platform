"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Trash2, Eye } from '../../../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';
import { toast } from 'react-toastify';

// ✅ Move function OUTSIDE the component
export const addToRecentlyViewed = (product) => {
  const stored = localStorage.getItem('recentlyViewed');
  let recent = stored ? JSON.parse(stored) : [];
  
  recent = recent.filter(item => item.id !== product.id);
  
  recent.unshift({
    id: product.id,
    name: product.name,
    price: product.price,
    images: product.images,
    primary_image: product.primary_image,
    avg_rating: product.avg_rating,
    slug: product.slug
  });
  
  recent = recent.slice(0, 10);
  localStorage.setItem('recentlyViewed', JSON.stringify(recent));
};

export default function RecentlyViewed({ onQuickView }) {
  const router = useRouter();
  const [recentProducts, setRecentProducts] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      const parsedProducts = JSON.parse(stored);
      const formattedProducts = parsedProducts.slice(0, 6).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.image 
          ? `${BASE_IMAGE_URL}${product.images[0].image}` 
          : product.primary_image 
            ? `${BASE_IMAGE_URL}${product.primary_image}` 
            : 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image',
        avg_rating: product.avg_rating || 0,
        slug: product.slug,
        images: product.images || []
      }));
      setRecentProducts(formattedProducts);
    }
  }, []);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const maxScroll = container.scrollWidth - container.clientWidth;
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft < maxScroll - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [recentProducts]);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentProducts([]);
    toast.success('Recently viewed history cleared');
  };

  const handleProductClick = (productId) => {
    router.push(`/productdetail/${productId}`);
  };

  const handleQuickView = (product, e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log('🔍 Quick View clicked for product:', product);
  console.log('🔍 Product ID:', product.id);
  
  // ✅ Navigate directly to product detail page
  router.push(`/productdetail/${product.id}`);
};

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  if (recentProducts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <div className="w-1 h-5 bg-primary-500 rounded-full" />
      <h2 className="text-base font-bold text-gray-900">Recently Viewed</h2>
    </div>
    <button
      onClick={clearHistory}
      className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all"
    >
      <Trash2 size={12} />
      Clear
    </button>
  </div>

  <div className="relative">
    {showLeftArrow && (
      <button
        onClick={() => scroll('left')}
        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 hover:border-primary-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110"
      >
        <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    )}

    <div
      ref={scrollContainerRef}
      onScroll={checkScroll}
      className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {recentProducts.map((product) => (
        <div
          key={product.id}
          className="w-36 flex-shrink-0 group cursor-pointer"
          onClick={() => handleProductClick(product.id)}
        >
          <div className="bg-white rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="aspect-square bg-gray-50 overflow-hidden relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image'; }}
              />
              <button
                onClick={(e) => handleQuickView(product, e)}
                className="absolute inset-0 bg-black/35 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              >
                <span className="px-3 py-1.5 bg-white text-gray-800 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                  <Eye size={11} />
                  Quick View
                </span>
              </button>
            </div>
            <div className="p-2.5">
              <h3 className="font-semibold text-gray-800 text-xs line-clamp-1 group-hover:text-primary-600 transition-colors">{product.name}</h3>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs font-bold text-primary-600">₹{product.price}</span>
                {product.avg_rating > 0 && (
                  <div className="flex items-center gap-0.5">
                    {renderStars(product.avg_rating)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {showRightArrow && (
      <button
        onClick={() => scroll('right')}
        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 hover:border-primary-300 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110"
      >
        <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )}
  </div>
</div>
  );
}
