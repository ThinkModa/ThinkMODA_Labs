-- Fix lesson order and add test lesson
-- Run this in your Supabase SQL editor

-- 1. First, let's see the current order
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

-- 2. Find the exact Welcome lesson
SELECT 
  'Welcome lesson details:' as info,
  id,
  title,
  created_at
FROM lessons 
WHERE title LIKE '%Welcome%'
   OR title LIKE '%WELCOME%'
   OR title LIKE '%Launchpad%';

-- 3. Find the Mission lesson
SELECT 
  'Mission lesson details:' as info,
  id,
  title,
  created_at
FROM lessons 
WHERE title LIKE '%MISSION%'
   OR title LIKE '%Mission%';

-- 4. Fix the order by updating timestamps
-- Set Welcome to be first (oldest timestamp)
UPDATE lessons 
SET created_at = '2024-01-01 10:00:00'
WHERE title LIKE '%Welcome%'
   OR title LIKE '%WELCOME%'
   OR title LIKE '%Launchpad%';

-- Set Mission to be second
UPDATE lessons 
SET created_at = '2024-01-01 10:00:01'
WHERE title LIKE '%MISSION%'
   OR title LIKE '%Mission%';

-- Set Visionary to be third
UPDATE lessons 
SET created_at = '2024-01-01 10:00:02'
WHERE title LIKE '%VISIONARY%'
   OR title LIKE '%Visionary%';

-- 5. Add a test lesson at the end
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'TEST LESSON',
  'This is a test lesson for debugging.

### Test Content

This lesson is for testing purposes only.

### Click "Complete Lesson" to test',
  'cmdxo5rrx0003sz8r60zu35s9',
  '2024-01-01 10:00:03',
  NOW()
);

-- 6. Verify the final order
SELECT 
  'Final lesson order:' as info,
  l.id,
  l.title,
  l.created_at,
  ROW_NUMBER() OVER (ORDER BY l.created_at) as final_order
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id = 'cmdxo5rrx0003sz8r60zu35s9'
ORDER BY l.created_at;

-- 7. Show all lessons in the section
SELECT 
  'All lessons in section:' as info,
  l.title,
  l.created_at,
  ROW_NUMBER() OVER (ORDER BY l.created_at) as order_number
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id = 'cmdxo5rrx0003sz8r60zu35s9'
ORDER BY l.created_at; 