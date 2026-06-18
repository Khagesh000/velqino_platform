"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Loader2, ChevronLeft, ChevronRight } from '../../../../../utils/icons';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice';
import { useAddToCartMutation } from '@/redux/wholesaler/slices/cartSlice';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/redux/wholesaler/slices/wishlistSlice';
import '../../../../../styles/Products/ProductsListingPage/ProductGrid.scss';
import { BASE_IMAGE_URL } from '@/utils/apiConfig';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';

const ProductCard = ({ product, onWishlistToggle }) => {
  const [isWishlist, setIsWishlist] = useState(product?.is_wishlisted || false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [addToWishlist, { isLoading: isAddingToWishlist }] = useAddToWishlistMutation();
  const [removeFromWishlist, { isLoading: isRemovingFromWishlist }] = useRemoveFromWishlistMutation();
  const imageScrollRef = useRef(null);

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;
  const imageUrl = imgError ? '/images/placeholder.jpg' : `${BASE_IMAGE_URL}${product.primary_image || product.image}`;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({ product_id: product.id, quantity: 1, selected_size: '', selected_color: '' }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isWishlist;
    setIsWishlist(newState);
    try {
      if (isWishlist) {
        await removeFromWishlist(product.id).unwrap();
        setIsWishlist(false);
        toast.success('Removed from wishlist');
        if (onWishlistToggle) onWishlistToggle(product.id, false);
      } else {
        await addToWishlist(product.id).unwrap();
        setIsWishlist(true);
        toast.success('Added to wishlist');
        if (onWishlistToggle) onWishlistToggle(product.id, true);
      }
    } catch (error) {
      setIsWishlist(!newState);
      toast.error(error?.data?.message || 'Please login to add to wishlist');
    }
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/productdetail/${product.id}`} className="flex flex-col flex-1">

        {/* Image Area */}
        <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-gray-100 group/img">
          {product.images && product.images.length > 0 ? (
            <>
              <div
                ref={imageScrollRef}
                className="flex flex-nowrap overflow-x-auto scroll-smooth h-full snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={`${BASE_IMAGE_URL}${img.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover flex-shrink-0 snap-start transition-transform duration-500 group-hover/img:scale-105"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                ))}
              </div>

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); e.stopPropagation();
                      imageScrollRef.current?.scrollBy({ left: -imageScrollRef.current.clientWidth, behavior: 'smooth' });
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover/img:opacity-100 z-30 border border-gray-100"
                  >
                    <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); e.stopPropagation();
                      imageScrollRef.current?.scrollBy({ left: imageScrollRef.current.clientWidth, behavior: 'smooth' });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover/img:opacity-100 z-30 border border-gray-100"
                  >
                    <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10 font-medium">
                    {product.images.length} photos
                  </div>
                </>
              )}
            </>
          ) : (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg z-10">
              -{discount}%
            </div>
          )}

          {/* NEW Badge */}
          {product.is_new && (
            <div className="absolute top-2.5 right-10 bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg z-10">
              NEW
            </div>
          )}

          {/* Wishlist */}
          <button
            onClick={handleWishlistClick}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110 disabled:opacity-50 border border-gray-100"
          >
            {(isAddingToWishlist || isRemovingFromWishlist) ? (
              <Loader2 size={13} className="animate-spin text-gray-400" />
            ) : (
              <Heart size={14} className={`${isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'} transition-colors`} />
            )}
          </button>

          {/* Quick View Overlay */}
          <div className={`absolute inset-0 bg-black/30 flex items-end justify-center pb-4 transition-all duration-300 z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="px-5 py-1.5 bg-white/95 hover:bg-white text-gray-800 hover:text-primary-600 rounded-full text-xs font-semibold tracking-wide shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-white/50 hover:border-primary-100"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-3 sm:p-4 flex-1 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-200 fill-current'}`} />
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.reviews || 0})</span>
          </div>
          <div className="mt-auto flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-primary-600">₹{product.price?.toLocaleString()}</span>
            {product.compare_price && (
              <span className="text-xs text-gray-400 line-through">₹{product.compare_price?.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-4">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white rounded-xl text-sm font-semibold
            transition-all duration-200 flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed group/btn
            hover:shadow-md hover:shadow-primary-200"
        >
          {isAddingToCart ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ShoppingCart size={14} className="group-hover/btn:scale-110 transition-transform" />
          )}
          <span>{isAddingToCart ? 'Adding...' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default function ProductGrid() {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const initialLoadDone = useRef(false);
  const [addToCart] = useAddToCartMutation();
  const isMounted = useRef(false);

  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category_id');
  const season = searchParams.get('season');
  const category = searchParams.get('category');
  const dealsOfDay = searchParams.get('deals_of_day');
  const productId = searchParams.get('product_id');
  const sort = searchParams.get('sort');

  const queryParams = {
    page, per_page: 12,
    ...(categoryId && { category_id: categoryId }),
    ...(season && { season }),
    ...(category && { category }),
    ...(dealsOfDay && { deals_of_day: dealsOfDay }),
    ...(productId && { product_id: productId }),
    ...(sort && { sort }),
  };

  const { data, isLoading, isFetching } = useGetProductsQuery(queryParams);
  const products = data?.data?.products || [];
  const totalPages = data?.data?.pagination?.total_pages || 1;

  useEffect(() => {
    if (!isMounted.current && products.length > 0) {
      isMounted.current = true;
      setAllProducts(products);
      setHasMore(page < totalPages);
    } else if (products.length > 0) {
      setAllProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newProducts = products.filter(p => !existingIds.has(p.id));
        return page === 1 ? products : [...prev, ...newProducts];
      });
      setHasMore(page < totalPages);
    }
  }, [products, page, totalPages]);

  useEffect(() => {
    if (!initialLoadDone.current && !isLoading && products.length === 0) {
      initialLoadDone.current = true;
    }
  }, [isLoading, products.length]);

  const handleWishlistToggle = (productId, isWishlisted) => {
    setAllProducts(prev => prev.map(p => p.id === productId ? { ...p, is_wishlisted: isWishlisted } : p));
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isFetching) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, isFetching]);

  useEffect(() => {
    return () => { setAllProducts([]); setPage(1); };
  }, []);

  /* ── Skeleton loader ── */
  if (isLoading && allProducts.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
            <div className="aspect-square bg-gray-100" />
            <div className="p-4 space-y-2.5">
              <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
              <div className="h-3 bg-gray-100 rounded-full w-1/2" />
              <div className="h-4 bg-gray-100 rounded-full w-1/3" />
              <div className="h-9 bg-gray-100 rounded-xl mt-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Results count */}
      {allProducts.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">{allProducts.length}</span> products
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {allProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onWishlistToggle={handleWishlistToggle}
          />
        ))}
      </div>

      {/* Loading more */}
      {isFetching && allProducts.length > 0 && (
        <div className="flex justify-center py-10">
          <div className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-100 rounded-full shadow-sm">
            <Loader2 size={16} className="animate-spin text-primary-500" />
            <span className="text-sm text-gray-500 font-medium">Loading more...</span>
          </div>
        </div>
      )}

      {hasMore && <div ref={loaderRef} className="h-10" />}

      {/* End */}
      {!hasMore && allProducts.length > 0 && (
        <div className="text-center py-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-full">
            <span className="text-sm text-gray-400 font-medium">All products loaded</span>
          </div>
        </div>
      )}
    </>
  );
}