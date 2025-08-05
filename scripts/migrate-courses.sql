-- Check and migrate courses from old system to Supabase
-- Run this in your Supabase SQL editor

-- First, let's see what's currently in the database
SELECT '=== CURRENT COURSES ===' as info;
SELECT 
  id,
  title,
  description,
  visibility,
  created_at
FROM courses 
ORDER BY created_at DESC;

-- Check if we have any sections
SELECT '=== CURRENT SECTIONS ===' as info;
SELECT 
  id,
  title,
  description,
  course_id,
  created_at
FROM sections 
ORDER BY created_at DESC;

-- Check if we have any lessons
SELECT '=== CURRENT LESSONS ===' as info;
SELECT 
  id,
  title,
  content,
  section_id,
  created_at
FROM lessons 
ORDER BY created_at DESC;

-- Now let's create the courses that should exist based on what the user side is showing
-- (You mentioned there are courses showing on the user side)

-- Create the main course that users are seeing
INSERT INTO courses (
  id,
  title,
  description,
  visibility,
  created_at,
  updated_at
) VALUES 
(
  'launchpad-fundamentals',
  'LaunchPad Fundamentals',
  'Master the essential skills for launching your business successfully. This comprehensive course covers everything from ideation to execution.',
  'OPEN',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  visibility = EXCLUDED.visibility,
  updated_at = NOW();

-- Create sections for the course
INSERT INTO sections (
  id,
  title,
  description,
  course_id,
  created_at,
  updated_at
) VALUES 
(
  'section-visionary',
  'The Visionary',
  'Learn how to develop a clear vision for your business',
  'launchpad-fundamentals',
  NOW(),
  NOW()
),
(
  'section-mission',
  'The Mission',
  'Define your mission and core values',
  'launchpad-fundamentals',
  NOW(),
  NOW()
),
(
  'section-plan',
  'The Plan',
  'Create a comprehensive business plan',
  'launchpad-fundamentals',
  NOW(),
  NOW()
),
(
  'section-baseline',
  'The Baseline',
  'Establish your business foundation',
  'launchpad-fundamentals',
  NOW(),
  NOW()
),
(
  'section-assessment',
  'The Assessment',
  'Evaluate your progress and next steps',
  'launchpad-fundamentals',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Create lessons for each section
INSERT INTO lessons (
  id,
  title,
  content,
  details,
  section_id,
  created_at,
  updated_at
) VALUES 
-- Visionary Section Lessons
(
  'lesson-visionary-1',
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
  'section-visionary',
  NOW(),
  NOW()
),
(
  'lesson-visionary-2',
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
  'section-visionary',
  NOW(),
  NOW()
),
-- Mission Section Lessons
(
  'lesson-mission-1',
  'Defining Your Mission',
  'Your mission is your business\'s purpose - why you exist and what you do.

## Mission vs Vision

- **Vision** = Where you want to go (future)
- **Mission** = What you do and why (present)

## Mission Components

1. **What you do** - Your core activities
2. **Who you serve** - Your target audience
3. **How you do it** - Your approach or method
4. **Why it matters** - The impact you make

## Examples

- "To provide the best customer service in the world"
- "To make the world a better place through technology"
- "To help people achieve their dreams"

Complete the form below to define your mission.',
  'Learn the difference between mission and vision.',
  'section-mission',
  NOW(),
  NOW()
),
-- Plan Section Lessons
(
  'lesson-plan-1',
  'Creating Your Business Plan',
  'A business plan is your roadmap to success. It outlines how you\'ll achieve your vision and mission.

## Business Plan Components

1. **Executive Summary** - Overview of your business
2. **Market Analysis** - Understanding your market
3. **Strategy** - How you\'ll compete
4. **Financial Projections** - Revenue and cost estimates
5. **Implementation Timeline** - Key milestones and deadlines

## Why You Need a Plan

- **Clarity** - Forces you to think through details
- **Funding** - Required for investors and loans
- **Guidance** - Keeps you on track
- **Communication** - Helps explain your business to others

Use the form below to start building your business plan.',
  'Learn the essential components of a business plan.',
  'section-plan',
  NOW(),
  NOW()
),
-- Baseline Section Lessons
(
  'lesson-baseline-1',
  'Establishing Your Foundation',
  'Your business foundation includes the core elements that support everything else.

## Foundation Elements

1. **Legal Structure** - LLC, Corporation, etc.
2. **Financial Systems** - Accounting, banking, budgeting
3. **Team Structure** - Roles, responsibilities, hiring
4. **Technology Stack** - Tools and systems you\'ll use
5. **Processes** - How work gets done

## Why Foundation Matters

- **Scalability** - Good foundation supports growth
- **Efficiency** - Proper systems save time and money
- **Compliance** - Legal and financial requirements
- **Risk Management** - Protects your business

Complete the form below to assess your current foundation.',
  'Learn how to establish a solid business foundation.',
  'section-baseline',
  NOW(),
  NOW()
),
-- Assessment Section Lessons
(
  'lesson-assessment-1',
  'Evaluating Your Progress',
  'Regular assessment helps you stay on track and make necessary adjustments.

## Assessment Framework

1. **Progress Review** - What have you accomplished?
2. **Gap Analysis** - What\'s missing or needs improvement?
3. **Market Feedback** - What are customers saying?
4. **Financial Health** - Are you meeting revenue goals?
5. **Team Performance** - Is everyone aligned and productive?

## Assessment Questions

- Are you on track to achieve your vision?
- What obstacles are you facing?
- What opportunities should you pursue?
- What changes do you need to make?

Use the form below to evaluate your current progress.',
  'Learn how to assess your business progress effectively.',
  'section-assessment',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  details = EXCLUDED.details,
  updated_at = NOW();

-- Verify everything was created
SELECT '=== VERIFICATION ===' as info;
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