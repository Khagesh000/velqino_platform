'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, Clock, Trash2, ChevronLeft, ChevronRight } from '../../../../utils/icons';

const ProductCard = memo(({ product, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  // Get image URL from product data
  const getImageUrl = () => {
    return product?.primary_image || 
           product?.images?.[0]?.image || 
           '/images/placeholder.jpg';
  };

  // Format time ago
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Get price
  const getPrice = () => {
    return product?.display_price || product?.price || 0;
  };

  // Get original price
  const getOriginalPrice = () => {
    return product?.retail_price || product?.compare_price || null;
  };

  // Get rating
  const getRating = () => {
    return product?.rating || 4.5;
  };

  return (
    <Link href={`/product/${product?.slug || product?.id}`} className="flex-shrink-0 w-[160px] sm:w-[180px] lg:w-[200px]">
      <div
        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <img
            src={getImageUrl()}
            alt={product?.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={() => setIsLoaded(true)}
            onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
          />
          
          {/* Viewed Time Badge */}
          {product?.viewedAt && (
            <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5">
              <span className="text-[8px] text-white">{getTimeAgo(product.viewedAt)}</span>
            </div>
          )}

          {/* Remove Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(product.id);
            }}
            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-red-50 transition-all"
          >
            <Trash2 size={10} className="text-gray-400 hover:text-red-500" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsWishlist(!isWishlist);
            }}
            className="absolute top-1 left-1 p-1 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <Heart size={10} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 mb-0.5">
            {product?.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-2.5 h-2.5 ${i < Math.floor(getRating()) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-[8px] text-gray-400">{getRating()}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs sm:text-sm font-bold text-primary-600">₹{getPrice()}</span>
            {getOriginalPrice() && (
              <span className="text-[8px] text-gray-400 line-through">₹{getOriginalPrice()}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full py-1 bg-primary-500 text-white rounded text-[10px] sm:text-xs font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-1"
          >
            <ShoppingCart size={10} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default function RecentlyViewed({ products = [], loading = false }) {
  const [recentProductIds, setRecentProductIds] = useState([]);
  
  // ✅ THEN USE
  const recentProducts = products.filter(p => recentProductIds.includes(p.id));
  console.log('🔍 RecentlyViewed - recentProductIds:', recentProductIds);
  console.log('🔍 RecentlyViewed - products count:', products.length);
  console.log('🔍 RecentlyViewed - recentProducts count:', recentProducts.length);

  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const autoScrollRef = useRef(null);

useEffect(() => {
  const stored = localStorage.getItem('recentlyViewed');
  console.log('🔍 RecentlyViewed - localStorage data:', stored);
  if (stored) {
    try {
      const ids = JSON.parse(stored);
      // Extract just the IDs if they are objects
      const extractedIds = ids.map(item => typeof item === 'object' ? item.id : item);
      console.log('🔍 Extracted IDs:', extractedIds);
      setRecentProductIds(extractedIds);
    } catch (e) {
      console.log('🔍 RecentlyViewed - error:', e);
      setRecentProductIds([]);
    }
  } else {
    console.log('🔍 RecentlyViewed - no data in localStorage');
  }
}, []);

// Filter products from props that are in recently viewed IDs

  // Auto-scroll
  useEffect(() => {
    if (isInView && recentProducts.length > 4 && !isHovered) {
      autoScrollRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 10) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
          }
        }
      }, 3000);
    }
    return () => clearInterval(autoScrollRef.current);
  }, [isInView, recentProducts.length, isHovered]);




  // Intersection Observer
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

  const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => setIsMobile(window.innerWidth < 768);
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

  const handleRemoveProduct = (productId) => {
  const updatedIds = recentProductIds.filter(id => id !== productId);
  setRecentProductIds(updatedIds);
  localStorage.setItem('recentlyViewed', JSON.stringify(updatedIds));
};

  const handleClearAll = () => {
  if (confirm('Clear all recently viewed products?')) {
    setRecentProductIds([]);
    localStorage.removeItem('recentlyViewed');
  }
};

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="recently-viewed-section py-8 sm:py-12 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-primary-500" />
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
              Recently Viewed
            </h2>
            <span className="text-xs text-gray-400">({recentProducts.length})</span>
          </div>
          <button
            onClick={handleClearAll}
            className="text-xs text-gray-500 hover:text-red-500 transition-all flex items-center gap-1"
          >
            <Trash2 size={12} />
            <span>Clear History</span>
          </button>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Arrow */}
          {(recentProducts.length > 4 || (isMobile && recentProducts.length > 2)) && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Scrollable Products */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 hide-scrollbar scroll-smooth"
          >
            {recentProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onRemove={handleRemoveProduct}
              />
            ))}
          </div>

          {/* Right Arrow */}
          {(recentProducts.length > 4 || (isMobile && recentProducts.length > 2)) && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}