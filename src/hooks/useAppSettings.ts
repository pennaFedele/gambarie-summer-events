import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, Json } from '@/integrations/supabase/types';

export type AppSetting = Tables<'app_settings'>;

export function useAppSettings() {
  const queryClient = useQueryClient();

  // Get all app settings
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .order('setting_key');
      
      if (error) throw error;
      return data;
    },
  });

  // Get specific setting value
  const getSetting = (key: string) => {
    const setting = settings?.find(s => s.setting_key === key);
    return setting?.setting_value;
  };

  // Update setting mutation (admin only)
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: Json }) => {
      const { error } = await supabase.rpc('update_app_setting', {
        setting_key_param: key,
        setting_value_param: value
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
    },
  });

  return {
    settings,
    isLoading,
    error,
    getSetting,
    updateSetting: updateSettingMutation.mutate,
    isUpdating: updateSettingMutation.isPending,
  };
}

// Hook for checking if app is public
export function useAppPublicStatus() {
  const { getSetting, isLoading } = useAppSettings();
  
  const isPublic = getSetting('app_public_visible') === true;
  const maintenanceMessage = getSetting('maintenance_message') || 'Stiamo lavorando per Voi. App in aggiornamento';
  const adminButtonText = getSetting('maintenance_admin_button_text') || 'Sei admin? Accedi';

  return {
    isPublic,
    maintenanceMessage,
    adminButtonText,
    isLoading,
  };
}