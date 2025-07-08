import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title?: string;
}

export const ImageModal = ({ isOpen, onClose, imageUrl, title }: ImageModalProps) => {
  if (!imageUrl) return null;

  const getFullImageUrl = (url: string) => {
    try {
      const imageData = JSON.parse(url);
      return imageData.full || imageData.thumbnail || url;
    } catch {
      return url;
    }
  };

  const handleDownload = () => {
    const fullUrl = getFullImageUrl(imageUrl);
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = `evento_${title || 'immagine'}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {title || 'Immagine Evento'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Scarica
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="p-4 pt-0">
          <img
            src={getFullImageUrl(imageUrl)}
            alt={title || 'Immagine evento'}
            className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
            loading="lazy"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};