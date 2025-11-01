import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import WhyAVIMS from '@/components/WhyAVIMS';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <Navigation />
      <HeroSection />
      <WhyAVIMS />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}