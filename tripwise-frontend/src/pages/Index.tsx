import React, { useEffect } from 'react';
import Header from '@/components/sections/header';
import HeroSection from '@/components/sections/hero';
import FeaturesSection from '@/components/sections/features';
import Footer from '@/components/sections/footer';
import FloatingActionButton from '@/components/sections/floating-action';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
      <FloatingActionButton />
    </div>
  );
};

export default Index;
