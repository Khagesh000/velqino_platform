"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Trash2, Eye, ChevronLeft, ChevronRight, History } from '@/utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export const addToRecentlyViewed = (product) => {
  if (typeof window === 'undefined' || !product?.id) return;
  try {
    const stored = localStorage.getItem('recentlyViewed');
    let recent = stored ? JSON.parse(stored) : [];
    recent = recent.filter(item => item.id !== product.id);
    recent.unshift({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      primary_image: product.primary_image,
      category_name: product.category_name,
      slug: product.slug
    });
    recent = recent.slice(0, 8);
    localStorage.setItem('recentlyViewed', JSON.stringify(recent));
  } catch (err) {
    console.error('Failed to update recently viewed:', err);
  }
};

export default function RecentlyViewed() {
  const router = useRouter();
  const [recentProducts, setRecentProducts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        setRecentProducts(JSON.parse(stored));
      }
    } catch {
      setRecentProducts([]);
    }
  }, []);

  const clearRecentlyViewed = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('recentlyViewed');
      setRecentProducts([]);
    }
  };

  const resolveImg = (prod) => {
    const raw = prod?.primary_image || prod?.images?.[0]?.image || prod?.image;
    if (!raw) return 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    return `${BASE_IMAGE_URL}${raw}`;
  };

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 pt-4 border-t border-primary-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History size={18} className="text-primary-700" />
          <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
            Recently Inspected Wholesale Lots
          </h2>
        </div>

        <button
          type="button"
          onClick={clearRecentlyViewed}
          className="text-xs text-gray-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
          <span>Clear History</span>
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar"
      >
        {recentProducts.map((prod) => (
          <Link
            key={prod.id}
            href={`/productdetail/${prod.id}`}
            className="flex-shrink-0 w-44 sm:w-48 bg-white rounded-xl border border-primary-100 p-2.5 hover:border-primary-300 hover:shadow-md transition-all group flex flex-col"
          >
            <div className="aspect-square rounded-lg bg-gray-50 overflow-hidden mb-2">
              <img
                src={resolveImg(prod)}
                alt={prod.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80';
                }}
              />
            </div>

            <h4 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
              {prod.name}
            </h4>

            <span className="text-xs font-black text-primary-900 mt-1">
              ₹{parseFloat(prod.price || 0).toLocaleString()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
