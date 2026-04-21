import PageWrapper from '@/features/common/PageWrapper';
import HomePage from '@/features/common/HomePage/HomePage';

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Home - Velqino Platform",
  description: "Find the best wholesalers and retailers near you",
};

export default function Home() {
  return (
    <PageWrapper>
      <HomePage />
    </PageWrapper>
  );
}