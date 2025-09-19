-- Add missing columns to lessons table in production database
-- Run this in the Supabase SQL Editor

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
  order_position = '1',
  content_type = 'rich_text',
  is_published = true,
  content_data = jsonb_build_object('content', content)
WHERE order_position IS NULL;

-- Add constraints
ALTER TABLE public.lessons 
ALTER COLUMN content_type SET NOT NULL;

ALTER TABLE public.lessons 
ALTER COLUMN is_published SET NOT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_section_order 
ON public.lessons(section_id, order_position);

