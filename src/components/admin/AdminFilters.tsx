import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface AdminFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    category: string;
    date: Date | undefined;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  }) => void;
}

export const AdminFilters = ({ onFiltersChange }: AdminFiltersProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [date, setDate] = useState<Date | undefined>();
  const [sortBy, setSortBy] = useState("event_date");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories = [
    { value: "all", label: "Tutte le categorie" },
    { value: "gastronomia", label: "Gastronomia" },
    { value: "cultura", label: "Cultura" },
    { value: "musica", label: "Musica" },
    { value: "natura", label: "Natura" },
    { value: "storia", label: "Storia" },
    { value: "sport", label: "Sport" },
    { value: "arte", label: "Arte" }
  ];

  const sortOptions = [
    { value: "event_date", label: "Data evento" },
    { value: "title", label: "Titolo" },
    { value: "created_at", label: "Data creazione" },
    { value: "organizer", label: "Organizzatore" }
  ];

  const handleFilterChange = () => {
    onFiltersChange({
      search,
      category: category === "all" ? "" : category,
      date,
      sortBy,
      sortOrder
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setDate(undefined);
    setSortBy("event_date");
    setSortOrder('asc');
    onFiltersChange({
      search: "",
      category: "",
      date: undefined,
      sortBy: "event_date",
      sortOrder: 'asc'
    });
  };

  // Trigger filter change whenever any filter changes
  useEffect(() => {
    handleFilterChange();
  }, [search, category, date, sortBy, sortOrder]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtri e Ordinamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cerca per nome</label>
            <Input
              placeholder="Nome evento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data evento</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ordina per</label>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>
        </div>

        {/* Clear filters */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="w-4 h-4 mr-2" />
            Pulisci filtri
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};