
import { toast } from "sonner";
import { format, parseISO, isValid } from "date-fns";

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
    // Create a unique URL to avoid caching issues
    const timestamp = new Date().getTime();
    const url = `/data/culinary_events.json?t=${timestamp}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch events: ${response.status}`);
      throw new Error(`Failed to fetch events: ${response.status}`);
    }
    
    const text = await response.text();
    
    // Check if the response is valid JSON or HTML
    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      console.warn('Received HTML instead of JSON, falling back to default events');
      throw new Error('Received HTML instead of JSON');
    }
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      throw new Error('Error parsing JSON');
    }
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      console.error('Invalid JSON structure');
      throw new Error('Invalid JSON structure');
    }
    
    const events = data.data.map((event: any) => {
      let eventDate;
      try {
        eventDate = event.date ? parseISO(event.date) : new Date();
        // Validate the date is actually valid
        if (!isValid(eventDate)) {
          console.warn(`Invalid date for event ${event.title}: ${event.date}`);
          eventDate = new Date(); // Fallback to current date
        }
      } catch (error) {
        console.warn(`Error parsing date for event ${event.title}: ${event.date}`);
        eventDate = new Date(); // Fallback to current date
      }
      
      return {
        ...event,
        date: eventDate
      };
    });
    
    return events;
  } catch (error) {
    console.error("Error fetching culinary events:", error);
    toast.error("Failed to load culinary events");
    
    // Return an empty array instead of mock events
    return [];
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
    if (filters.month !== undefined && filters.month !== "All" && event.date && event.date.getMonth() !== filters.month) {
      return false;
    }
    
    return true;
  });
}

export function formatEventDate(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return "Date unavailable";
  }
  return format(date, "MMMM d, yyyy");
}
