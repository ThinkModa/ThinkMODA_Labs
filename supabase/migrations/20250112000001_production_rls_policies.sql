-- Production RLS policies for ThinkMODA Labs
-- This migration sets up proper Row Level Security for production

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Anyone can view open courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage all courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view sections of accessible courses" ON public.sections;
DROP POLICY IF EXISTS "Admins can manage all sections" ON public.sections;
DROP POLICY IF EXISTS "Users can view lessons of accessible sections" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.lessons;
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Service role can manage all progress" ON public.user_progress;

-- Courses policies
CREATE POLICY "Anyone can view public courses" ON public.courses
    FOR SELECT USING (visibility = 'public' AND is_published = true);

CREATE POLICY "Admins can manage all courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = (SELECT id FROM public.users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')::uuid
            AND users.role = 'ADMIN'
        )
    );

-- Sections policies
CREATE POLICY "Anyone can view sections of public courses" ON public.sections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = sections.course_id 
            AND courses.visibility = 'public' 
            AND courses.is_published = true
        )
    );

CREATE POLICY "Admins can manage all sections" ON public.sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = (SELECT id FROM public.users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')::uuid
            AND users.role = 'ADMIN'
        )
    );

-- Lessons policies
CREATE POLICY "Anyone can view lessons of public courses" ON public.lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sections 
            JOIN public.courses ON courses.id = sections.course_id
            WHERE sections.id = lessons.section_id 
            AND courses.visibility = 'public' 
            AND courses.is_published = true
        )
    );

CREATE POLICY "Admins can manage all lessons" ON public.lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = (SELECT id FROM public.users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')::uuid
            AND users.role = 'ADMIN'
        )
    );

-- User progress policies
CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR SELECT USING (
        user_id = (SELECT id FROM public.users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')::uuid
    );

CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR INSERT WITH CHECK (
        user_id = (SELECT id FROM public.users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')::uuid
    );

CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR UPDATE USING (
        user_id = (SELECT id FROM public.users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')::uuid
    );

-- Service role policy for webhooks and admin operations
CREATE POLICY "Service role can manage all progress" ON public.user_progress
    FOR ALL USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- User courses policies
CREATE POLICY "Users can view own course assignments" ON public.user_courses
    FOR SELECT USING (
        user_id = (SELECT id FROM public.users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')::uuid
    );

CREATE POLICY "Admins can manage all course assignments" ON public.user_courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE users.id = (SELECT id FROM public.users WHERE email = current_setting('request.jwt.claims', true)::json->>'email')::uuid
            AND users.role = 'ADMIN'
        )
    );
