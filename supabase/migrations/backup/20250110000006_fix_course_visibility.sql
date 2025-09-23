-- Fix course visibility and ensure admin user can see the course
-- Make the LaunchPad Onboarding course public and published

UPDATE public.courses 
SET 
    visibility = 'public',
    is_published = true,
    description = 'Please complete the following onboarding activities to kick off your LaunchPad journey. Good luck!'
WHERE slug = 'launchpad-onboarding';

-- Also ensure the admin user exists with the correct password hash from production
-- The password hash corresponds to a known password (you'll need to provide the actual password)
-- For now, let's just ensure the admin user has the right role and details

UPDATE public.users 
SET 
    first_name = 'Admin',
    last_name = 'User',
    company_name = 'ThinkMODA Labs',
    phone_number = '+1-555-ADMIN-01',
    role = 'ADMIN'
WHERE email = 'admin@thinkmoda.co';
