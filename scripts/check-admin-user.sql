-- Check and fix admin user in database
-- Run this in your Supabase SQL editor

-- First, let's see what users exist
SELECT '=== ALL USERS IN DATABASE ===' as info;
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
ORDER BY created_at DESC;

-- Check if admin user exists
SELECT '=== ADMIN USER CHECK ===' as info;
SELECT 
  id,
  first_name,
  last_name,
  email,
  role,
  created_at
FROM users 
WHERE email = 'admin@thinkmoda.com' OR role = 'ADMIN';

-- If admin user doesn't exist, create it
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
) ON CONFLICT (email) DO UPDATE SET
  role = 'ADMIN',
  updated_at = NOW();

-- Verify admin user was created/updated
SELECT '=== ADMIN USER VERIFICATION ===' as info;
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

-- Check total user count
SELECT '=== USER SUMMARY ===' as info;
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as admin_users,
  COUNT(CASE WHEN role = 'BASIC' THEN 1 END) as basic_users
FROM users; 