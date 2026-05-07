'use client';
import PageWrapper from '@/features/common/PageWrapper';
import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('@/features/common/HomePage/HomePage'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  return (
    <PageWrapper>
      <HomePage />
    </PageWrapper>
  );
}