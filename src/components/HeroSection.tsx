
import React, { useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleParallax = () => {
      if (!heroRef.current) return;
      const scrollTop = window.scrollY;
      const backgroundLayer = heroRef.current.querySelector(".hero-background");
      const contentLayer = heroRef.current.querySelector(".hero-content");
      
      if (backgroundLayer && contentLayer) {
        const yBg = scrollTop * 0.5;
        const yContent = scrollTop * 0.1;
        
        (backgroundLayer as HTMLElement).style.transform = `translate3d(0, ${yBg}px, 0)`;
        (contentLayer as HTMLElement).style.transform = `translate3d(0, ${yContent}px, 0)`;
      }
    };

    window.addEventListener("scroll", handleParallax);
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background with parallax effect */}
      <div className="hero-background absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-background/80"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center opacity-20 dark:opacity-10"></div>
      </div>

      {/* Content with slight parallax */}
      <div className="hero-content relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold font-montserrat mb-6 tracking-tight animate-fade-in">
          Culinary
          <span className="gradient-text">Ops</span>
        </h1>
        <p className="text-xl md:text-3xl font-light mb-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Tools. Trends. Teamwork.
        </p>
        <p className="max-w-xl mx-auto text-muted-foreground mb-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          The ultimate platform for culinary innovation, professional kitchen operations, and industry collaboration.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.9s" }}>
          <Button size="lg" className="px-8">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            Learn More
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <span className="text-sm text-muted-foreground mb-2">Scroll</span>
        <ChevronDown size={20} className="text-accent" />
      </div>
    </section>
  );
};

export default HeroSection;
