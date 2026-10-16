"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Sparkles,
  Eye,
  Package
} from '../../../../utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function WishlistCard({ 
  item, 
  onAddToCart, 
  onRemove, 
  isAdding, 
  isRemoving 
}) {
  const [imgError, setImgError] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const imageScrollRef = useRef(null);

  const resolveImageUrl = (img) => {
    if (!img) return '/images/placeholder.jpg';
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    return `${BASE_IMAGE_URL}${img}`;
  };

  const images = Array.isArray(item?.product_images) && item.product_images.length > 0 
    ? item.product_images 
    : item?.product_primary_image 
    ? [item.product_primary_image] 
    : [];

  const price = Number(item?.product_price || 0);
  const comparePrice = Number(item?.product_compare_price || 0);
  const isDiscounted = comparePrice > price && price > 0;
  const discountPercent = isDiscounted ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
  const isOutOfStock = item?.product_stock === 0;

  const scrollImage = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    if (!imageScrollRef.current) return;
    const width = imageScrollRef.current.clientWidth;
    const newIdx = direction === 'left' 
      ? Math.max(0, currentImgIdx - 1) 
      : Math.min(images.length - 1, currentImgIdx + 1);
    
    setCurrentImgIdx(newIdx);
    imageScrollRef.current.scrollTo({
      left: newIdx * width,
      behavior: 'smooth'
    });
  };

  const handleScroll = () => {
    if (!imageScrollRef.current) return;
    const scrollLeft = imageScrollRef.current.scrollLeft;
    const width = imageScrollRef.current.clientWidth;
    const newIdx = Math.round(scrollLeft / width);
    if (newIdx !== currentImgIdx && newIdx >= 0 && newIdx < images.length) {
      setCurrentImgIdx(newIdx);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-2xs hover:shadow-xs transition-all duration-300 overflow-hidden flex flex-col group relative">
      
      {/* Product Image Stage */}
      <div className="relative aspect-square bg-gray-50/80 overflow-hidden">
        <Link 
          href={`/product/${item?.product_slug || item?.product_id}`} 
          className="block w-full h-full cursor-pointer"
        >
          {images.length > 1 ? (
            <div className="relative w-full h-full">
              <div 
                ref={imageScrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto h-full snap-x snap-mandatory scrollbar-none"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {images.map((img, idx) => (
                  <div key={idx} className="w-full h-full flex-shrink-0 snap-start relative">
                    <img 
                      src={resolveImageUrl(img)}
                      alt={item?.product_name || 'Product Image'}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => { 
                        e.currentTarget.src = '/images/placeholder.jpg'; 
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Slider Arrows */}
              <button 
                type="button"
                onClick={(e) => scrollImage(e, 'left')}
                disabled={currentImgIdx === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-xs transition-all disabled:opacity-0 cursor-pointer z-10"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                type="button"
                onClick={(e) => scrollImage(e, 'right')}
                disabled={currentImgIdx === images.length - 1}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-xs transition-all disabled:opacity-0 cursor-pointer z-10"
              >
                <ChevronRight size={16} />
              </button>

              {/* Carousel Pagination Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-y-0 -translate-x-1/2 flex items-center gap-1 z-10 pointer-events-none">
                {images.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentImgIdx === idx ? 'w-4 bg-primary-600' : 'w-1.5 bg-white/70'
                    }`} 
                  />
                ))}
              </div>
            </div>
          ) : (
            <img 
              src={resolveImageUrl(images[0] || item?.product_primary_image)}
              alt={item?.product_name || 'Product'}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => { 
                e.currentTarget.src = '/images/placeholder.jpg'; 
              }}
            />
          )}
        </Link>

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-xs tracking-wide uppercase">
              Out of Stock
            </span>
          ) : isDiscounted ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs tracking-wide">
              {discountPercent}% OFF
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-gray-700 shadow-2xs backdrop-blur-xs border border-gray-100">
              In Stock
            </span>
          )}
        </div>

        {/* Top-Right Action: Remove from Wishlist */}
        <button
          type="button"
          onClick={() => onRemove(item?.product_id)}
          disabled={isRemoving}
          title="Remove from wishlist"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-rose-600 shadow-2xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer z-10 backdrop-blur-xs"
        >
          {isRemoving ? (
            <Loader2 size={14} className="animate-spin text-rose-600" />
          ) : (
            <Heart size={16} className="fill-rose-500 text-rose-500" />
          )}
        </button>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          <Link 
            href={`/product/${item?.product_slug || item?.product_id}`}
            className="block group-hover:text-primary-600 transition-colors"
          >
            <h3 className="text-sm font-extrabold text-gray-900 line-clamp-2 leading-snug tracking-tight">
              {item?.product_name || 'Saved Product'}
            </h3>
          </Link>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
            <span className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">
              ₹{price.toLocaleString('en-IN')}
            </span>
            {isDiscounted && (
              <span className="text-xs text-gray-400 line-through">
                ₹{comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Added Date & Stock Subtext */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100">
            <span>Saved {formatDate(item?.added_at)}</span>
            <span className={`font-semibold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-600'}`}>
              {isOutOfStock ? 'Unavailable' : 'Available'}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center gap-2">
          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={() => onAddToCart(item?.product_id)}
            disabled={isAdding || isOutOfStock}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 !text-white text-white hover:text-white hover:!text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            {isAdding ? (
              <Loader2 size={14} className="animate-spin !text-white text-white" style={{ color: '#ffffff' }} />
            ) : (
              <ShoppingCart size={14} className="!text-white text-white" style={{ color: '#ffffff' }} />
            )}
            <span className="!text-white text-white" style={{ color: '#ffffff' }}>
              {isOutOfStock ? 'Out of Stock' : isAdding ? 'Adding...' : 'Move to Cart'}
            </span>
          </button>

          {/* Quick Remove Button */}
          <button
            type="button"
            onClick={() => onRemove(item?.product_id)}
            disabled={isRemoving}
            title="Delete from wishlist"
            className="p-2.5 rounded-xl bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200/80 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
          >
            {isRemoving ? (
              <Loader2 size={15} className="animate-spin text-rose-600" />
            ) : (
              <Trash2 size={15} />
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
