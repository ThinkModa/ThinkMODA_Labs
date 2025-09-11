-- Create a test admin user with a known password for staging
-- Password: "admin123" (hashed with bcrypt)

INSERT INTO public.users (id, first_name, last_name, email, password, role, created_at, updated_at, company_name, phone_number) VALUES
(gen_random_uuid(), 'Staging', 'Admin', 'staging-admin@thinkmoda.co', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN', NOW(), NOW(), 'ThinkMODA Labs', '+1-555-STAGING-01')
ON CONFLICT (email) DO NOTHING;

-- Also update the existing admin user with a known password
-- Password: "admin123" (same hash as above)
UPDATE public.users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE email = 'admin@thinkmoda.co';
