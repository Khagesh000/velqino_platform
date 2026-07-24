'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, ChevronRight, Sparkles, TrendingUp, Gift, Sun, Snowflake } from '../../../../utils/icons';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { toast } from 'react-toastify';
import Image from 'next/image';

const ProductCard = memo(({ product, wishlistIds = [] }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isWishlist, setIsWishlist] = useState(wishlistIds?.includes(product?.id) || false);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  useEffect(() => {
    const productId = Number(product?.id);
    setIsWishlist(wishlistIds?.includes(productId) || false);
  }, [wishlistIds, product?.id]);

  const getImageUrl = () => product?.image || '/images/placeholder.jpg';
  const getPrice = () => product?.display_price || product?.price || 0;
  const getOriginalPrice = () => product?.retail_price || product?.compare_price || null;

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({ product_id: product.id, quantity: 1, selected_size: '', selected_color: '' }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-primary-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <Image
          src={getImageUrl()}
          alt={product?.name}
          fill
          className={`object-cover transition-all duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={false}
          onLoadingComplete={() => setIsLoaded(true)}
        />

        {/* Wishlist button */}
        <button
          onClick={() => setIsWishlist(!isWishlist)}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full shadow-sm transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <Heart size={14} className={`transition-colors duration-200 ${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Discount badge */}
        {getOriginalPrice() && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary-500 text-white text-[10px] font-semibold rounded-full shadow-sm">
            SALE
          </div>
        )}

        {/* Quick add overlay on hover (desktop) */}
        <div
          className={`hidden sm:flex absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={(e) => handleAddToCart(e, product)}
            disabled={isAddingToCart}
            className="w-full py-1.5 bg-white text-primary-600 rounded-lg text-xs font-semibold hover:bg-primary-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <ShoppingCart size={12} />
            {isAddingToCart ? 'Adding...' : 'Quick Add'}
          </button>
        </div>
      </div>

      <div className="p-2.5">
        <h4 className="text-xs font-medium text-gray-800 truncate">{product?.name}</h4>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-sm font-bold text-primary-600">₹{getPrice()}</span>
          {getOriginalPrice() && (
            <span className="text-[10px] text-gray-400 line-through">₹{getOriginalPrice()}</span>
          )}
        </div>

        {/* Mobile always-visible add button */}
        <button
          onClick={(e) => handleAddToCart(e, product)}
          disabled={isAddingToCart}
          className="sm:hidden w-full mt-2 py-1.5 bg-primary-500 text-white rounded-lg text-[11px] font-medium hover:bg-primary-600 active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <ShoppingCart size={11} />
          <span>{isAddingToCart ? 'Adding...' : 'Add'}</span>
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default function FeaturedCollections({ collections = [], wishlistIds = [] }) {
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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && currentCollection?.products) {
      setVisibleProducts(currentCollection.products.slice(0, 2));
      const timer = setTimeout(() => setVisibleProducts(currentCollection.products), 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, currentCollection]);

  if (!collections.length) return null;

  const hasProducts = currentCollection?.products?.length > 0;

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

        {/* Season Tabs — animated sliding indicator */}
        <div className="relative flex justify-center gap-1 sm:gap-2 mb-8 bg-white/60 backdrop-blur-sm rounded-full p-1.5 max-w-md mx-auto shadow-sm border border-gray-100">
          {seasons.map((season) => (
            <button
              key={season.id}
              onClick={() => setActiveSeason(season.id)}
              className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-300 ${
                activeSeason === season.id ? 'text-white' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              {season.icon}
              <span>{season.label}</span>
              {activeSeason === season.id && (
                <span className="absolute inset-0 -z-10 bg-primary-500 rounded-full shadow-md animate-[fadeIn_0.3s_ease-out]" />
              )}
            </button>
          ))}
        </div>

        {/* Collection Card */}
        {currentCollection && (
          <div
            key={activeSeason}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-[fadeIn_0.4s_ease-out]"
          >
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
                  className="text-white text-sm font-medium hover:underline flex items-center gap-1 transition-transform hover:translate-x-0.5"
                >
                  View Collection <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Curator Note */}
            <div className="bg-primary-50 px-4 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-primary-500 shrink-0" />
                <span className="text-xs text-gray-600">
                  <span className="font-semibold">Curator's Pick:</span> {currentCollection.curatorNote || 'Trending this season'}
                </span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="p-4">
              {hasProducts ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} wishlistIds={wishlistIds} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
                    <Gift size={22} className="text-primary-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No products available in this season yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Check back soon for new arrivals!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            href={`/product/productlistingpage?season=${activeSeason}`}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary-500 text-primary-600 font-semibold rounded-full hover:bg-primary-500 hover:text-white transition-all duration-300 group shadow-sm hover:shadow-md"
          >
            <span>View All {currentCollection?.name}</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}