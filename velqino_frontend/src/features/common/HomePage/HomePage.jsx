'use client';

import React, { useState, useMemo, lazy, Suspense, useEffect, useCallback } from 'react';
import { useGetHomepageDataQuery } from '@/redux/wholesaler/slices/homepageSlice';
import { motion, AnimatePresence } from 'framer-motion';
import LogoLoader from '../LogoLoader';

// YOUR EXISTING LAZY IMPORTS (NO CHANGES)
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

const SectionPlaceholder = ({ height = 'h-64' }) => (
  <div className={`${height} bg-gray-100 rounded-xl animate-pulse m-4`} />
);

const HeroPlaceholder = () => (
  <div className="w-full h-[500px] bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
);

export default function HomePage() {
  const [showLoader, setShowLoader] = useState(true);
  const [cachedData, setCachedData] = useState(null);

  // ✅ SINGLE API CALL WITH CACHING
  const { 
    data: homepageResponse, 
    isLoading: homepageLoading,
    isFetching
  } = useGetHomepageDataQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    pollingInterval: 300000,
    // Cache data for 5 minutes
    keepUnusedDataFor: 300,
  });

  // Cache data to localStorage for instant load on next visit
  useEffect(() => {
    if (homepageResponse?.data) {
      setCachedData(homepageResponse.data);
      try {
        localStorage.setItem('homepage_cache', JSON.stringify({
          data: homepageResponse.data,
          timestamp: Date.now()
        }));
      } catch (e) {}
    }
  }, [homepageResponse]);

  // Load from cache immediately if available
  useEffect(() => {
    try {
      const cached = localStorage.getItem('homepage_cache');
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        // Use cache if less than 5 minutes old
        if (Date.now() - timestamp < 300000) {
          setCachedData(data);
        }
      }
    } catch (e) {}
  }, []);

  // Use cached data while fetching new data
  const displayData = homepageResponse?.data || cachedData;
  const isLoading = homepageLoading && !displayData;

  // Extract data from displayData
  const bestSellingProducts = useMemo(
    () => displayData?.bestSelling || [], 
    [displayData]
  );

  const newArrivalsProducts = useMemo(
    () => displayData?.newArrivalsProducts || displayData?.newArrivals || [], 
    [displayData]
  );
  
  const dealsProducts = useMemo(
    () => displayData?.dealsOfDay || [], 
    [displayData]
  );
  
  const summerProducts = useMemo(
    () => displayData?.seasonalCollections?.summer || [], 
    [displayData]
  );
  
  const winterProducts = useMemo(
    () => displayData?.seasonalCollections?.winter || [], 
    [displayData]
  );
  
  const festiveProducts = useMemo(
    () => displayData?.seasonalCollections?.festive || [], 
    [displayData]
  );
  
  const memoizedCategories = useMemo(
    () => displayData?.categories || [], 
    [displayData]
  );
  
  const allProducts = useMemo(() => {
  const combined = [...bestSellingProducts, ...newArrivalsProducts, ...dealsProducts];
  const unique = combined.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );
  return unique;
}, [bestSellingProducts, newArrivalsProducts, dealsProducts]);

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

  // Loading state - show only on first load
  useEffect(() => {
    if (!isLoading && displayData) {
      const timer = setTimeout(() => setShowLoader(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, displayData]);

  if (isLoading && !displayData) {
    return <LogoLoader />;
  }

  return (
    <AnimatePresence mode="wait">
      <div key="content" className="block">
        <Suspense fallback={<SectionPlaceholder height="h-20" />}>
          <CategoriesMegaMenu 
            categories={memoizedCategories} 
            quickLinksData={quickLinksData}
            loading={false} 
          />
        </Suspense>
        
        <Suspense fallback={<HeroPlaceholder />}>
          <HeroBanner />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-96" />}>
          <CategoryGrid 
            categories={memoizedCategories} 
            productsData={displayData || {}} 
            loading={false} 
          />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <DealsOfTheDay deals={dealsProducts} loading={false} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <BestSellingProducts products={bestSellingProducts} loading={false} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <NewArrivals products={newArrivalsProducts} loading={false} />
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
          <RecentlyViewed products={allProducts} loading={false} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-48" />}>
          <NewsletterSection />
        </Suspense>
        
        <Suspense fallback={null}>
          <FloatingElements />
        </Suspense>
      </div>
    </AnimatePresence>
  );
}