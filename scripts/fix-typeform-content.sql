-- Fix lesson content by adding the correct Typeform URL
-- Run this in your Supabase SQL editor

-- First, let's see what we're working with
SELECT 
  id,
  title,
  content
FROM lessons 
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux';

-- Update the lesson content to include the correct Typeform URL
-- This will add the Typeform embed to the lesson content
UPDATE lessons 
SET content = content || E'\n/embed https://form.typeform.com/to/pZp1eiDj'
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'
  AND title LIKE '%ASSESSMENT%';

-- Verify the update
SELECT 
  id,
  title,
  content,
  CASE 
    WHEN content LIKE '%pZp1eiDj%' THEN 'Has correct Typeform'
    ELSE 'No Typeform'
  END as typeform_status
FROM lessons 
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'; 