
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface NewsArticle {
  id: number;
  title: string;
  source: string;
  date: string;
  snippet: string;
  image: string;
  url: string;
}

interface NewsArticleProps {
  article: NewsArticle;
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
        <Button variant="link" className="p-0" asChild>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Fallback data in case the API fetch fails
const fallbackNews = [
  {
    id: 1,
    title: "Plant-Based Seafood Alternatives Gain Momentum",
    source: "Food & Wine",
    date: "May 1, 2025",
    snippet: "Companies are creating convincing plant-based seafood alternatives that mimic the taste and texture of popular seafood items.",
    image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    url: "https://www.foodandwine.com/plant-based-seafood-trends"
  },
  {
    id: 2,
    title: "AI-Driven Kitchen Management Systems Revolutionize Restaurant Operations",
    source: "The Spoon",
    date: "April 28, 2025",
    snippet: "New AI technologies are helping restaurants optimize inventory, reduce food waste, and improve operational efficiency.",
    image: "https://images.unsplash.com/photo-1581092335878-2d9ff86ca2bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    url: "https://thespoon.tech/ai-kitchen-management"
  },
  {
    id: 3,
    title: "Regenerative Agriculture Practices Transform Restaurant Supply Chains",
    source: "Eater",
    date: "April 25, 2025",
    snippet: "Top restaurants are partnering with farms practicing regenerative agriculture to create more sustainable food systems.",
    image: "https://images.unsplash.com/photo-1594231517868-453e631de8e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    url: "https://www.eater.com/sustainable-restaurant-supply-chains"
  }
];

const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Here we use a combination of the news API and web scraping
        // This would be connected to our Python backend in production
        const sources = [
          { url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.foodandwine.com%2Frss%2Fsynd%2Flatest', source: 'Food & Wine' },
          { url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.eater.com%2Frss%2Findex.xml', source: 'Eater' },
          { url: 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fthespoon.tech%2Ffeed%2F', source: 'The Spoon' }
        ];
        
        const newsArticles: NewsArticle[] = [];
        const fetchPromises = sources.map(async (source) => {
          try {
            const response = await fetch(source.url);
            const data = await response.json();
            
            if (data.status === 'ok' && data.items) {
              const articles = data.items.slice(0, 4).map((item: any, index: number) => ({
                id: `${source.source.toLowerCase().replace(/\s+/g, '-')}-${index}`,
                title: item.title,
                source: source.source,
                date: new Date(item.pubDate).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                }),
                snippet: item.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...',
                image: item.enclosure?.link || 
                       (item.content && item.content.match(/src="([^"]+)"/)?.[1]) || 
                       `https://source.unsplash.com/random/600x400/?food,${source.source}`,
                url: item.link
              }));
              newsArticles.push(...articles);
            }
          } catch (error) {
            console.error(`Error fetching from ${source.source}:`, error);
          }
        });
        
        await Promise.all(fetchPromises);
        
        if (newsArticles.length > 0) {
          // Sort by date (most recent first) and take only 3
          newsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setNews(newsArticles.slice(0, 3));
        } else {
          // If no articles were fetched, use fallback data
          setNews(fallbackNews);
          toast({
            title: "Using demo data",
            description: "Could not connect to news sources. Showing demo content.",
          });
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        toast({
          title: "Error fetching news",
          description: "Using cached data instead.",
          variant: "destructive",
        });
        setNews(fallbackNews);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Refresh news once per hour
    const refreshInterval = setInterval(fetchNews, 3600000);
    return () => clearInterval(refreshInterval);
  }, [toast]);

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
