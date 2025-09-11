-- Migrate production data to staging database with correct schema
-- This will copy all courses, users, lessons, and progress data

-- Insert courses with new UUIDs
INSERT INTO public.courses (id, title, description, slug, visibility, is_published, created_at, updated_at) VALUES
(gen_random_uuid(), 'LaunchPad Onboarding', 'Please complete the following onboarding activities to kick off your LaunchPad journey. Good luck!', 'launchpad-onboarding', 'public', true, '2025-08-04 22:15:18.28+00', '2025-08-04 22:15:18.28+00')
ON CONFLICT (slug) DO NOTHING;

-- Get the course ID for reference and insert sections
DO $$
DECLARE
    course_id_var UUID;
    section_id_var UUID;
BEGIN
    SELECT id INTO course_id_var FROM public.courses WHERE slug = 'launchpad-onboarding' LIMIT 1;
    
    -- Insert sections
    INSERT INTO public.sections (id, title, description, course_id, order_position, created_at, updated_at) VALUES
    (gen_random_uuid(), 'Onboarding Journey', 'Complete the following steps to access Launchpad materials.', course_id_var, '1', '2025-08-04 22:15:44.349+00', '2025-08-04 22:15:44.349+00'),
    (gen_random_uuid(), '1. Mind Mapping Your Concept | Business Model Canvas', '', course_id_var, '2', '2025-08-12 16:26:01.48299+00', '2025-08-12 16:26:01.48299+00')
    ON CONFLICT (course_id, order_position) DO NOTHING;
    
    -- Get the section ID for lessons
    SELECT id INTO section_id_var FROM public.sections WHERE title = 'Onboarding Journey' LIMIT 1;
    
    -- Insert lessons with content_data as JSONB
    INSERT INTO public.lessons (id, title, description, section_id, order_position, content_type, content_data, is_published, created_at, updated_at) VALUES
    (gen_random_uuid(), 'WELCOME TO LAUNCHPAD!', 'It''s time to level up!', section_id_var, '1', 'rich_text', '{"content": "Please watch the introduction video below\n\n/embed https://www.youtube.com/embed/FYk-zNfYeQY\n\nNext Step:\n\n__**Create Founder Profile**__\n\n### **Click \"Complete Lesson\" to start the Onboarding process**"}', true, '2025-08-06 15:45:21.304852+00', '2025-08-06 17:01:43.969+00'),

    (gen_random_uuid(), 'THE VISIONARY', 'The icon behind the mission!', section_id_var, '2', 'rich_text', '{"content": "Complete the form below to create your founder profile.\n\n/embed https://form.typeform.com/to/pZp1eiDj#company_name=xxxxx&lesson_id=xxxxx&first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&user_id=xxxxx&course_id=xxxxx\n\nNext Step:\n\n__**Company Profile**__\n\n### **Click \"Complete Lesson\" to create your Company Profile**"}', true, '2025-08-06 15:47:18.785345+00', '2025-08-06 15:47:18.785345+00'),

    (gen_random_uuid(), 'THE MISSION', 'The legacy in the making', section_id_var, '3', 'rich_text', '{"content": "Complete the form below to create your company profile.\n\n/embed https://form.typeform.com/to/ZIevyTG8#lesson_id=xxxxx&company_name=xxxxx&first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&course_id=xxxxx&user_id=xxxxx\n\nNext Step:\n\n__**Strategic Planning Exercise**__\n\n### Click \"Complete Lesson\" to begin the Strategic Planning Exercise"}', true, '2025-08-06 15:49:35.92785+00', '2025-08-06 15:49:35.92785+00'),

    (gen_random_uuid(), 'THE PLAN', 'Crafting your strategic roadmap', section_id_var, '4', 'rich_text', '{"content": "Watch the video and complete the exercise form below to create a strategic plan that our team can review before the cohort kickoff.\n\n/embed https://www.youtube.com/embed/z7RAsNaFQl4\n\n/embed https://form.typeform.com/to/xHocdpeq#first_name=xxxxx&last_name=xxxxx&email=xxxxx&lesson_id=xxxxx&company_name=xxxxx&phone_number=xxxxx&course_id=xxxxx&user_id=xxxxx\n\nNext Step:\n\n__**Company Benchmark**__\n\n### Click \"Complete Lesson\" to begin the Company Benchmark form"}', true, '2025-08-06 15:56:26.612997+00', '2025-08-06 15:56:26.612997+00'),

    (gen_random_uuid(), 'THE BASELINE', 'Let''s measure where we are today', section_id_var, '5', 'rich_text', '{"content": "Complete the form below to submit your current metrics for review.\n\n/embed https://form.typeform.com/to/TgYsSfUX#first_name=xxxxx&last_name=xxxxx&email=xxxxx&lesson_id=xxxxx&company_name=xxxxx&phone_number=xxxxx&user_id=xxxxx&course_id=xxxxx\n\nNext Step:\n\n__**Pre-Assessment**__\n\n### Click \"Complete Lesson\" to begin the Pre-Assessment survey"}', true, '2025-08-06 15:57:47.565115+00', '2025-08-06 15:57:47.565115+00'),

    (gen_random_uuid(), 'THE ASSESSMENT', 'What you know today', section_id_var, '6', 'rich_text', '{"content": "Complete the pre-assessment so we can gauge your knowledge on the upcoming topics.\n\n/embed https://form.typeform.com/to/NjzuCVgZ#first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&lesson_id=xxxxx&company_name=xxxxx&course_id=xxxxx&user_id=xxxxx\n\nFinal Step:\n\n__**Access Dashboard**__\n\n### Click \"Complete Lesson\" to finish the Onboarding process"}', true, '2025-08-06 15:59:42.924606+00', '2025-08-06 15:59:42.924606+00'),

    (gen_random_uuid(), 'PRE-TESTIMONIAL', 'Tell us what you hope', section_id_var, '7', 'rich_text', '{"content": "Purpose: This quick video helps us understand your journey, expectations, and goals before you begin the LaunchPad Accelerator. It also sets the stage to reflect on your growth by the end of the program. Please be sure to answer all questions that are underlined.\n\n**🎥Video Recording Instructions**\n✅ Keep your camera vertical (portrait mode).\n✅ Use Cinematic Mode if available for best video quality.\n✅ Use a microphone or headphones for clear audio, or record in a quiet space.\n✅ If you stumble, just keep going — we''ll edit it.\n✅ Keep the total video under 90 seconds.\n✅ Submit your video at the link provided below.\n✅ Relax and speak naturally — think of it as a conversation.\n**📝 What to Share in Your Video**\nUse this as a loose guide. Just be comfortable and talk through a few questions from each section.\n\n### Introduction\n- State and spell your full name.\n- State and spell your company name.\n- Give a short description of what your business does or the idea you''re working on.\n### Where You''re Starting From\n- How long have you been running your business?\n- What is your role/title?\n- What have been some of the highlights so far?\n- What are the biggest challenges you''ve faced?\n- What are the different resources you have found useful in your small business journey in Ohio?\n\n### Why LaunchPad?\n- What motivated you to join LaunchPad?\n- Have you participated in any other accelerator programs before? If yes, what did you like or dislike about them?\n\n- What are you expecting to learn or gain from this experience?\n- What feels like it will be the most challenging part of the program?\n- How hard or easy do you expect this program to be—and why?\n### Vision for Success\n- What outcomes would feel like success by the end of the program?\n- What does growth look like for your business after LaunchPad?\nAnything Else?\n- Is there anything else you''d like us to know about you or your business?\n\n[📤 Upload Your Video Here](https://drive.google.com/drive/folders/1osS6nXcAOw8_UBWd_12HVaU9Wjybqq3w?usp=sharing)"}', true, '2025-08-06 16:05:52.45187+00', '2025-08-06 17:00:50.576+00')
    ON CONFLICT (section_id, order_position) DO NOTHING;
END $$;

-- Insert test users
INSERT INTO public.users (id, first_name, last_name, email, password, role, created_at, updated_at, company_name, phone_number) VALUES
(gen_random_uuid(), 'Admin', 'User', 'admin@thinkmoda.co', '$2b$10$xToV3a5CbkkVvxHBuJNniu/yEvn8uCLJQTUDugT7eGWFiobbRYJh6', 'ADMIN', '2025-08-05 21:01:54.483614+00', '2025-08-05 21:23:29.564+00', 'ThinkMODA Labs', '+1-555-ADMIN-01'),
(gen_random_uuid(), 'Test', 'User', 'test@example.com', '$2b$10$VfWsKacacCkLajEdR5Fi3OxrZuvTlTgovBYuXn/jmhSj1wYE6YPgW', 'BASIC', '2025-08-05 06:55:31.684688+00', '2025-08-05 06:55:31.684688+00', 'Test Company', '555-0123')
ON CONFLICT (email) DO NOTHING;
