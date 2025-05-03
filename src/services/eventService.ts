
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

export type EventType = "festival" | "exhibition" | "holiday" | "conference" | "workshop" | "trade_show" | "speaking";
export type Country = "Canada" | "US" | "Global";

export interface CulinaryEvent {
  id: number;
  title: string;
  date: Date;
  type: EventType;
  description: string;
  location: string;
  country: Country;
  ticketUrl?: string;
  url?: string;
}

export interface EventFilters {
  country?: Country | "All";
  type?: EventType | "All";
  month?: number | "All"; // 0-11 for Jan-Dec
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

export function filterEvents(events: CulinaryEvent[], filters: EventFilters): CulinaryEvent[] {
  return events.filter(event => {
    // Country filter
    if (filters.country && filters.country !== "All" && event.country !== filters.country) {
      return false;
    }
    
    // Type filter
    if (filters.type && filters.type !== "All" && event.type !== filters.type) {
      return false;
    }
    
    // Month filter
    if (filters.month !== undefined && filters.month !== "All" && event.date.getMonth() !== filters.month) {
      return false;
    }
    
    return true;
  });
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
      country: "Global",
    },
    {
      id: 2,
      title: "Montreal Food Festival",
      date: new Date(year, month, 15),
      type: "festival",
      description: "Experience the diverse culinary scene of Montreal with chef demonstrations, tastings, and cultural performances.",
      location: "Montreal, QC",
      country: "Canada",
      ticketUrl: "https://www.mtlfoodfestival.com/tickets"
    },
    {
      id: 3,
      title: "Chocolate Innovation Expo",
      date: new Date(year, month, 22),
      type: "exhibition",
      description: "Discover the latest innovations in chocolate making, from bean to bar, with some of the world's top chocolatiers.",
      location: "Montreal Convention Center",
      country: "Canada",
      ticketUrl: "https://www.chocolateinnovationexpo.com"
    },
    {
      id: 4,
      title: "International Coffee Day",
      date: new Date(year, month + 1, 1),
      type: "holiday",
      description: "Celebrating coffee and recognizing the millions of people who work to create and serve the beverage worldwide.",
      location: "Global",
      country: "Global"
    },
    {
      id: 5,
      title: "Sustainable Seafood Summit",
      date: new Date(year, month + 1, 12),
      type: "conference",
      description: "Industry leaders discuss sustainable fishing practices and innovations in aquaculture.",
      location: "Maritime Museum, Montreal",
      country: "Canada",
      ticketUrl: "https://www.seafoodsummit.org/tickets"
    },
    {
      id: 6,
      title: "American Culinary Federation Convention",
      date: new Date(year, month + 1, 18),
      type: "conference",
      description: "Annual gathering of professional chefs and culinary educators showcasing the latest in American cuisine.",
      location: "Chicago, IL",
      country: "US",
      ticketUrl: "https://www.acfchefs.org/convention"
    },
    {
      id: 7,
      title: "Craft Beer Trade Show",
      date: new Date(year, month + 2, 5),
      type: "trade_show",
      description: "Connecting craft brewers with suppliers, distributors, and technology providers to grow the industry.",
      location: "Denver, CO",
      country: "US",
      ticketUrl: "https://www.craftbeertradeshow.com"
    },
    {
      id: 8,
      title: "Farm to Table Speaker Series",
      date: new Date(year, month + 2, 14),
      type: "speaking",
      description: "Renowned chefs and food activists discuss sustainable sourcing and the farm to table movement.",
      location: "Vancouver Community College",
      country: "Canada",
      url: "https://www.farmtotableseries.org"
    },
    {
      id: 9, 
      title: "National Donut Day",
      date: new Date(year, month + 2, 22),
      type: "holiday",
      description: "A day celebrating the beloved donut with special offers from bakeries across North America.",
      location: "Nationwide",
      country: "US"
    },
    {
      id: 10,
      title: "International Food Equipment Show",
      date: new Date(year, month + 3, 8),
      type: "trade_show",
      description: "The largest exhibition of food service equipment and supplies in the Western Hemisphere.",
      location: "McCormick Place, Chicago",
      country: "US",
      ticketUrl: "https://www.thenafemshow.org/tickets"
    },
    {
      id: 11,
      title: "Restaurant Innovation Summit",
      date: new Date(year, month + 3, 17),
      type: "conference",
      description: "Bringing together restaurant leaders to explore technology and trends shaping the future of foodservice.",
      location: "Toronto, ON",
      country: "Canada",
      ticketUrl: "https://www.restaurantinnovationsummit.com"
    },
    {
      id: 12,
      title: "Artisan Bread Workshop",
      date: new Date(year, month + 3, 25),
      type: "workshop",
      description: "Hands-on workshop teaching traditional bread baking techniques with master bakers.",
      location: "San Francisco Baking Institute",
      country: "US",
      ticketUrl: "https://www.sfbi.com/workshops"
    }
  ];
}

export function formatEventDate(date: Date): string {
  return format(date, "MMMM d, yyyy");
}
