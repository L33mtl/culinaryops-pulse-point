
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, addMonths, isSameDay } from "date-fns";

interface CulinaryEvent {
  id: number;
  title: string;
  date: Date;
  type: "festival" | "holiday" | "exhibition";
  description: string;
  location: string;
  ticketUrl?: string;
}

const CalendarSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [nextMonth, setNextMonth] = useState<Date>(addMonths(new Date(), 1));
  const [culinaryEvents, setCulinaryEvents] = useState<CulinaryEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<CulinaryEvent[]>([]);
  const [activeTab, setActiveTab] = useState("thisMonth");

  // Sample culinary events - in a real scenario, this would come from an API
  useEffect(() => {
    // This month's events
    const today = new Date();
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();
    
    const events: CulinaryEvent[] = [
      {
        id: 1,
        title: "World Pastry Day",
        date: new Date(thisYear, thisMonth, 10),
        type: "holiday",
        description: "Celebrated internationally, World Pastry Day honors pastry chefs and their culinary creativity.",
        location: "Global",
      },
      {
        id: 2,
        title: "Montreal Food Festival",
        date: new Date(thisYear, thisMonth, 15),
        type: "festival",
        description: "Experience the diverse culinary scene of Montreal with chef demonstrations, tastings, and cultural performances.",
        location: "Montreal, QC, Canada",
        ticketUrl: "https://www.mtlfoodfestival.com/tickets"
      },
      {
        id: 3,
        title: "Chocolate Innovation Expo",
        date: new Date(thisYear, thisMonth, 22),
        type: "exhibition",
        description: "Discover the latest innovations in chocolate making, from bean to bar, with some of the world's top chocolatiers.",
        location: "Montreal Convention Center",
        ticketUrl: "https://www.chocolateinnovationexpo.com"
      },
      {
        id: 4,
        title: "International Coffee Day",
        date: new Date(thisYear, thisMonth + 1, 1),
        type: "holiday",
        description: "Celebrating coffee and recognizing the millions of people who work to create and serve the beverage worldwide.",
        location: "Global"
      },
      {
        id: 5,
        title: "Sustainable Seafood Summit",
        date: new Date(thisYear, thisMonth + 1, 12),
        type: "exhibition",
        description: "Industry leaders discuss sustainable fishing practices and innovations in aquaculture.",
        location: "Maritime Museum, Montreal",
        ticketUrl: "https://www.seafoodsummit.org/tickets"
      },
      {
        id: 6,
        title: "Wine & Gastronomy Tour",
        date: new Date(thisYear, thisMonth + 1, 18),
        type: "festival",
        description: "Tour the best restaurants in Montreal with specially curated wine pairings by local sommeliers.",
        location: "Various Locations in Montreal",
        ticketUrl: "https://www.winegastronomymtl.com"
      }
    ];
    
    setCulinaryEvents(events);
    
    // Set initial selected events
    if (selectedDate) {
      setSelectedEvents(events.filter(event => isSameDay(event.date, selectedDate)));
    }
  }, []);
  
  // Update selected events when date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedEvents(culinaryEvents.filter(event => isSameDay(event.date, selectedDate)));
    } else {
      setSelectedEvents([]);
    }
  }, [selectedDate, culinaryEvents]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "nextMonth") {
      setSelectedDate(undefined); // Clear selection when switching tabs
    } else {
      setSelectedDate(undefined);
    }
  };
  
  // Function to determine if a date has events
  const dateHasEvent = (date: Date) => {
    return culinaryEvents.some(event => isSameDay(date, event.date));
  };
  
  // Custom rendering for calendar days to show event indicators
  const renderDayContent = (day: Date) => {
    const hasEvent = dateHasEvent(day);
    
    if (hasEvent) {
      const events = culinaryEvents.filter(event => isSameDay(day, event.date));
      const eventTypes = [...new Set(events.map(e => e.type))];
      
      return (
        <div className="relative h-full w-full">
          {day.getDate()}
          <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-0.5">
            {eventTypes.includes("holiday") && <span className="h-1 w-1 rounded-full bg-green-500"></span>}
            {eventTypes.includes("festival") && <span className="h-1 w-1 rounded-full bg-accent"></span>}
            {eventTypes.includes("exhibition") && <span className="h-1 w-1 rounded-full bg-blue-500"></span>}
          </div>
        </div>
      );
    }
    
    return day.getDate();
  };

  return (
    <section id="calendar" className="section">
      <h2 className="section-title">
        Culinary <span className="gradient-text">Calendar</span>
      </h2>
      <p className="section-subtitle">
        Discover upcoming culinary events, food holidays, and exhibitions from around the world.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <Tabs defaultValue="thisMonth" className="w-full" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="thisMonth">{format(currentMonth, "MMMM yyyy")}</TabsTrigger>
              <TabsTrigger value="nextMonth">{format(nextMonth, "MMMM yyyy")}</TabsTrigger>
            </TabsList>
            <TabsContent value="thisMonth" className="mt-0">
              <Card>
                <CardContent className="pt-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="rounded-md border shadow-sm pointer-events-auto"
                    components={{
                      DayContent: ({ day }) => renderDayContent(day),
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="nextMonth" className="mt-0">
              <Card>
                <CardContent className="pt-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={nextMonth}
                    onMonthChange={setNextMonth}
                    className="rounded-md border shadow-sm pointer-events-auto"
                    components={{
                      DayContent: ({ day }) => renderDayContent(day),
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="text-sm">Food Holidays</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent"></span>
              <span className="text-sm">Food Festivals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500"></span>
              <span className="text-sm">Exhibitions</span>
            </div>
          </div>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Upcoming Events"}
              </CardTitle>
              <CardDescription>
                {selectedEvents.length > 0 
                  ? `${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''} scheduled`
                  : selectedDate 
                    ? "No events scheduled for this day" 
                    : "Select a date to see details"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedDate && activeTab === "thisMonth" && (
                <div className="space-y-4">
                  {culinaryEvents
                    .filter(event => event.date.getMonth() === currentMonth.getMonth())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{format(event.date, "MMM d, yyyy")}</p>
                          </div>
                          <Badge variant={
                            event.type === "festival" ? "default" : 
                            event.type === "holiday" ? "success" : "outline"
                          }>
                            {event.type}
                          </Badge>
                        </div>
                      </div>  
                    ))
                  }
                </div>
              )}
              
              {!selectedDate && activeTab === "nextMonth" && (
                <div className="space-y-4">
                  {culinaryEvents
                    .filter(event => event.date.getMonth() === nextMonth.getMonth())
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{format(event.date, "MMM d, yyyy")}</p>
                          </div>
                          <Badge variant={
                            event.type === "festival" ? "default" : 
                            event.type === "holiday" ? "success" : "outline"
                          }>
                            {event.type}
                          </Badge>
                        </div>
                      </div>  
                    ))
                  }
                </div>
              )}
              
              {selectedEvents.length > 0 && (
                <div className="space-y-4">
                  {selectedEvents.map(event => (
                    <div key={event.id} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge variant={
                          event.type === "festival" ? "default" : 
                          event.type === "holiday" ? "success" : "outline"
                        }>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm">{event.description}</p>
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                      {event.ticketUrl && (
                        <Button asChild size="sm" className="mt-2">
                          <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
                            Purchase Tickets
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CalendarSection;
