import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, MapPin, ExternalLink, User, Image as ImageIcon, CalendarPlus } from "lucide-react";
import { format } from "date-fns";
import { it, enUS } from "date-fns/locale";
import { ImageModal } from "./ImageModal";
import { downloadCalendarFile, generateGoogleCalendarUrl } from "@/lib/calendarUtils";
import { useTranslation } from 'react-i18next';

interface Event {
  id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  organizer: string;
  organizer_en?: string;
  date: string;
  time: string;
  location: string;
  location_en?: string;
  category: string;
  external_link?: string;
  image_url?: string;
  cancelled?: boolean;
}

interface EventCardProps {
  event: Event;
  variant?: "current" | "past";
}

const categoryColors: Record<string, string> = {
  gastronomia: "bg-[hsl(var(--gastronomia))]",
  cultura: "bg-[hsl(var(--cultura))]",
  musica: "bg-[hsl(var(--musica))]",
  natura: "bg-[hsl(var(--natura))]",
  storia: "bg-[hsl(var(--storia))]",
  sport: "bg-[hsl(var(--sport))]",
  arte: "bg-[hsl(var(--arte))]"
};

export const EventCard = ({ event, variant = "current" }: EventCardProps) => {
  const { t, i18n } = useTranslation();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  // Get content in appropriate language
  const getLocalizedContent = () => {
    const isEnglish = i18n.language === 'en';
    return {
      title: isEnglish && event.title_en ? event.title_en : event.title,
      description: isEnglish && event.description_en ? event.description_en : event.description,
      organizer: isEnglish && event.organizer_en ? event.organizer_en : event.organizer,
      location: isEnglish && event.location_en ? event.location_en : event.location,
    };
  };

  const localizedContent = getLocalizedContent();
  const dateLocale = i18n.language === 'en' ? enUS : it;
  
  const getThumbnailUrl = (imageUrl: string | undefined) => {
    if (!imageUrl) return null;
    
    try {
      const imageData = JSON.parse(imageUrl);
      return imageData.thumbnail || imageData.full || imageUrl;
    } catch {
      return imageUrl;
    }
  };
  
  const thumbnailUrl = getThumbnailUrl(event.image_url);
  const isPast = variant === "past";

  const handleAddToCalendar = () => {
    const calendarEvent = {
      title: localizedContent.title,
      description: localizedContent.description,
      location: localizedContent.location,
      startDate: event.date,
      time: event.time,
      organizer: localizedContent.organizer
    };

    // For mobile devices, try to open Google Calendar
    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.open(generateGoogleCalendarUrl(calendarEvent), '_blank');
    } else {
      // For desktop, download ICS file
      downloadCalendarFile(calendarEvent);
    }
  };
  
  return (
    <>
      <Card className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
        variant === "past" ? "opacity-75" : ""
      } ${event.cancelled ? "border-red-500 border-2" : ""}`}>
        {event.cancelled && (
          <div className="bg-red-500 text-white text-center py-1 text-sm font-medium">
            {t('events.cancelled')}
          </div>
        )}
        {/* Event Image */}
        {thumbnailUrl && (
          <div 
            className="relative h-48 overflow-hidden cursor-pointer"
            onClick={() => setIsImageModalOpen(true)}
          >
            <img
              src={thumbnailUrl}
              alt={localizedContent.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
              {localizedContent.title}
            </CardTitle>
            <Badge 
              className={`${categoryColors[event.category] || 'bg-muted'} text-card shrink-0`}
            >
              {t(`admin.categories.${event.category}`, event.category)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span>{format(new Date(event.date), "dd MMM yyyy", { locale: dateLocale })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{event.time.substring(0, 5)}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {localizedContent.description}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{localizedContent.organizer}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{localizedContent.location}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {event.external_link && (
              <Button 
                variant="outline" 
                size="sm" 
                asChild
                className="flex-1"
              >
                <a 
                  href={event.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('events.learnMore')}
                </a>
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddToCalendar}
              className={`${event.external_link ? '' : 'w-full'} flex items-center gap-2`}
              title={t('events.addToCalendar')}
            >
              <CalendarPlus className="w-4 h-4" />
              {!event.external_link && t('events.addToCalendar')}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={event.image_url}
        title={localizedContent.title}
      />
    </>
  );
};
