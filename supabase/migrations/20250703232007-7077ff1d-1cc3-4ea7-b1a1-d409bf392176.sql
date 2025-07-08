-- Add cancelled column to events table
ALTER TABLE public.events 
ADD COLUMN cancelled BOOLEAN NOT NULL DEFAULT false;

-- Add cancelled column to long_events table  
ALTER TABLE public.long_events 
ADD COLUMN cancelled BOOLEAN NOT NULL DEFAULT false;

-- Add indexes for better performance when filtering by cancelled status
CREATE INDEX idx_events_cancelled ON public.events(cancelled);
CREATE INDEX idx_long_events_cancelled ON public.long_events(cancelled);