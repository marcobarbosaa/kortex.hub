import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyKortexSection from "@/components/WhyKortexSection";
import SystemSection from "@/components/SystemSection";
import PricingSection from "@/components/PricingSection";
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
      <PricingSection />
      <AuthoritySection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;

