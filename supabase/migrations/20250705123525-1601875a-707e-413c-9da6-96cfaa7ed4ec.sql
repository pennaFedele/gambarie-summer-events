-- Create activities table with bilingual support
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_it TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_it TEXT,
  description_en TEXT,
  type_it TEXT NOT NULL,
  type_en TEXT NOT NULL,
  info_links JSONB DEFAULT '[]'::jsonb,
  maps_links JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for activities
CREATE POLICY "Activities are viewable by everyone" 
ON public.activities 
FOR SELECT 
USING (active = true);

CREATE POLICY "Authenticated users can create activities" 
ON public.activities 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own activities" 
ON public.activities 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own activities" 
ON public.activities 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add bilingual support to events table
ALTER TABLE public.events 
ADD COLUMN title_en TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN location_en TEXT,
ADD COLUMN organizer_en TEXT;

-- Add bilingual support to long_events table  
ALTER TABLE public.long_events
ADD COLUMN title_en TEXT,
ADD COLUMN description_en TEXT,
ADD COLUMN location_en TEXT,
ADD COLUMN organizer_en TEXT;

-- Insert existing activities data
INSERT INTO public.activities (title_it, title_en, description_it, description_en, type_it, type_en, info_links, maps_links, display_order) VALUES
('Bike Rent', 'Bike Rent', 'Attivo presso l''infopoint in Piazza Mangeruca consente di noleggiare mountain-bike e possibilità di escursioni guidate.', 'Active at the infopoint in Piazza Mangeruca allows mountain bike rental and the possibility of guided excursions.', 'Sport', 'Sport', '[{"label": "Info", "url": "https://www.gambarie.it/bike-rent"}]'::jsonb, '[{"label": "Piazza Mangeruca", "url": "https://maps.google.com/maps?q=Piazza+Mangeruca+Gambarie"}]'::jsonb, 1),
('Laser Tag', 'Laser Tag', 'Attività ricreativa in cui i giocatori, divisi in squadre, si armano di armi laser che emettono raggi infrarossi invisibili.', 'Recreational activity where players, divided into teams, are armed with laser weapons that emit invisible infrared rays.', 'Sport', 'Sport', '[{"label": "Info", "url": "https://www.gambarie.it/laser-tag"}]'::jsonb, '[{"label": "Bosco Viu-Arunci", "url": "https://maps.google.com/maps?q=Bosco+Viu-Arunci+Gambarie"}]'::jsonb, 2),
('Campo da Calcio', 'Football Field', 'Campo da calcio a 5 realizzato in erba sintetica anche 3 e 5 in terza generazione situato nel Polo Sportivo di Cucullaro.', '5-a-side football field made of synthetic grass, also 3 and 5 third generation located in the Cucullaro Sports Center.', 'Sport', 'Sport', '[{"label": "Info", "url": "https://www.gambarie.it/campo-calcio"}]'::jsonb, '[{"label": "Polo Sportivo Cucullaro", "url": "https://maps.google.com/maps?q=Polo+Sportivo+Cucullaro+Gambarie"}]'::jsonb, 3),
('Campo Padel / Tennis', 'Padel / Tennis Court', 'Campo da padel, tennis e anche da football, immersi in una vista mozzafiato per combinare sport e natura.', 'Padel, tennis and also football courts, immersed in a breathtaking view to combine sport and nature.', 'Sport', 'Sport', '[{"label": "Info", "url": "https://www.gambarie.it/campo-padel-tennis"}]'::jsonb, '[{"label": "Cucullaro Sports Centre", "url": "https://maps.google.com/maps?q=Cucullaro+Sports+Centre+Gambarie"}]'::jsonb, 4),
('Campi Basket, Volley', 'Basketball, Volleyball Courts', 'Campi polrifunzionali riservati a: Basket, Pallavolo e preparazione atletica.', 'Multi-functional courts reserved for: Basketball, Volleyball and athletic preparation.', 'Sport', 'Sport', '[{"label": "Info", "url": "https://www.gambarie.it/basket-volley"}]'::jsonb, '[{"label": "Campi Basket/Volley", "url": "https://maps.google.com/maps?q=Campi+Basket+Volley+Gambarie"}]'::jsonb, 5),
('Bob Estivo', 'Summer Bob', 'Attrazione per grandi e piccini che consente di vivere un''esperienza unica velocità responsabile su un tracciato con paraboliche finali.', 'Attraction for young and old that allows you to live a unique experience with responsible speed on a track with final parabolas.', 'Avventura', 'Adventure', '[{"label": "Info", "url": "https://www.gambarie.it/bob-estivo"}]'::jsonb, '[{"label": "Bob Estivo", "url": "https://maps.google.com/maps?q=Bob+Estivo+Gambarie"}]'::jsonb, 6),
('Aspropark', 'Aspropark', 'Parco avventura a 10 minuti da Gambarie, offre percorsi acrobatici, pista ciclabile, tiro con l''arco, noleggio e-bike.', 'Adventure park 10 minutes from Gambarie, offers acrobatic courses, cycle path, archery, e-bike rental.', 'Avventura', 'Adventure', '[{"label": "Sito Ufficiale", "url": "https://www.aspropark.it"}, {"label": "Info", "url": "https://www.gambarie.it/aspropark"}]'::jsonb, '[{"label": "Aspropark", "url": "https://maps.google.com/maps?q=Aspropark+Gambarie"}]'::jsonb, 7),
('Escursioni', 'Hiking', 'Per una vacanza attiva a contatto con la natura, offre la possibilità di vivere un''esperienza unica adatta a famiglie, senior e sportivi.', 'For an active holiday in contact with nature, it offers the possibility to live a unique experience suitable for families, seniors and athletes.', 'Natura', 'Nature', '[{"label": "Percorsi", "url": "https://www.gambarie.it/escursioni"}, {"label": "Guide", "url": "https://www.gambarie.it/guide-escursioni"}]'::jsonb, '[{"label": "Punto di partenza", "url": "https://maps.google.com/maps?q=Gambarie+escursioni"}, {"label": "Sentieri", "url": "https://maps.google.com/maps?q=Sentieri+Gambarie"}]'::jsonb, 8),
('Snow Tubing - Campo da Bocce', 'Snow Tubing - Bowling Field', 'Attività per tempo libero dove si scivola su un''apposita pista per famiglie utilizzando ciambelline di gomma.', 'Leisure activity where you slide on a special family track using rubber rings.', 'Famiglia', 'Family', '[{"label": "Info", "url": "https://www.gambarie.it/snow-tubing"}]'::jsonb, '[{"label": "Pista Snow Tubing", "url": "https://maps.google.com/maps?q=Snow+Tubing+Gambarie"}]'::jsonb, 9),
('Centro Benessere', 'Wellness Center', 'Sauna, Piscine riscaldate e idromassaggio per assaporare momenti di relax in un''atmosfera di montagna.', 'Sauna, heated pools and whirlpool to savor moments of relaxation in a mountain atmosphere.', 'Benessere', 'Wellness', '[{"label": "Info", "url": "https://www.gambarie.it/centro-benessere"}, {"label": "Prenotazioni", "url": "https://www.gambarie.it/prenotazioni-spa"}]'::jsonb, '[{"label": "Centro Benessere", "url": "https://maps.google.com/maps?q=Centro+Benessere+Gambarie"}]'::jsonb, 10);