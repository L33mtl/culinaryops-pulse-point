
import React from 'react';

const EventTypeLegend: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
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
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-violet-500"></span>
        <span className="text-sm">Conferences</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-500"></span>
        <span className="text-sm">Workshops</span>
      </div>
    </div>
  );
};

export default EventTypeLegend;
