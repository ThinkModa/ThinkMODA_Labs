
h666tt-- Test lesson completion manually
-- Run this in your Supabase SQL editor

-- 1. Check current progress for a specific user and lesson
SELECT 
  'Current progress for user:' as info,
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  completed_at,
  typeform_completed_at
FROM user_progress 
WHERE user_id = '0fbe2d55-2afc-4a88-aba1-8f9e1c7d6630'  -- Replace with actual user ID
  AND lesson_id = '718eabee-2f3e-4635-bb38-2cabea51e835'; -- Replace with actual lesson ID

-- 2. Manually complete a lesson (if needed for testing)
-- UPDATE user_progress 
-- SET completed = true,
--     completed_at = NOW(),
--     typeform_submitted = true,
--     typeform_completed_at = NOW(),
--     updated_at = NOW()
-- WHERE user_id = '0fbe2d55-2afc-4a88-aba1-8f9e1c7d6630'
--   AND lesson_id = '718eabee-2f3e-4635-bb38-2cabea51e835';

-- 3. Show all progress records for debugging
SELECT 
  'All progress records:' as info,
  COUNT(*) as total_records
FROM user_progress;

-- 4. Show recent progress updates
SELECT 
  'Recent progress updates:' as info,
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  completed_at,
  updated_at
FROM user_progress 
ORDER BY updated_at DESC 
LIMIT 10; 