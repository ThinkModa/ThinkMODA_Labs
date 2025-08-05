-- Debug lesson content to see what's actually stored
-- Run this in your Supabase SQL editor

-- Check the specific lesson that's causing issues
SELECT 
  id,
  title,
  content,
  LENGTH(content) as content_length,
  CASE 
    WHEN content LIKE '%typeform.com%' THEN 'Has Typeform'
    WHEN content LIKE '%/embed%' THEN 'Has Embed'
    ELSE 'No Typeform'
  END as content_type
FROM lessons 
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'
   OR id = 'cmdxoam330007sz8rgz2v4llf'
   OR title LIKE '%ASSESSMENT%'
ORDER BY title;

-- Check all lessons with Typeform content
SELECT 
  id,
  title,
  LEFT(content, 200) as content_preview,
  CASE 
    WHEN content LIKE '%pZp1eiDj%' THEN 'The Visionary'
    WHEN content LIKE '%ZIevyTG8%' THEN 'The Mission'
    WHEN content LIKE '%xHocdpeq%' THEN 'The Plan'
    WHEN content LIKE '%TgYsSfUX%' THEN 'The Baseline'
    WHEN content LIKE '%NjzuCVgZ%' THEN 'The Assessment'
    ELSE 'Unknown Typeform'
  END as typeform_type
FROM lessons 
WHERE content LIKE '%typeform.com%'
ORDER BY title; 