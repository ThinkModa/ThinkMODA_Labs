-- Complete clean restore to original state
-- Run this in your Supabase SQL editor

-- 1. First, let's see what we currently have
SELECT 
  'Current lessons before cleanup:' as info,
  l.id,
  l.title,
  l.created_at
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id = 'cmdxo5rrx0003sz8r60zu35s9'
ORDER BY l.created_at;

-- 2. Delete ALL lessons in this section to start completely fresh
DELETE FROM lessons 
WHERE section_id = 'cmdxo5rrx0003sz8r60zu35s9';

-- 3. Delete ALL user progress to start completely fresh
DELETE FROM user_progress;

-- 4. Now recreate the original lessons in the correct order

-- Welcome to Launchpad (1st) - Original simple lesson
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Welcome to Launchpad',
  'Welcome to Launchpad! This is your first step in the journey.

### Getting Started

This course will guide you through the essential steps to launch your business.

### What You''ll Learn

- Company Profile Creation
- Mission Statement Development
- Vision Planning
- And much more!

### Ready to begin?

Click "Complete Lesson" to move forward.',
  'cmdxo5rrx0003sz8r60zu35s9',
  '2024-01-01 10:00:00',
  NOW()
);

-- Mission: Legacy in the Making (2nd) - Original simple lesson
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Mission: Legacy in the Making',
  'Your mission is the foundation of your business.

### Understanding Your Mission

A clear mission statement guides every decision you make.

### Key Components

- **Purpose**: Why does your business exist?
- **Values**: What principles guide your actions?
- **Impact**: What change do you want to create?

### Your Mission Statement

Take time to craft a mission that inspires you and your team.

### Next Steps

Complete this lesson to move to the next phase.',
  'cmdxo5rrx0003sz8r60zu35s9',
  '2024-01-01 10:00:01',
  NOW()
);

-- The Visionary (3rd) - Original Typeform lesson (NO DUPLICATES)
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'The Visionary',
  'Complete the form below to create your founder profile.

/embed https://form.typeform.com/to/pZp1eiDj#company_name=xxxxx&lesson_id=xxxxx&first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&user_id=xxxxx&course_id=xxxxx

Next Step:

__**Company Profile**__

### Click "Complete Lesson" to create your Company Profile',
  'cmdxo5rrx0003sz8r60zu35s9',
  '2024-01-01 10:00:02',
  NOW()
);

-- 5. Verify the clean state
SELECT 
  'Clean restored lesson order:' as info,
  l.id,
  l.title,
  l.created_at,
  ROW_NUMBER() OVER (ORDER BY l.created_at) as order_number
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id = 'cmdxo5rrx0003sz8r60zu35s9'
ORDER BY l.created_at;

-- 6. Show the Visionary lesson to confirm it's correct
SELECT 
  'Visionary lesson content:' as info,
  title,
  content
FROM lessons 
WHERE title = 'The Visionary';

-- 7. Confirm no duplicates exist
SELECT 
  'Duplicate check:' as info,
  title,
  COUNT(*) as count
FROM lessons 
WHERE section_id = 'cmdxo5rrx0003sz8r60zu35s9'
GROUP BY title
HAVING COUNT(*) > 1;

-- 8. Show total lessons in section
SELECT 
  'Total lessons in section:' as info,
  COUNT(*) as total_lessons
FROM lessons 
WHERE section_id = 'cmdxo5rrx0003sz8r60zu35s9'; 