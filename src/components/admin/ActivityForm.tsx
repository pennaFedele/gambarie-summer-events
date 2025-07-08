import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useActivities, Activity } from '@/hooks/useActivities';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';

const linkSchema = z.object({
  label: z.string().min(1, 'Label è richiesta'),
  url: z.string().url('URL non valido'),
});

const activitySchema = z.object({
  title_it: z.string().min(1, 'Titolo in italiano è richiesto'),
  title_en: z.string().min(1, 'Titolo in inglese è richiesto'),
  description_it: z.string().optional(),
  description_en: z.string().optional(),
  type_it: z.string().min(1, 'Tipo in italiano è richiesto'),
  type_en: z.string().min(1, 'Tipo in inglese è richiesto'),
  info_links: z.array(linkSchema).optional(),
  maps_links: z.array(linkSchema).optional(),
  image_url: z.string().optional(),
  display_order: z.number().min(0),
  active: z.boolean(),
});

type ActivityFormData = z.infer<typeof activitySchema>;

interface ActivityFormProps {
  activity?: Activity | null;
  onClose: () => void;
}

export const ActivityForm = ({ activity, onClose }: ActivityFormProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { createActivity, updateActivity, isCreating, isUpdating } = useActivities();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title_it: '',
      title_en: '',
      description_it: '',
      description_en: '',
      type_it: '',
      type_en: '',
      info_links: [],
      maps_links: [],
      image_url: '',
      display_order: 0,
      active: true,
    },
  });

  const {
    fields: infoLinkFields,
    append: appendInfoLink,
    remove: removeInfoLink,
  } = useFieldArray({
    control,
    name: 'info_links',
  });

  const {
    fields: mapsLinkFields,
    append: appendMapsLink,
    remove: removeMapsLink,
  } = useFieldArray({
    control,
    name: 'maps_links',
  });

  useEffect(() => {
    if (activity) {
      reset({
        title_it: activity.title_it,
        title_en: activity.title_en,
        description_it: activity.description_it || '',
        description_en: activity.description_en || '',
        type_it: activity.type_it,
        type_en: activity.type_en,
        info_links: activity.info_links || [],
        maps_links: activity.maps_links || [],
        image_url: activity.image_url || '',
        display_order: activity.display_order,
        active: activity.active,
      });
    }
  }, [activity, reset]);

  const onSubmit = (data: ActivityFormData) => {
    const activityData = {
      title_it: data.title_it,
      title_en: data.title_en,
      description_it: data.description_it,
      description_en: data.description_en,
      type_it: data.type_it,
      type_en: data.type_en,
      image_url: data.image_url,
      created_by: user?.id,
      active: data.active,
      display_order: data.display_order,
      // Filter out empty links and ensure proper typing
      info_links: data.info_links?.filter(link => link.label && link.url).map(link => ({
        label: link.label,
        url: link.url
      })) as { label: string; url: string }[] || [],
      maps_links: data.maps_links?.filter(link => link.label && link.url).map(link => ({
        label: link.label,
        url: link.url
      })) as { label: string; url: string }[] || [],
    };

    if (activity) {
      updateActivity({ id: activity.id, ...activityData });
    } else {
      createActivity(activityData);
    }
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('common.back')}
        </Button>
        <h2 className="text-2xl font-bold text-foreground">
          {activity ? t('admin.editActivity') : t('admin.addActivity')}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activity ? t('admin.editActivity') : t('admin.addActivity')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title_it">{t('admin.form.titleIt')}</Label>
                <Input
                  id="title_it"
                  {...register('title_it')}
                  placeholder="Titolo in italiano"
                />
                {errors.title_it && (
                  <p className="text-sm text-destructive">{errors.title_it.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title_en">{t('admin.form.titleEn')}</Label>
                <Input
                  id="title_en"
                  {...register('title_en')}
                  placeholder="Title in English"
                />
                {errors.title_en && (
                  <p className="text-sm text-destructive">{errors.title_en.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description_it">{t('admin.form.descriptionIt')}</Label>
                <Textarea
                  id="description_it"
                  {...register('description_it')}
                  placeholder="Descrizione in italiano"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_en">{t('admin.form.descriptionEn')}</Label>
                <Textarea
                  id="description_en"
                  {...register('description_en')}
                  placeholder="Description in English"
                  rows={4}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type_it">{t('admin.form.typeIt')}</Label>
                <Input
                  id="type_it"
                  {...register('type_it')}
                  placeholder="Sport, Avventura, Natura..."
                />
                {errors.type_it && (
                  <p className="text-sm text-destructive">{errors.type_it.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type_en">{t('admin.form.typeEn')}</Label>
                <Input
                  id="type_en"
                  {...register('type_en')}
                  placeholder="Sport, Adventure, Nature..."
                />
                {errors.type_en && (
                  <p className="text-sm text-destructive">{errors.type_en.message}</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Info Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t('admin.form.infoLinks')}</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendInfoLink({ label: '', url: '' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Aggiungi Link
                </Button>
              </div>
              
              {infoLinkFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`info_links.${index}.label`}>{t('admin.form.linkLabel')}</Label>
                    <Input
                      {...register(`info_links.${index}.label`)}
                      placeholder="Info"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`info_links.${index}.url`}>{t('admin.form.linkUrl')}</Label>
                    <Input
                      {...register(`info_links.${index}.url`)}
                      placeholder="https://..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeInfoLink(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Maps Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t('admin.form.mapsLinks')}</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendMapsLink({ label: '', url: '' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Aggiungi Mappa
                </Button>
              </div>
              
              {mapsLinkFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`maps_links.${index}.label`}>{t('admin.form.linkLabel')}</Label>
                    <Input
                      {...register(`maps_links.${index}.label`)}
                      placeholder="Posizione"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`maps_links.${index}.url`}>{t('admin.form.linkUrl')}</Label>
                    <Input
                      {...register(`maps_links.${index}.url`)}
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeMapsLink(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image_url">{t('admin.form.imageUrl')}</Label>
                <Input
                  id="image_url"
                  {...register('image_url')}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_order">{t('admin.form.displayOrder')}</Label>
                <Input
                  id="display_order"
                  type="number"
                  {...register('display_order', { valueAsNumber: true })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                {...register('active')}
              />
              <Label htmlFor="active">{t('admin.form.active')}</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
              >
                {t('common.save')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('common.cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};