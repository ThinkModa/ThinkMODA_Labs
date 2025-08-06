-- Restore original state before aggressive reset
-- Run this in your Supabase SQL editor

-- 1. First, let's see what we currently have
SELECT 
  'Current lessons:' as info,
  l.id,
  l.title,
  l.created_at
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id = 'cmdxo5rrx0003sz8r60zu35s9'
ORDER BY l.created_at;

-- 2. Delete any test lessons or duplicates we created
DELETE FROM lessons 
WHERE title LIKE '%TEST%'
   OR title LIKE '%DUPLICATE%'
   OR title LIKE '%RESTORE%';

-- 3. Restore the original lessons with proper content and order

-- Welcome to Launchpad (1st)
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

-- Mission/Legacy in the Making (2nd)
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

-- The Visionary (3rd) - with Typeform
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

-- 4. Clear all user progress to start fresh
DELETE FROM user_progress 
WHERE user_id IN (
  SELECT id FROM users 
  WHERE email LIKE '%@gmail.com'
);

-- 5. Verify the restored state
SELECT 
  'Restored lesson order:' as info,
  l.id,
  l.title,
  l.created_at,
  ROW_NUMBER() OVER (ORDER BY l.created_at) as order_number
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.id = 'cmdxo5rrx0003sz8r60zu35s9'
ORDER BY l.created_at;

-- 6. Show the Typeform lesson content
SELECT 
  'Visionary lesson content:' as info,
  title,
  content
FROM lessons 
WHERE title = 'The Visionary';

-- 7. Check if any progress records remain
SELECT 
  'Remaining progress records:' as info,
  COUNT(*) as total_records
FROM user_progress; 