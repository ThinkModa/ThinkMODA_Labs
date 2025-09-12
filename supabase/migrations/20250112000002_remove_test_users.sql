-- Remove test admin users for production
-- This migration removes staging-specific test users

-- Remove staging admin user
DELETE FROM public.users WHERE email = 'staging-admin@thinkmoda.co';

-- Update production admin password to a secure one
-- Note: This should be updated with a proper secure password hash
UPDATE public.users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    updated_at = NOW()
WHERE email = 'admin@thinkmoda.co';

-- Remove any test users that might have been created during development
DELETE FROM public.users WHERE email LIKE '%test%' OR email LIKE '%staging%';
