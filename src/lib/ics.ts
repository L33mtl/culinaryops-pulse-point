import { addDays, format } from "date-fns";
import type { CulinaryEvent } from "@/services/eventService";

// Escape text per RFC 5545 (backslash, semicolon, comma, newline)
const escapeText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

// Build an all-day iCalendar event (source data has no end time)
export function buildEventIcs(event: CulinaryEvent): string {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const link = event.ticketUrl || event.url;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CulinaryOps//Culinary Calendar//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:culinaryops-event-${event.id}@culinaryops`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${format(event.date, "yyyyMMdd")}`,
    `DTEND;VALUE=DATE:${format(addDays(event.date, 1), "yyyyMMdd")}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    `LOCATION:${escapeText(event.location)}`,
    ...(link ? [`URL:${link}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n") + "\r\n";
}

export function downloadEventIcs(event: CulinaryEvent): void {
  const blob = new Blob([buildEventIcs(event)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
