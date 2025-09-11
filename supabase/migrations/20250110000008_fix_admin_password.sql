-- Fix admin user password with correct hash
-- Password: "admin123"

UPDATE public.users 
SET password = '$2b$10$R6aUI1ku0EOE8D08oUucrOvD170r0QQGpAix4Lo9muA4XXa6Rx/bK'
WHERE email = 'admin@thinkmoda.co';

UPDATE public.users 
SET password = '$2b$10$R6aUI1ku0EOE8D08oUucrOvD170r0QQGpAix4Lo9muA4XXa6Rx/bK'
WHERE email = 'staging-admin@thinkmoda.co';
