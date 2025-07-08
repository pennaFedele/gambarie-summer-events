import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, ExternalLink, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { EventForm } from './EventForm';
import { CSVImport } from './CSVImport';
import { AdminFilters } from './AdminFilters';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { isSameDay } from 'date-fns';

interface Event {
  id: string;
  title: string;
  description: string | null;
  organizer: string;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
  external_link: string | null;
  image_url: string | null;
  created_at: string;
  cancelled: boolean;
}

export const EventsList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    date: undefined as Date | undefined,
    sortBy: "event_date",
    sortOrder: 'asc' as 'asc' | 'desc'
  });
  const { toast } = useToast();

  const categoryColors: Record<string, string> = {
    gastronomia: 'bg-[hsl(var(--gastronomia))]',
    cultura: 'bg-[hsl(var(--cultura))]',
    musica: 'bg-[hsl(var(--musica))]',
    natura: 'bg-[hsl(var(--natura))]',
    storia: 'bg-[hsl(var(--storia))]',
    sport: 'bg-[hsl(var(--sport))]',
    arte: 'bg-[hsl(var(--arte))]'
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare gli eventi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = [...events];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        event.organizer.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Date filter
    if (filters.date) {
      filtered = filtered.filter(event =>
        isSameDay(new Date(event.event_date), filters.date!)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[filters.sortBy as keyof Event];
      let bValue: any = b[filters.sortBy as keyof Event];

      if (filters.sortBy === 'event_date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [events, filters]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: 'Evento eliminato',
        description: 'L\'evento è stato eliminato con successo.',
      });

      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare l\'evento.',
        variant: 'destructive',
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setShowCSVImport(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('it-IT');
  };

  if (showForm || editingEvent || showCSVImport) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => {
            setShowForm(false);
            setShowCSVImport(false);
            setEditingEvent(null);
          }}
        >
          ← Torna alla lista
        </Button>
        {showCSVImport ? (
          <CSVImport onImportComplete={handleFormSuccess} />
        ) : (
          <EventForm
            onSuccess={handleFormSuccess}
            initialData={editingEvent || undefined}
            eventId={editingEvent?.id}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminFilters onFiltersChange={setFilters} />
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestione Eventi</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredEvents.length} {filteredEvents.length === 1 ? "evento trovato" : "eventi trovati"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuovo Evento
              </Button>
              <Button variant="outline" onClick={() => setShowCSVImport(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Importa CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        {loading ? (
          <div className="text-center py-8">Caricamento eventi...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {events.length === 0 ? "Nessun evento trovato. Crea il primo evento!" : "Nessun evento corrispondente ai filtri."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Immagine</TableHead>
                  <TableHead>Titolo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Organizzatore</TableHead>
                  <TableHead>Luogo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const getThumbnailUrl = (imageUrl: string | null) => {
                    if (!imageUrl) return null;
                    try {
                      const imageData = JSON.parse(imageUrl);
                      return imageData.thumbnail || imageData.full || imageUrl;
                    } catch {
                      return imageUrl;
                    }
                  };
                  
                  return (
                    <TableRow key={event.id}>
                      <TableCell>
                        {event.image_url ? (
                          <img
                            src={getThumbnailUrl(event.image_url) || ''}
                            alt={event.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">No img</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      <Badge className={`${categoryColors[event.category] || 'bg-muted'} text-card`}>
                        {event.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(event.event_date)}</TableCell>
                    <TableCell>{event.organizer}</TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      {event.cancelled ? (
                        <Badge variant="destructive">Annullato</Badge>
                      ) : (
                        <Badge variant="default">Attivo</Badge>
                      )}
                    </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingEvent(event)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {event.external_link && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a href={event.external_link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Elimina Evento</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Sei sicuro di voler eliminare l'evento "{event.title}"? 
                                  Questa azione non può essere annullata.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annulla</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(event.id)}>
                                  Elimina
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
};