
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/services/eventService";
import { MapPin } from "lucide-react";
import type { CulinaryEvent } from "@/services/eventService";

interface EventCardProps {
  events: CulinaryEvent[];
  title: string;
  description?: string;
}

const EventCard: React.FC<EventCardProps> = ({ events, title, description }) => {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "festival":
        return "default";
      case "holiday":
        return "success";
      case "conference":
        return "secondary";
      case "workshop":
        return "destructive";
      case "trade_show":
        return "warning";
      case "speaking":
        return "outline";
      default:
        return "outline";
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "festival": return "Festival";
      case "holiday": return "Food Holiday";
      case "conference": return "Conference";
      case "workshop": return "Workshop";
      case "exhibition": return "Exhibition";
      case "trade_show": return "Trade Show";
      case "speaking": return "Speaking Event";
      default: return type;
    }
  };

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
        
        <div className="space-y-4">
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.id} className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge variant={getBadgeVariant(event.type)}>
                    {getEventTypeLabel(event.type)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{formatEventDate(event.date)}</p>
                <p className="text-sm">{event.description}</p>
                
                <div className="flex items-center text-xs text-muted-foreground gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{event.location}</span>
                  {event.country && event.country !== "Global" && (
                    <Badge variant="outline" className="text-xs ml-1">
                      {event.country}
                    </Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {event.ticketUrl && (
                    <Button asChild size="sm" className="mt-2">
                      <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                        Purchase Tickets
                      </a>
                    </Button>
                  )}
                  
                  {!event.ticketUrl && event.url && (
                    <Button asChild size="sm" variant="outline" className="mt-2">
                      <a href={event.url} target="_blank" rel="noopener noreferrer">
                        Event Details
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No events to display</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
