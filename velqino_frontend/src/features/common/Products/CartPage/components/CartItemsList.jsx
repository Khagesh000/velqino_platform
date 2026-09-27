"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { 
  Trash2, 
  Heart, 
  Clock, 
  Minus, 
  Plus, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Package, 
  CheckCircle,
  Tag
} from '@/utils/icons';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';

export default function CartItemsList({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onMoveToWishlist, 
  onSaveForLater,
  updatingItemId,
  removingItemId
}) {
  const scrollRefs = useRef({});

  const scrollImages = (itemId, direction) => {
    const ref = scrollRefs.current[itemId];
    if (ref) {
      const scrollAmount = ref.offsetWidth;
      ref.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const resolveImageUrl = (img) => {
    if (!img) return '/images/placeholder.jpg';
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    return `${BASE_IMAGE_URL}${img}`;
  };

  return (
    <div className="space-y-4">
      {/* List Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-primary-100 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary-50 border border-primary-200/80 flex items-center justify-center text-primary-700">
            <Package size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-tight">
              Selected Wholesale Lots ({cartItems?.length || 0})
            </h2>
            <p className="text-[11px] text-gray-500">
              Verified factory mill pricing with secure escrow checkout
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2.5 py-1 rounded-full">
          <CheckCircle size={12} />
          <span>Dispatch Ready</span>
        </div>
      </div>

      {/* Cart Items Loop */}
      <div className="space-y-3.5">
        {cartItems?.map((item) => {
          const unitPrice = item.price_at_add || item.product_detail?.price || 0;
          const comparePrice = item.product_detail?.compare_price || 0;
          const hasDiscount = comparePrice > unitPrice;
          const discountPercent = hasDiscount ? Math.round(((comparePrice - unitPrice) / comparePrice) * 100) : 0;
          const lineTotal = unitPrice * item.quantity;
          const lineSavings = hasDiscount ? (comparePrice - unitPrice) * item.quantity : 0;
          const images = item.product_detail?.images || [];
          const rawPrimaryImg = images[0]?.image || item.product_detail?.primary_image || item.product_detail?.image;
          const primaryImg = resolveImageUrl(rawPrimaryImg);

          return (
            <div 
              key={item.id} 
              className="cart-item-card p-3.5 sm:p-4 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                
                {/* Left: Product Image & Pack Showcase */}
                <div className="relative w-full sm:w-36 lg:w-44 aspect-square sm:aspect-square rounded-2xl overflow-hidden bg-primary-50/40 border border-primary-100 flex-shrink-0">
                  {images.length > 1 ? (
                    <>
                      <div
                        ref={el => scrollRefs.current[item.id] = el}
                        className="flex h-full w-full overflow-x-auto scroll-smooth hide-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        {images.map((img, idx) => (
                          <img
                            key={idx}
                            src={resolveImageUrl(img.image)}
                            alt={item.product_detail?.name || 'Lot'}
                            className="h-full w-full object-cover flex-shrink-0"
                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                          />
                        ))}
                      </div>

                      {/* Mini Carousel Controls */}
                      <button
                        onClick={() => scrollImages(item.id, 'left')}
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all border border-gray-100"
                        aria-label="Previous lot image"
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <button
                        onClick={() => scrollImages(item.id, 'right')}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-all border border-gray-100"
                        aria-label="Next lot image"
                      >
                        <ChevronRight size={13} />
                      </button>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-900/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs whitespace-nowrap">
                        {images.length} In Lot
                      </div>
                    </>
                  ) : (
                    <img
                      src={primaryImg}
                      alt={item.product_detail?.name || 'Lot'}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                    />
                  )}

                  {/* Discount Chip */}
                  {discountPercent > 0 && (
                    <div className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                      {discountPercent}% OFF
                    </div>
                  )}
                </div>

                {/* Right: Specifications, Actions & Pricing */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  
                  {/* Top Details & Attributes */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider block mb-1">
                          Direct Factory Lot
                        </span>
                        <Link href={`/productdetail/${item.product_detail?.id || item.product_id || item.id}`}>
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                            {item.product_detail?.name || 'Wholesale Product Lot'}
                          </h3>
                        </Link>
                      </div>

                      {/* Line Item Total (Top Right on Large Screens) */}
                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <span className="text-xs text-gray-400 block font-medium">Lot Total</span>
                        <span className="text-base sm:text-lg font-black text-primary-700">
                          ₹{lineTotal.toLocaleString()}
                        </span>
                        {lineSavings > 0 && (
                          <span className="text-[11px] font-bold text-emerald-600 block">
                            Save ₹{lineSavings.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Spec Badges Row */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {item.selected_size && (
                        <span className="text-[11px] font-semibold text-gray-700 bg-gray-100/90 border border-gray-200/80 px-2.5 py-0.5 rounded-lg">
                          Size: {item.selected_size}
                        </span>
                      )}
                      {item.selected_color && (
                        <span className="text-[11px] font-semibold text-gray-700 bg-gray-100/90 border border-gray-200/80 px-2.5 py-0.5 rounded-lg">
                          Color: {item.selected_color}
                        </span>
                      )}
                      {images.length > 1 && (
                        <span className="text-[11px] font-semibold text-primary-800 bg-primary-100/70 border border-primary-200 px-2.5 py-0.5 rounded-lg">
                          {images.length} lot styles
                        </span>
                      )}
                      {item.product_detail?.stock === 0 ? (
                        <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-lg">
                          Out of Stock
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-lg">
                          Verified Lot In Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Controls Row: Pricing, Quantity Stepper & Micro Actions */}
                  <div className="pt-3 mt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Unit Price & Qty Stepper */}
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">
                          Unit Price
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-bold text-gray-900">
                            ₹{unitPrice.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span className="text-[11px] text-gray-400 line-through">
                              ₹{comparePrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="cart-qty-pill">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updatingItemId === item.id || item.quantity <= 1}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        
                        <div className="qty-val flex items-center justify-center">
                          {updatingItemId === item.id ? (
                            <Loader2 size={13} className="animate-spin text-primary-600" />
                          ) : (
                            item.quantity
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updatingItemId === item.id || (item.product_detail?.stock && item.quantity >= item.product_detail.stock)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Mobile Total Display */}
                      <div className="sm:hidden ml-auto text-right">
                        <span className="text-[10px] text-gray-400 block font-medium">Total</span>
                        <span className="text-base font-black text-primary-700">
                          ₹{lineTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Micro-Action Buttons */}
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => onMoveToWishlist(item)}
                        className="cart-action-pill"
                        title="Move lot to wishlist"
                      >
                        <Heart size={12} className="text-primary-600" />
                        <span className="hidden sm:inline">Wishlist</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSaveForLater(item)}
                        className="cart-action-pill"
                        title="Save lot for later"
                      >
                        <Clock size={12} className="text-accent-700" />
                        <span className="hidden sm:inline">Save Later</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        disabled={removingItemId === item.id}
                        className="cart-action-pill danger"
                        title="Remove lot from cart"
                      >
                        {removingItemId === item.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <Trash2 size={12} />
                        )}
                        <span>Remove</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Return to Catalog Strip */}
      <div className="p-4 bg-white rounded-2xl border border-primary-100 flex items-center justify-between shadow-2xs">
        <Link
          href="/product/productlistingpage"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-700 hover:text-primary-800 transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Add More Wholesale Lots</span>
        </Link>
        <span className="text-xs text-gray-500 hidden sm:inline">
          Escrow verification on all deliveries
        </span>
      </div>
    </div>
  );
}
