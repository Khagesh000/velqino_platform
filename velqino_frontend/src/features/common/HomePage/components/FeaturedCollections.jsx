'use client';

import React, { useState, useRef, memo, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, ChevronRight, Sun, Snowflake, Gift, Sparkles, TrendingUp, ArrowRight, CheckCircle } from '../../../../utils/icons';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { toast } from 'react-toastify';

const CompactCuratedCard = memo(({ product, wishlistIds = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const handleAddToCart = async (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({ product_id: p.id, quantity: 1, selected_size: '', selected_color: '' }).unwrap();
      toast.success(`${p.name} added to cart!`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };

  const discountPercent = product.retail_price && product.price && product.retail_price > product.price
    ? Math.round(((product.retail_price - product.price) / product.retail_price) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-200/80 p-2.5 sm:p-3 hover:shadow-lg hover:border-primary-400 transition-all duration-300 flex flex-col justify-between h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        {/* Compact Square Image Container */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 mb-2 border border-gray-100 flex items-center justify-center">
          <Link href={`/product/productlistingpage?product_id=${product.id}`} className="w-full h-full flex items-center justify-center">
            <img
              src={product.image || product.primary_image || '/images/products/placeholder.jpg'}
              alt={product.name}
              loading="lazy"
              onError={(e) => { e.target.src = '/images/products/placeholder.jpg'; }}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
            />
          </Link>

          {/* Curated Micro Chip */}
          <div className="absolute top-2 left-2 bg-primary-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
            <Sparkles size={8} />
            <span>CURATED</span>
          </div>

          {/* Discount Pill */}
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
              {discountPercent}% OFF
            </div>
          )}

          {/* Hover Quick View Overlay */}
          <div className={`absolute inset-x-2 bottom-2 transition-all duration-200 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1 pointer-events-none'}`}>
            <Link href={`/product/productlistingpage?product_id=${product.id}`}>
              <div className="w-full py-1 bg-white/95 backdrop-blur-xs text-gray-900 rounded-lg text-[11px] font-semibold text-center shadow-xs hover:bg-primary-500 hover:text-white transition-colors">
                Quick View
              </div>
            </Link>
          </div>
        </div>

        {/* Product Details */}
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-primary-600 truncate block mb-0.5">
            {product.category || 'Apparel'}
          </span>
          <Link href={`/product/productlistingpage?product_id=${product.id}`}>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1 hover:text-primary-600 transition-colors">
              {product.name}
            </h4>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 mt-1 mb-2">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              ₹{product.display_price || product.price}
            </span>
            {product.retail_price > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.retail_price}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Unified Brand Button */}
      <button
        onClick={(e) => handleAddToCart(e, product)}
        disabled={isAddingToCart}
        className="w-full py-1.5 bg-primary-500 hover:bg-primary-600 active:scale-98 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
      >
        <ShoppingCart size={13} />
        <span>{isAddingToCart ? 'Adding...' : 'Add to Bag'}</span>
      </button>
    </div>
  );
});

CompactCuratedCard.displayName = 'CompactCuratedCard';

export default function FeaturedCollections({ collections = [], allProducts = [], wishlistIds = [] }) {
  const [activeSeason, setActiveSeason] = useState('summer');
  const sectionRef = useRef(null);

  const seasons = [
    { 
      id: 'summer', 
      label: 'Summer Breeze', 
      icon: <Sun size={15} />, 
      badge: 'Lightweight & Cotton',
      curatorNote: 'Breathable cotton kurtas, lightweight track pants & daily summer wear directly from textile mills.'
    },
    { 
      id: 'festive', 
      label: 'Festive Special', 
      icon: <Gift size={15} />, 
      badge: 'Ethnic & Celebrations',
      curatorNote: 'Royal banarasi sarees, punjabi bridal suits & designer festive wear with high margin potential.'
    },
    { 
      id: 'winter', 
      label: 'Winter Warmth', 
      icon: <Snowflake size={15} />, 
      badge: 'Heavy Denim & Sherpa',
      curatorNote: 'Thermal fleece jackets, heavyweight baggy cargo pants & warm layered clothing for cold weather.'
    },
  ];

  const activeSeasonConfig = seasons.find(s => s.id === activeSeason) || seasons[0];
  const currentCollection = collections.find(c => c.season === activeSeason) || collections[0];

  // Guaranteed product lookup for each season tab
  const displayProducts = useMemo(() => {
    if (Array.isArray(currentCollection?.products) && currentCollection.products.length > 0) {
      return currentCollection.products.slice(0, 4);
    }

    if (allProducts && allProducts.length > 0) {
      if (activeSeason === 'summer') {
        const summerItems = allProducts.filter(p => 
          p.category === 'Track Pants' || p.category === 'Tshirt' || p.category === 'Shirt'
        );
        if (summerItems.length >= 4) return summerItems.slice(0, 4);
        return [...summerItems, ...allProducts.filter(p => !summerItems.includes(p))].slice(0, 4);
      }

      if (activeSeason === 'festive') {
        const festiveItems = allProducts.filter(p => 
          p.category === 'Saree' || p.category === 'Punjabi Dresses'
        );
        if (festiveItems.length >= 4) return festiveItems.slice(0, 4);
        return [...festiveItems, ...allProducts.filter(p => !festiveItems.includes(p))].slice(0, 4);
      }

      if (activeSeason === 'winter') {
        const winterItems = allProducts.filter(p => 
          p.category === 'Jacket' || p.category === 'Pant'
        );
        if (winterItems.length >= 4) return winterItems.slice(0, 4);
        return [...winterItems, ...allProducts.filter(p => !winterItems.includes(p))].slice(0, 4);
      }

      return allProducts.slice(0, 4);
    }

    return [
      {
        id: 91,
        name: 'White Track Pants (Bulk Pack)',
        category: 'Track Pants',
        price: 400,
        retail_price: 699,
        image: 'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785050400/products/2026/07/PROD-B834A209_image_1'
      },
      {
        id: 90,
        name: 'Black Punjabi Dresses (Bulk)',
        category: 'Punjabi Dresses',
        price: 600,
        retail_price: 999,
        image: 'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785049553/products/2026/07/PROD-0B138866_image_1'
      },
      {
        id: 89,
        name: 'Denim Black Sherpa Jacket',
        category: 'Jacket',
        price: 1700,
        retail_price: 2499,
        image: 'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048693/retailer/products/2026/07/RET-80409D4B_image_1'
      },
      {
        id: 88,
        name: 'Baggy Jeans 20 (Dark Denim)',
        category: 'Pant',
        price: 1100,
        retail_price: 1599,
        image: 'https://res.cloudinary.com/dfv1k6imi/image/upload/v1785048593/retailer/products/2026/07/RET-84B74D80_image_1'
      }
    ];
  }, [currentCollection, activeSeason, allProducts]);

  return (
    <section ref={sectionRef} className="py-4 sm:py-5 lg:py-6 bg-white border-b border-gray-100">
      <div className="container">

        {/* Section Header with Season Switcher Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 sm:mb-5 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary-500"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600">
                Curated Series
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              Curated Fashion Collections
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Handpicked clothing lookbooks for every season & celebration
            </p>
          </div>

          {/* Interactive Season Switcher Tabs */}
          <div className="flex items-center gap-1.5 bg-gray-100/80 p-1 rounded-xl self-start md:self-auto">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => setActiveSeason(season.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSeason === season.id
                    ? 'bg-primary-500 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <span>{season.icon}</span>
                <span>{season.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Asymmetric Split Layout: Left Spotlight Feature + Right Compact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
          
          {/* Left Column: Editorial Spotlight Feature Card */}
          <div className="lg:col-span-4 xl:col-span-3 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-3">
                <Sparkles size={11} className="text-accent-200" />
                <span>{activeSeasonConfig.badge}</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-2 flex items-center gap-2">
                <span>{activeSeasonConfig.label}</span>
                <span>{activeSeasonConfig.icon}</span>
              </h4>

              <p className="text-xs text-primary-100 leading-relaxed mb-4">
                {activeSeasonConfig.curatorNote}
              </p>

              {/* Micro Perks */}
              <div className="space-y-1.5 pt-2 border-t border-white/15 text-xs text-primary-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-accent-200 shrink-0" />
                  <span>Direct factory textile pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-accent-200 shrink-0" />
                  <span>Curated for high retail resale</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-5">
              <Link
                href={`/product/productlistingpage?season=${activeSeason}`}
                className="w-full py-2.5 bg-white hover:bg-primary-50 active:scale-98 text-primary-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>Explore Full {activeSeasonConfig.label}</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Column: Compact Curated Products Shelf */}
          <div className="lg:col-span-8 xl:col-span-9 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-3.5">
            {displayProducts.map((product) => (
              <CompactCuratedCard
                key={product.id}
                product={product}
                wishlistIds={wishlistIds}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}