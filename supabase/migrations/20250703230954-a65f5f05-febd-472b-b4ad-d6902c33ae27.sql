-- Create long_events table for multi-day events
CREATE TABLE public.long_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  organizer TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('gastronomia', 'cultura', 'musica', 'natura', 'storia', 'sport', 'arte')),
  image_url TEXT,
  external_link TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  -- Ensure end_date is after start_date
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Enable Row Level Security
ALTER TABLE public.long_events ENABLE ROW LEVEL SECURITY;

-- Create policies for long_events (same as regular events)
CREATE POLICY "Long events are viewable by everyone" 
ON public.long_events 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create long events" 
ON public.long_events 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own long events" 
ON public.long_events 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own long events" 
ON public.long_events 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create trigger for automatic timestamp updates on long_events
CREATE TRIGGER update_long_events_updated_at
BEFORE UPDATE ON public.long_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance on date queries
CREATE INDEX idx_long_events_dates ON public.long_events(start_date, end_date);
CREATE INDEX idx_long_events_category ON public.long_events(category);
CREATE INDEX idx_long_events_created_by ON public.long_events(created_by);