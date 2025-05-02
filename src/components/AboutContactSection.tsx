
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const AboutContactSection: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <section id="about" className="section bg-accent/5">
        <h2 className="section-title">About <span className="gradient-text">CulinaryOps</span></h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <p className="text-lg">
              CulinaryOps is a pioneering platform at the intersection of culinary arts and operational excellence. We empower restaurants, food service businesses, and culinary teams with innovative tools and insights.
            </p>
            <p>
              Founded by a team of experienced chefs and tech enthusiasts, CulinaryOps bridges the gap between traditional kitchen operations and modern technology to create more efficient, sustainable, and creative culinary environments.
            </p>
            <p>
              Our mission is to transform the culinary industry through smart technology, data-driven insights, and collaborative tools that enable food businesses to thrive in an ever-evolving landscape.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <div className="font-montserrat text-3xl font-bold text-accent">500+</div>
                <div className="text-sm text-muted-foreground">Restaurants Served</div>
              </div>
              <div className="text-center">
                <div className="font-montserrat text-3xl font-bold text-accent">12K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="font-montserrat text-3xl font-bold text-accent">98%</div>
                <div className="text-sm text-muted-foreground">Client Satisfaction</div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative">
            <div className="rounded-2xl overflow-hidden aspect-video lg:aspect-square shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Professional kitchen" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-full bg-accent/10 -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-accent/20 -z-10"></div>
          </div>
        </div>
      </section>
      
      <section id="contact" className="section">
        <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
        <p className="section-subtitle">Have questions or want to learn more? Send us a message and we'll get back to you soon.</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
          <div className="bg-card rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="How can we help you?"
                  rows={6}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
          
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">1275 Rue Saint-Antoine O, Montreal, QC H3C 5L2, Canada</p>
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-muted-foreground">hello@culinaryops.com</p>
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-muted-foreground">+1 (514) 555-7890</p>
                </div>
              </div>
            </div>
            
            {/* Embedded Map - Updated to Montreal location */}
            <div className="w-full h-64 rounded-xl overflow-hidden shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.6324256269487!2d-73.56936708444598!3d45.49748797910133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a5a66ab793f%3A0x3b92d0c50f8e6fbe!2sMontreal%2C%20QC%2C%20Canada!5e0!3m2!1sen!2sus!4v1652489930139!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy"
                title="CulinaryOps Location"
                className="filter grayscale"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutContactSection;
