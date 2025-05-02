
#!/usr/bin/env python3
"""
CulinaryOps Event Scraper

This script scrapes culinary events, conventions, and equipment salons 
across Canada and the US from various sources.
"""

import requests
from bs4 import BeautifulSoup
import json
import os
import time
from datetime import datetime, timedelta
import re
from typing import List, Dict, Any
import random

# Event sources to scrape
SOURCES = {
    "10Times": "https://10times.com/food-beverage",
    "EventBrite": "https://www.eventbrite.com/d/united-states--canada/culinary-events/",
    "EventsEye": "https://www.eventseye.com/fairs/c1_trade-shows_food-beverage.html",
}

# User agents to rotate (to avoid being blocked)
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
]

def get_random_user_agent():
    """Return a random user agent to avoid detection."""
    return random.choice(USER_AGENTS)

def scrape_10times() -> List[Dict[str, Any]]:
    """Scrape culinary events from 10times."""
    events = []
    try:
        headers = {'User-Agent': get_random_user_agent()}
        response = requests.get(SOURCES["10Times"], headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        event_items = soup.select(".eventlist-item")
        
        for item in event_items[:20]:  # Get top 20 events
            try:
                title_element = item.select_one(".title a")
                date_element = item.select_one(".date")
                location_element = item.select_one(".location")
                link_element = title_element if title_element else None
                
                if title_element and date_element and location_element:
                    title = title_element.text.strip()
                    url = "https://10times.com" + link_element.get("href", "") if link_element.get("href", "").startswith("/") else link_element.get("href", "")
                    date_text = date_element.text.strip()
                    location = location_element.text.strip()
                    
                    # Parse date
                    try:
                        # Example format: "06 - 09 May 2025"
                        date_match = re.search(r'(\d{2})\s*-\s*(\d{2})\s*(\w+)\s*(\d{4})', date_text)
                        if date_match:
                            day_start, day_end, month, year = date_match.groups()
                            month_num = time.strptime(month, '%b').tm_mon
                            event_date = datetime(int(year), month_num, int(day_start))
                        else:
                            date_match = re.search(r'(\d{2})\s*(\w+)\s*(\d{4})', date_text)
                            if date_match:
                                day, month, year = date_match.groups()
                                month_num = time.strptime(month[:3], '%b').tm_mon
                                event_date = datetime(int(year), month_num, int(day))
                            else:
                                event_date = datetime.now() + timedelta(days=30)  # Default to 30 days from now
                    except Exception as e:
                        print(f"Error parsing date '{date_text}': {e}")
                        event_date = datetime.now() + timedelta(days=30)  # Default to 30 days from now
                    
                    # Try to extract more info by visiting the event page
                    try:
                        event_page = requests.get(url, headers={'User-Agent': get_random_user_agent()}, timeout=5)
                        if event_page.status_code == 200:
                            event_soup = BeautifulSoup(event_page.text, "html.parser")
                            ticket_element = event_soup.select_one("a.btn-tickets") or event_soup.select_one("a.register-btn")
                            ticket_url = ticket_element.get("href") if ticket_element else url
                            description_element = event_soup.select_one(".event-description") or event_soup.select_one(".about-text")
                            description = description_element.text.strip() if description_element else f"Culinary event in {location}"
                        else:
                            ticket_url = url
                            description = f"Culinary event in {location}"
                    except Exception:
                        ticket_url = url
                        description = f"Culinary event in {location}"
                    
                    # Categorize event type
                    event_type = "exhibition"
                    if "festival" in title.lower() or "fest" in title.lower():
                        event_type = "festival"
                    elif "congress" in title.lower() or "conference" in title.lower() or "summit" in title.lower():
                        event_type = "conference"
                    
                    # Only include events in US and Canada
                    country = location.split(',')[-1].strip()
                    if "USA" in country or "United States" in country or "Canada" in country:
                        events.append({
                            "title": title,
                            "date": event_date,
                            "location": location,
                            "description": description[:200] + "..." if len(description) > 200 else description,
                            "url": url,
                            "ticketUrl": ticket_url,
                            "type": event_type
                        })
            except Exception as e:
                print(f"Error parsing 10Times event: {e}")
                continue
    except Exception as e:
        print(f"Error scraping 10Times: {e}")
    
    return events

def scrape_eventbrite() -> List[Dict[str, Any]]:
    """Scrape culinary events from Eventbrite."""
    events = []
    try:
        headers = {'User-Agent': get_random_user_agent()}
        response = requests.get(SOURCES["EventBrite"], headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        event_cards = soup.select("div[data-event-card]") or soup.select("div.search-event-card-square")
        
        for card in event_cards[:15]:  # Get top 15 events
            try:
                title_element = card.select_one("h2") or card.select_one(".event-card__title")
                date_element = card.select_one("time") or card.select_one(".event-card__date")
                location_element = card.select_one("p.location") or card.select_one(".event-card__location")
                link_element = card.select_one("a") or card.select_one(".event-card__link")
                
                if title_element and link_element:
                    title = title_element.text.strip()
                    url = link_element.get("href", "")
                    date_text = date_element.text.strip() if date_element else ""
                    location = location_element.text.strip() if location_element else "North America"
                    
                    # Default to 30 days from now if we can't parse the date
                    event_date = datetime.now() + timedelta(days=30)
                    
                    # Try to extract more info by visiting the event page
                    try:
                        event_page = requests.get(url, headers={'User-Agent': get_random_user_agent()}, timeout=5)
                        if event_page.status_code == 200:
                            event_soup = BeautifulSoup(event_page.text, "html.parser")
                            ticket_url = url
                            description_element = event_soup.select_one(".event-description") or event_soup.select_one(".eds-text--left")
                            description = description_element.text.strip() if description_element else f"Culinary event: {title}"
                        else:
                            ticket_url = url
                            description = f"Culinary event: {title}"
                    except Exception:
                        ticket_url = url
                        description = f"Culinary event: {title}"
                    
                    # Categorize event type
                    event_type = "festival"
                    if "workshop" in title.lower() or "class" in title.lower() or "tasting" in title.lower():
                        event_type = "workshop"
                    elif "expo" in title.lower() or "exhibition" in title.lower() or "show" in title.lower():
                        event_type = "exhibition"
                    
                    # Only include events in US and Canada
                    if "USA" in location or "United States" in location or "Canada" in location or "US" in location:
                        events.append({
                            "title": title,
                            "date": event_date,
                            "location": location,
                            "description": description[:200] + "..." if len(description) > 200 else description,
                            "url": url,
                            "ticketUrl": ticket_url,
                            "type": event_type
                        })
            except Exception as e:
                print(f"Error parsing Eventbrite event: {e}")
                continue
    except Exception as e:
        print(f"Error scraping Eventbrite: {e}")
    
    return events

def scrape_eventseye() -> List[Dict[str, Any]]:
    """Scrape culinary events from EventsEye."""
    events = []
    try:
        headers = {'User-Agent': get_random_user_agent()}
        response = requests.get(SOURCES["EventsEye"], headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        event_rows = soup.select("table.gridFairs tr") or soup.select("tr.fairRow")
        
        # Skip header row
        for row in event_rows[1:21]:  # Get top 20 events
            try:
                columns = row.select("td")
                if len(columns) >= 4:
                    title_element = columns[0].select_one("a")
                    date_element = columns[1]
                    location_element = columns[2]
                    
                    if title_element and date_element and location_element:
                        title = title_element.text.strip()
                        url = "https://www.eventseye.com" + title_element.get("href", "") if title_element.get("href", "").startswith("/") else title_element.get("href", "")
                        date_text = date_element.text.strip()
                        location = location_element.text.strip()
                        
                        # Parse date
                        try:
                            # Example format: "06.05 - 09.05.2025"
                            date_match = re.search(r'(\d{2})\.(\d{2}).*?(\d{4})', date_text)
                            if date_match:
                                day, month, year = date_match.groups()
                                event_date = datetime(int(year), int(month), int(day))
                            else:
                                event_date = datetime.now() + timedelta(days=60)  # Default to 60 days from now
                        except Exception as e:
                            print(f"Error parsing date '{date_text}': {e}")
                            event_date = datetime.now() + timedelta(days=60)  # Default to 60 days from now
                        
                        # Try to extract more info by visiting the event page
                        try:
                            event_page = requests.get(url, headers={'User-Agent': get_random_user_agent()}, timeout=5)
                            if event_page.status_code == 200:
                                event_soup = BeautifulSoup(event_page.text, "html.parser")
                                ticket_element = event_soup.select_one("a.btnRegister") or event_soup.select_one("a.official-site")
                                ticket_url = ticket_element.get("href") if ticket_element else url
                                description_element = event_soup.select_one("div.fairDescription") or event_soup.select_one(".fair-details")
                                description = description_element.text.strip() if description_element else f"Food and beverage trade show in {location}"
                            else:
                                ticket_url = url
                                description = f"Food and beverage trade show in {location}"
                        except Exception:
                            ticket_url = url
                            description = f"Food and beverage trade show in {location}"
                        
                        # Only include events in US and Canada
                        if "USA" in location or "United States" in location or "Canada" in location:
                            events.append({
                                "title": title,
                                "date": event_date,
                                "location": location,
                                "description": description[:200] + "..." if len(description) > 200 else description,
                                "url": url,
                                "ticketUrl": ticket_url,
                                "type": "exhibition"
                            })
            except Exception as e:
                print(f"Error parsing EventsEye event: {e}")
                continue
    except Exception as e:
        print(f"Error scraping EventsEye: {e}")
    
    return events

def generate_sample_events() -> List[Dict[str, Any]]:
    """Generate sample events if scraping fails."""
    today = datetime.now()
    year = today.year
    month = today.month
    
    return [
        {
            "id": 1,
            "title": "North American Food Equipment Expo",
            "date": datetime(year, month, 15),
            "type": "exhibition",
            "description": "The largest food equipment exhibition in North America showcasing the latest innovations in commercial kitchen equipment.",
            "location": "Toronto, ON, Canada",
            "ticketUrl": "https://www.nafem.org/tickets"
        },
        {
            "id": 2,
            "title": "Culinary Masters Festival",
            "date": datetime(year, month, 22),
            "type": "festival",
            "description": "Experience top chefs from across Canada and the US competing for the Culinary Master title. Includes tastings, demonstrations, and workshops.",
            "location": "Vancouver, BC, Canada",
            "ticketUrl": "https://www.culinarymastersfest.com/tickets"
        },
        {
            "id": 3,
            "title": "International Pastry Arts Expo",
            "date": datetime(year, month + 1, 10),
            "type": "exhibition",
            "description": "Leading pastry chefs showcase techniques, equipment, and ingredients for creating world-class desserts and pastries.",
            "location": "Chicago, IL, USA",
            "ticketUrl": "https://www.pastryartsexpo.com/register"
        },
        {
            "id": 4,
            "title": "Sustainable Seafood Summit",
            "date": datetime(year, month + 1, 18),
            "type": "conference",
            "description": "Industry leaders discuss sustainable fishing practices and innovations in aquaculture, with exhibits of the latest seafood processing equipment.",
            "location": "Seattle, WA, USA",
            "ticketUrl": "https://www.seafoodsummit.org/tickets"
        },
        {
            "id": 5,
            "title": "Montreal International Food Innovation Conference",
            "date": datetime(year, month + 1, 25),
            "type": "conference",
            "description": "Discover cutting-edge technologies and innovations in the food industry, with a focus on automation and sustainability.",
            "location": "Montreal, QC, Canada",
            "ticketUrl": "https://www.mtlfoodinnovation.com/tickets"
        }
    ]

def scrape_all_sources() -> List[Dict[str, Any]]:
    """Scrape all event sources and combine results."""
    all_events = []
    
    # Scrape each source
    events_10times = scrape_10times()
    events_eventbrite = scrape_eventbrite()
    events_eventseye = scrape_eventseye()
    
    # Combine all events
    all_events.extend(events_10times)
    all_events.extend(events_eventbrite)
    all_events.extend(events_eventseye)
    
    # Use sample events if we didn't find any real ones
    if len(all_events) < 5:
        print("Not enough events found, using sample data")
        all_events.extend(generate_sample_events())
    
    # Convert dates to ISO strings for JSON serialization
    for event in all_events:
        if isinstance(event["date"], datetime):
            event["date"] = event["date"].isoformat()
    
    # Sort by date
    all_events.sort(key=lambda x: x["date"])
    
    # Add unique IDs
    for i, event in enumerate(all_events):
        event["id"] = i + 1
    
    return all_events

def save_to_json(events: List[Dict[str, Any]], output_path: str = "public/data/culinary_events.json"):
    """Save scraped events to a JSON file."""
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save data
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "data": events,
            "meta": {
                "total": len(events),
                "updated": datetime.now().isoformat()
            }
        }, f, indent=2)
    
    print(f"Saved {len(events)} events to {output_path}")

def main():
    """Main function to run the scraper."""
    print("Starting CulinaryOps Event Scraper...")
    
    start_time = time.time()
    events = scrape_all_sources()
    
    # Save results
    save_to_json(events)
    
    print(f"Scraping completed in {time.time() - start_time:.2f} seconds")
    print(f"Found {len(events)} culinary events in North America")
    print("Data saved to public/data/culinary_events.json")

if __name__ == "__main__":
    main()
