"use client";

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, Sparkles, ChevronRight, TrendingUp, Gift, Sun, Snowflake } from '../../../../utils/icons';

const collections = [
  {
    id: 1,
    name: 'Summer Breeze',
    season: 'summer',
    icon: <Sun size={20} />,
    gradient: 'from-orange-500 to-yellow-500',
    description: 'Beat the heat with our summer collection',
    curatorNote: 'Light, breathable fabrics perfect for sunny days',
    products: [
      { id: 1, name: 'Linen Shirt', price: 899, originalPrice: 1799, image: '/images/products/linen-shirt.jpg', rating: 4.8 },
      { id: 2, name: 'Cotton Shorts', price: 499, originalPrice: 999, image: '/images/products/cotton-shorts.jpg', rating: 4.7 },
      { id: 3, name: 'Summer Hat', price: 299, originalPrice: 599, image: '/images/products/summer-hat.jpg', rating: 4.6 },
      { id: 4, name: 'Flip Flops', price: 399, originalPrice: 799, image: '/images/products/flip-flops.jpg', rating: 4.5 },
    ]
  },
  {
    id: 2,
    name: 'Winter Warmers',
    season: 'winter',
    icon: <Snowflake size={20} />,
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Stay cozy this winter season',
    curatorNote: 'Premium wool blends for ultimate comfort',
    products: [
      { id: 5, name: 'Wool Sweater', price: 1499, originalPrice: 2999, image: '/images/products/wool-sweater.jpg', rating: 4.9 },
      { id: 6, name: 'Thermal Gloves', price: 299, originalPrice: 599, image: '/images/products/thermal-gloves.jpg', rating: 4.7 },
      { id: 7, name: 'Winter Jacket', price: 2499, originalPrice: 4999, image: '/images/products/winter-jacket.jpg', rating: 4.8 },
      { id: 8, name: 'Woolen Scarf', price: 399, originalPrice: 799, image: '/images/products/woolen-scarf.jpg', rating: 4.6 },
    ]
  },
  {
    id: 3,
    name: 'Festive Dhamaka',
    season: 'festive',
    icon: <Gift size={20} />,
    gradient: 'from-red-500 to-pink-500',
    description: 'Celebrate with exclusive offers',
    curatorNote: 'Perfect gifts for your loved ones',
    products: [
      { id: 9, name: 'Gift Hamper', price: 999, originalPrice: 1999, image: '/images/products/gift-hamper.jpg', rating: 4.9 },
      { id: 10, name: 'Decorative Lights', price: 499, originalPrice: 999, image: '/images/products/decorative-lights.jpg', rating: 4.7 },
      { id: 11, name: 'Pooja Thali', price: 599, originalPrice: 1199, image: '/images/products/pooja-thali.jpg', rating: 4.8 },
      { id: 12, name: 'Rangoli Colors', price: 199, originalPrice: 399, image: '/images/products/rangoli-colors.jpg', rating: 4.5 },
    ]
  }
];

const ProductCard = memo(({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

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
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-110' : 'scale-100'}`}
          onLoad={() => setIsLoaded(true)}
        />
        <button
          onClick={() => setIsWishlist(!isWishlist)}
          className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm"
        >
          <Heart size={12} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="p-2">
        <h4 className="text-xs font-medium text-gray-800 truncate">{product.name}</h4>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs font-bold text-primary-600">₹{product.price}</span>
          <span className="text-[9px] text-gray-400 line-through">₹{product.originalPrice}</span>
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

export default function FeaturedCollections() {
  const [activeSeason, setActiveSeason] = useState('summer');
  const [isInView, setIsInView] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const sectionRef = useRef(null);

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
    if (isInView && currentCollection) {
      setVisibleProducts(currentCollection.products.slice(0, 2));
      const timer = setTimeout(() => {
        setVisibleProducts(currentCollection.products);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, currentCollection]);

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
                    <p className="text-white/80 text-sm">{currentCollection.description}</p>
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
                  <span className="font-semibold">Curator's Pick:</span> {currentCollection.curatorNote}
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