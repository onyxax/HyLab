'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { HeroSection } from '@/features/home/components/HeroSection';
import { StatsSection } from '@/features/home/components/StatsSection';
import { BrowsePreviewSection } from '@/features/home/components/BrowsePreviewSection';
import { IntegrationSection } from '@/features/home/components/IntegrationSection';
import { CTASection } from '@/features/home/components/CTASection';

export default function Home() {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <BrowsePreviewSection />
      <IntegrationSection />
      <CTASection />
      <Footer />
    </div>
  );
}
