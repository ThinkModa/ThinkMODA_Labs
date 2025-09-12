-- Fix lessons table schema mismatch
-- The code expects 'content' and 'details' columns, but the database has 'content_data' and 'description'

-- Add missing columns that the code expects
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS content TEXT,
ADD COLUMN IF NOT EXISTS details TEXT;

-- Migrate data from content_data to content column
UPDATE public.lessons 
SET content = content_data->>'content'
WHERE content_data IS NOT NULL AND content IS NULL;

-- Migrate data from description to details column  
UPDATE public.lessons
SET details = description
WHERE description IS NOT NULL AND details IS NULL;

-- Make content column NOT NULL if it has data
UPDATE public.lessons 
SET content = '' 
WHERE content IS NULL;

-- Add NOT NULL constraint to content column
ALTER TABLE public.lessons 
ALTER COLUMN content SET NOT NULL;
