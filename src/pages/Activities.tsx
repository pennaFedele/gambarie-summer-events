import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Map } from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { useTranslation } from 'react-i18next';

export default function Activities() {
  const { activities, isLoading } = useActivities();
  const { t, i18n } = useTranslation();
  const isItalian = i18n.language === 'it';

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Sport":
        return "bg-blue-100 text-blue-800";
      case "Avventura":
      case "Adventure":
        return "bg-green-100 text-green-800";
      case "Natura":
      case "Nature":
        return "bg-emerald-100 text-emerald-800";
      case "Famiglia":
      case "Family":
        return "bg-orange-100 text-orange-800";
      case "Benessere":
      case "Wellness":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-xl">{t('common.loading')}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('activities.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('activities.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card key={activity.id} className="h-full hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {isItalian ? activity.title_it : activity.title_en}
                    </CardTitle>
                    <Badge className={getTypeColor(isItalian ? activity.type_it : activity.type_en)}>
                      {isItalian ? activity.type_it : activity.type_en}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm text-gray-600 mt-3">
                  {isItalian ? activity.description_it : activity.description_en}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-2">
                  {activity.info_links && activity.info_links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activity.info_links.map((link, index) => (
                        <Button 
                          key={index}
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {link.label}
                        </Button>
                      ))}
                    </div>
                  )}
                  {activity.maps_links && activity.maps_links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {activity.maps_links.map((link, index) => (
                        <Button 
                          key={index}
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <Map className="w-4 h-4 mr-2" />
                          {link.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('activities.infoAndBookings')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('activities.infoText')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{t('activities.location')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}