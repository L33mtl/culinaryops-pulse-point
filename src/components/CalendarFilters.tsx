
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { EventFilters, EventType, Country } from '@/services/eventService';

interface CalendarFiltersProps {
  filters: EventFilters;
  setFilters: React.Dispatch<React.SetStateAction<EventFilters>>;
}

const CalendarFilters: React.FC<CalendarFiltersProps> = ({ filters, setFilters }) => {
  const months = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August", 
    "September", "October", "November", "December"
  ];
  
  const eventTypes: { value: EventType | "All"; label: string }[] = [
    { value: "All", label: "All Event Types" },
    { value: "festival", label: "Food Festivals" },
    { value: "holiday", label: "Food Holidays" },
    { value: "exhibition", label: "Exhibitions" },
    { value: "conference", label: "Conferences" },
    { value: "workshop", label: "Workshops" },
    { value: "trade_show", label: "Trade Shows" },
    { value: "speaking", label: "Speaking Events" }
  ];
  
  const countries: { value: Country | "All"; label: string }[] = [
    { value: "All", label: "All Countries" },
    { value: "Canada", label: "Canada" },
    { value: "US", label: "United States" },
    { value: "Global", label: "Global Events" }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="space-y-2">
        <Label htmlFor="country-filter">Country</Label>
        <Select
          value={filters.country?.toString() || "All"}
          onValueChange={(value) => setFilters({ ...filters, country: value as Country | "All" })}
        >
          <SelectTrigger id="country-filter" className="w-full">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.value} value={country.value.toString()}>
                {country.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type-filter">Event Type</Label>
        <Select
          value={filters.type?.toString() || "All"}
          onValueChange={(value) => setFilters({ ...filters, type: value as EventType | "All" })}
        >
          <SelectTrigger id="type-filter" className="w-full">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map((type) => (
              <SelectItem key={type.value} value={type.value.toString()}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="month-filter">Month</Label>
        <Select
          value={filters.month?.toString() || "All"}
          onValueChange={(value) => {
            const monthValue = value === "All" ? "All" : parseInt(value);
            setFilters({ ...filters, month: monthValue });
          }}
        >
          <SelectTrigger id="month-filter" className="w-full">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Months</SelectItem>
            {months.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CalendarFilters;
