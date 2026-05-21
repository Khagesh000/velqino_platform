'use client';

import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
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

  // ✅ SINGLE API CALL - REPLACES ALL 8 CALLS
  const { 
    data: homepageResponse, 
    isLoading: homepageLoading 
  } = useGetHomepageDataQuery(undefined, {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
    pollingInterval: 300000, // Poll every 5 minutes (optional)
  });

  // Extract data - YOUR EXACT SAME PROPS STRUCTURE
  const bestSellingProducts = useMemo(
      () => homepageResponse?.data?.bestSelling || [], 
      [homepageResponse]
  );


  const newArrivalsProducts = useMemo(
    () => homepageResponse?.data?.newArrivalsProducts || homepageResponse?.data?.newArrivals || [], 
    [homepageResponse]
);
  
  const dealsProducts = useMemo(
      () => homepageResponse?.data?.dealsOfDay || [], 
      [homepageResponse]
  );
  
  const summerProducts = useMemo(
    () => homepageResponse?.data?.seasonalCollections?.summer || [], 
    [homepageResponse]
);
  
  const winterProducts = useMemo(
    () => homepageResponse?.data?.seasonalCollections?.winter || [], 
    [homepageResponse]
);
  
  const festiveProducts = useMemo(
    () => homepageResponse?.data?.seasonalCollections?.festive || [], 
    [homepageResponse]
);
  
  const memoizedCategories = useMemo(
    () => homepageResponse?.data?.categories || [], 
    [homepageResponse]
  );
  
  // For RecentlyViewed component - Using deals products instead of allProducts
  const allProducts = useMemo(
    () => dealsProducts, // Use whatever you want here
    [dealsProducts]
  );

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

  // Loading state - YOUR EXISTING LOGIC
  useEffect(() => {
    if (!homepageLoading && homepageResponse) {
      const timer = setTimeout(() => setShowLoader(false), 300);
      return () => clearTimeout(timer);
    }
  }, [homepageLoading, homepageResponse]);

  // Loading fallback
  if (homepageLoading || showLoader) {
    return <LogoLoader />;
  }

  // YOUR EXISTING JSX - NO CHANGES NEEDED
  return (
    <AnimatePresence mode="wait">
      <div key="content" className="block">
        <Suspense fallback={<SectionPlaceholder height="h-20" />}>
          <CategoriesMegaMenu 
            categories={memoizedCategories} 
            quickLinksData={quickLinksData}
            loading={homepageLoading} 
          />
        </Suspense>
        
        <Suspense fallback={<HeroPlaceholder />}>
          <HeroBanner />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-96" />}>
          <CategoryGrid 
            categories={memoizedCategories} 
            productsData={homepageResponse?.data || {}} 
            loading={homepageLoading} 
          />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <DealsOfTheDay deals={dealsProducts} loading={homepageLoading} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <BestSellingProducts products={bestSellingProducts} loading={homepageLoading} />
        </Suspense>
        
        <Suspense fallback={<SectionPlaceholder height="h-80" />}>
          <NewArrivals products={newArrivalsProducts} loading={homepageLoading} />
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
          <RecentlyViewed products={allProducts} loading={homepageLoading} />
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