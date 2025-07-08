import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface CSVImportProps {
  onImportComplete: () => void;
}

interface CSVEvent {
  title: string;
  description: string;
  organizer: string;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
  external_link?: string;
}

export const CSVImport = ({ onImportComplete }: CSVImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: string[] } | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const downloadTemplate = () => {
    const template = `title,description,organizer,event_date,event_time,location,category,external_link
"Concerto Estivo","Concerto di musica classica","Comune di Santo Stefano","2024-07-15","21:00","Piazza Centrale","musica","https://example.com"
"Escursione Guidata","Passeggiata nei sentieri dell'Aspromonte","Pro Loco","2024-07-20","09:00","Sentiero del Drago","natura",""
"Sagra dei Prodotti Tipici","Degustazione di specialità locali","Associazione Turistica","2024-07-25","19:00","Via Roma","gastronomia",""`;
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_eventi.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCSV = (csvText: string): CSVEvent[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    return lines.slice(1).map(line => {
      const values = [];
      let currentValue = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim());
      
      const event: any = {};
      headers.forEach((header, index) => {
        event[header] = values[index] || '';
      });
      
      return event as CSVEvent;
    });
  };

  const validateEvent = (event: CSVEvent): string[] => {
    const errors: string[] = [];
    
    // Enhanced input validation with sanitization
    if (!event.title?.trim()) errors.push('Titolo mancante');
    if (!event.organizer?.trim()) errors.push('Organizzatore mancante');
    if (!event.event_date?.trim()) errors.push('Data mancante');
    if (!event.event_time?.trim()) errors.push('Ora mancante');
    if (!event.location?.trim()) errors.push('Luogo mancante');
    if (!event.category?.trim()) errors.push('Categoria mancante');
    
    // Validate string lengths to prevent abuse
    if (event.title && event.title.length > 200) {
      errors.push('Titolo troppo lungo (max 200 caratteri)');
    }
    if (event.description && event.description.length > 2000) {
      errors.push('Descrizione troppo lunga (max 2000 caratteri)');
    }
    if (event.organizer && event.organizer.length > 100) {
      errors.push('Nome organizzatore troppo lungo (max 100 caratteri)');
    }
    if (event.location && event.location.length > 200) {
      errors.push('Nome location troppo lungo (max 200 caratteri)');
    }
    
    // Sanitize and validate category
    const validCategories = ['gastronomia', 'cultura', 'musica', 'natura', 'storia', 'sport', 'arte'];
    const sanitizedCategory = event.category?.trim().toLowerCase();
    if (sanitizedCategory && !validCategories.includes(sanitizedCategory)) {
      errors.push(`Categoria non valida: ${event.category}. Valide: ${validCategories.join(', ')}`);
    }
    
    // Enhanced date validation
    if (event.event_date && !/^\d{4}-\d{2}-\d{2}$/.test(event.event_date.trim())) {
      errors.push('Formato data non valido (usa YYYY-MM-DD)');
    } else if (event.event_date) {
      const eventDate = new Date(event.event_date.trim());
      if (isNaN(eventDate.getTime())) {
        errors.push('Data non valida');
      }
    }
    
    // Enhanced time validation
    if (event.event_time && !/^\d{2}:\d{2}$/.test(event.event_time.trim())) {
      errors.push('Formato ora non valido (usa HH:MM)');
    } else if (event.event_time) {
      const [hours, minutes] = event.event_time.trim().split(':').map(Number);
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        errors.push('Ora non valida (usa formato 24h: 00:00-23:59)');
      }
    }
    
    // Validate external link if provided
    if (event.external_link && event.external_link.trim()) {
      try {
        new URL(event.external_link.trim());
      } catch {
        errors.push('Link esterno non valido (deve essere un URL completo)');
      }
    }
    
    return errors;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResults(null);
    } else {
      toast({
        title: 'Errore',
        description: 'Seleziona un file CSV valido.',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async () => {
    if (!file || !user) return;

    setImporting(true);
    setResults(null);

    try {
      const csvText = await file.text();
      const events = parseCSV(csvText);
      
      let successCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const validationErrors = validateEvent(event);
        
        if (validationErrors.length > 0) {
          errors.push(`Riga ${i + 2}: ${validationErrors.join(', ')}`);
          continue;
        }

        try {
          // Sanitize data before insertion
          const sanitizedEvent = {
            title: event.title.trim(),
            description: event.description?.trim() || null,
            organizer: event.organizer.trim(),
            event_date: event.event_date.trim(),
            event_time: event.event_time.trim(),
            location: event.location.trim(),
            category: event.category.trim().toLowerCase(),
            external_link: event.external_link?.trim() || null,
            created_by: user.id
          };

          const { error } = await supabase
            .from('events')
            .insert([sanitizedEvent]);

          if (error) {
            errors.push(`Riga ${i + 2}: ${error.message}`);
          } else {
            successCount++;
            // Log security event for audit trail
            await supabase.rpc('log_security_event', {
              p_action: 'CSV_IMPORT_EVENT_CREATED',
              p_resource_type: 'event',
              p_metadata: { event_title: sanitizedEvent.title }
            });
          }
        } catch (err) {
          errors.push(`Riga ${i + 2}: Errore di inserimento`);
        }
      }

      setResults({ success: successCount, errors });
      
      if (successCount > 0) {
        toast({
          title: 'Importazione completata',
          description: `${successCount} eventi importati con successo.`,
        });
        onImportComplete();
      }
      
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Errore durante la lettura del file CSV.',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Importazione CSV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Scarica Template
          </Button>
          <span className="text-sm text-muted-foreground">
            Scarica il template per vedere il formato richiesto
          </span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="csv-file">File CSV</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={importing}
          />
        </div>

        {file && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        )}

        <Button
          onClick={handleImport}
          disabled={!file || importing}
          className="w-full"
        >
          {importing ? (
            <>
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full"></div>
              Importazione in corso...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Importa Eventi
            </>
          )}
        </Button>

        {results && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{results.success} eventi importati con successo</span>
            </div>
            
            {results.errors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{results.errors.length} errori:</span>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {results.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-700">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};