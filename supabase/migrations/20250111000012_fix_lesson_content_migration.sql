-- Fix lesson content migration from content_data to content field
-- The content_data field contains the actual lesson content, but the code expects it in the content field

-- Update lessons to properly migrate content from content_data to content
UPDATE public.lessons 
SET content = content_data->>'content'
WHERE content_data IS NOT NULL 
  AND content_data->>'content' IS NOT NULL 
  AND (content IS NULL OR content = '');

-- Also ensure details field is populated from description
UPDATE public.lessons
SET details = description
WHERE description IS NOT NULL 
  AND (details IS NULL OR details = '');

-- Verify the migration worked by checking a few lessons
-- This will help us see if the content is properly migrated
SELECT 
    id,
    title,
    CASE 
        WHEN content IS NOT NULL AND content != '' THEN 'Content field populated'
        ELSE 'Content field empty'
    END as content_status,
    CASE 
        WHEN content_data IS NOT NULL THEN 'Content_data exists'
        ELSE 'Content_data empty'
    END as content_data_status,
    LENGTH(content) as content_length,
    LENGTH(content_data->>'content') as content_data_length
FROM public.lessons 
ORDER BY title
LIMIT 5;
