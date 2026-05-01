"use client";

import { useEffect } from 'react';
import { useGetProductQuery } from '@/redux/wholesaler/slices/productsSlice';
import ProductGallery from './Components/ProductGallery';
import ProductInfo from './Components/ProductInfo';
import ProductTabs from './Components/ProductTabs';
import RelatedProducts from './Components/RelatedProducts';
import RecentlyViewed, { addToRecentlyViewed } from './Components/RecentlyViewed';

export default function ProductDetailPage({ productId }) {
  console.log('Received productId:', productId);
  
  // ✅ Fetch product by ID
  const { data, isLoading, error } = useGetProductQuery(productId);
  
  // Add to recently viewed when product loads
  useEffect(() => {
    if (data?.data) {
      addToRecentlyViewed(data.data);
    }
  }, [data]);
  
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading product...</div>;
  }
  
  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">Product not found</div>;
  }
  
  const product = data?.data;
  
  if (!product) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-primary-500">Home</a>
        <span>/</span>
        <a href="/product/productlistingpage" className="hover:text-primary-500">Products</a>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="lg:w-1/2">
          <ProductGallery product={product} />
        </div>
        <div className="lg:w-1/2">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Product Tabs */}
      <ProductTabs product={product} />

      {/* Related Products */}
      <RelatedProducts 
        currentProductId={product.id}
        categoryId={product.category_id}
        subcategoryId={product.subcategory_id}
      />

      {/* Recently Viewed */}
      <RecentlyViewed />
    </div>
  );
}