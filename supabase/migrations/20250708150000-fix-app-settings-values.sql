-- Fix app settings values to use proper JSON format
UPDATE public.app_settings 
SET setting_value = 'true'::jsonb 
WHERE setting_key = 'app_public_visible';

UPDATE public.app_settings 
SET setting_value = '"Stiamo lavorando per Voi. App in aggiornamento"'::jsonb 
WHERE setting_key = 'maintenance_message';

UPDATE public.app_settings 
SET setting_value = '"Sei admin? Accedi"'::jsonb 
WHERE setting_key = 'maintenance_admin_button_text';