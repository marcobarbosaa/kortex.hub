import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutPreviewSection from "@/components/AboutPreviewSection";
import SystemSection from "@/components/SystemSection";
import WhyKortexSection from "@/components/WhyKortexSection";
import ConsultancySection from "@/components/ConsultancySection";
import TechStackSection from "@/components/TechStackSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background animate-page-fade">
      {/* 1. Logo + Simple Navigation */}
      <Navbar />

      {/* 2. Hero Section + CTA */}
      <HeroSection />

      {/* 3. Key Features / Diferenciais (Por que Gabs?) */}
      <WhyKortexSection />

      {/* 4. About Section (Quem somos?) */}
      <AboutPreviewSection />

      {/* 5. Key Features / Offers (serviços) */}
      <SystemSection />

      {/* 5. Content Section (tecnologias) */}
      <TechStackSection />

      {/* 6. Lead Magnet + CTA */}
      <ConsultancySection />

      {/* CTA Final */}
      <CTASection />

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};

export default Index;
