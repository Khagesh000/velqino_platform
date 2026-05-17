'use client';

import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice';
import { useGetCategoriesQuery } from '@/redux/wholesaler/slices/categoriesSlice';
import { motion, AnimatePresence } from 'framer-motion';
import LogoLoader from '../LogoLoader';


// Lazy load components
const CategoriesMegaMenu = lazy(() => import('./components/CategoriesMegaMenu'));
const HeroBanner = lazy(() => import('./components/HeroBanner'));
const CategoryGrid = lazy(() => import('./components/CategoryGrid'));
const DealsOfTheDay = lazy(() => import('./components/DealsOfTheDay'));
const BestSellingProducts = lazy(() => import('./components/BestSellingProducts'));
const NewArrivals = lazy(() => import('./components/NewArrivals'));
const TopBrands = lazy(() => import('./components/TopBrands'));
const PromotionBanners = lazy(() => import('./components/PromotionBanners'));
const FeaturedCollections = lazy(() => import('./components/FeaturedCollections'));
const ReviewsSection = lazy(() => import('./components/ReviewsSection'));
const BenefitsSection = lazy(() => import('./components/BenefitsSection'));
const RecentlyViewed = lazy(() => import('./components/RecentlyViewed'));
const NewsletterSection = lazy(() => import('./components/NewsletterSection'));
const FloatingElements = lazy(() => import('./components/FloatingElements'));

// Loading placeholders
const SectionPlaceholder = ({ height = 'h-64' }) => (
  <div className={`${height} bg-gray-100 rounded-xl animate-pulse m-4`} />
);

const HeroPlaceholder = () => (
  <div className="w-full h-[500px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
);

export default function HomePage() {
  const [showLoader, setShowLoader] = useState(true);

  // ============ MULTIPLE PARALLEL API CALLS ============
  const { data: bestSellingResponse, isLoading: bestSellingLoading } = useGetProductsQuery(
    { sort: '-total_sold', limit: 8 },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: newArrivalsResponse, isLoading: newArrivalsLoading } = useGetProductsQuery(
    { sort: '-created_at', limit: 8 },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: dealsResponse, isLoading: dealsLoading } = useGetProductsQuery(
    { deals_of_day: true, limit: 8 },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: summerResponse, isLoading: summerLoading } = useGetProductsQuery(
    { season: 'summer', limit: 8 },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: winterResponse, isLoading: winterLoading } = useGetProductsQuery(
    { season: 'winter', limit: 8 },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: festiveResponse, isLoading: festiveLoading } = useGetProductsQuery(
    { season: 'festive', limit: 8 },
    { refetchOnMountOrArgChange: true }
  );
  
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  
  const { data: allProductsResponse, isLoading: allProductsLoading } = useGetProductsQuery(
    { page: 1, per_page: 50 },
    { refetchOnMountOrArgChange: true }
  );

  // Hide loader when essential data is loaded
  useEffect(() => {
    if (!categoriesLoading && !allProductsLoading && bestSellingResponse && newArrivalsResponse) {
      const timer = setTimeout(() => setShowLoader(false), 300);
      return () => clearTimeout(timer);
    }
  }, [categoriesLoading, allProductsLoading, bestSellingResponse, newArrivalsResponse]);

  // ============ EXTRACT DATA FROM RESPONSES ============
  const bestSellingProducts = useMemo(() => bestSellingResponse?.data?.products || [], [bestSellingResponse]);
  const newArrivalsProducts = useMemo(() => newArrivalsResponse?.data?.products || [], [newArrivalsResponse]);
  const dealsProducts = useMemo(() => dealsResponse?.data?.products || [], [dealsResponse]);
  const summerProducts = useMemo(() => summerResponse?.data?.products || [], [summerResponse]);
  const winterProducts = useMemo(() => winterResponse?.data?.products || [], [winterResponse]);
  const festiveProducts = useMemo(() => festiveResponse?.data?.products || [], [festiveResponse]);
  const allProducts = useMemo(() => allProductsResponse?.data?.products || [], [allProductsResponse]);
  
  const memoizedCategories = useMemo(() => {
    const categoryList = categoriesData?.data || categoriesData;
    return Array.isArray(categoryList) ? categoryList : [];
  }, [categoriesData]);
  
  const seasonalCollections = useMemo(() => [
    { name: 'Summer Breeze', season: 'summer', products: summerProducts, icon: '☀️', gradient: 'from-orange-500 to-yellow-500' },
    { name: 'Winter Warmers', season: 'winter', products: winterProducts, icon: '❄️', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Festive Dhamaka', season: 'festive', products: festiveProducts, icon: '🎁', gradient: 'from-red-500 to-pink-500' }
  ], [summerProducts, winterProducts, festiveProducts]);
  
  const quickLinksData = useMemo(() => ({
    trending_count: allProducts.length,
    new_arrivals_count: newArrivalsProducts.length,
    best_sellers_count: bestSellingProducts.length,
    deals_count: dealsProducts.length,
    brands_count: memoizedCategories.length,
  }), [allProducts, newArrivalsProducts, bestSellingProducts, dealsProducts, memoizedCategories]);

  return (
    <AnimatePresence mode="wait">
    {showLoader ? (
      <LogoLoader key="loader" />
    ) : (
      <div key="content" className="block">
        <Suspense fallback={<SectionPlaceholder height="h-20" />}>
          <CategoriesMegaMenu 
            categories={memoizedCategories} 
            quickLinksData={quickLinksData}
            loading={categoriesLoading} 
          />
        </Suspense>
        
        <Suspense fallback={<HeroPlaceholder />}>
          <HeroBanner />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-96" />}>
          <CategoryGrid 
            categories={memoizedCategories} 
            productsData={allProductsResponse?.data || {}} 
            loading={categoriesLoading} 
          />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <DealsOfTheDay deals={dealsProducts} loading={dealsLoading} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <BestSellingProducts products={bestSellingProducts} loading={bestSellingLoading} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <NewArrivals products={newArrivalsProducts} loading={newArrivalsLoading} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <FeaturedCollections collections={seasonalCollections} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-60" />}>
          <TopBrands />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-40" />}>
          <PromotionBanners />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-96" />}>
          <ReviewsSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-32" />}>
          <BenefitsSection />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <RecentlyViewed products={allProducts} loading={allProductsLoading} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-48" />}>
          <NewsletterSection />
        </Suspense>
        
        <Suspense fallback={null}>
          <FloatingElements />
        </Suspense>
      </div>
    )}
  </AnimatePresence>
  );
}