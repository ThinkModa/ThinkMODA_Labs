-- Simple fix for lessons table schema mismatch
-- Add the missing columns that the code expects

-- Add content column if it doesn't exist
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS content TEXT;

-- Add details column if it doesn't exist  
ALTER TABLE public.lessons
ADD COLUMN IF NOT EXISTS details TEXT;

-- Migrate data from content_data to content column
UPDATE public.lessons 
SET content = content_data->>'content'
WHERE content_data IS NOT NULL AND content IS NULL;

-- Migrate data from description to details column
UPDATE public.lessons
SET details = description  
WHERE description IS NOT NULL AND details IS NULL;

-- Set default empty string for null content
UPDATE public.lessons 
SET content = '' 
WHERE content IS NULL;
