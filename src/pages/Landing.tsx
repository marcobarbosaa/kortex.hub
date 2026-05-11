import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyKortexSection from "@/components/WhyKortexSection";
import SystemSection from "@/components/SystemSection";
import TechStackSection from "@/components/TechStackSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ConsultancySection from "@/components/ConsultancySection";
import AuthoritySection from "@/components/AuthoritySection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background animate-page-fade">
      <Navbar />
      <HeroSection />
      <WhyKortexSection />
      <SystemSection />
      <TechStackSection />
      <TestimonialsSection />
      <ConsultancySection />
      <AuthoritySection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
