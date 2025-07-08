import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Event {
  id: string;
  title: string;
  title_en?: string;
  description: string | null;
  description_en?: string | null;
  organizer: string;
  organizer_en?: string;
  event_date: string;
  event_time: string;
  location: string;
  location_en?: string;
  category: string;
  external_link: string | null;
  image_url: string | null;
  created_at: string;
}

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useEvents = (pageSize = 20, showPast = false): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const { toast } = useToast();

  const fetchEvents = useCallback(async (isLoadMore = false) => {
    console.log('fetchEvents called:', { isLoadMore, offset, currentEventsLength: events.length });
    
    try {
      const currentOffset = isLoadMore ? offset : 0;
      console.log('Using offset:', currentOffset);
      
      // Filter by date based on showPast parameter
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let query = supabase
        .from('events')
        .select('*');
      
      if (showPast) {
        query = query.lt('event_date', today.toISOString().split('T')[0])
          .order('event_date', { ascending: false })
          .order('event_time', { ascending: false });
      } else {
        query = query.gte('event_date', today.toISOString().split('T')[0])
          .order('event_date', { ascending: true })
          .order('event_time', { ascending: true });
      }
      
      const { data, error } = await query.range(currentOffset, currentOffset + pageSize - 1);
      console.log('Query result:', { dataLength: data?.length, error });

      if (error) throw error;

      if (isLoadMore) {
        // Usa una funzione di aggiornamento per accedere al valore corrente di events
        setEvents(prev => {
          console.log('Before adding new events:', prev.length);
          const newEvents = (data || []).filter(newEvent => 
            !prev.some(existingEvent => existingEvent.id === newEvent.id)
          );
          console.log('New events to add:', newEvents.length);
          const updatedEvents = [...prev, ...newEvents];
          console.log('Total events after adding:', updatedEvents.length);
          return updatedEvents;
        });
        // Aggiorna l'offset solo se ci sono nuovi dati
        if (data && data.length > 0) {
          setOffset(currentOffset + pageSize);
        }
      } else {
        setEvents(data || []);
        setOffset(data ? pageSize : 0);
      }

      // Check if we have more data - se abbiamo meno eventi del pageSize, non ci sono più eventi
      const hasMoreData = (data || []).length === pageSize;
      console.log('Setting hasMore to:', hasMoreData);
      setHasMore(hasMoreData);
      
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare gli eventi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [pageSize, showPast, toast, offset]); // Rimosso events dalle dipendenze per evitare loop

  const loadMore = useCallback(async () => {
    console.log('loadMore called:', { hasMore, loading });
    if (!hasMore || loading) {
      console.log('Skipping loadMore:', { hasMore, loading });
      return;
    }
    setLoading(true);
    await fetchEvents(true);
  }, [hasMore, loading, fetchEvents]);

  const refresh = useCallback(async () => {
    console.log('refresh called');
    setLoading(true);
    setOffset(0);
    setHasMore(true);
    await fetchEvents(false);
  }, [fetchEvents]);

  useEffect(() => {
    console.log('Initial fetchEvents useEffect');
    fetchEvents();
  }, []); // Rimuovo fetchEvents dalle dipendenze per evitare loop infiniti

  return {
    events,
    loading,
    hasMore,
    loadMore,
    refresh,
  };
};