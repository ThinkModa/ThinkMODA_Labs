-- Check existing courses and create test courses if needed
-- Run this in your Supabase SQL editor

-- First, let's see what courses exist
SELECT 
  id,
  title,
  description,
  visibility,
  created_at
FROM courses 
ORDER BY created_at DESC;

-- If no courses exist, let's create some test courses
INSERT INTO courses (
  id,
  title,
  description,
  visibility,
  created_at,
  updated_at
) VALUES 
(
  'test-course-001',
  'LaunchPad Fundamentals',
  'Master the essential skills for launching your business successfully. This comprehensive course covers everything from ideation to execution.',
  'OPEN',
  NOW(),
  NOW()
),
(
  'test-course-002',
  'Advanced Business Strategy',
  'Deep dive into advanced business strategies and market analysis techniques.',
  'PRIVATE',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Now let's create some sections for the first course
INSERT INTO sections (
  id,
  title,
  description,
  course_id,
  created_at,
  updated_at
) VALUES 
(
  'section-001',
  'The Visionary',
  'Learn how to develop a clear vision for your business',
  'test-course-001',
  NOW(),
  NOW()
),
(
  'section-002',
  'The Mission',
  'Define your mission and core values',
  'test-course-001',
  NOW(),
  NOW()
),
(
  'section-003',
  'The Plan',
  'Create a comprehensive business plan',
  'test-course-001',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Create lessons for the first section
INSERT INTO lessons (
  id,
  title,
  content,
  details,
  section_id,
  created_at,
  updated_at
) VALUES 
(
  'lesson-001',
  'Understanding Your Vision',
  'Welcome to the Visionary section! In this lesson, you will learn how to develop a clear and compelling vision for your business.

## What is a Vision?

A vision is your picture of the future - what you want your business to become. It should be:
- **Inspiring** - Motivates you and your team
- **Clear** - Easy to understand and communicate
- **Achievable** - Realistic but challenging

## Key Components

1. **Purpose** - Why does your business exist?
2. **Values** - What principles guide your decisions?
3. **Goals** - What do you want to achieve?

## Next Steps

Complete the embedded form below to start defining your vision.',
  'This lesson introduces the concept of business vision and its importance.',
  'section-001',
  NOW(),
  NOW()
),
(
  'lesson-002',
  'Crafting Your Vision Statement',
  'Now that you understand what a vision is, let\'s create your vision statement.

## Vision Statement Framework

Your vision statement should answer:
- What do you want to achieve?
- Who do you want to serve?
- How will you make a difference?

## Example Vision Statements

- "To be the world\'s most customer-centric company"
- "To organize the world\'s information and make it universally accessible"
- "To accelerate the world\'s transition to sustainable energy"

## Your Turn

Use the form below to craft your own vision statement.',
  'Learn how to write an effective vision statement.',
  'section-001',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Verify everything was created
SELECT 
  c.title as course_title,
  c.visibility,
  COUNT(s.id) as section_count,
  COUNT(l.id) as lesson_count
FROM courses c
LEFT JOIN sections s ON c.id = s.course_id
LEFT JOIN lessons l ON s.id = l.section_id
GROUP BY c.id, c.title, c.visibility
ORDER BY c.created_at DESC; 