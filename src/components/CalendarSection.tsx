
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  format, 
  addMonths, 
  isSameDay, 
  isValid,
  startOfMonth,
  getMonth,
  getYear
} from "date-fns";
import { 
  fetchCulinaryEvents, 
  filterEvents,
  type CulinaryEvent, 
  type EventFilters 
} from "@/services/eventService";
import { toast } from "sonner";
import CalendarDayContent from "./CalendarDayContent";
import EventCard from "./EventCard";
import EventTypeLegend from "./EventTypeLegend";
import CalendarFilters from "./CalendarFilters";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";

const CalendarSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewingMonth, setViewingMonth] = useState<Date>(startOfMonth(new Date()));
  const [culinaryEvents, setCulinaryEvents] = useState<CulinaryEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CulinaryEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<CulinaryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilters>({
    country: "All",
    type: "All",
    month: "All"
  });
  const [showFilters, setShowFilters] = useState(false);
  
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
        setFilteredEvents(validEvents);
        
        // Set initial selected events
        if (selectedDate) {
          setSelectedEvents(validEvents.filter(event => 
            event.date && isSameDay(event.date, selectedDate)
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

  // Apply filters when filters or events change
  useEffect(() => {
    const filtered = filterEvents(culinaryEvents, filters);
    setFilteredEvents(filtered);
    
    // Update selected events if a date is selected
    if (selectedDate) {
      setSelectedEvents(filtered.filter(event => 
        isSameDay(event.date, selectedDate)
      ));
    }
  }, [filters, culinaryEvents, selectedDate]);
  
  // Update selected events when date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedEvents(filteredEvents.filter(event => 
        isSameDay(event.date, selectedDate)
      ));
    } else {
      setSelectedEvents([]);
    }
  }, [selectedDate, filteredEvents]);

  // Get events for the currently viewed month
  const getCurrentMonthEvents = () => {
    return filteredEvents.filter(event => {
      const eventDate = event.date;
      return eventDate && isValid(eventDate) && 
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
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
      
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={toggleFilters} className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      
      {showFilters && (
        <CalendarFilters filters={filters} setFilters={setFilters} />
      )}

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
                    DayContent: (props) => {
                      // Make sure we're passing a valid Date object
                      if (!props.date || !(props.date instanceof Date) || isNaN(props.date.getTime())) {
                        return <>-</>;
                      }
                      return (
                        <CalendarDayContent 
                          date={props.date} 
                          displayMonth={viewingMonth} 
                          events={filteredEvents} 
                        />
                      );
                    },
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
