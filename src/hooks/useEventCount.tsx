import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEventCount = (includeArchive = false) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Count regular events
        let regularQuery = supabase
          .from('events')
          .select('*', { count: 'exact', head: true });
        
        if (!includeArchive) {
          regularQuery = regularQuery.gte('event_date', today.toISOString().split('T')[0]);
        }
        
        // Count long events
        let longQuery = supabase
          .from('long_events')
          .select('*', { count: 'exact', head: true });
        
        if (!includeArchive) {
          longQuery = longQuery.gte('end_date', today.toISOString().split('T')[0]);
        }
        
        const [regularResult, longResult] = await Promise.all([
          regularQuery,
          longQuery
        ]);
        
        if (regularResult.error) throw regularResult.error;
        if (longResult.error) throw longResult.error;
        
        const totalCount = (regularResult.count || 0) + (longResult.count || 0);
        setTotalCount(totalCount);
      } catch (error) {
        console.error('Error fetching event count:', error);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, [includeArchive]);

  return { totalCount, loading };
};