
#!/usr/bin/env python3
"""
CulinaryOps News Scraper

This script scrapes culinary news from popular food industry websites
and creates a JSON API endpoint for the frontend.

For a real implementation, this would be deployed as a serverless function
or scheduled job that updates a database or API endpoint.
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import time
from datetime import datetime
from typing import List, Dict, Any

# News sources to scrape
SOURCES = {
    "Eater": "https://www.eater.com/",
    "Food & Wine": "https://www.foodandwine.com/",
    "The Spoon": "https://thespoon.tech/"
}

def scrape_eater() -> List[Dict[str, Any]]:
    """Scrape news articles from Eater."""
    articles = []
    try:
        response = requests.get(SOURCES["Eater"], timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        featured_articles = soup.select(".c-entry-box--compact")
        
        for article in featured_articles[:5]:  # Get top 5 articles
            try:
                title_element = article.select_one(".c-entry-box--compact__title")
                link_element = title_element.find("a") if title_element else None
                image_element = article.select_one("img")
                
                if title_element and link_element:
                    title = title_element.text.strip()
                    url = link_element.get("href", "")
                    image_url = image_element.get("src", "") if image_element else ""
                    
                    # Get article snippet/excerpt (would need to visit article page for full content)
                    snippet = "Latest culinary news and trends from Eater."
                    
                    articles.append({
                        "title": title,
                        "url": url,
                        "image": image_url,
                        "source": "Eater",
                        "date": datetime.now().strftime("%B %d, %Y"),
                        "snippet": snippet
                    })
            except Exception as e:
                print(f"Error parsing Eater article: {e}")
                continue
    except Exception as e:
        print(f"Error scraping Eater: {e}")
    
    return articles

def scrape_food_and_wine() -> List[Dict[str, Any]]:
    """Scrape news articles from Food & Wine."""
    articles = []
    try:
        response = requests.get(SOURCES["Food & Wine"], timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        featured_articles = soup.select(".mntl-card")
        
        for article in featured_articles[:5]:  # Get top 5 articles
            try:
                title_element = article.select_one(".card__title")
                link_element = article.select_one("a")
                image_element = article.select_one("img")
                
                if title_element and link_element:
                    title = title_element.text.strip()
                    url = link_element.get("href", "")
                    image_url = image_element.get("data-src", "") if image_element else ""
                    
                    # Get article snippet
                    snippet = "Explore the latest in food and beverage trends from Food & Wine."
                    
                    articles.append({
                        "title": title,
                        "url": url,
                        "image": image_url or "https://images.unsplash.com/photo-1556910638-faf2909b2e62",
                        "source": "Food & Wine",
                        "date": datetime.now().strftime("%B %d, %Y"),
                        "snippet": snippet
                    })
            except Exception as e:
                print(f"Error parsing Food & Wine article: {e}")
                continue
    except Exception as e:
        print(f"Error scraping Food & Wine: {e}")
    
    return articles

def scrape_the_spoon() -> List[Dict[str, Any]]:
    """Scrape news articles from The Spoon."""
    articles = []
    try:
        response = requests.get(SOURCES["The Spoon"], timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        featured_articles = soup.select("article.post")
        
        for article in featured_articles[:5]:  # Get top 5 articles
            try:
                title_element = article.select_one(".entry-title")
                link_element = title_element.find("a") if title_element else None
                image_element = article.select_one("img")
                
                if title_element and link_element:
                    title = title_element.text.strip()
                    url = link_element.get("href", "")
                    image_url = image_element.get("src", "") if image_element else ""
                    
                    # Get article excerpt if available
                    snippet_element = article.select_one(".entry-content")
                    snippet = snippet_element.text.strip() if snippet_element else "Latest food tech news from The Spoon."
                    
                    articles.append({
                        "title": title,
                        "url": url,
                        "image": image_url or "https://images.unsplash.com/photo-1593504049359-74330189a345",
                        "source": "The Spoon",
                        "date": datetime.now().strftime("%B %d, %Y"),
                        "snippet": snippet[:150] + "..." if len(snippet) > 150 else snippet
                    })
            except Exception as e:
                print(f"Error parsing The Spoon article: {e}")
                continue
    except Exception as e:
        print(f"Error scraping The Spoon: {e}")
    
    return articles

def scrape_all_sources() -> List[Dict[str, Any]]:
    """Scrape all news sources and combine results."""
    all_articles = []
    
    # Scrape each source
    all_articles.extend(scrape_eater())
    all_articles.extend(scrape_food_and_wine())
    all_articles.extend(scrape_the_spoon())
    
    # Sort by most recent
    all_articles.sort(key=lambda x: x.get("date", ""), reverse=True)
    
    # Add unique IDs
    for i, article in enumerate(all_articles):
        article["id"] = i + 1
    
    return all_articles

def save_to_json(articles: List[Dict[str, Any]], output_path: str = "api/news.json"):
    """Save scraped articles to a JSON file."""
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save data
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "data": articles,
            "meta": {
                "total": len(articles),
                "updated": datetime.now().isoformat()
            }
        }, f, indent=2)
    
    print(f"Saved {len(articles)} articles to {output_path}")

def main():
    """Main function to run the scraper."""
    print("Starting CulinaryOps News Scraper...")
    
    start_time = time.time()
    articles = scrape_all_sources()
    
    # Save results
    save_to_json(articles)
    
    print(f"Scraping completed in {time.time() - start_time:.2f} seconds")
    print(f"Found {len(articles)} articles")

if __name__ == "__main__":
    main()
