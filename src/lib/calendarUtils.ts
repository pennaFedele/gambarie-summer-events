
import { format } from 'date-fns';

interface CalendarEvent {
  title: string;
  description?: string;
  location: string;
  startDate: string;
  endDate?: string;
  time: string;
  organizer: string;
}

export const generateCalendarFile = (event: CalendarEvent) => {
  const startDateTime = new Date(`${event.startDate}T${event.time}`);
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours duration
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Gambarie Eventi//IT',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@gambarie-eventi.com`,
    `DTSTART:${formatDate(startDateTime)}`,
    `DTEND:${formatDate(endDateTime)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description || ''} - Organizzato da: ${event.organizer}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
};

export const downloadCalendarFile = (event: CalendarEvent) => {
  const icsContent = generateCalendarFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  link.click();
  window.URL.revokeObjectURL(link.href);
};

export const generateGoogleCalendarUrl = (event: CalendarEvent) => {
  const startDateTime = new Date(`${event.startDate}T${event.time}`);
  const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
  
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}`,
    details: `${event.description || ''} - Organizzato da: ${event.organizer}`,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
