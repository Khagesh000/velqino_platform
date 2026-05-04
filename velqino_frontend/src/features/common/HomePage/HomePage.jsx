import React from 'react'
import CategoriesMegaMenu from './components/CategoriesMegaMenu'
import HeroBanner from './components/HeroBanner'
import CategoryGrid from './components/CategoryGrid'
import DealsOfTheDay from './components/DealsOfTheDay'
import BestSellingProducts from './components/BestSellingProducts'
import NewArrivals from './components/NewArrivals'
import TopBrands from './components/TopBrands'
import PromotionBanners from './components/PromotionBanners'
import FeaturedCollections from './components/FeaturedCollections'
import ReviewsSection from './components/ReviewsSection'
import BenefitsSection from './components/BenefitsSection'
import RecentlyViewed from './components/RecentlyViewed'
import NewsletterSection from './components/NewsletterSection'
import FloatingElements from './components/FloatingElements'

export default function HomePage() {
  return (
    <div>
      <CategoriesMegaMenu />
      <HeroBanner />
      <CategoryGrid />
      <DealsOfTheDay />
      <BestSellingProducts />
      <NewArrivals />
      <TopBrands />
      <PromotionBanners />
      <FeaturedCollections />
      <ReviewsSection />
      <BenefitsSection />
      <RecentlyViewed />
      <NewsletterSection />
      <FloatingElements />
    </div>
  )
}
