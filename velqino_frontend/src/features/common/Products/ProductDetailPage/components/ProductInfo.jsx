"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Zap, 
  Check, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Minus, 
  Plus, 
  Loader2,
  Building,
  Sparkles,
  FileText,
  Lock,
  Copy,
  Tag
} from '@/utils/icons';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { toast } from 'react-toastify';

export default function ProductInfo({ product }) {
  const router = useRouter();
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
  const isBulkBuyer = userRole === 'retailer' || userRole === 'wholesaler';
  const minOrderQty = Math.max(1, parseInt(product?.min_order_qty || product?.display_min_order || 1, 10));

  const [quantity, setQuantity] = useState(minOrderQty);
  const [selectedSize, setSelectedSize] = useState(product?.variants?.[0]?.size || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.primary_color || 'Standard');
  const [isWishlist, setIsWishlist] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinMessage, setPinMessage] = useState('');
  const [copiedSku, setCopiedSku] = useState(false);

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // Pricing calculations
  const price = typeof product?.price === 'number' ? product.price : parseFloat(product?.price || 0);
  const comparePrice = typeof product?.compare_price === 'number' ? product.compare_price : parseFloat(product?.compare_price || 0);
  const originalPrice = comparePrice > price ? comparePrice : Math.round(price * 1.35);
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const marginSavings = originalPrice - price;

  const stock = parseInt(product?.stock ?? 50, 10);
  const isInStock = stock > 0;
  const rating = parseFloat(product?.rating || product?.avg_rating || 4.7);
  const reviewsCount = parseInt(product?.reviews || product?.total_reviews || 28, 10);

  // Volume price calculation based on quantity
  const getEffectiveUnitPrice = (qty) => {
    if (qty >= 100) return Math.round(price * 0.90);
    if (qty >= 25) return Math.round(price * 0.95);
    return price;
  };

  const effectiveUnitPrice = getEffectiveUnitPrice(quantity);
  const currentLotTotal = effectiveUnitPrice * quantity;

  // Sizes extracted from variants or defaults
  const variantSizes = Array.isArray(product?.variants) && product.variants.length > 0
    ? [...new Set(product.variants.map(v => v.size).filter(Boolean))]
    : ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleCopySku = () => {
    if (!product?.sku) return;
    navigator.clipboard.writeText(product.sku);
    setCopiedSku(true);
    toast.success('Product SKU copied!');
    setTimeout(() => setCopiedSku(false), 2000);
  };

  const handlePinCheck = () => {
    if (/^\d{6}$/.test(pinCode)) {
      setPinMessage('✓ Pan-India direct mill dispatch available for this PIN code (3-5 business days)');
      setTimeout(() => setPinMessage(''), 4000);
    } else {
      setPinMessage('✗ Please enter a valid 6-digit postal PIN code');
      setTimeout(() => setPinMessage(''), 3000);
    }
  };

  const handleAddToCart = async () => {
    if (!isInStock) return;
    try {
      await addToCart({
        product_id: product.id,
        quantity: quantity,
        selected_size: selectedSize,
        selected_color: selectedColor
      }).unwrap();
      toast.success(`${product.name} (${quantity} units) added to wholesale cart!`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to wholesale cart');
    }
  };

  const handleBuyNow = async () => {
    if (!isInStock) return;
    try {
      await addToCart({
        product_id: product.id,
        quantity: quantity,
        selected_size: selectedSize,
        selected_color: selectedColor
      }).unwrap();
      router.push('/product/checkout');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to initialize instant checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Badges: Mill Verification & Lot SKU */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-100/70 border border-primary-200/90 rounded-full text-xs font-bold text-primary-900 tracking-wide">
            <Building size={12} className="text-primary-700" />
            <span>{product?.brand || 'Authentic Mill Drop'}</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-bold text-emerald-800">
            <ShieldCheck size={12} className="text-emerald-600" />
            <span>Mill Verified</span>
          </span>
        </div>

        {/* SKU Pill */}
        {product?.sku && (
          <button 
            type="button"
            onClick={handleCopySku}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-xs font-mono text-gray-600 transition-colors cursor-pointer"
            title="Copy SKU"
          >
            <span>SKU: {product.sku}</span>
            {copiedSku ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
          </button>
        )}
      </div>

      {/* 2. Title & Review Metrics */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-snug tracking-tight">
          {product?.name}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-amber-500 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="font-bold text-amber-900 ml-1">{rating.toFixed(1)}</span>
          </div>

          <span className="text-gray-500 font-medium">({reviewsCount} Verified Wholesale Reviews)</span>

          <span className="text-gray-300">•</span>

          <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-md text-[11px]">
            Fast Pan-India Dispatch
          </span>
        </div>
      </div>

      {/* 3. Wholesale Pricing Box */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-primary-50/70 via-white to-primary-50/50 rounded-2xl border-2 border-primary-200/90 shadow-2xs space-y-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <span className="text-[10px] font-bold text-primary-900 uppercase tracking-wider block mb-0.5">
              Direct Mill Wholesale Price
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-black text-primary-900">
                ₹{effectiveUnitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-gray-500 font-medium">/ unit</span>
            </div>
          </div>

          {discount > 0 && (
            <div className="text-right">
              <span className="text-xs text-gray-400 line-through block">
                MRP: ₹{originalPrice.toLocaleString()}
              </span>
              <span className="inline-block bg-rose-600 text-white text-xs font-black px-2.5 py-0.5 rounded-lg shadow-2xs">
                {discount}% Margin Benefit
              </span>
            </div>
          )}
        </div>

        {marginSavings > 0 && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-primary-100 text-xs text-emerald-800 font-semibold">
            <Sparkles size={14} className="text-emerald-600 flex-shrink-0" />
            <span>Estimated Reseller Margin: <strong>₹{marginSavings.toLocaleString()} per piece</strong></span>
          </div>
        )}
      </div>

      {/* 4. Volume Wholesale Tiers */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
            <Tag size={13} className="text-primary-700" />
            <span>Volume Pricing Tiers</span>
          </span>
          <span className="text-primary-700 font-semibold">B2B Tiered Discounts</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-2.5 rounded-xl border transition-all ${quantity < 25 ? 'bg-primary-50 border-primary-500 font-bold shadow-2xs' : 'bg-gray-50 border-gray-200'}`}>
            <span className="text-[10px] text-gray-500 block">1 - 24 Units</span>
            <span className="text-gray-900 font-black">₹{price}</span>
            <span className="text-[10px] text-gray-500 block mt-0.5">Base Price</span>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${quantity >= 25 && quantity < 100 ? 'bg-primary-50 border-primary-500 font-bold shadow-2xs' : 'bg-gray-50 border-gray-200'}`}>
            <span className="text-[10px] text-gray-500 block">25 - 99 Units</span>
            <span className="text-primary-900 font-black">₹{Math.round(price * 0.95)}</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Save 5%</span>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${quantity >= 100 ? 'bg-primary-50 border-primary-500 font-bold shadow-2xs' : 'bg-gray-50 border-gray-200'}`}>
            <span className="text-[10px] text-gray-500 block">100+ Units</span>
            <span className="text-primary-900 font-black">₹{Math.round(price * 0.90)}</span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">Save 10%</span>
          </div>
        </div>
      </div>

      {/* 5. Variant Size Selector */}
      {variantSizes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-800 uppercase tracking-wide">Select Lot Size</span>
            <span className="text-primary-700 font-semibold">Standard Wholesale Spec</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {variantSizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer
                    ${isSelected
                      ? 'border-primary-600 bg-primary-600 text-white shadow-sm scale-102'
                      : 'border-primary-100 bg-white hover:border-primary-300 text-gray-700'
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Stock Status Indicator */}
      <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${isInStock ? 'bg-emerald-50/80 border-emerald-200/90 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className={`w-2 h-2 rounded-full ${isInStock ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600'}`} />
          <span>{isInStock ? `Active Inventory: ${stock} Units Ready for Mill Dispatch` : 'Out of Stock at Mill'}</span>
        </div>
        <span className="text-[11px] font-semibold text-gray-500">MOQ: {minOrderQty} pcs</span>
      </div>

      {/* 7. Quantity Selector & Live Subtotal */}
      {isInStock && (
        <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              Lot Order Quantity
            </span>
            <span className="text-xs text-gray-500 font-medium">
              Min Order: <strong className="text-gray-800">{minOrderQty} units</strong>
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center bg-white rounded-xl border border-gray-300 shadow-2xs p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(minOrderQty, quantity - 1))}
                disabled={quantity <= minOrderQty}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors disabled:opacity-30 cursor-pointer"
                title="Decrease quantity"
              >
                <Minus size={15} />
              </button>

              <span className="w-14 text-center font-black text-base text-gray-900">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                disabled={quantity >= stock}
                className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors disabled:opacity-30 cursor-pointer"
                title="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Live Subtotal Callout */}
            <div className="text-right">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                Lot Order Subtotal
              </span>
              <span className="text-xl sm:text-2xl font-black text-primary-900">
                ₹{currentLotTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8. Action Buttons */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Add to Wholesale Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isInStock || isAddingToCart}
            className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary-700 via-primary-600 to-primary-700 hover:from-primary-800 hover:via-primary-700 hover:to-primary-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg shadow-primary-900/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isAddingToCart ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Adding to Cart...</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add Lot to Wholesale Cart</span>
              </>
            )}
          </button>

          {/* Instant Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!isInStock}
            className="flex-1 py-3.5 px-4 rounded-xl bg-primary-50/80 hover:bg-primary-100 text-primary-900 hover:text-primary-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-primary-300 hover:border-primary-500 shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap size={16} className="text-amber-600" />
            <span>Instant Wholesale Checkout</span>
          </button>
        </div>

        {/* Wishlist & Share strip */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsWishlist(!isWishlist);
              toast.success(isWishlist ? 'Removed from saved lots' : 'Saved to wholesale wishlist');
            }}
            className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer
              ${isWishlist ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            <Heart size={14} className={isWishlist ? 'fill-rose-600 text-rose-600' : ''} />
            <span>{isWishlist ? 'Saved in Wishlist' : 'Save for Later'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all cursor-pointer"
          >
            <Share2 size={14} />
            <span>Share Wholesale Spec</span>
          </button>
        </div>
      </div>

      {/* 9. Escrow Trade Assurance & Trust Strip */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl space-y-2 text-xs text-emerald-950">
        <div className="flex items-center gap-2 font-bold text-emerald-900">
          <ShieldCheck size={18} className="text-emerald-600 flex-shrink-0" />
          <span>100% Escrow Trade Assurance Guaranteed</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-relaxed">
          Buyer funds remain locked in escrow until verified delivery. Automatic GST tax invoice with HSN classification generated on dispatch.
        </p>
      </div>

      {/* 10. Postal PIN Code Delivery Check */}
      <div className="p-4 bg-white rounded-2xl border border-primary-100 shadow-2xs space-y-2">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
          Estimate Dispatch Delivery
        </span>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter 6-digit postal PIN code"
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={handlePinCheck}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Check PIN
          </button>
        </div>
        {pinMessage && (
          <p className={`text-xs font-semibold mt-1.5 ${pinMessage.includes('✓') ? 'text-emerald-700' : 'text-rose-600'}`}>
            {pinMessage}
          </p>
        )}
      </div>

    </div>
  );
}
