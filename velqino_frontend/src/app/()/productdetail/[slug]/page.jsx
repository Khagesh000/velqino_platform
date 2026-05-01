import React from 'react'
import PageWrapper from '@/features/common/PageWrapper'
import ProductDetailPage from '@/features/common/Products/ProductDetailPage/ProductDetailPage';

export default async function page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  
  // ✅ Extract numeric ID from slug (e.g., "shirt-bulk-pack-PROD-30762242" -> 314)
  // Your actual ID is 314, not the SKU numbers
  const productId = slug?.match(/\d+$/)?.[0] || slug?.split('-').pop();
  
  console.log('🔍 Slug received:', slug);
  console.log('🔍 Extracted productId:', productId);
  
  return (
    <PageWrapper>
      <ProductDetailPage productId={productId} />
    </PageWrapper>
  )
}