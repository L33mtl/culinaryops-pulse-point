
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

export interface CulinaryEvent {
  id: number;
  title: string;
  date: Date;
  type: "festival" | "exhibition" | "holiday" | "conference" | "workshop";
  description: string;
  location: string;
  ticketUrl?: string;
  url?: string;
}

export async function fetchCulinaryEvents(): Promise<CulinaryEvent[]> {
  try {
    // Try to fetch the JSON file, but return default events if there's any issue
    const response = await fetch("/data/culinary_events.json");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Check if the response is HTML (meaning the file doesn't exist or returns HTML)
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error('Received HTML instead of JSON');
    }
    
    const data = JSON.parse(text);
    
    return data.data.map((event: any) => ({
      ...event,
      date: event.date ? parseISO(event.date) : new Date()
    }));
  } catch (error) {
    console.error("Error fetching culinary events:", error);
    toast.error("Failed to load culinary events");
    
    // Return default events if fetching fails
    return getDefaultEvents();
  }
}

function getDefaultEvents(): CulinaryEvent[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  return [
    {
      id: 1,
      title: "World Pastry Day",
      date: new Date(year, month, 10),
      type: "holiday",
      description: "Celebrated internationally, World Pastry Day honors pastry chefs and their culinary creativity.",
      location: "Global",
    },
    {
      id: 2,
      title: "Montreal Food Festival",
      date: new Date(year, month, 15),
      type: "festival",
      description: "Experience the diverse culinary scene of Montreal with chef demonstrations, tastings, and cultural performances.",
      location: "Montreal, QC, Canada",
      ticketUrl: "https://www.mtlfoodfestival.com/tickets"
    },
    {
      id: 3,
      title: "Chocolate Innovation Expo",
      date: new Date(year, month, 22),
      type: "exhibition",
      description: "Discover the latest innovations in chocolate making, from bean to bar, with some of the world's top chocolatiers.",
      location: "Montreal Convention Center",
      ticketUrl: "https://www.chocolateinnovationexpo.com"
    },
    {
      id: 4,
      title: "International Coffee Day",
      date: new Date(year, month + 1, 1),
      type: "holiday",
      description: "Celebrating coffee and recognizing the millions of people who work to create and serve the beverage worldwide.",
      location: "Global"
    },
    {
      id: 5,
      title: "Sustainable Seafood Summit",
      date: new Date(year, month + 1, 12),
      type: "exhibition",
      description: "Industry leaders discuss sustainable fishing practices and innovations in aquaculture.",
      location: "Maritime Museum, Montreal",
      ticketUrl: "https://www.seafoodsummit.org/tickets"
    }
  ];
}

export function formatEventDate(date: Date): string {
  return format(date, "MMMM d, yyyy");
}
