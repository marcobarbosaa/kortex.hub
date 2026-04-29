import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PublicPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const PublicPageLayout = ({ title, description, children }: PublicPageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 pt-32 pb-16">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">{title}</h1>
            <p className="text-lg text-muted-foreground">{description}</p>
          </div>
          <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-kortex-orange">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicPageLayout;
