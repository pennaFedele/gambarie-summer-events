import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateThumbnail, generateOptimizedImage, uploadImageToSupabase } from '@/lib/imageUtils';

interface ImageUploadProps {
  eventId?: string;
  currentImageUrl?: string | null;
  onImageUploaded: (imageUrl: string) => void;
  onImageRemoved: () => void;
}

export const ImageUpload = ({ eventId, currentImageUrl, onImageUploaded, onImageRemoved }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Use eventId if available, otherwise generate a temporary one
    const uploadId = eventId || `temp_${Date.now()}`;

    setUploading(true);
    try {
      // Generate preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      // Generate optimized versions
      const [thumbnail, optimized] = await Promise.all([
        generateThumbnail(file),
        generateOptimizedImage(file)
      ]);

      // Upload both versions with user ID in path for security
      const [thumbnailUrl, optimizedUrl] = await Promise.all([
        uploadImageToSupabase(thumbnail!, uploadId, 'thumbnail', supabase),
        uploadImageToSupabase(optimized!, uploadId, 'full', supabase)
      ]);

      if (optimizedUrl) {
        // Store both URLs in a JSON format
        const imageData = JSON.stringify({
          thumbnail: thumbnailUrl,
          full: optimizedUrl
        });
        
        onImageUploaded(imageData);
        
        toast({
          title: 'Immagine caricata',
          description: 'L\'immagine è stata ottimizzata e caricata con successo.',
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Errore',
        description: 'Errore durante il caricamento dell\'immagine.',
        variant: 'destructive',
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [onImageUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleRemoveImage = async () => {
    try {
      // Remove from storage if needed
      if (currentImageUrl && typeof currentImageUrl === 'string') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User must be authenticated to remove images');
        }

        const imageData = JSON.parse(currentImageUrl);
        const filesToRemove: string[] = [];
        
        if (imageData.full) {
          // Extract the full path from URL for secure deletion
          const url = new URL(imageData.full);
          const fullPath = url.pathname.split('/event-images/')[1];
          if (fullPath) {
            filesToRemove.push(fullPath);
          }
        }
        if (imageData.thumbnail) {
          // Extract the full path from URL for secure deletion
          const url = new URL(imageData.thumbnail);
          const fullPath = url.pathname.split('/event-images/')[1];
          if (fullPath) {
            filesToRemove.push(fullPath);
          }
        }

        if (filesToRemove.length > 0) {
          await supabase.storage.from('event-images').remove(filesToRemove);
        }
      }
      
      setPreview(null);
      onImageRemoved();
      
      toast({
        title: 'Immagine rimossa',
        description: 'L\'immagine è stata rimossa con successo.',
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: 'Errore',
        description: 'Errore durante la rimozione dell\'immagine.',
        variant: 'destructive',
      });
    }
  };

  const getImageUrl = (imageUrl: string | null, type: 'thumbnail' | 'full' = 'thumbnail') => {
    if (!imageUrl) return null;
    
    try {
      const imageData = JSON.parse(imageUrl);
      return imageData[type] || imageData.full || imageUrl;
    } catch {
      return imageUrl; // Fallback for old format
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <label className="text-sm font-medium">Immagine Evento</label>
          
          {preview || currentImageUrl ? (
            <div className="relative">
              <img
                src={preview || getImageUrl(currentImageUrl)}
                alt="Event preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-2">
                {uploading ? (
                  <>
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
                    <p className="text-sm text-muted-foreground">Caricamento in corso...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {isDragActive ? 'Rilascia l\'immagine qui' : 'Trascina un\'immagine o clicca per selezionare'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Formato supportati: JPEG, PNG, WebP (max 10MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};