import { Calendar, Clock, MapPin, User, ExternalLink, Eye, CalendarPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ImageModal } from './ImageModal';
import { format } from 'date-fns';
import { it, enUS } from 'date-fns/locale';
import { downloadCalendarFile, generateGoogleCalendarUrl } from '@/lib/calendarUtils';
import { useTranslation } from 'react-i18next';

interface LongEvent {
  id: string;
  title: string;
  title_en?: string;
  description: string | null;
  description_en?: string | null;
  organizer: string;
  organizer_en?: string;
  start_date: string;
  end_date: string;
  event_time: string;
  location: string;
  location_en?: string;
  category: string;
  external_link: string | null;
  image_url: string | null;
  cancelled?: boolean;
}

interface LongEventCardProps {
  event: LongEvent;
}

const getImageUrl = (imageUrl: string | null, type: 'thumbnail' | 'full' = 'thumbnail') => {
  if (!imageUrl) return null;
  
  try {
    const imageData = JSON.parse(imageUrl);
    return imageData[type] || imageData.full || imageUrl;
  } catch {
    return imageUrl;
  }
};

const categoryColors: Record<string, string> = {
  gastronomia: "bg-[hsl(var(--gastronomia))]",
  cultura: "bg-[hsl(var(--cultura))]",
  musica: "bg-[hsl(var(--musica))]",
  natura: "bg-[hsl(var(--natura))]",
  storia: "bg-[hsl(var(--storia))]",
  sport: "bg-[hsl(var(--sport))]",
  arte: "bg-[hsl(var(--arte))]"
};

const getCategoryLabel = (category: string, t: any) => {
  return t(`admin.categories.${category}`, category);
};

export const LongEventCard = ({ event }: LongEventCardProps) => {
  const { t, i18n } = useTranslation();
  const [showImageModal, setShowImageModal] = useState(false);

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
  
  const formatEventTime = (timeString: string) => {
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  const formatDateRange = () => {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    if (event.start_date === event.end_date) {
      return format(startDate, 'EEEE d MMMM yyyy', { locale: dateLocale });
    }
    
    return `${format(startDate, 'd MMM', { locale: dateLocale })} - ${format(endDate, 'd MMM yyyy', { locale: dateLocale })}`;
  };

  const handleAddToCalendar = () => {
    const calendarEvent = {
      title: localizedContent.title,
      description: localizedContent.description,
      location: localizedContent.location,
      startDate: event.start_date,
      endDate: event.end_date,
      time: event.event_time,
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

  const thumbnailUrl = getImageUrl(event.image_url, 'thumbnail');
  const fullImageUrl = getImageUrl(event.image_url, 'full');

  return (
    <>
      <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/50 ${
        event.cancelled ? "border-red-500 border-2" : ""
      }`}>
        {event.cancelled && (
          <div className="bg-red-500 text-white text-center py-1 text-sm font-medium">
            {t('events.cancelled')}
          </div>
        )}
        {thumbnailUrl && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={thumbnailUrl}
              alt={localizedContent.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 bg-white/90 hover:bg-white"
              onClick={() => setShowImageModal(true)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 flex-1">
              {localizedContent.title}
            </h3>
            <Badge 
              className={`${categoryColors[event.category] || 'bg-muted'} text-card shrink-0`}
            >
              {getCategoryLabel(event.category, t)}
            </Badge>
          </div>
          
          {localizedContent.description && (
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {localizedContent.description}
            </p>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="font-medium">{formatDateRange()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <Clock className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{t('events.at')} {formatEventTime(event.event_time)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">{localizedContent.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="truncate">{localizedContent.organizer}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            {event.external_link && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 group hover:bg-primary hover:text-white transition-colors"
                onClick={() => window.open(event.external_link!, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="w-4 h-4 mr-2 group-hover:text-white" />
                {t('events.moreInfo')}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddToCalendar}
              className={`${event.external_link ? '' : 'w-full'} group hover:bg-primary hover:text-white transition-colors`}
              title={t('events.addToCalendar')}
            >
              <CalendarPlus className="w-4 h-4 mr-2 group-hover:text-white" />
              {!event.external_link && t('events.addToCalendar')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showImageModal && fullImageUrl && (
        <ImageModal
          isOpen={showImageModal}
          imageUrl={fullImageUrl}
          title={localizedContent.title}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </>
  );
};
