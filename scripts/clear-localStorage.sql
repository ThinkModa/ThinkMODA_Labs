-- Note: This is a frontend issue, not a database issue
-- The progress is being cached in browser localStorage

-- This script just shows the current database state
-- The actual fix needs to be done in the browser

-- 1. Check current database state
SELECT 
  COUNT(*) as total_progress_records,
  COUNT(DISTINCT user_id) as unique_users
FROM user_progress;

-- 2. Show sample records
SELECT 
  user_id,
  lesson_id,
  completed,
  typeform_submitted,
  created_at
FROM user_progress 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. The real fix is to clear browser localStorage
-- Run this in your browser console:
-- localStorage.clear();
-- Then refresh the page 