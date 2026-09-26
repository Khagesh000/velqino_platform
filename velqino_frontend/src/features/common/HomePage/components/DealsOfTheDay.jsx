"use client";

import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Clock, Zap, ChevronRight, Flame } from '../../../../utils/icons';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { toast } from 'react-toastify';

// Live Countdown Timer
const CountdownTimer = memo(({ targetHours = 8 }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: targetHours, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetHours]);

  return (
    <div className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-900 px-2.5 py-1 rounded-full border border-primary-200 text-[11px] font-bold shadow-xs">
      <Clock size={13} className="text-primary-600 animate-pulse" />
      <span className="text-primary-700">ENDS IN:</span>
      <span className="font-mono tracking-wider text-primary-900">
        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
      </span>
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

const DealCard = memo(({ product, wishlistIds = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const handleAddToCart = async (e, prod) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({
        product_id: prod.id,
        quantity: 1,
        selected_size: '',
        selected_color: ''
      }).unwrap();
      toast.success(`${prod.name} added to cart!`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };

  const soldPercentage = Math.min(100, Math.round(((product.sold || 12) / ((product.sold || 12) + (product.stock || 8))) * 100));

  return (
    <div 
      className="group bg-white rounded-2xl border border-gray-200/80 p-2.5 sm:p-3 hover:shadow-lg hover:border-primary-400 transition-all duration-300 flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Deal Product Image with Balanced Height on Laptop */}
        <div className="relative aspect-square max-h-48 sm:max-h-52 lg:max-h-48 w-full rounded-xl overflow-hidden bg-gray-50 mb-2.5 border border-gray-100 flex items-center justify-center">
          <Link href={`/product/productlistingpage?product_id=${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
            />
          </Link>

          {/* Discount Pill */}
          <div className="absolute top-2 left-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
            {product.discount > 0 ? `${product.discount}% OFF` : 'DEAL'}
          </div>

          {/* Quick View Button */}
          <div className={`absolute inset-0 bg-black/25 flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Link href={`/product/productlistingpage?product_id=${product.id}`}>
              <span className="bg-white text-gray-900 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xs hover:bg-primary-500 hover:text-white transition-colors">
                Quick View
              </span>
            </Link>
          </div>
        </div>

        {/* Title */}
        <Link href={`/product/productlistingpage?product_id=${product.id}`}>
          <h4 className="text-xs font-semibold text-gray-800 line-clamp-1 hover:text-primary-600 transition-colors">
            {product.name}
          </h4>
        </Link>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 mt-1 mb-1.5">
          <span className="text-sm sm:text-base font-bold text-gray-900">
            ₹{product.discountedPrice}
          </span>
          {product.originalPrice > product.discountedPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Stock Meter */}
        <div className="mb-2">
          <div className="flex justify-between text-[9px] sm:text-[10px] text-gray-500 mb-1 font-medium">
            <span>Sold: {product.sold || 18}</span>
            <span className="text-primary-700 font-bold">{product.stock || 8} left</span>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent-400 to-primary-600 rounded-full transition-all duration-500"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Compact Add To Cart */}
      <button 
        onClick={(e) => handleAddToCart(e, product)}
        disabled={isAddingToCart}
        className="w-full py-1.5 bg-primary-500 text-white rounded-xl text-xs font-semibold hover:bg-primary-600 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-xs"
      >
        <ShoppingCart size={13} />
        <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
      </button>
    </div>
  );
});

DealCard.displayName = 'DealCard';

export default function DealsOfTheDay({ deals = [], loading = false, wishlistIds = [] }) {
  const sectionRef = useRef(null);

  const formattedDeals = useMemo(() => {
    if (!deals || deals.length === 0) {
      return [
        {
          id: 88,
          name: 'Baggy Jeans 20 (Dark Wash)',
          image: 'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048593/retailer/products/2026/07/RET-84B74D80_image_1',
          originalPrice: 1699,
          discountedPrice: 1100,
          discount: 35,
          stock: 6,
          sold: 24,
        },
        {
          id: 87,
          name: 'Baggy Jeans 19 (Cargo Khaki)',
          image: 'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048509/retailer/products/2026/07/RET-2F212480_image_1',
          originalPrice: 1799,
          discountedPrice: 1100,
          discount: 38,
          stock: 4,
          sold: 28,
        },
        {
          id: 91,
          name: 'White Track Pants (Bulk Pack)',
          image: 'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785050400/products/2026/07/PROD-B834A209_image_1',
          originalPrice: 799,
          discountedPrice: 400,
          discount: 50,
          stock: 12,
          sold: 48,
        },
        {
          id: 89,
          name: 'Denim Black Sherpa Jacket',
          image: 'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048693/retailer/products/2026/07/RET-80409D4B_image_1',
          originalPrice: 2499,
          discountedPrice: 1700,
          discount: 32,
          stock: 3,
          sold: 19,
        }
      ];
    }
    return deals.slice(0, 4).map(deal => ({
      ...deal,
      discountedPrice: deal.price || deal.discounted_price,
      originalPrice: deal.retail_price || deal.compare_price || (deal.price ? Math.round(deal.price * 1.3) : 999),
      discount: deal.discount_percent || 25,
      stock: deal.stock || 8,
      sold: deal.sold || 15,
    }));
  }, [deals]);

  if (loading) {
    return (
      <div className="container py-3 sm:py-4">
        <div className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="py-3.5 sm:py-4.5 lg:py-5 bg-primary-50/40 border-y border-primary-100/70">
      <div className="container">
        
        {/* Flipkart-Style Dedicated Deal Zone Shelf */}
        <div className="bg-white rounded-2xl border border-primary-200/80 p-3 sm:p-4 md:p-5 shadow-xs">
          
          {/* Deal Shelf Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 sm:mb-4 pb-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-xs">
                <Flame size={17} className="fill-current animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-none">
                    Grab or Gone Deals
                  </h3>
                  <span className="text-[9px] font-extrabold uppercase bg-accent-100 text-accent-900 border border-accent-300/80 px-2 py-0.5 rounded-full">
                    Flash Wholesale
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Highest saving bulk lots with guaranteed instant factory dispatch
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <CountdownTimer targetHours={8} />
              <Link
                href="/product/productlistingpage?deals=true"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 group"
              >
                <span>View All Deals</span>
                <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 4-Column Deal Shelf */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
            {formattedDeals.map((product) => (
              <DealCard key={product.id} product={product} wishlistIds={wishlistIds} />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}