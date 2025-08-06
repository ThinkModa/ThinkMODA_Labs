-- Restore to pre-aggressive fix state with original 6 lessons
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

-- 2. Delete ALL lessons in this section to start fresh
DELETE FROM lessons 
WHERE section_id = 'cmdxo5rrx0003sz8r60zu35s9';

-- 3. Delete ALL user progress to start fresh
DELETE FROM user_progress;

-- 4. Now recreate the original 6 lessons in the correct order

-- 1. Welcome to Launchpad
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

-- 2. The Visionary (with Typeform)
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
  '2024-01-01 10:00:01',
  NOW()
);

-- 3. The Mission
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'The Mission',
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
  '2024-01-01 10:00:02',
  NOW()
);

-- 4. The Plan
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'The Plan',
  'Now it''s time to create your strategic plan.

### Strategic Planning

A solid plan guides your business growth and development.

### Key Elements

- **Goals**: What do you want to achieve?
- **Strategy**: How will you get there?
- **Timeline**: When will you accomplish each step?
- **Resources**: What do you need to succeed?

### Your Business Plan

Develop a comprehensive plan that outlines your path to success.

### Next Steps

Complete this lesson to continue your journey.',
  'cmdxo5rrx0003sz8r60zu35s9',
  '2024-01-01 10:00:03',
  NOW()
);

-- 5. The Baseline
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'The Baseline',
  'Establish your baseline metrics and current state.

### Understanding Your Baseline

Your baseline represents where you are today.

### Key Metrics

- **Current Performance**: What are your current numbers?
- **Market Position**: Where do you stand in your industry?
- **Resource Assessment**: What do you have to work with?
- **Gap Analysis**: What do you need to improve?

### Your Baseline Assessment

Document your current state to measure future progress.

### Next Steps

Complete this lesson to move forward.',
  'cmdxo5rrx0003sz8r60zu35s9',
  '2024-01-01 10:00:04',
  NOW()
);

-- 6. The Assessment
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'The Assessment',
  'Final assessment of your business readiness.

### Comprehensive Assessment

Evaluate your overall business readiness and next steps.

### Assessment Areas

- **Strategy**: Is your plan solid?
- **Execution**: Can you implement effectively?
- **Resources**: Do you have what you need?
- **Timeline**: Is your timeline realistic?

### Your Final Assessment

Complete this comprehensive evaluation of your business readiness.

### Congratulations!

You''ve completed the Launchpad course!',
  'cmdxo5rrx0003sz8r60zu35s9',
  '2024-01-01 10:00:05',
  NOW()
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

-- 6. Show the Visionary lesson to confirm Typeform is correct
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