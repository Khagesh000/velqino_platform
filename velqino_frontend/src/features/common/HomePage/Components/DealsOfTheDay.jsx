"use client";

import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Clock, Zap, TrendingUp, Eye, ChevronRight } from '../../../../utils/icons';
import '../../../../styles/common/HomePage/DealsOfTheDay.scss'

const dealsData = [
  {
    id: 1,
    name: 'Premium Wireless Headphones',
    slug: 'wireless-headphones',
    originalPrice: 4999,
    discountedPrice: 2999,
    discount: 40,
    image: '/images/products/headphones.jpg',
    stock: 45,
    totalStock: 100,
    sold: 55,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    originalPrice: 12999,
    discountedPrice: 7999,
    discount: 38,
    image: '/images/products/smartwatch.jpg',
    stock: 28,
    totalStock: 80,
    sold: 52,
    rating: 4.9
  },
  {
    id: 3,
    name: 'Running Shoes',
    slug: 'running-shoes',
    originalPrice: 3999,
    discountedPrice: 1999,
    discount: 50,
    image: '/images/products/shoes.jpg',
    stock: 15,
    totalStock: 60,
    sold: 45,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Smart LED TV 55"',
    slug: 'smart-tv',
    originalPrice: 49999,
    discountedPrice: 34999,
    discount: 30,
    image: '/images/products/tv.jpg',
    stock: 8,
    totalStock: 25,
    sold: 17,
    rating: 4.6
  },
  {
    id: 5,
    name: 'Wireless Earbuds',
    slug: 'wireless-earbuds',
    originalPrice: 2999,
    discountedPrice: 1499,
    discount: 50,
    image: '/images/products/earbuds.jpg',
    stock: 32,
    totalStock: 100,
    sold: 68,
    rating: 4.5
  },
  {
    id: 6,
    name: 'Gaming Keyboard',
    slug: 'gaming-keyboard',
    originalPrice: 5999,
    discountedPrice: 3499,
    discount: 42,
    image: '/images/products/keyboard.jpg',
    stock: 12,
    totalStock: 50,
    sold: 38,
    rating: 4.8
  }
];

// Timer Component with performance optimization
const CountdownTimer = memo(({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    return (
      <div className="flex gap-2">
        <div className="bg-primary-100 rounded-lg px-2 py-1 min-w-[50px] text-center animate-pulse">Loading</div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="bg-primary-100 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-center min-w-[50px] sm:min-w-[60px]">
        <span className="text-lg sm:text-2xl font-bold text-primary-700">{String(timeLeft.hours).padStart(2, '0')}</span>
        <p className="text-[9px] sm:text-xs text-gray-500">Hours</p>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-primary-500 self-center">:</div>
      <div className="bg-primary-100 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-center min-w-[50px] sm:min-w-[60px]">
        <span className="text-lg sm:text-2xl font-bold text-primary-700">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <p className="text-[9px] sm:text-xs text-gray-500">Minutes</p>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-primary-500 self-center">:</div>
      <div className="bg-primary-100 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-center min-w-[50px] sm:min-w-[60px]">
        <span className="text-lg sm:text-2xl font-bold text-primary-700">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <p className="text-[9px] sm:text-xs text-gray-500">Seconds</p>
      </div>
    </div>
  );
});

CountdownTimer.displayName = 'CountdownTimer';

// Product Card Component with memoization
const ProductCard = memo(({ product, index }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const soldPercentage = (product.sold / product.totalStock) * 100;

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Discount Badge */}
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          -{product.discount}%
        </div>
        
        {/* Quick View Button */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-500 hover:text-white transition-all transform -translate-y-2 group-hover:translate-y-0">
            Quick View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-1 mb-1">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg sm:text-xl font-bold text-primary-600">₹{product.discountedPrice}</span>
          <span className="text-xs sm:text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
        </div>

        {/* Stock Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
            <span>Sold: {product.sold}</span>
            <span>Available: {product.stock}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${soldPercentage}%` }}
            />
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
          <ShoppingCart size={16} />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function DealsOfTheDay() {
  const [visibleDeals, setVisibleDeals] = useState([]);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);
  
  // Set end time (24 hours from now)
  const endTime = new Date().getTime() + 24 * 60 * 60 * 1000;

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Progressive loading of deals
  useEffect(() => {
    if (isInView) {
      // Load first 3 immediately, then rest
      setVisibleDeals(dealsData.slice(0, 3));
      const timer = setTimeout(() => {
        setVisibleDeals(dealsData);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="deals-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={24} className="text-primary-500" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Deals of the <span className="text-primary-500">Day</span>
              </h2>
            </div>
            <p className="text-sm text-gray-500">Limited time offers. Hurry up!</p>
          </div>
          
          {/* Countdown Timer */}
          <CountdownTimer targetDate={endTime} />
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {visibleDeals.map((deal, index) => (
            <ProductCard key={deal.id} product={deal} index={index} />
          ))}
        </div>

        {/* View All Deals Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-500 hover:text-primary-500 transition-all duration-300 group"
          >
            <span>View All Deals</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}