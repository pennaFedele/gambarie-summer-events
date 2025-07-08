import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  children: React.ReactNode;
}

export const LoadMore = ({ hasMore, loading, onLoadMore, children }: LoadMoreProps) => {
  return (
    <>
      {children}
      <div className="py-8 text-center">
        {hasMore ? (
          <Button 
            onClick={onLoadMore} 
            disabled={loading}
            variant="outline"
            size="lg"
            className="min-w-48"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Caricamento...
              </>
            ) : (
              "Carica altri eventi"
            )}
          </Button>
        ) : (
          <div className="text-muted-foreground text-sm">
            ✓ Tutti gli eventi sono stati caricati
          </div>
        )}
      </div>
    </>
  );
};