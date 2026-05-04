"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from '../../../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice';

export default function RecommendedProducts() {
  const scrollRef = useRef(null);
  const { data: response, isLoading } = useGetProductsQuery({ limit: 10 });
  
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
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };
  
  if (isLoading || products.length === 0) return null;
  
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">You May Also Like</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll('right')} className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 scroll-smooth">
        {products.slice(0, 8).map((product) => (
          <Link key={product.id} href={`/product/${product.slug || product.id}`} className="flex-shrink-0 w-48 bg-white rounded-xl border border-gray-100 p-3 hover:shadow-lg transition-all group">
            <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
              <img 
                src={product.images?.[0]?.image ? `${BASE_IMAGE_URL}${product.images[0].image}` : '/images/placeholder.jpg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
              />
            </div>
            <h3 className="font-medium text-gray-800 text-sm line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">{renderStars(product.avg_rating || 4)}</div>
              <span className="text-xs text-gray-500">{product.avg_rating || 4}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-primary-600">₹{product.price}</span>
              {product.compare_price && (
                <span className="text-xs text-gray-400 line-through">₹{product.compare_price}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}