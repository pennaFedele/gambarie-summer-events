import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminCheck = () => {
  const [hasAnyAdmin, setHasAnyAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkForAdmins = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('id')
          .eq('role', 'admin')
          .limit(1);

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking for admins:', error);
          setHasAnyAdmin(null);
        } else {
          setHasAnyAdmin((data || []).length > 0);
        }
      } catch (error) {
        console.error('Error checking for admins:', error);
        setHasAnyAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    checkForAdmins();
  }, []);

  return { hasAnyAdmin, loading };
};