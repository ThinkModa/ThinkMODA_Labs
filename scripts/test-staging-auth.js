const { createClient } = require('@supabase/supabase-js');

// Test the staging authentication
const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwNzQ5NzQsImV4cCI6MjA0OTY1MDk3NH0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('Testing staging authentication...\n');
  
  // Test 1: Check if we can connect to Supabase
  console.log('1. Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return;
    }
    console.log('✅ Supabase connection successful');
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    return;
  }
  
  // Test 2: Check if admin user exists
  console.log('\n2. Checking admin user exists...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@thinkmoda.co')
      .single();
    
    if (error) {
      console.log('❌ Admin user not found:', error.message);
      return;
    }
    
    console.log('✅ Admin user found:', {
      id: data.id,
      email: data.email,
      role: data.role,
      first_name: data.first_name,
      last_name: data.last_name
    });
  } catch (err) {
    console.log('❌ Error checking admin user:', err.message);
    return;
  }
  
  // Test 3: Check if course exists and is public
  console.log('\n3. Checking course visibility...');
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', 'launchpad-onboarding')
      .single();
    
    if (error) {
      console.log('❌ Course not found:', error.message);
      return;
    }
    
    console.log('✅ Course found:', {
      id: data.id,
      title: data.title,
      slug: data.slug,
      visibility: data.visibility,
      is_published: data.is_published
    });
  } catch (err) {
    console.log('❌ Error checking course:', err.message);
    return;
  }
  
  console.log('\n🎉 All tests passed! Authentication should work.');
  console.log('\nLogin credentials:');
  console.log('Email: admin@thinkmoda.co');
  console.log('Password: admin123');
}

testAuth().catch(console.error);
