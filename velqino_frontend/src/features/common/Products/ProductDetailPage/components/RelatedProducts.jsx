"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from '../../../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice'; // ✅ Fixed import path

export default function RelatedProducts({ currentProductId, categoryId, subcategoryId }) {
  const scrollRef = useRef(null);
  
  // Fetch related products based on category/subcategory
  const params = {
    ...(subcategoryId && { subcategory_id: subcategoryId }),
    ...(categoryId && !subcategoryId && { category_id: categoryId }),
    exclude: currentProductId,
    limit: 10
  };
  
  const { data: response, isLoading, error } = useGetProductsQuery(params);
  
// Extract products array safely
let products = [];
if (response?.data?.results && Array.isArray(response.data.results)) {
  products = response.data.results;
} else if (response?.results && Array.isArray(response.results)) {
  products = response.results;
} else if (response?.data && Array.isArray(response.data)) {
  products = response.data;
} else if (Array.isArray(response)) {
  products = response;
}

console.log('Products array:', products); // Debug to see what you're getting
  
  // Format products to match your structure
  const relatedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.original_price || product.mrp || Math.round(product.price * 1.5),
    rating: product.avg_rating || 4.0,
    image: product.images?.[0]?.image 
      ? `${BASE_IMAGE_URL}${product.images[0].image}` 
      : '/images/placeholder.jpg',
    slug: product.slug,
    discount: product.discount
  }));

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Helper to render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
          <div className="flex gap-2">
            <button className="p-2 bg-white border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
              <ChevronLeft size={18} />
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-lg opacity-50 cursor-not-allowed">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex-shrink-0 w-48 bg-white rounded-xl border border-gray-100 p-3 animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || relatedProducts.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')} 
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef} 
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.slug || product.id}`} 
            className="flex-shrink-0 w-48 bg-white rounded-xl border border-gray-100 p-3 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
              />
            </div>
            <h3 className="font-medium text-gray-800 text-sm line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-xs text-gray-500">{product.rating}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-primary-600">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
              {product.discount && (
                <span className="text-xs text-green-600 font-medium">{product.discount}% off</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}