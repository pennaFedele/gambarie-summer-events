import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { it, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

interface EventFiltersProps {
  selectedDate?: Date;
  selectedCategories: string[];
  onDateChange: (date?: Date) => void;
  onCategoriesChange: (categories: string[]) => void;
  onClearFilters: () => void;
}

export const EventFilters = ({
  selectedDate,
  selectedCategories,
  onDateChange,
  onCategoriesChange,
  onClearFilters
}: EventFiltersProps) => {
  const { t, i18n } = useTranslation();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const categories = [
    { id: "gastronomia", label: t('admin.categories.gastronomia'), color: "bg-[hsl(var(--gastronomia))]" },
    { id: "cultura", label: t('admin.categories.cultura'), color: "bg-[hsl(var(--cultura))]" },
    { id: "musica", label: t('admin.categories.musica'), color: "bg-[hsl(var(--musica))]" },
    { id: "natura", label: t('admin.categories.natura'), color: "bg-[hsl(var(--natura))]" },
    { id: "storia", label: t('admin.categories.storia'), color: "bg-[hsl(var(--storia))]" },
    { id: "sport", label: t('admin.categories.sport'), color: "bg-[hsl(var(--sport))]" },
    { id: "arte", label: t('admin.categories.arte'), color: "bg-[hsl(var(--arte))]" }
  ];

  const dateLocale = i18n.language === 'en' ? enUS : it;

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onCategoriesChange([...selectedCategories, categoryId]);
    }
  };

  const hasActiveFilters = selectedDate || selectedCategories.length > 0;

  return (
    <>
      {/* Date Filter Card - Not Sticky */}
      <Card className="shadow-card mb-4">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5" />
              {t('events.eventFilters')}
            </CardTitle>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
                {t('common.clear')}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {/* Date Filter */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">{t('common.date')}</h4>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "dd MMMM yyyy", { locale: dateLocale })
                  ) : (
                    <span>{t('common.selectDate')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    onDateChange(date);
                    setCalendarOpen(false);
                  }}
                  initialFocus
                  className="pointer-events-auto"
                  locale={dateLocale}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter Card - Sticky */}
      <Card className="sticky top-4 z-10 shadow-card">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">{t('common.categories')}</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <Badge
                    key={category.id}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-smooth hover:shadow-soft",
                      isSelected && `${category.color} text-card border-transparent`
                    )}
                    onClick={() => toggleCategory(category.id)}
                  >
                    {category.label}
                  </Badge>
                );
              })}
            </div>

            {hasActiveFilters && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  {selectedCategories.length > 0 && `${selectedCategories.length} ${t('events.selectedCategories')}`}
                  {selectedDate && selectedCategories.length > 0 && " • "}
                  {selectedDate && t('events.specificDate')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};