
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
  // Early return with just the date number if date is invalid
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return <>-</>;
  }
  
  const hasEvent = events.some(event => 
    event.date && isSameDay(event.date, date)
  );
  
  if (hasEvent) {
    const dayEvents = events.filter(event => 
      event.date && isSameDay(event.date, date)
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
          {eventTypes.includes("trade_show") && <span className="h-1 w-1 rounded-full bg-amber-500"></span>}
          {eventTypes.includes("speaking") && <span className="h-1 w-1 rounded-full bg-cyan-500"></span>}
        </div>
      </div>
    );
  }
  
  return <>{date.getDate()}</>;
};

export default CalendarDayContent;
