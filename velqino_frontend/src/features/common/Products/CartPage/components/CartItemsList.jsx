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
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
  <div className="divide-y divide-gray-100">
    {cartItems?.map((item) => (
      <div key={item.id} className="hover:bg-gray-50 transition-colors">

        {/* MAIN LAYOUT: stacked on mobile/tablet, side-by-side on lg+ */}
        <div className="flex flex-col lg:flex-row lg:h-[220px]">

          {/* LEFT / TOP: Image Area — full width on mobile, 60% on lg */}
          <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-full lg:flex-[0_0_60%] bg-gray-50 overflow-hidden">
            <div
              ref={el => scrollRefs.current[item.id] = el}
              className="flex h-full overflow-x-auto scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db transparent' }}
            >
              {item.product_detail?.images?.map((img, idx) => (
                <img
                  key={idx}
                  src={`${BASE_IMAGE_URL}${img.image}`}
                  alt={item.product_detail?.name}
                  className="h-full w-full object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                />
              ))}
            </div>

            {/* Scroll Arrows */}
            {item.product_detail?.images?.length > 1 && (
              <>
                <button
                  onClick={() => scrollImages(item.id, 'left')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-200
                    bg-primary-500 hover:bg-primary-600 text-white border-2 border-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollImages(item.id, 'right')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10 transition-all duration-200
                    bg-primary-500 hover:bg-primary-600 text-white border-2 border-white"
                >
                  <ChevronRight size={16} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[11px] font-medium px-3 py-0.5 rounded-full whitespace-nowrap">
                  📦 {item.product_detail.images.length} items in pack
                </div>
              </>
            )}
          </div>

          {/* RIGHT / BOTTOM: Product Details — full width on mobile, 40% on lg */}
          <div className="flex flex-col justify-between p-4 lg:flex-[0_0_40%] lg:p-4">

            {/* TOP: Name, badges, variants, actions */}
            <div>
              <Link href={`/product/${item.product_detail?.slug || item.id}`}>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 hover:text-primary-500 transition-colors line-clamp-2 leading-snug">
                  {item.product_detail?.name || 'Product'}
                </h3>
              </Link>

              {item.product_detail?.images?.length > 1 && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">
                  📦 {item.product_detail.images.length} items in pack
                </span>
              )}

              {(item.selected_size || item.selected_color) && (
                <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-gray-500">
                  {item.selected_size && <span>Size: {item.selected_size}</span>}
                  {item.selected_color && <span>Color: {item.selected_color}</span>}
                </div>
              )}

              {item.product_detail?.stock === 0 && (
                <span className="text-xs text-red-500 mt-1.5 block font-medium">⚠ Out of stock</span>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <button
                  onClick={() => onMoveToWishlist(item)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all"
                >
                  <Heart size={12} /> Wishlist
                </button>
                <button
                  onClick={() => onSaveForLater(item)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all"
                >
                  <Clock size={12} /> Save Later
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  disabled={removingItemId === item.id}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-40"
                >
                  {removingItemId === item.id
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Trash2 size={12} />
                  }
                  Remove
                </button>
              </div>
            </div>

            {/* BOTTOM: Price | Qty | Total — pinned to bottom on lg, mt-4 on mobile */}
            <div className="mt-4 lg:mt-0 border-t border-gray-100 pt-3">
              <div className="flex items-center justify-between gap-2">

                {/* Price */}
                <div className="min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Price</p>
                  <p className="text-sm font-bold text-gray-900">₹{item.price_at_add || item.product_detail?.price}</p>
                  {item.product_detail?.compare_price > (item.price_at_add || item.product_detail?.price) && (
                    <p className="text-[11px] text-gray-400 line-through">₹{item.product_detail.compare_price}</p>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={updatingItemId === item.id || item.quantity <= 1}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
                  >
                    <Minus size={12} className="text-gray-600" />
                  </button>
                  {updatingItemId === item.id
                    ? <Loader2 size={14} className="animate-spin text-primary-500" />
                    : <span className="w-6 text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                  }
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={updatingItemId === item.id || (item.product_detail?.stock && item.quantity >= item.product_detail.stock)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40"
                  >
                    <Plus size={12} className="text-gray-600" />
                  </button>
                </div>

                {/* Total */}
                <div className="text-right min-w-0">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total</p>
                  <p className="text-sm font-bold text-primary-600">
                    ₹{(item.price_at_add || item.product_detail?.price) * item.quantity}
                  </p>
                  {item.product_detail?.compare_price && (
                    <p className="text-[11px] text-green-600 font-medium">
                      Save ₹{(item.product_detail.compare_price - (item.price_at_add || item.product_detail?.price)) * item.quantity}
                    </p>
                  )}
                </div>
              </div>

              {/* Max stock warning */}
              {item.product_detail?.stock && item.quantity >= item.product_detail.stock && (
                <p className="text-[11px] text-red-500 text-right mt-1.5 font-medium">Maximum stock reached</p>
              )}
            </div>
          </div>
        </div>

      </div>
    ))}
  </div>

  {/* Continue Shopping */}
  <div className="px-4 sm:px-5 py-3.5 border-t border-gray-100">
    <Link href="/product/productlistingpage" className="text-primary-500 hover:text-primary-600 font-semibold inline-flex items-center gap-1 text-sm">
      ← Continue Shopping
    </Link>
  </div>
</div>
  );
}