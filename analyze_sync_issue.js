require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function analyzeSyncIssue() {
  try {
    console.log('🔍 Analyzing frontend/backend synchronization issue...\n')
    
    // Step 1: Check if typeform_submitted column exists
    console.log('1️⃣ Checking database schema...')
    const { data: columns, error: schemaError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'user_progress')
      .in('column_name', ['typeform_submitted', 'source', 'completion_data'])
    
    if (schemaError) {
      console.error('❌ Error checking schema:', schemaError)
    } else {
      console.log('📊 User_progress table columns:')
      columns?.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type}`)
      })
    }
    
    // Step 2: Check how typeform completions are actually stored
    console.log('\n2️⃣ Analyzing typeform completion records...')
    const { data: typeformCompletions, error: typeformError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('source', 'typeform')
      .limit(5)
    
    if (typeformError) {
      console.error('❌ Error fetching typeform completions:', typeformError)
    } else if (typeformCompletions && typeformCompletions.length > 0) {
      console.log('📝 Typeform completion records:')
      typeformCompletions.forEach((record, index) => {
        console.log(`   ${index + 1}. User: ${record.user_id}`)
        console.log(`      Lesson: ${record.lesson_id}`)
        console.log(`      Source: ${record.source}`)
        console.log(`      Completed: ${record.completed}`)
        console.log(`      Has typeform_submitted: ${record.typeform_submitted !== undefined ? 'Yes' : 'No'}`)
        console.log(`      Has completion_data: ${record.completion_data ? 'Yes' : 'No'}`)
        console.log('')
      })
    } else {
      console.log('📝 No typeform completion records found')
    }
    
    // Step 3: Check the specific user's record
    console.log('\n3️⃣ Checking rahwalton9@gmail.com typeform completion...')
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'rahwalton9@gmail.com')
      .single()
    
    if (userError || !user) {
      console.error('❌ User not found')
      return
    }
    
    const { data: userProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', '1d18dafb-0806-4092-adf6-3073dbb41721') // The Visionary lesson
      .single()
    
    if (progressError && progressError.code !== 'PGRST116') {
      console.error('❌ Error fetching user progress:', progressError)
    } else if (userProgress) {
      console.log('📊 User progress record:')
      console.log(`   Completed: ${userProgress.completed}`)
      console.log(`   Source: ${userProgress.source}`)
      console.log(`   Has typeform_submitted: ${userProgress.typeform_submitted !== undefined ? 'Yes' : 'No'}`)
      console.log(`   Typeform_submitted value: ${userProgress.typeform_submitted}`)
      console.log(`   Has completion_data: ${userProgress.completion_data ? 'Yes' : 'No'}`)
    }
    
    // Step 4: Simulate the isTypeformCompleted function
    console.log('\n4️⃣ Simulating isTypeformCompleted function...')
    
    // This is the current logic from progress-supabase.ts
    const { data: typeformCheck, error: typeformCheckError } = await supabase
      .from('user_progress')
      .select('typeform_submitted')
      .eq('user_id', user.id)
      .eq('lesson_id', '1d18dafb-0806-4092-adf6-3073dbb41721')
      .eq('typeform_submitted', true)
      .single()
    
    console.log('🔍 isTypeformCompleted query result:')
    if (typeformCheckError) {
      console.log(`   Error: ${typeformCheckError.message}`)
      console.log(`   Code: ${typeformCheckError.code}`)
    } else {
      console.log(`   Result: ${JSON.stringify(typeformCheck)}`)
    }
    
    // Step 5: Root cause analysis
    console.log('\n📊 ROOT CAUSE ANALYSIS:')
    console.log('='.repeat(60))
    
    const hasTypeformSubmittedColumn = columns?.some(col => col.column_name === 'typeform_submitted')
    const hasSourceColumn = columns?.some(col => col.column_name === 'source')
    
    console.log('🎯 IDENTIFIED ISSUES:')
    console.log('')
    
    if (!hasTypeformSubmittedColumn) {
      console.log('❌ CRITICAL: typeform_submitted column does not exist in database')
      console.log('   • The isTypeformCompleted function queries for typeform_submitted = true')
      console.log('   • But the typeform webhook only sets source = "typeform" and completed = true')
      console.log('   • This creates a mismatch between what the webhook stores and what the frontend checks')
    }
    
    if (hasSourceColumn) {
      console.log('✅ source column exists - webhook is using this correctly')
    } else {
      console.log('❌ source column missing - webhook may not be working properly')
    }
    
    console.log('')
    console.log('🔧 THE PROBLEM:')
    console.log('   1. Typeform webhook creates record with: source="typeform", completed=true')
    console.log('   2. Frontend isTypeformCompleted() checks for: typeform_submitted=true')
    console.log('   3. These are different fields, causing the mismatch')
    console.log('')
    console.log('💡 SOLUTION OPTIONS:')
    console.log('   Option A: Update isTypeformCompleted to check source="typeform" instead')
    console.log('   Option B: Update typeform webhook to also set typeform_submitted=true')
    console.log('   Option C: Add typeform_submitted column and migrate existing data')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

analyzeSyncIssue()
