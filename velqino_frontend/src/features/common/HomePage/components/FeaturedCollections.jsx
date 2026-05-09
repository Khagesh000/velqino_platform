'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, Sparkles, ChevronRight, TrendingUp, Gift, Sun, Snowflake } from '../../../../utils/icons';

const ProductCard = memo(({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  // Get image URL from backend product data
  const getImageUrl = () => {
    return product?.primary_image || 
           product?.images?.[0]?.image || 
           '/images/placeholder.jpg';
  };

  const getPrice = () => {
    return product?.display_price || product?.price || 0;
  };

  const getOriginalPrice = () => {
    return product?.retail_price || product?.compare_price || null;
  };

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
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
        <button
          onClick={() => setIsWishlist(!isWishlist)}
          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm"
        >
          <Heart size={12} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="p-2">
        <h4 className="text-xs font-medium text-gray-800 truncate">{product?.name}</h4>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs font-bold text-primary-600">₹{getPrice()}</span>
          {getOriginalPrice() && (
            <span className="text-[9px] text-gray-400 line-through">₹{getOriginalPrice()}</span>
          )}
        </div>
        <button className="w-full mt-2 py-1 bg-primary-500 text-white rounded text-[10px] font-medium hover:bg-primary-600 transition-all flex items-center justify-center gap-1">
          <ShoppingCart size={10} />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function FeaturedCollections({ collections = [] }) {
  const [activeSeason, setActiveSeason] = useState('summer');
  const [isInView, setIsInView] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const sectionRef = useRef(null);

  // Get current collection from props (passed from HomePage)
  const currentCollection = collections.find(c => c.season === activeSeason);

  const seasons = [
    { id: 'summer', label: 'Summer', icon: <Sun size={16} /> },
    { id: 'winter', label: 'Winter', icon: <Snowflake size={16} /> },
    { id: 'festive', label: 'Festive', icon: <Gift size={16} /> },
  ];

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

  // Progressive loading
  useEffect(() => {
    if (isInView && currentCollection?.products) {
      setVisibleProducts(currentCollection.products.slice(0, 2));
      const timer = setTimeout(() => {
        setVisibleProducts(currentCollection.products);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, currentCollection]);

  // If no collections data, don't render
  if (!collections.length || !currentCollection?.products?.length) {
    return null;
  }

  return (
    <section ref={sectionRef} className="featured-collections-section py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={24} className="text-primary-500" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Curated <span className="text-primary-500">Collections</span>
            </h2>
          </div>
          <p className="text-sm text-gray-500">Handpicked by our experts just for you</p>
          <div className="w-20 h-1 bg-primary-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Season Tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-8">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setActiveSeason(season.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeSeason === season.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary-50'
              }`}
            >
              {season.icon}
              <span>{season.label}</span>
            </button>
          ))}
        </div>

        {/* Collection Card */}
        {currentCollection && (
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
            {/* Collection Header */}
            <div className={`bg-gradient-to-r ${currentCollection.gradient} p-4 sm:p-6`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                    {currentCollection.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{currentCollection.name}</h3>
                    <p className="text-white/80 text-sm">{currentCollection.description || 'Seasonal collection'}</p>
                  </div>
                </div>
                <Link
                  href={`/collections/${currentCollection.season}`}
                  className="text-white text-sm font-medium hover:underline flex items-center gap-1"
                >
                  View Collection <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Curator Note */}
            <div className="bg-primary-50 px-4 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-primary-500" />
                <span className="text-xs text-gray-600">
                  <span className="font-semibold">Curator's Pick:</span> {currentCollection.curatorNote || 'Trending this season'}
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View All Collections Button */}
        <div className="text-center mt-8">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-600 hover:text-primary-50 transition-all duration-300 group"
          >
            <span>View All Collections</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}