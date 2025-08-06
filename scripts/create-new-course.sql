-- Create new course structure with test content
-- Run this in your Supabase SQL editor

-- 1. First, let's clean up any existing test data
DELETE FROM user_progress;
DELETE FROM lessons WHERE title LIKE '%TEST%' OR title LIKE '%NEW%';
DELETE FROM sections WHERE title LIKE '%TEST%' OR title LIKE '%NEW%';
DELETE FROM courses WHERE title LIKE '%TEST%' OR title LIKE '%NEW%';

-- 2. Create the new course
INSERT INTO courses (
  id,
  title,
  description,
  visibility,
  created_at,
  updated_at
) VALUES (
  'launchpad-onboarding-test',
  'Launchpad Onboarding (Test)',
  'Test course for Launchpad onboarding with embedded Typeform functionality',
  'OPEN',
  NOW(),
  NOW()
);

-- 3. Create the main section
INSERT INTO sections (
  id,
  title,
  description,
  course_id,
  created_at,
  updated_at
) VALUES (
  'section-onboarding-test',
  'Onboarding Fundamentals',
  'Essential steps to get started with your business launch',
  'launchpad-onboarding-test',
  NOW(),
  NOW()
);

-- 4. Create test lessons with embedded content

-- Lesson 1: Welcome
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
  'section-onboarding-test',
  NOW(),
  NOW()
);

-- Lesson 2: Test Typeform (Simple)
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Test Typeform',
  'This is a test lesson with a simple Typeform to verify the course ID functionality.

Complete the form below to test the embedded Typeform feature.

/embed https://form.typeform.com/to/test123

### What to Test

- Form loads correctly
- Course ID is passed properly
- User data is captured
- Lesson completion works

### Next Steps

After completing the form, click "Complete Lesson" to continue.',
  'section-onboarding-test',
  NOW(),
  NOW()
);

-- Lesson 3: Mission Statement
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Mission Statement',
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
  'section-onboarding-test',
  NOW(),
  NOW()
);

-- Lesson 4: Vision Planning
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Vision Planning',
  'Now it''s time to create your strategic vision.

### Strategic Vision

A solid vision guides your business growth and development.

### Key Elements

- **Goals**: What do you want to achieve?
- **Strategy**: How will you get there?
- **Timeline**: When will you accomplish each step?
- **Resources**: What do you need to succeed?

### Your Business Vision

Develop a comprehensive vision that outlines your path to success.

### Next Steps

Complete this lesson to continue your journey.',
  'section-onboarding-test',
  NOW(),
  NOW()
);

-- Lesson 5: Business Plan
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Business Plan',
  'Establish your business plan and strategic framework.

### Understanding Your Business Plan

Your business plan represents your roadmap to success.

### Key Metrics

- **Current Performance**: What are your current numbers?
- **Market Position**: Where do you stand in your industry?
- **Resource Assessment**: What do you have to work with?
- **Gap Analysis**: What do you need to improve?

### Your Business Plan

Document your strategic approach to measure future progress.

### Next Steps

Complete this lesson to move forward.',
  'section-onboarding-test',
  NOW(),
  NOW()
);

-- Lesson 6: Market Research
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Market Research',
  'Conduct comprehensive market research for your business.

### Market Research Fundamentals

Understanding your market is crucial for success.

### Research Areas

- **Target Audience**: Who are your customers?
- **Competition**: Who are your competitors?
- **Market Size**: What is the market opportunity?
- **Trends**: What are the current market trends?

### Your Market Research

Complete thorough research to inform your business decisions.

### Next Steps

Complete this lesson to continue.',
  'section-onboarding-test',
  NOW(),
  NOW()
);

-- Lesson 7: Financial Planning
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Financial Planning',
  'Create a solid financial foundation for your business.

### Financial Planning Essentials

A strong financial plan supports your business growth.

### Key Components

- **Revenue Projections**: How much will you earn?
- **Cost Structure**: What are your expenses?
- **Funding Strategy**: How will you finance growth?
- **Cash Flow Management**: How will you manage money?

### Your Financial Plan

Develop a comprehensive financial strategy for your business.

### Next Steps

Complete this lesson to continue.',
  'section-onboarding-test',
  NOW(),
  NOW()
);

-- Lesson 8: Final Assessment
INSERT INTO lessons (
  id,
  title,
  content,
  section_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Final Assessment',
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

You''ve completed the Launchpad onboarding course!',
  'section-onboarding-test',
  NOW(),
  NOW()
);

-- 5. Verify the course was created successfully
SELECT 
  'Course created:' as info,
  c.title as course_title,
  c.visibility,
  COUNT(s.id) as section_count,
  COUNT(l.id) as lesson_count
FROM courses c
LEFT JOIN sections s ON c.id = s.course_id
LEFT JOIN lessons l ON s.id = l.section_id
WHERE c.id = 'launchpad-onboarding-test'
GROUP BY c.id, c.title, c.visibility;

-- 6. Show all lessons in order
SELECT 
  'Lesson order:' as info,
  l.title,
  l.created_at,
  ROW_NUMBER() OVER (ORDER BY l.created_at) as lesson_number
FROM lessons l
JOIN sections s ON l.section_id = s.id
WHERE s.course_id = 'launchpad-onboarding-test'
ORDER BY l.created_at;

-- 7. Show the test Typeform lesson
SELECT 
  'Test Typeform lesson:' as info,
  title,
  content
FROM lessons 
WHERE title = 'Test Typeform'; 