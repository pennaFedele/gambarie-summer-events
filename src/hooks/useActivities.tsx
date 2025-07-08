import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Activity {
  id: string;
  title_it: string;
  title_en: string;
  description_it?: string;
  description_en?: string;
  type_it: string;
  type_en: string;
  info_links?: { label: string; url: string }[];
  maps_links?: { label: string; url: string }[];
  image_url?: string;
  active: boolean;
  display_order: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useActivities = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: activities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Activity[];
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: async (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('activities')
        .insert([activity])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Attività creata",
        description: "L'attività è stata creata con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore durante la creazione dell'attività.",
        variant: "destructive",
      });
      console.error('Error creating activity:', error);
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: async ({ id, ...activity }: Partial<Activity> & { id: string }) => {
      const { data, error } = await supabase
        .from('activities')
        .update(activity)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Attività aggiornata",
        description: "L'attività è stata aggiornata con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento dell'attività.",
        variant: "destructive",
      });
      console.error('Error updating activity:', error);
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast({
        title: "Attività eliminata",
        description: "L'attività è stata eliminata con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore durante l'eliminazione dell'attività.",
        variant: "destructive",
      });
      console.error('Error deleting activity:', error);
    },
  });

  return {
    activities,
    isLoading,
    error,
    createActivity: createActivityMutation.mutate,
    updateActivity: updateActivityMutation.mutate,
    deleteActivity: deleteActivityMutation.mutate,
    isCreating: createActivityMutation.isPending,
    isUpdating: updateActivityMutation.isPending,
    isDeleting: deleteActivityMutation.isPending,
  };
};