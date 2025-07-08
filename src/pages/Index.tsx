import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EventCard } from '@/components/EventCard';
import { LongEventCard } from '@/components/LongEventCard';
import { EventFilters } from '@/components/EventFilters';
import { EventTypeSelector, EventType } from '@/components/EventTypeSelector';
import { LoadMore } from '@/components/LoadMore';
import { useEvents } from '@/hooks/useEvents';
import { useLongEvents } from '@/hooks/useLongEvents';
import { useEventCount } from '@/hooks/useEventCount';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [eventType, setEventType] = useState<EventType>('regular');
  const { totalCount } = useEventCount();
  
  const { 
    events: regularEvents, 
    loading: regularLoading, 
    hasMore: regularHasMore, 
    loadMore: regularLoadMore, 
    refresh: regularRefresh 
  } = useEvents(20, false);
  
  const { 
    events: longEvents, 
    loading: longLoading, 
    hasMore: longHasMore, 
    loadMore: longLoadMore, 
    refresh: longRefresh 
  } = useLongEvents(20, false);

  const getFilteredEvents = (eventsList: any[]) => {
    return eventsList.filter(event => {
      const matchesDate = !selectedDate || 
        (eventType === 'regular' && new Date(event.event_date).toDateString() === selectedDate.toDateString()) ||
        (eventType === 'long' && (
          new Date(event.start_date) <= selectedDate && 
          new Date(event.end_date) >= selectedDate
        ));
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(event.category);

      return matchesDate && matchesCategory;
    });
  };

  const getCurrentEvents = () => {
    return eventType === 'regular' ? regularEvents : longEvents;
  };

  const getCurrentLoading = () => {
    return eventType === 'regular' ? regularLoading : longLoading;
  };

  const getCurrentHasMore = () => {
    return eventType === 'regular' ? regularHasMore : longHasMore;
  };

  const getCurrentLoadMore = () => {
    return eventType === 'regular' ? regularLoadMore : longLoadMore;
  };

  const handleClearFilters = () => {
    setSelectedDate(undefined);
    setSelectedCategories([]);
  };

  const filteredCurrentEvents = getFilteredEvents(getCurrentEvents());

  const EventCardComponent = eventType === 'regular' ? EventCard : LongEventCard;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(/hero.png)` }}
        />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 sm:px-8 md:px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            {t('events.summerEvents')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {t('events.heroSubtitle')}
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 text-lg font-semibold">
            <Calendar className="w-5 h-5" />
            <span>{totalCount} {t('events.eventsScheduled')}</span>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-6 sm:px-8 lg:px-4">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              {/* Event Type Selector */}
              <div className="flex justify-center pt-4">
                <EventTypeSelector 
                  selectedType={eventType} 
                  onTypeChange={setEventType} 
                />
              </div>
            </div>

            <EventFilters 
              selectedDate={selectedDate}
              selectedCategories={selectedCategories}
              onDateChange={setSelectedDate}
              onCategoriesChange={setSelectedCategories}
              onClearFilters={handleClearFilters}
            />

            <LoadMore
              hasMore={getCurrentHasMore()}
              loading={getCurrentLoading()}
              onLoadMore={getCurrentLoadMore()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-6">
                {filteredCurrentEvents.map((event) => (
                  <EventCardComponent
                    key={event.id}
                    event={{
                      ...event,
                      date: eventType === 'regular' ? event.event_date : event.start_date,
                      time: event.event_time
                    }}
                  />
                ))}
              </div>
            </LoadMore>
            
            {filteredCurrentEvents.length === 0 && !getCurrentLoading() && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {t('events.noEventsFound')}
                </h3>
                <p className="text-muted-foreground">
                  {t('events.modifyFilters')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
