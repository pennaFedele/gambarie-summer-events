import { useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ActivityForm } from './ActivityForm';
import { useActivities, Activity } from '@/hooks/useActivities';
import { useTranslation } from 'react-i18next';

export const ActivitiesList = () => {
  const { t } = useTranslation();
  const { activities, isLoading, deleteActivity, isDeleting } = useActivities();
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteActivity(id);
    setDeleteId(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingActivity(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Sport':
        return 'bg-blue-100 text-blue-800';
      case 'Avventura':
      case 'Adventure':
        return 'bg-green-100 text-green-800';
      case 'Natura':
      case 'Nature':
        return 'bg-emerald-100 text-emerald-800';
      case 'Famiglia':
      case 'Family':
        return 'bg-orange-100 text-orange-800';
      case 'Benessere':
      case 'Wellness':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <ActivityForm
        activity={editingActivity}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">{t('admin.activities')}</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.addActivity')}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">{t('common.loading')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{activity.title_it}</CardTitle>
                    <Badge className={getTypeColor(activity.type_it)}>
                      {activity.type_it}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(activity)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(activity.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {activity.description_it}
                  </p>
                  {activity.title_en && (
                    <p className="text-sm text-muted-foreground italic">
                      EN: {activity.title_en}
                    </p>
                  )}
                </div>
                
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
                          <ExternalLink className="w-3 h-3 mr-1" />
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
                          <Map className="w-3 h-3 mr-1" />
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
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.deleteActivity')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={isDeleting}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};