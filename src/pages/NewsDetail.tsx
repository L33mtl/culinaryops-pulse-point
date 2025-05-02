
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// This would connect to our Python backend in a real implementation
const fetchNewsDetail = async (id: string) => {
  // Simulating API call to backend
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Fallback/mock data (would be replaced with actual API call)
  return {
    id: parseInt(id),
    title: `Article ${id} - Detailed Culinary Innovation`,
    source: "Food & Wine",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    content: "This is a detailed view of the article. In a real implementation, this would be fetched from the backend where the Python scraper has stored the full article content.",
    image: `https://images.unsplash.com/photo-${1600000000000 + parseInt(id)}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600`,
    url: "https://www.example.com/article",
    author: "Jane Doe",
    tags: ["innovation", "culinary", "technology"],
  };
};

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }
    
    const getNewsDetail = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsDetail(id);
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
        toast({
          title: "Error",
          description: "Unable to load article details.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    getNewsDetail();
  }, [id, navigate, toast]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <Button onClick={() => navigate('/')}>Return to Home</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <article className="section max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-8"
          >
            ← Back to News
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground mb-6">
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.source}</span>
            {article.author && (
              <>
                <span>•</span>
                <span>By {article.author}</span>
              </>
            )}
          </div>
          
          {article.image && (
            <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            <p>{article.content}</p>
            
            <div className="my-8">
              <Button asChild>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  Read Original Article
                </a>
              </Button>
            </div>
            
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {article.tags.map((tag: string) => (
                  <span 
                    key={tag}
                    className="bg-secondary px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetail;
