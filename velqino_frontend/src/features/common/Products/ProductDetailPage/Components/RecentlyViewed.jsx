"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, Trash2 } from '../../../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

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
    avg_rating: product.avg_rating,
    slug: product.slug
  });
  
  recent = recent.slice(0, 10);
  localStorage.setItem('recentlyViewed', JSON.stringify(recent));
};

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState([]);

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
          : product.image || '/images/placeholder.jpg',
        avg_rating: product.avg_rating || 0,
        slug: product.slug
      }));
      setRecentProducts(formattedProducts);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('recentlyViewed');
    setRecentProducts([]);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  if (recentProducts.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recently Viewed</h2>
        <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
          <Trash2 size={12} />
          Clear History
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {recentProducts.map((product) => (
          <Link key={product.id} href={`/product/${product.slug || product.id}`} className="bg-white rounded-xl border border-gray-100 p-2 hover:shadow-lg transition-all duration-300 group">
            <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={(e) => { e.target.src = '/images/placeholder.jpg'; }} />
            </div>
            <h3 className="font-medium text-gray-800 text-xs line-clamp-1">{product.name}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-bold text-primary-600">₹{product.price}</span>
              {product.avg_rating > 0 && (
                <div className="flex items-center gap-0.5">
                  {renderStars(product.avg_rating)}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}