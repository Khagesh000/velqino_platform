"use client";

import React, { useRef } from 'react';
import Link from 'next/link';
import { Trash2, Heart, Clock, Minus, Plus, Loader2, ChevronLeft, ChevronRight } from '../../../../../utils/icons';
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
    const scrollAmount = ref.offsetWidth; // ← exact one image width
    ref.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }
};

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
  <div className="divide-y divide-gray-100">
    {cartItems?.map((item) => (
      <div key={item.id} className="group hover:bg-gray-50/60 transition-colors duration-200">

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row lg:h-[220px]">

          {/* LEFT: Image Area */}
          <div className="relative w-full h-56 sm:h-64 lg:h-full lg:flex-[0_0_58%] bg-gray-100 overflow-hidden">
            <div
              ref={el => scrollRefs.current[item.id] = el}
              className="flex h-full overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {item.product_detail?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={`${BASE_IMAGE_URL}${img.image}`}
                  alt={item.product_detail?.name}
                  className="h-full w-full object-cover flex-shrink-0 transition-transform duration-500 group-hover:scale-[1.02]"
                  onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
              ))}
            </div>

            {/* Scroll Arrows */}
            {item.product_detail?.images?.length > 1 && (
              <>
                <button
                  onClick={() => scrollImages(item.id, 'left')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-200
                    bg-white/90 hover:bg-white text-primary-600 border border-gray-100 hover:scale-110"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => scrollImages(item.id, 'right')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-200
                    bg-white/90 hover:bg-white text-primary-600 border border-gray-100 hover:scale-110"
                >
                  <ChevronRight size={15} />
                </button>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[11px] font-medium px-3 py-1 rounded-full whitespace-nowrap backdrop-blur-sm">
                  {item.product_detail.images.length} items in pack
                </div>
              </>
            )}
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col justify-between p-4 sm:p-5 lg:flex-[0_0_42%]">

            {/* TOP: Name + badges + actions */}
            <div>
              <Link href={`/product/${item.product_detail?.slug || item.id}`}>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                  {item.product_detail?.name || 'Product'}
                </h3>
              </Link>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {item.product_detail?.images?.length > 1 && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-primary-700 bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full font-medium">
                    {item.product_detail.images.length} items in pack
                  </span>
                )}
                {item.selected_size && (
                  <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                    Size: {item.selected_size}
                  </span>
                )}
                {item.selected_color && (
                  <span className="text-[11px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                    Color: {item.selected_color}
                  </span>
                )}
                {item.product_detail?.stock === 0 && (
                  <span className="text-[11px] text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full font-medium">
                    Out of stock
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-3.5">
                <button
                  onClick={() => onMoveToWishlist(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 border border-pink-100 hover:border-pink-200 transition-all duration-200"
                >
                  <Heart size={11} /> Wishlist
                </button>
                <button
                  onClick={() => onSaveForLater(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 hover:border-amber-200 transition-all duration-200"
                >
                  <Clock size={11} /> Save Later
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  disabled={removingItemId === item.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 hover:border-red-200 transition-all duration-200 disabled:opacity-40"
                >
                  {removingItemId === item.id
                    ? <Loader2 size={11} className="animate-spin" />
                    : <Trash2 size={11} />
                  }
                  Remove
                </button>
              </div>
            </div>

            {/* BOTTOM: Price | Qty | Total */}
            <div className="mt-4 lg:mt-0 pt-3.5 border-t border-gray-100">
              <div className="flex items-end justify-between gap-3">

                {/* Price */}
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Unit Price</p>
                  <p className="text-sm font-bold text-gray-900">₹{(item.price_at_add || item.product_detail?.price)?.toLocaleString()}</p>
                  {item.product_detail?.compare_price > (item.price_at_add || item.product_detail?.price) && (
                    <p className="text-[11px] text-gray-400 line-through">₹{item.product_detail.compare_price?.toLocaleString()}</p>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">Qty</p>
                  <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={updatingItemId === item.id || item.quantity <= 1}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 border border-gray-200"
                    >
                      <Minus size={11} className="text-gray-600" />
                    </button>
                    <div className="w-7 flex items-center justify-center">
                      {updatingItemId === item.id
                        ? <Loader2 size={13} className="animate-spin text-primary-500" />
                        : <span className="text-sm font-bold text-gray-900">{item.quantity}</span>
                      }
                    </div>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={updatingItemId === item.id || (item.product_detail?.stock && item.quantity >= item.product_detail.stock)}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40 border border-gray-200"
                    >
                      <Plus size={11} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right min-w-0">
                  <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-0.5">Total</p>
                  <p className="text-sm font-bold text-primary-600">
                    ₹{((item.price_at_add || item.product_detail?.price) * item.quantity)?.toLocaleString()}
                  </p>
                  {item.product_detail?.compare_price && (
                    <p className="text-[11px] text-green-600 font-semibold">
                      Save ₹{((item.product_detail.compare_price - (item.price_at_add || item.product_detail?.price)) * item.quantity)?.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Max stock warning */}
              {item.product_detail?.stock && item.quantity >= item.product_detail.stock && (
                <p className="text-[11px] text-red-500 text-right mt-2 font-medium bg-red-50 px-2 py-0.5 rounded-lg inline-block float-right">
                  Maximum stock reached
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Continue Shopping */}
  <div className="px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
    <Link
      href="/product/productlistingpage"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group"
    >
      <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
      Continue Shopping
    </Link>
  </div>
</div>
  );
}
