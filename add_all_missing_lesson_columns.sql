-- Add ALL missing columns to lessons table in production database
-- Run this in the Supabase SQL Editor

-- Add description column (this is what's currently failing)
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add order_position column
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS order_position VARCHAR(10);

-- Add content_data column (JSONB for structured content)
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS content_data JSONB;

-- Add content_type column
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'rich_text';

-- Add is_published column
ALTER TABLE public.lessons 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Update existing lessons to have default values
UPDATE public.lessons 
SET 
  description = details,  -- Copy details to description
  order_position = '1',
  content_type = 'rich_text',
  is_published = true,
  content_data = jsonb_build_object('content', content)
WHERE description IS NULL OR order_position IS NULL;

-- Add constraints for new columns
ALTER TABLE public.lessons 
ALTER COLUMN content_type SET NOT NULL;

ALTER TABLE public.lessons 
ALTER COLUMN is_published SET NOT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_section_order 
ON public.lessons(section_id, order_position);

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'lessons' 
ORDER BY ordinal_position;

