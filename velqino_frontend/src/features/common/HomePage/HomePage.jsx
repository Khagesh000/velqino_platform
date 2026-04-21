import React from 'react'
import CategoriesMegaMenu from './Components/CategoriesMegaMenu'
import HeroBanner from './Components/HeroBanner'
import CategoryGrid from './Components/CategoryGrid'
import DealsOfTheDay from './Components/DealsOfTheDay'
import BestSellingProducts from './Components/BestSellingProducts'
import NewArrivals from './Components/NewArrivals'
import TopBrands from './Components/TopBrands'
import PromotionBanners from './Components/PromotionBanners'
import FeaturedCollections from './Components/FeaturedCollections'
import ReviewsSection from './Components/ReviewsSection'
import BenefitsSection from './Components/BenefitsSection'
import RecentlyViewed from './Components/RecentlyViewed'
import NewsletterSection from './Components/NewsletterSection'
import Footer from './Components/Footer'
import FloatingElements from './Components/FloatingElements'

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
