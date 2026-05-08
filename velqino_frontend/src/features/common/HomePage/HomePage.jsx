'use client';

import React, { useState, useMemo, lazy, Suspense, useEffect } from 'react';
import { useGetProductsQuery } from '@/redux/wholesaler/slices/productsSlice';
import { useGetCategoriesQuery } from '@/redux/wholesaler/slices/categoriesSlice';
import { useGetWholesalerStatsQuery } from '@/redux/wholesaler/slices/statsSlice';

// Lazy load components (only load when visible)
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
  const [shouldFetch, setShouldFetch] = useState(false);
  
  // Use Intersection Observer to load data only when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    const sentinel = document.getElementById('homepage-sentinel');
    if (sentinel) observer.observe(sentinel);
    
    return () => observer.disconnect();
  }, []);
  
  // Fetch products with different params for different sections
  const { data: allProductsData, isLoading: productsLoading } = useGetProductsQuery(
    { page: 1, per_page: 20 },
    { skip: !shouldFetch }
  );
  
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery(
    undefined,
    { skip: !shouldFetch }
  );

  const { data: statsData } = useGetWholesalerStatsQuery(undefined, { skip: !shouldFetch });

  
  // Memoize filtered data from the same products endpoint
  const memoizedProducts = useMemo(() => allProductsData?.products || [], [allProductsData]);
  
  // Filter deals (products with discount > 0)
  const memoizedDeals = useMemo(() => 
    memoizedProducts.filter(product => product.discount_percentage > 0 || product.sale_price),
    [memoizedProducts]
  );
  
  // Filter best selling (sort by sold count)
  const memoizedBestSelling = useMemo(() => 
    [...memoizedProducts].sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0)).slice(0, 8),
    [memoizedProducts]
  );
  
  // Filter new arrivals (sort by created date)
  const memoizedNewArrivals = useMemo(() => 
    [...memoizedProducts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8),
    [memoizedProducts]
  );
  
  const memoizedCategories = useMemo(() => categoriesData?.categories || categoriesData || [], [categoriesData]);
  
  // Check if any data is still loading for initial render
  const isInitialLoading = !shouldFetch || productsLoading;
  

  const quickLinksData = useMemo(() => ({
  trending_count: statsData?.trending_products_count || statsData?.trending_count || 0,
  new_arrivals_count: statsData?.new_arrivals_count || 0,
  best_sellers_count: statsData?.best_sellers_count || 0,
  deals_count: statsData?.deals_count || statsData?.active_deals_count || 0,
  brands_count: statsData?.brands_count || 0,
}), [statsData]);


  return (
    <div>
      {/* Sentinel to trigger data fetching when homepage is visible */}
      <div id="homepage-sentinel" style={{ position: 'absolute', top: 0, height: '1px' }} />
      
      {/* CategoriesMegaMenu - Load immediately (no lazy for above fold) */}
      <Suspense fallback={<SectionPlaceholder height="h-20" />}>
        <CategoriesMegaMenu 
            categories={memoizedCategories} 
            quickLinksData={quickLinksData}
            loading={categoriesLoading} 
          />
      </Suspense>
      
      {/* HeroBanner - Load immediately */}
      <Suspense fallback={<HeroPlaceholder />}>
        <HeroBanner />
      </Suspense>
      
      {/* CategoryGrid - Load with data */}
      <Suspense fallback={<SectionPlaceholder height="h-96" />}>
       <CategoryGrid 
          categories={memoizedCategories} 
          productsData={allProductsData}  // ← Add this
          loading={categoriesLoading} 
        />
      </Suspense>
      
      {/* DealsOfTheDay - Load with filtered deals */}
      <Suspense fallback={<SectionPlaceholder height="h-80" />}>
        <DealsOfTheDay deals={memoizedDeals} loading={isInitialLoading} />
      </Suspense>
      
      {/* BestSellingProducts - Load with sorted products */}
      <Suspense fallback={<SectionPlaceholder height="h-80" />}>
        <BestSellingProducts products={memoizedBestSelling} loading={isInitialLoading} />
      </Suspense>
      
      {/* NewArrivals - Load with sorted products */}
      <Suspense fallback={<SectionPlaceholder height="h-80" />}>
        <NewArrivals products={memoizedNewArrivals} loading={isInitialLoading} />
      </Suspense>
      
      {/* Static components below fold - lazy load with delay */}
      <Suspense fallback={<SectionPlaceholder height="h-60" />}>
        <TopBrands />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder height="h-40" />}>
        <PromotionBanners />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder height="h-80" />}>
        <FeaturedCollections products={memoizedProducts} />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder height="h-96" />}>
        <ReviewsSection />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder height="h-32" />}>
        <BenefitsSection />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder height="h-80" />}>
        <RecentlyViewed />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder height="h-48" />}>
        <NewsletterSection />
      </Suspense>
      
      <Suspense fallback={null}>
        <FloatingElements />
      </Suspense>
    </div>
  );
}