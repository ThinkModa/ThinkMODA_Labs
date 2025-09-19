#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

console.log('🚀 Running database migration for webhook compatibility...');
console.log('🌐 Target: Production database');
console.log('📄 Migration: fix_production_schema_for_webhooks.sql');
console.log('');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read the migration file
const migrationSQL = fs.readFileSync('fix_production_schema_for_webhooks.sql', 'utf8');

// Split the migration into individual statements
const statements = migrationSQL
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

console.log(`📋 Found ${statements.length} SQL statements to execute`);
console.log('');

// Execute each statement using the REST API directly
async function runMigration() {
  try {
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        try {
          // Use the REST API to execute SQL
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey
            },
            body: JSON.stringify({ sql: statement })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Error in statement ${i + 1}:`, errorText);
            console.error('Statement:', statement);
            return false;
          }
          
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (fetchError) {
          console.error(`❌ Error in statement ${i + 1}:`, fetchError.message);
          console.error('Statement:', statement);
          return false;
        }
      }
    }
    
    console.log('');
    console.log('🎉 Migration completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  }
}

// Test the current schema first
async function testCurrentSchema() {
  try {
    console.log('🧪 Testing current schema...');
    
    const testData = {
      user_id: '00000000-0000-0000-0000-000000000001',
      lesson_id: '00000000-0000-0000-0000-000000000001',
      completed: true,
      completed_at: new Date().toISOString(),
      completion_data: { test: 'data' },
      source: 'test'
    };
    
    const { data, error } = await supabase
      .from('user_progress')
      .insert(testData);
    
    if (error) {
      console.log('❌ Schema needs migration:', error.message);
      return false;
    } else {
      console.log('✅ Schema is already correct');
      // Clean up test record
      await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', '00000000-0000-0000-0000-000000000001')
        .eq('lesson_id', '00000000-0000-0000-0000-000000000001');
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error testing schema:', error);
    return false;
  }
}

// Main execution
async function main() {
  // Test current schema first
  const schemaOk = await testCurrentSchema();
  
  if (schemaOk) {
    console.log('✅ Database schema is already correct - no migration needed');
    process.exit(0);
  }
  
  console.log('');
  console.log('🔧 Running migration...');
  
  // Run the migration
  const success = await runMigration();
  
  if (success) {
    console.log('✅ Database migration completed successfully');
    
    // Test the schema again
    console.log('');
    console.log('🧪 Testing schema after migration...');
    const finalTest = await testCurrentSchema();
    
    if (finalTest) {
      console.log('✅ Migration verified successfully!');
      process.exit(0);
    } else {
      console.log('❌ Migration verification failed');
      process.exit(1);
    }
  } else {
    console.log('❌ Database migration failed');
    process.exit(1);
  }
}

// Run the migration
main().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
