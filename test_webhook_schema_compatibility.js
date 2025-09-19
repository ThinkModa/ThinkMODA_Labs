// Test script to verify webhook schema compatibility
// This script tests the database operations that the webhook performs

const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables or replace with actual values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testWebhookSchemaCompatibility() {
  console.log('🧪 Testing webhook schema compatibility...\n');

  try {
    // Test 1: Check if user_progress table has required columns
    console.log('1️⃣ Testing user_progress table structure...');
    const { data: progressColumns, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .limit(1);

    if (progressError) {
      console.error('❌ Error accessing user_progress table:', progressError);
      return false;
    }

    // Check if the table has the required columns by trying to insert a test record
    const testProgressData = {
      user_id: '00000000-0000-0000-0000-000000000001',
      lesson_id: '00000000-0000-0000-0000-000000000001',
      completed: true,
      completed_at: new Date().toISOString(),
      completion_data: { test: 'data' },
      source: 'test'
    };

    const { error: insertError } = await supabase
      .from('user_progress')
      .insert(testProgressData);

    if (insertError) {
      console.error('❌ Error inserting test progress record:', insertError);
      console.error('This indicates missing columns in user_progress table');
      return false;
    }

    // Clean up test record
    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', '00000000-0000-0000-0000-000000000001')
      .eq('lesson_id', '00000000-0000-0000-0000-000000000001');

    console.log('✅ user_progress table has all required columns');

    // Test 2: Check if users table can be queried by email
    console.log('\n2️⃣ Testing users table access...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(1);

    if (usersError) {
      console.error('❌ Error accessing users table:', usersError);
      return false;
    }

    console.log('✅ users table is accessible');

    // Test 3: Check if lessons table can be queried by ID
    console.log('\n3️⃣ Testing lessons table access...');
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, section_id')
      .limit(1);

    if (lessonsError) {
      console.error('❌ Error accessing lessons table:', lessonsError);
      return false;
    }

    console.log('✅ lessons table is accessible');

    // Test 4: Test the exact webhook flow with a mock user
    console.log('\n4️⃣ Testing complete webhook flow...');
    
    // Create a test user
    const testUser = {
      first_name: 'Test',
      last_name: 'User',
      email: 'webhook-test@example.com',
      password: 'test-password-hash',
      role: 'BASIC'
    };

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', testUser.email)
      .single();

    if (existingUser) {
      console.log('ℹ️ Test user already exists, using existing user');
    } else {
      // Create test user
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert(testUser)
        .select()
        .single();

      if (createUserError) {
        console.error('❌ Error creating test user:', createUserError);
        return false;
      }

      console.log('✅ Test user created successfully');
    }

    // Get the user ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', testUser.email)
      .single();

    // Test progress creation (this is what the webhook does)
    const testProgress = {
      user_id: user.id,
      lesson_id: '00000000-0000-0000-0000-000000000001', // Mock lesson ID
      completed: true,
      completed_at: new Date().toISOString(),
      completion_data: {
        typeform_token: 'test-token',
        typeform_submitted_at: new Date().toISOString(),
        typeform_event_id: 'test-event',
        answers: [],
        hidden_fields: { user_email: testUser.email, lesson_id: '00000000-0000-0000-0000-000000000001' }
      },
      source: 'typeform'
    };

    const { error: progressInsertError } = await supabase
      .from('user_progress')
      .insert(testProgress);

    if (progressInsertError) {
      console.error('❌ Error creating test progress:', progressInsertError);
      return false;
    }

    console.log('✅ Test progress record created successfully');

    // Clean up test data
    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id);

    await supabase
      .from('users')
      .delete()
      .eq('email', testUser.email);

    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All webhook schema compatibility tests passed!');
    console.log('✅ The webhook should work correctly with the current database schema');
    
    return true;

  } catch (error) {
    console.error('❌ Unexpected error during testing:', error);
    return false;
  }
}

// Run the test
testWebhookSchemaCompatibility()
  .then(success => {
    if (success) {
      console.log('\n✅ Schema compatibility test completed successfully');
      process.exit(0);
    } else {
      console.log('\n❌ Schema compatibility test failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Test script error:', error);
    process.exit(1);
  });
