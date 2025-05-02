
import React, { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import NewsSection from "@/components/NewsSection";
import CalendarSection from "@/components/CalendarSection";
import ToolsSection from "@/components/ToolsSection";
import AboutContactSection from "@/components/AboutContactSection";
import Footer from "@/components/Footer";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Welcome message
    setTimeout(() => {
      toast({
        title: "Welcome to CulinaryOps",
        description: "Explore our platform for culinary innovation and professional kitchen operations.",
      });
    }, 2000);

    // Initialize intersection observers for scroll animations
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll(".hidden-element");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      if (hiddenElements) {
        hiddenElements.forEach((el) => observer.unobserve(el));
      }
    };
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <NewsSection />
        <CalendarSection />
        <ToolsSection />
        <AboutContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
