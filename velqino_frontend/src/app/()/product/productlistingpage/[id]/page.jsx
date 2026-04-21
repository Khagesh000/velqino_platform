"use client";

import { useParams } from 'next/navigation';
import { useGetProductQuery } from '@/redux/wholesaler/slices/productsSlice';
import PageWrapper from '@/features/common/PageWrapper';
import ProductDetailPage from '@/features/common/Products/ProductDetailPage/ProductDetailPage';

export default function ProductDetail() {
  const { id } = useParams();
  
  const { data, isLoading, error } = useGetProductQuery(id);
  
  if (isLoading) {
    return (
      <PageWrapper>
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </PageWrapper>
    );
  }
  
  return (
    <PageWrapper>
      <ProductDetailPage productId={id} />
    </PageWrapper>
  );
}