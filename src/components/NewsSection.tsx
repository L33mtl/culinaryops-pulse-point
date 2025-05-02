
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock news data (in real implementation, would come from Python backend)
const mockNews = [
  {
    id: 1,
    title: "Plant-Based Seafood Alternatives Gain Momentum",
    source: "Food & Wine",
    date: "May 1, 2025",
    snippet: "Companies are creating convincing plant-based seafood alternatives that mimic the taste and texture of popular seafood items.",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    url: "#"
  },
  {
    id: 2,
    title: "AI-Driven Kitchen Management Systems Revolutionize Restaurant Operations",
    source: "The Spoon",
    date: "April 28, 2025",
    snippet: "New AI technologies are helping restaurants optimize inventory, reduce food waste, and improve operational efficiency.",
    image: "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    url: "#"
  },
  {
    id: 3,
    title: "Regenerative Agriculture Practices Transform Restaurant Supply Chains",
    source: "Eater",
    date: "April 25, 2025",
    snippet: "Top restaurants are partnering with farms practicing regenerative agriculture to create more sustainable food systems.",
    image: "https://images.unsplash.com/photo-1594231517868-453e631de8e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    url: "#"
  }
];

interface NewsArticleProps {
  article: {
    id: number;
    title: string;
    source: string;
    date: string;
    snippet: string;
    image: string;
    url: string;
  };
  index: number;
}

const NewsArticle: React.FC<NewsArticleProps> = ({ article, index }) => {
  return (
    <Card className="h-full overflow-hidden opacity-0 animate-fade-in-up" style={{ animationDelay: `${0.2 * index}s` }}>
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute top-0 right-0 bg-accent text-white text-xs px-2 py-1 m-2 rounded">
          {article.source}
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2">{article.title}</CardTitle>
        <CardDescription>{article.date}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{article.snippet}</p>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="p-0">
          Read More
        </Button>
      </CardFooter>
    </Card>
  );
};

const NewsSection: React.FC = () => {
  // In a real implementation, this would fetch from a Python backend API
  const [news, setNews] = useState(mockNews);
  const [loading, setLoading] = useState(false);

  return (
    <section id="news" className="section">
      <h2 className="section-title">
        What's <span className="gradient-text">Cooking</span> Globally
      </h2>
      <p className="section-subtitle">Stay updated on the latest trends, innovations, and news in the culinary world.</p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <NewsArticle key={article.id} article={article} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewsSection;
