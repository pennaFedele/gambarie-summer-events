import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ImageUpload } from './ImageUpload';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LongEventFormData {
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  organizer: string;
  organizer_en: string;
  start_date: string;
  end_date: string;
  event_time: string;
  location: string;
  location_en: string;
  category: string;
  external_link: string;
  image_url: string;
  cancelled: boolean;
}

interface LongEventFormProps {
  onSuccess: () => void;
  initialData?: Partial<LongEventFormData & { image_url?: string; cancelled?: boolean }>;
  eventId?: string;
}

export const LongEventForm = ({ onSuccess, initialData, eventId }: LongEventFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<LongEventFormData>({
    title: initialData?.title || '',
    title_en: initialData?.title_en || '',
    description: initialData?.description || '',
    description_en: initialData?.description_en || '',
    organizer: initialData?.organizer || '',
    organizer_en: initialData?.organizer_en || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
    event_time: initialData?.event_time || '',
    location: initialData?.location || '',
    location_en: initialData?.location_en || '',
    category: initialData?.category || '',
    external_link: initialData?.external_link || '',
    image_url: initialData?.image_url || '',
    cancelled: initialData?.cancelled || false,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const categories = [
    { value: 'gastronomia', label: t('admin.categories.gastronomia') },
    { value: 'cultura', label: t('admin.categories.cultura') },
    { value: 'musica', label: t('admin.categories.musica') },
    { value: 'natura', label: t('admin.categories.natura') },
    { value: 'storia', label: t('admin.categories.storia') },
    { value: 'sport', label: t('admin.categories.sport') },
    { value: 'arte', label: t('admin.categories.arte') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate that end_date is after start_date
    if (new Date(formData.end_date) < new Date(formData.start_date)) {
      toast({
        title: t('common.error'),
        description: t('admin.form.endDateAfterStart'),
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const eventData = {
        ...formData,
        external_link: formData.external_link || null,
        description: formData.description || null,
        ...(eventId ? {} : { created_by: user?.id }),
      };

      let result;
      if (eventId) {
        result = await supabase
          .from('long_events')
          .update(eventData)
          .eq('id', eventId);
      } else {
        result = await supabase
          .from('long_events')
          .insert([eventData]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: eventId ? t('common.save') : t('common.add'),
        description: eventId ? 'Evento multi-giorno aggiornato con successo.' : 'Nuovo evento multi-giorno creato con successo.',
      });

      onSuccess();
    } catch (error) {
      console.error('Error saving long event:', error);
      toast({
        title: t('common.error'),
        description: 'Errore durante il salvataggio dell\'evento multi-giorno.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof LongEventFormData, value: string) => {
    if (field === 'cancelled') {
      setFormData(prev => ({ ...prev, [field]: value === 'true' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{eventId ? t('admin.editLongEvent') : t('admin.addLongEvent')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="italian" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="italian">Italiano</TabsTrigger>
              <TabsTrigger value="english">English</TabsTrigger>
            </TabsList>
            
            <TabsContent value="italian" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">{t('admin.form.title')} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Titolo in italiano"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="organizer">{t('admin.form.organizer')} *</Label>
                  <Input
                    id="organizer"
                    value={formData.organizer}
                    onChange={(e) => handleChange('organizer', e.target.value)}
                    placeholder="Organizzatore"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t('admin.form.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Descrizione in italiano"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="location">{t('admin.form.location')} *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Luogo"
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="english" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_en">{t('admin.form.titleEn')}</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => handleChange('title_en', e.target.value)}
                    placeholder="Title in English"
                  />
                </div>
                <div>
                  <Label htmlFor="organizer_en">{t('admin.form.organizerEn')}</Label>
                  <Input
                    id="organizer_en"
                    value={formData.organizer_en}
                    onChange={(e) => handleChange('organizer_en', e.target.value)}
                    placeholder="Organizer"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description_en">{t('admin.form.descriptionEn')}</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => handleChange('description_en', e.target.value)}
                  placeholder="Description in English"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="location_en">{t('admin.form.locationEn')}</Label>
                <Input
                  id="location_en"
                  value={formData.location_en}
                  onChange={(e) => handleChange('location_en', e.target.value)}
                  placeholder="Location"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="start_date">{t('admin.form.startDate')} *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">{t('admin.form.endDate')} *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="event_time">{t('admin.form.time')} *</Label>
              <Input
                id="event_time"
                type="time"
                value={formData.event_time}
                onChange={(e) => handleChange('event_time', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">{t('admin.form.category')} *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.form.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="external_link">{t('admin.form.externalLink')}</Label>
            <Input
              id="external_link"
              type="url"
              value={formData.external_link}
              onChange={(e) => handleChange('external_link', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <ImageUpload
            eventId={eventId}
            currentImageUrl={formData.image_url}
            onImageUploaded={(imageUrl) => handleChange('image_url', imageUrl)}
            onImageRemoved={() => handleChange('image_url', '')}
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="cancelled"
              checked={formData.cancelled}
              onCheckedChange={(checked) => handleChange('cancelled', checked.toString())}
            />
            <Label htmlFor="cancelled">{t('admin.form.cancelled')}</Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {eventId ? t('common.edit') : t('common.add')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};