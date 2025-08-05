-- Comprehensive fix for Typeform issues
-- Run this in your Supabase SQL editor

-- 1. First, let's see the current state
SELECT 
  id,
  title,
  content,
  CASE 
    WHEN content LIKE '%typeform.com%' THEN 'Has Typeform'
    ELSE 'No Typeform'
  END as typeform_status
FROM lessons 
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux';

-- 2. Fix the lesson content by adding the correct Typeform URL
UPDATE lessons 
SET content = CASE 
  WHEN content IS NULL OR content = '' THEN '/embed https://form.typeform.com/to/pZp1eiDj'
  ELSE content || E'\n/embed https://form.typeform.com/to/pZp1eiDj'
END
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux'
  AND title LIKE '%ASSESSMENT%';

-- 3. Ensure RLS is disabled on user_progress to fix 409/406 errors
ALTER TABLE user_progress DISABLE ROW LEVEL SECURITY;

-- 4. Add the typeform_submitted column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_progress' 
    AND column_name = 'typeform_submitted'
  ) THEN
    ALTER TABLE user_progress ADD COLUMN typeform_submitted BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- 5. Verify the fixes
SELECT 
  id,
  title,
  content,
  CASE 
    WHEN content LIKE '%pZp1eiDj%' THEN 'Has correct Typeform'
    WHEN content LIKE '%typeform.com%' THEN 'Has Typeform'
    ELSE 'No Typeform'
  END as typeform_status
FROM lessons 
WHERE id = 'cmdxo57nr0001sz8rwjkfrkux';

-- 6. Check user_progress table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_progress'
ORDER BY ordinal_position; 