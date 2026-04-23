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
      const scrollAmount = 80;
      ref.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600">
        <div className="col-span-6">Product</div>
        <div className="col-span-2 text-center">Price</div>
        <div className="col-span-2 text-center">Quantity</div>
        <div className="col-span-2 text-right">Total</div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {cartItems?.map((item) => (
          <div key={item.id} className="p-4 sm:p-5 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col md:grid md:grid-cols-12 gap-4 sm:gap-5">
              
              {/* Product Info - Full width on mobile */}
              <div className="flex gap-4 col-span-6">
                {/* Product Images - Multiple images with scroll */}
                <div className="flex-shrink-0">
                  {item.product_detail?.images && item.product_detail.images.length > 1 ? (
                    <div className="relative">
                      <div 
                        ref={el => scrollRefs.current[item.id] = el}
                        className="flex gap-2 overflow-x-auto scroll-smooth w-20 h-20 sm:w-24 sm:h-24"
                        style={{ scrollbarWidth: 'thin' }}
                      >
                        {item.product_detail.images.map((img, idx) => (
                          <img 
                            key={idx}
                            src={`${BASE_IMAGE_URL}${img.image}`}
                            alt={item.product_detail?.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                          />
                        ))}
                      </div>
                      {item.product_detail.images.length > 2 && (
                        <>
                          <button 
                            onClick={() => scrollImages(item.id, 'left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 text-xs"
                          >
                            ‹
                          </button>
                          <button 
                            onClick={() => scrollImages(item.id, 'right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 text-xs"
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <Link href={`/product/${item.product_detail?.slug || item.id}`} className="block w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={item.product_detail?.primary_image ? `${BASE_IMAGE_URL}${item.product_detail.primary_image}` : '/images/placeholder.jpg'} 
                        alt={item.product_detail?.name || 'Product'}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                      />
                    </Link>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product_detail?.slug || item.id}`}>
                    <h3 className="font-semibold text-gray-800 hover:text-primary-500 transition-colors line-clamp-2 text-base sm:text-lg">
                      {item.product_detail?.name || 'Product'}
                    </h3>
                  </Link>
                  
                  {/* Show image count badge for bulk products */}
                  {item.product_detail?.images && item.product_detail.images.length > 1 && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      📦 {item.product_detail.images.length} items in pack
                    </span>
                  )}
                  
                  {/* Selected Variants */}
                  {(item.selected_size || item.selected_color) && (
                    <div className="flex flex-wrap gap-2 mt-1.5 text-sm text-gray-500">
                      {item.selected_size && <span>Size: {item.selected_size}</span>}
                      {item.selected_color && <span>Color: {item.selected_color}</span>}
                    </div>
                  )}
                  
                  {/* Stock Status */}
                  {item.product_detail?.stock === 0 && (
                    <span className="text-sm text-red-500 mt-1.5 block font-medium">Out of stock</span>
                  )}
                  
                  {/* Price - Visible on mobile only */}
                  <div className="block md:hidden mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Price:</span>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 text-base">₹{item.price_at_add || item.product_detail?.price}</div>
                        {item.product_detail?.compare_price && item.product_detail.compare_price > (item.price_at_add || item.product_detail?.price) && (
                          <div className="text-sm text-gray-400 line-through">₹{item.product_detail.compare_price}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quantity & Total - Visible on mobile only */}
                  <div className="block md:hidden mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Quantity:</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updatingItemId === item.id || item.quantity <= 1}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <Minus size={14} className={item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'} />
                        </button>
                        {updatingItemId === item.id ? (
                          <Loader2 size={16} className="animate-spin text-primary-500" />
                        ) : (
                          <span className="w-10 text-center font-semibold text-base">{item.quantity}</span>
                        )}
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updatingItemId === item.id || (item.product_detail?.stock && item.quantity >= item.product_detail.stock)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <Plus size={14} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Total:</span>
                      <div className="font-bold text-primary-600 text-base">
                        ₹{(item.price_at_add || item.product_detail?.price) * item.quantity}
                      </div>
                    </div>
                    {item.product_detail?.compare_price && (
                      <div className="text-right mt-1.5">
                        <span className="text-sm text-green-600 font-medium">
                          Save ₹{(item.product_detail.compare_price - (item.price_at_add || item.product_detail?.price)) * item.quantity}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons - Responsive */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <button 
                      onClick={() => onMoveToWishlist(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-pink-50 text-pink-600 hover:bg-pink-100 transition-all duration-200"
                    >
                      <Heart size={14} className="text-pink-500" />
                      <span className="hidden xs:inline">Wishlist</span>
                      <span className="xs:hidden">Save</span>
                    </button>
                    
                    <button 
                      onClick={() => onSaveForLater(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all duration-200"
                    >
                      <Clock size={14} className="text-amber-500" />
                      <span className="hidden xs:inline">Save Later</span>
                      <span className="xs:hidden">Later</span>
                    </button>
                    
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      disabled={removingItemId === item.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 disabled:opacity-40"
                    >
                      {removingItemId === item.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Price - Desktop only */}
              <div className="hidden md:block col-span-2 text-center">
                <div className="font-semibold text-gray-900 text-base">₹{item.price_at_add || item.product_detail?.price}</div>
                {item.product_detail?.compare_price && item.product_detail.compare_price > (item.price_at_add || item.product_detail?.price) && (
                  <div className="text-sm text-gray-400 line-through">₹{item.product_detail.compare_price}</div>
                )}
              </div>
              
              {/* Quantity - Desktop only */}
              <div className="hidden md:block col-span-2">
                <div className="flex items-center justify-center gap-2">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={updatingItemId === item.id || item.quantity <= 1}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Minus size={14} className={item.quantity <= 1 ? 'text-gray-300' : 'text-gray-600'} />
                  </button>
                  {updatingItemId === item.id ? (
                    <Loader2 size={16} className="animate-spin text-primary-500" />
                  ) : (
                    <span className="w-10 text-center font-semibold text-base">{item.quantity}</span>
                  )}
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={updatingItemId === item.id || (item.product_detail?.stock && item.quantity >= item.product_detail.stock)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <Plus size={14} className="text-gray-600" />
                  </button>
                </div>
                {item.product_detail?.stock && item.quantity >= item.product_detail.stock && (
                  <p className="text-sm text-red-500 text-center mt-1 font-medium">Max stock</p>
                )}
              </div>
              
              {/* Total - Desktop only */}
              <div className="hidden md:block col-span-2 text-right">
                <div className="font-bold text-primary-600 text-base">
                  ₹{(item.price_at_add || item.product_detail?.price) * item.quantity}
                </div>
                {item.product_detail?.compare_price && (
                  <div className="text-sm text-green-600 font-medium">
                    Save ₹{(item.product_detail.compare_price - (item.price_at_add || item.product_detail?.price)) * item.quantity}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Continue Shopping */}
      <div className="p-4 sm:p-5 border-t border-gray-100">
        <Link href="/products" className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1 text-base sm:text-base">
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}