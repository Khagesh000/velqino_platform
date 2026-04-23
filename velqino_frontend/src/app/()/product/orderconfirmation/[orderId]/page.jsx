"use client";

import { useParams } from 'next/navigation';
import PageWrapper from '@/features/common/PageWrapper';
import OrderConfirmationPage from '@/features/common/Products/OrderConfirmationPage/OrderConfirmationPage';

export default function Page() {
  const { orderId } = useParams();
  console.log('Route - orderId:', orderId);  // ✅ Add this
  
  return (
    <PageWrapper>
      <OrderConfirmationPage orderId={orderId} />
    </PageWrapper>
  );
}