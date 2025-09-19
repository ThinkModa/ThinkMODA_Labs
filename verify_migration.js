#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

console.log('🔍 Verifying database migration...');
console.log('🌐 Target: Production database');
console.log('');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Test the webhook schema compatibility
async function verifyMigration() {
  try {
    console.log('🧪 Testing user_progress table schema...');
    
    // Test 1: Try to insert a record with the new columns
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000001',
      lesson_id: '00000000-0000-0000-0000-000000000001',
      completed: true,
      completed_at: new Date().toISOString(),
      completion_data: { 
        typeform_token: 'test-token',
        typeform_submitted_at: new Date().toISOString(),
        typeform_event_id: 'test-event',
        answers: [],
        hidden_fields: { user_email: 'test@example.com', lesson_id: '00000000-0000-0000-0000-000000000001' }
      },
      source: 'typeform'
    };
    
    const { data, error } = await supabase
      .from('user_progress')
      .insert(testData);
    
    if (error) {
      console.log('❌ Migration verification failed:');
      console.log('Error:', error.message);
      console.log('Code:', error.code);
      return false;
    }
    
    console.log('✅ user_progress table schema is correct');
    
    // Test 2: Try to update the record
    const { error: updateError } = await supabase
      .from('user_progress')
      .update({
        completed_at: new Date().toISOString(),
        completion_data: { updated: true },
        source: 'webhook'
      })
      .eq('user_id', '00000000-0000-0000-0000-000000000001')
      .eq('lesson_id', '00000000-0000-0000-0000-000000000001');
    
    if (updateError) {
      console.log('❌ Update test failed:', updateError.message);
      return false;
    }
    
    console.log('✅ user_progress table update works correctly');
    
    // Test 3: Clean up test record
    const { error: deleteError } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', '00000000-0000-0000-0000-000000000001')
      .eq('lesson_id', '00000000-0000-0000-0000-000000000001');
    
    if (deleteError) {
      console.log('❌ Cleanup failed:', deleteError.message);
      return false;
    }
    
    console.log('✅ Test data cleaned up successfully');
    
    // Test 4: Test users table access
    console.log('');
    console.log('🧪 Testing users table access...');
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, company_name, phone_number')
      .limit(1);
    
    if (usersError) {
      console.log('❌ Users table access failed:', usersError.message);
      return false;
    }
    
    console.log('✅ Users table access works correctly');
    
    // Test 5: Test lessons table access
    console.log('');
    console.log('🧪 Testing lessons table access...');
    
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, section_id, content, details, description')
      .limit(1);
    
    if (lessonsError) {
      console.log('❌ Lessons table access failed:', lessonsError.message);
      return false;
    }
    
    console.log('✅ Lessons table access works correctly');
    
    console.log('');
    console.log('🎉 Migration verification completed successfully!');
    console.log('✅ All database operations required by the webhook are working');
    console.log('✅ The Typeform webhook should now work without errors');
    
    return true;
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return false;
  }
}

// Run the verification
verifyMigration().then(success => {
  if (success) {
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Re-enable your Typeform webhooks in the Typeform dashboard');
    console.log('2. Test with a real form submission');
    console.log('3. Monitor webhook delivery logs');
    process.exit(0);
  } else {
    console.log('');
    console.log('❌ Migration verification failed');
    console.log('Please check the migration was executed correctly');
    process.exit(1);
  }
});
