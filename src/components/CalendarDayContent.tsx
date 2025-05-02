
import React from 'react';
import { isSameDay } from 'date-fns';
import type { CulinaryEvent } from '@/services/eventService';

interface CalendarDayContentProps {
  date: Date;
  displayMonth: Date;
  events: CulinaryEvent[];
}

const CalendarDayContent: React.FC<CalendarDayContentProps> = ({ 
  date, 
  events 
}) => {
  const hasEvent = events.some(event => 
    isSameDay(new Date(event.date), date)
  );
  
  if (hasEvent) {
    const dayEvents = events.filter(event => 
      isSameDay(new Date(event.date), date)
    );
    
    const eventTypes = [...new Set(dayEvents.map(e => e.type))];
    
    return (
      <div className="relative h-full w-full">
        {date.getDate()}
        <div className="absolute -bottom-1 left-0 right-0 flex justify-center gap-0.5">
          {eventTypes.includes("holiday") && <span className="h-1 w-1 rounded-full bg-green-500"></span>}
          {eventTypes.includes("festival") && <span className="h-1 w-1 rounded-full bg-accent"></span>}
          {eventTypes.includes("exhibition") && <span className="h-1 w-1 rounded-full bg-blue-500"></span>}
          {eventTypes.includes("conference") && <span className="h-1 w-1 rounded-full bg-violet-500"></span>}
          {eventTypes.includes("workshop") && <span className="h-1 w-1 rounded-full bg-red-500"></span>}
        </div>
      </div>
    );
  }
  
  return <>{date.getDate()}</>;
};

export default CalendarDayContent;
