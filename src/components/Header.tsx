
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <a href="#" className="flex items-center">
          <Logo className="h-10 w-auto" />
          <span className="ml-3 text-lg md:text-xl font-montserrat font-bold">
            CulinaryOps
          </span>
        </a>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-1">
          <a
            href="#news"
            className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors"
          >
            News
          </a>
          <a
            href="#tools"
            className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors"
          >
            Tools
          </a>
          <a
            href="#about"
            className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors"
          >
            Contact
          </a>
          <ThemeToggle />
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden space-x-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-background border-t border-border py-3">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <a
              href="#news"
              className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              News
            </a>
            <a
              href="#tools"
              className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </a>
            <a
              href="#about"
              className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#contact"
              className="px-4 py-2 text-sm font-medium hover:text-accent transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
