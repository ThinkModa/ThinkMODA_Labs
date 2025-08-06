-- Insert The Visionary lesson with correct section ID
-- Run this in your Supabase SQL editor

-- 1. Insert The Visionary lesson
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
  NOW(),
  NOW()
);

-- 2. Verify the lesson was created
SELECT 
  'Verification - The Visionary lesson:' as info,
  id,
  title,
  LEFT(content, 200) as content_preview
FROM lessons 
WHERE title = 'THE VISIONARY';

-- 3. Check that it's in the correct section
SELECT 
  'Section verification:' as info,
  l.title as lesson_title,
  s.title as section_title
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE l.title = 'THE VISIONARY'; 