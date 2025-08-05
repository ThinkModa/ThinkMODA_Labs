-- Clean up and create admin user for ThinkMODA Labs
-- Run this in your Supabase SQL editor

-- First, let's see what users exist
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  created_at
FROM users 
WHERE email LIKE '%admin%' OR role = 'ADMIN';

-- Delete any existing admin users
DELETE FROM users 
WHERE email = 'admin@thinkmoda.com' OR role = 'ADMIN';

-- Create fresh admin user with hashed password
-- Password: Admin123! (hashed with bcrypt)
INSERT INTO users (
  id,
  first_name,
  last_name,
  email,
  password,
  role,
  company_name,
  phone_number,
  created_at,
  updated_at
) VALUES (
  'admin-user-001',
  'Admin',
  'User',
  'admin@thinkmoda.com',
  '$2b$10$xToV3a5CbkkVvxHBuJNniu/yEvn8uCLJQTUDugT7eGWFiobbRYJh6',
  'ADMIN',
  'ThinkMODA Labs',
  '+1-555-ADMIN-01',
  NOW(),
  NOW()
);

-- Verify admin user was created successfully
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  company_name,
  phone_number,
  created_at
FROM users 
WHERE email = 'admin@thinkmoda.com';

-- Also check if the password field is properly set
SELECT 
  id,
  email,
  role,
  CASE 
    WHEN password IS NOT NULL AND LENGTH(password) > 0 THEN 'Password set'
    ELSE 'Password missing'
  END as password_status
FROM users 
WHERE email = 'admin@thinkmoda.com'; 