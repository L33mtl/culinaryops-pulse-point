
import React from "react";
import Logo from "./Logo";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">CulinaryOps</span>
            </div>
            <p className="text-muted-foreground">
              Empowering culinary excellence through innovation, insights, and collaboration.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Home</a></li>
              <li><a href="#news" className="text-muted-foreground hover:text-accent transition-colors">News</a></li>
              <li><a href="#tools" className="text-muted-foreground hover:text-accent transition-colors">Tools</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-accent transition-colors">About</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Kitchen Optimization</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Menu Development</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Staff Training</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Operational Consulting</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Supplier Network</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for the latest industry insights.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="your.email@example.com" 
                className="px-3 py-2 bg-background border border-border rounded-l-md flex-grow text-sm"
              />
              <button className="bg-accent hover:bg-accent/90 text-white px-3 py-2 rounded-r-md text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-muted-foreground">
          <div>&copy; {currentYear} CulinaryOps. All rights reserved.</div>
          <div className="space-x-4">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
