-- Reorder The Visionary lesson to appear after "Welcome to Launchpad"
-- Run this in your Supabase SQL editor

-- 1. First, let's see the current order of lessons in the section
SELECT 
  'Current lesson order:' as info,
  l.id,
  l.title,
  l.created_at,
  ROW_NUMBER() OVER (ORDER BY l.created_at) as current_order
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id = 'cmdxo5rrx0003sz8r60zu35s9'
ORDER BY l.created_at;

-- 2. Find the "Welcome to Launchpad" lesson
SELECT 
  'Welcome to Launchpad lesson:' as info,
  id,
  title,
  created_at
FROM lessons 
WHERE title LIKE '%Welcome%Launchpad%'
   OR title LIKE '%Welcome to Launchpad%'
   OR title LIKE '%WELCOME%';

-- 3. Update The Visionary lesson to have a created_at timestamp right after Welcome to Launchpad
-- This will make it appear second in the list
UPDATE lessons 
SET created_at = (
  SELECT created_at + INTERVAL '1 second'
  FROM lessons 
  WHERE title LIKE '%Welcome%Launchpad%'
     OR title LIKE '%Welcome to Launchpad%'
     OR title LIKE '%WELCOME%'
  LIMIT 1
)
WHERE title = 'THE VISIONARY';

-- 4. Verify the new order
SELECT 
  'New lesson order:' as info,
  l.id,
  l.title,
  l.created_at,
  ROW_NUMBER() OVER (ORDER BY l.created_at) as new_order
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id = 'cmdxo5rrx0003sz8r60zu35s9'
ORDER BY l.created_at;

-- 5. Alternative: If the above doesn't work, we can manually set the order
-- Uncomment and run this if needed:
/*
UPDATE lessons 
SET created_at = '2024-01-01 10:00:01' -- Set to right after Welcome lesson
WHERE title = 'THE VISIONARY';
*/ 