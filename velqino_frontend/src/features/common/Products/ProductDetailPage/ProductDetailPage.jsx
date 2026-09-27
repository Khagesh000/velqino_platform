"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useGetProductQuery } from '@/redux/wholesaler/slices/productsSlice';
import { ChevronRight, ArrowLeft, ShoppingBag, ShieldCheck, RotateCcw } from '@/utils/icons';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import RelatedProducts from './components/RelatedProducts';
import RecentlyViewed, { addToRecentlyViewed } from './components/RecentlyViewed';
import '@/styles/common/ProductDetailPage.scss';

export default function ProductDetailPage({ productId }) {
  // Fetch product by ID from backend API
  const { data, isLoading, error, refetch } = useGetProductQuery(productId, {
    skip: !productId,
  });
  
  const product = data?.data || data;

  // Track in recently viewed
  useEffect(() => {
    if (product?.id) {
      addToRecentlyViewed(product);
    }
  }, [product]);

  // 1. Loading Skeleton State
  if (isLoading || !productId) {
    return (
      <div className="pdp-page-wrapper py-6 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>

          {/* Main 2-Column Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Gallery Skeleton */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-square bg-gray-200 rounded-3xl animate-pulse"></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Info Skeleton */}
            <div className="lg:col-span-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded-full w-32 animate-pulse"></div>
              <div className="h-9 bg-gray-200 rounded-xl w-3/4 animate-pulse"></div>
              <div className="h-28 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-14 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error / Not Found State
  if (error || !product) {
    return (
      <div className="pdp-page-wrapper min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl border-2 border-primary-200 shadow-sm">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-500">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Wholesale Lot Not Found</h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 leading-relaxed">
            The requested wholesale lot may have completed its factory dispatch or is temporarily unavailable from the mill.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="w-full sm:w-auto px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw size={15} />
              <span>Retry Query</span>
            </button>
            <Link
              href="/product/productlistingpage"
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={15} />
              <span>Wholesale Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pdp-page-wrapper py-5 sm:py-8 lg:py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-8 lg:space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link href="/" className="hover:text-primary-700 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
          <Link href="/product/productlistingpage" className="hover:text-primary-700 transition-colors">
            Wholesale Catalog
          </Link>
          {product?.category_name && (
            <>
              <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 font-medium">{product.category_name}</span>
            </>
          )}
          <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
          <span className="text-gray-900 font-bold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </div>

        {/* Product Main Section: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Gallery (6 Columns) */}
          <div className="lg:col-span-6 h-full">
            <ProductGallery product={product} />
          </div>

          {/* Right Column: Information, Pricing & Actions (6 Columns) */}
          <div className="lg:col-span-6 h-full">
            <ProductInfo product={product} />
          </div>

        </div>

        {/* Product Tabs (Specs, Terms, Reviews) */}
        <div className="pt-4">
          <ProductTabs product={product} />
        </div>

        {/* Related Wholesale Lots */}
        <RelatedProducts 
          currentProductId={product.id}
          categoryId={product.category_id}
          subcategoryId={product.subcategory_id}
        />

        {/* Recently Viewed History */}
        <RecentlyViewed />

      </div>
    </div>
  );
}
