import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MaintenancePageProps {
  message?: string;
  adminButtonText?: string;
}

export function MaintenancePage({ 
  message = 'Stiamo lavorando per Voi. App in aggiornamento',
  adminButtonText = 'Sei admin? Accedi'
}: MaintenancePageProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleAdminLogin = () => {
    // Preserve UTM parameters when navigating to auth
    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = Array.from(urlParams.entries())
      .filter(([key]) => key.startsWith('utm_'))
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const authPath = utmParams ? `/auth?${utmParams}` : '/auth';
    navigate(authPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Wrench className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('maintenance.title', 'Manutenzione')}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              {t('maintenance.description', 'Torneremo presto con nuove funzionalità!')}
            </p>
          </div>
          
          <div className="border-t pt-4">
            <Button 
              onClick={handleAdminLogin}
              variant="outline"
              className="w-full"
              size="sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              {adminButtonText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}