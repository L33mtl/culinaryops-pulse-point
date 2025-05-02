
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  format, 
  addMonths, 
  isSameDay, 
  isValid,
  startOfMonth,
  getMonth,
  getYear
} from "date-fns";
import { fetchCulinaryEvents, type CulinaryEvent } from "@/services/eventService";
import { toast } from "sonner";
import CalendarDayContent from "./CalendarDayContent";
import EventCard from "./EventCard";
import EventTypeLegend from "./EventTypeLegend";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewingMonth, setViewingMonth] = useState<Date>(startOfMonth(new Date()));
  const [culinaryEvents, setCulinaryEvents] = useState<CulinaryEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<CulinaryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Calculate max month (4 months from now)
  const maxMonth = addMonths(startOfMonth(new Date()), 4);
  
  // Fetch culinary events
  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        const events = await fetchCulinaryEvents();
        
        // Ensure all events have valid dates
        const validEvents = events.filter(event => event.date && isValid(event.date));
        setCulinaryEvents(validEvents);
        
        // Set initial selected events
        if (selectedDate) {
          setSelectedEvents(validEvents.filter(event => 
            isSameDay(event.date, selectedDate)
          ));
        }
      } catch (error) {
        console.error("Error loading culinary events:", error);
        toast.error("Failed to load culinary events");
      } finally {
        setIsLoading(false);
      }
    };
    
    getEvents();
  }, []);
  
  // Update selected events when date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedEvents(culinaryEvents.filter(event => 
        isSameDay(event.date, selectedDate)
      ));
    } else {
      setSelectedEvents([]);
    }
  }, [selectedDate, culinaryEvents]);

  // Get events for the currently viewed month
  const getCurrentMonthEvents = () => {
    return culinaryEvents.filter(event => {
      const eventDate = event.date;
      return isValid(eventDate) && 
             getMonth(eventDate) === getMonth(viewingMonth) && 
             getYear(eventDate) === getYear(viewingMonth);
    });
  };

  // Navigation handlers
  const goToPreviousMonth = () => {
    const currentDate = new Date();
    const newMonth = addMonths(viewingMonth, -1);
    
    // Don't allow going before current month
    if (getMonth(newMonth) >= getMonth(currentDate) && 
        getYear(newMonth) >= getYear(currentDate)) {
      setViewingMonth(newMonth);
    }
  };
  
  const goToNextMonth = () => {
    const newMonth = addMonths(viewingMonth, 1);
    
    // Don't allow going past max month (4 months from now)
    if (getMonth(newMonth) <= getMonth(maxMonth) && 
        getYear(newMonth) <= getYear(maxMonth)) {
      setViewingMonth(newMonth);
    }
  };

  const safeFormat = (date: Date | undefined, formatString: string) => {
    if (!date || !isValid(date)) return "Invalid Date";
    try {
      return format(date, formatString);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  // Check if we're at the current month to disable previous button
  const isCurrentMonth = () => {
    const currentDate = new Date();
    return getMonth(viewingMonth) === getMonth(currentDate) &&
           getYear(viewingMonth) === getYear(currentDate);
  };
  
  // Check if we're at max month to disable next button
  const isMaxMonth = () => {
    return getMonth(viewingMonth) === getMonth(maxMonth) &&
           getYear(viewingMonth) === getYear(maxMonth);
  };

  return (
    <section id="calendar" className="section">
      <h2 className="section-title">
        Culinary <span className="gradient-text">Calendar</span>
      </h2>
      <p className="section-subtitle">
        Discover upcoming culinary events, food holidays, and exhibitions from across Canada and the US.
        Plan ahead with events up to 4 months in the future.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="outline" 
                onClick={goToPreviousMonth} 
                disabled={isCurrentMonth()}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <h3 className="text-xl font-medium">
                {safeFormat(viewingMonth, "MMMM yyyy")}
              </h3>
              <Button 
                variant="outline" 
                onClick={goToNextMonth} 
                disabled={isMaxMonth()}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <Card>
              <CardContent className="pt-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={viewingMonth}
                  onMonthChange={setViewingMonth}
                  className="rounded-md border shadow-sm pointer-events-auto"
                  components={{
                    DayContent: (props) => (
                      <CalendarDayContent 
                        date={props.date} 
                        displayMonth={viewingMonth} 
                        events={culinaryEvents} 
                      />
                    ),
                  }}
                />
              </CardContent>
            </Card>
            
            <EventTypeLegend />
          </div>
          
          <div>
            {selectedEvents.length > 0 ? (
              <EventCard 
                events={selectedEvents}
                title={selectedDate && isValid(selectedDate) ? safeFormat(selectedDate, "MMMM d, yyyy") : "Selected Date"}
                description={`${selectedEvents.length} event${selectedEvents.length > 1 ? 's' : ''} scheduled`}
              />
            ) : (
              <EventCard 
                events={getCurrentMonthEvents().slice(0, 3)}
                title={selectedDate && isValid(selectedDate)
                  ? `${safeFormat(selectedDate, "MMMM d, yyyy")} - No Events` 
                  : "Upcoming Events"
                }
                description={selectedDate && isValid(selectedDate)
                  ? "No events scheduled for this day" 
                  : "Select a date to see details"
                }
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default CalendarSection;
