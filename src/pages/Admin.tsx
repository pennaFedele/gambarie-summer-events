import { useState } from 'react';
import { EventsList } from '@/components/admin/EventsList';
import { LongEventsList } from '@/components/admin/LongEventsList';
import { ActivitiesList } from '@/components/admin/ActivitiesList';
import { AppSettingsTab } from '@/components/admin/AppSettingsTab';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Calendar, CalendarRange, Activity, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Admin() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('admin.backToSite')}
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">{t('admin.title')}</h1>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {t('admin.welcome')}, {user?.email}
          </div>
        </div>

        {/* Welcome Card */}
        <div className="mb-8 p-6 rounded-lg bg-card border shadow-soft">
          <h2 className="text-xl font-semibold mb-2 text-foreground">
            {t('admin.managementTitle')}
          </h2>
          <p className="text-muted-foreground">
            {t('admin.managementDescription')}
          </p>
        </div>

        {/* Events Management with Tabs */}
        <Tabs defaultValue="regular" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="regular" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('admin.events')}
            </TabsTrigger>
            <TabsTrigger value="long" className="flex items-center gap-2">
              <CalendarRange className="w-4 h-4" />
              {t('admin.longEvents')}
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {t('admin.activities')}
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {t('admin.settings', 'Impostazioni')}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="regular" className="mt-6">
            <EventsList />
          </TabsContent>
          <TabsContent value="long" className="mt-6">
            <LongEventsList />
          </TabsContent>
          <TabsContent value="activities" className="mt-6">
            <ActivitiesList />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <AppSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}