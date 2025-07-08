import { Calendar, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

export type EventType = 'regular' | 'long';

interface EventTypeSelectorProps {
  selectedType: EventType;
  onTypeChange: (type: EventType) => void;
}

export const EventTypeSelector = ({ selectedType, onTypeChange }: EventTypeSelectorProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center justify-center gap-2 p-1 bg-muted rounded-lg">
      <Button
        variant={selectedType === 'regular' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('regular')}
        className="flex items-center gap-2 transition-all"
      >
        <Calendar className="w-4 h-4" />
        {t('events.dailyEvents')}
      </Button>
      <Button
        variant={selectedType === 'long' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('long')}
        className="flex items-center gap-2 transition-all"
      >
        <CalendarDays className="w-4 h-4" />
        {t('events.multiDayEvents')}
      </Button>
    </div>
  );
};