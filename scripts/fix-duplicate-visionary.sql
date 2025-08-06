-- Fix duplicate Visionary lessons and reorder properly
-- Run this in your Supabase SQL editor

-- 1. First, let's see all the Visionary lessons
SELECT 
  'All Visionary lessons:' as info,
  id,
  title,
  created_at,
  LEFT(content, 100) as content_preview
FROM lessons 
WHERE title LIKE '%VISIONARY%'
ORDER BY created_at;

-- 2. Find the Welcome to Launchpad lesson
SELECT 
  'Welcome to Launchpad lesson:' as info,
  id,
  title,
  created_at
FROM lessons 
WHERE title LIKE '%Welcome%Launchpad%'
   OR title LIKE '%Welcome to Launchpad%'
   OR title LIKE '%WELCOME%'
ORDER BY created_at;

-- 3. Delete ALL Visionary lessons (we'll recreate one properly)
DELETE FROM lessons 
WHERE title LIKE '%VISIONARY%';

-- 4. Delete any progress records for Visionary lessons
DELETE FROM user_progress 
WHERE lesson_id IN (
  SELECT id FROM lessons WHERE title LIKE '%VISIONARY%'
);

-- 5. Create ONE Visionary lesson with the correct timestamp
-- Get the Welcome lesson timestamp and add 1 second
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'THE VISIONARY',
  'Complete the form below to create your founder profile.

/embed https://form.typeform.com/to/pZp1eiDj
Next Step:

__**Company Profile**__

### Click "Complete Lesson" to create your Company Profile',
  'cmdxo5rrx0003sz8r60zu35s9',
  (SELECT created_at + INTERVAL '1 second' FROM lessons WHERE title LIKE '%Welcome%Launchpad%' OR title LIKE '%Welcome to Launchpad%' OR title LIKE '%WELCOME%' LIMIT 1),
  NOW()
);

-- 6. Verify the fix
SELECT 
  'Final lesson order:' as info,
  l.id,
  l.title,
  l.created_at,
  ROW_NUMBER() OVER (ORDER BY l.created_at) as lesson_order
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id = 'cmdxo5rrx0003sz8r60zu35s9'
ORDER BY l.created_at;

-- 7. Check that there's only one Visionary lesson
SELECT 
  'Visionary lesson count:' as info,
  COUNT(*) as count
FROM lessons 
WHERE title LIKE '%VISIONARY%'; 