import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function AppSettingsTab() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { settings, getSetting, updateSetting, isUpdating } = useAppSettings();
  
  const [localSettings, setLocalSettings] = useState({
    app_public_visible: true,
    maintenance_message: 'Stiamo lavorando per Voi. App in aggiornamento',
    maintenance_admin_button_text: 'Sei admin? Accedi'
  });

  const [hasLoaded, setHasLoaded] = useState(false);

  // Update local settings when data loads for the first time
  useEffect(() => {
    if (settings && !hasLoaded) {
      const publicVisible = getSetting('app_public_visible');
      const maintenanceMsg = getSetting('maintenance_message');
      const adminButtonText = getSetting('maintenance_admin_button_text');
      
      // Parse JSON values properly
      const parseStringValue = (value: any, defaultValue: string) => {
        if (typeof value === 'string') {
          // If it's already a string, just return it (remove quotes if present)
          return value.replace(/^"|"$/g, '');
        }
        return defaultValue;
      };
      
      setLocalSettings({
        app_public_visible: publicVisible === true,
        maintenance_message: parseStringValue(maintenanceMsg, 'Stiamo lavorando per Voi. App in aggiornamento'),
        maintenance_admin_button_text: parseStringValue(adminButtonText, 'Sei admin? Accedi')
      });
      
      setHasLoaded(true);
    }
  }, [settings, hasLoaded]);

  const handleSave = async () => {
    try {
      await updateSetting({ key: 'app_public_visible', value: localSettings.app_public_visible as boolean });
      await updateSetting({ key: 'maintenance_message', value: localSettings.maintenance_message as string });
      await updateSetting({ key: 'maintenance_admin_button_text', value: localSettings.maintenance_admin_button_text as string });
      
      toast({
        title: t('admin.settings.success', 'Impostazioni salvate'),
        description: t('admin.settings.successDescription', 'Le impostazioni sono state aggiornate con successo.'),
      });
    } catch (error) {
      toast({
        title: t('admin.settings.error', 'Errore'),
        description: t('admin.settings.errorDescription', 'Si è verificato un errore durante il salvataggio delle impostazioni.'),
        variant: 'destructive',
      });
    }
  };

  const currentIsPublic = localSettings.app_public_visible;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {currentIsPublic ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            {t('admin.settings.visibility.title', 'Visibilità App')}
          </CardTitle>
          <CardDescription>
            {t('admin.settings.visibility.description', 'Controlla se l\'app è visibile al pubblico o in modalità manutenzione.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Public Visibility Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="public-visible" className="text-sm font-medium">
                {t('admin.settings.visibility.public', 'App Pubblica')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('admin.settings.visibility.publicDescription', 'Quando disattivato, l\'app mostra una pagina di manutenzione.')}
              </p>
            </div>
            <Switch
              id="public-visible"
              checked={localSettings.app_public_visible}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, app_public_visible: checked }))
              }
            />
          </div>

          {/* Warning when app is not public */}
          {!currentIsPublic && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                {t('admin.settings.visibility.warning', 'L\'app è attualmente in modalità manutenzione.')}
              </span>
            </div>
          )}

          {/* Maintenance Message */}
          <div className="space-y-2">
            <Label htmlFor="maintenance-message">
              {t('admin.settings.maintenance.message', 'Messaggio di Manutenzione')}
            </Label>
            <Textarea
              id="maintenance-message"
              placeholder={t('admin.settings.maintenance.messagePlaceholder', 'Inserisci il messaggio da mostrare durante la manutenzione...')}
              value={localSettings.maintenance_message}
              onChange={(e) => 
                setLocalSettings(prev => ({ ...prev, maintenance_message: e.target.value }))
              }
              className="min-h-[100px]"
            />
          </div>

          {/* Admin Button Text */}
          <div className="space-y-2">
            <Label htmlFor="admin-button-text">
              {t('admin.settings.maintenance.buttonText', 'Testo Pulsante Admin')}
            </Label>
            <Input
              id="admin-button-text"
              placeholder={t('admin.settings.maintenance.buttonTextPlaceholder', 'Testo del pulsante per accesso admin...')}
              value={localSettings.maintenance_admin_button_text}
              onChange={(e) => 
                setLocalSettings(prev => ({ ...prev, maintenance_admin_button_text: e.target.value }))
              }
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave}
              disabled={isUpdating}
              className="min-w-[120px]"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('admin.settings.saving', 'Salvataggio...')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {t('admin.settings.save', 'Salva')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}