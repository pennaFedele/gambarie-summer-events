import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";
import { LoadMore } from "@/components/LoadMore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useEvents } from "@/hooks/useEvents";
import { isSameDay } from "date-fns";

const Archive = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Modifico useEvents per eventi passati
  const { events, loading, hasMore, loadMore } = useEvents(20, true); // true per archivio

  const eventsToShow = useMemo(() => {
    let filteredEvents = events;

    if (selectedDate) {
      filteredEvents = filteredEvents.filter(event => 
        isSameDay(new Date(event.event_date), selectedDate)
      );
    }

    if (selectedCategories.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        selectedCategories.includes(event.category)
      );
    }

    return filteredEvents;
  }, [events, selectedDate, selectedCategories]);

  const clearFilters = () => {
    setSelectedDate(undefined);
    setSelectedCategories([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="inline-block mb-6">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Torna agli Eventi Attuali
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Archivio Eventi
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Rivivi i momenti speciali e gli eventi che hanno animato Gambarie
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <EventFilters
              selectedDate={selectedDate}
              selectedCategories={selectedCategories}
              onDateChange={setSelectedDate}
              onCategoriesChange={setSelectedCategories}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Eventi Passati
                </h2>
                <p className="text-muted-foreground">
                  {eventsToShow.length} {eventsToShow.length === 1 ? "evento trovato" : "eventi trovati"}
                </p>
              </div>
            </div>

            {eventsToShow.length > 0 ? (
              <LoadMore
                hasMore={hasMore}
                loading={loading}
                onLoadMore={loadMore}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {eventsToShow.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={{
                        ...event,
                        date: event.event_date,
                        time: event.event_time
                      }}
                      variant="past"
                    />
                  ))}
                </div>
              </LoadMore>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <CalendarIcon className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nessun evento trovato</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedDate || selectedCategories.length > 0 
                    ? "Prova a modificare i filtri per trovare eventi."
                    : "Non ci sono eventi nell'archivio al momento."
                  }
                </p>
                {(selectedDate || selectedCategories.length > 0) && (
                  <Button variant="outline" onClick={clearFilters}>
                    Pulisci filtri
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Archive;