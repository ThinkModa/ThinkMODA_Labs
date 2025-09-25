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

async function analyzeAutoAdvanceTiming() {
  try {
    console.log('🔍 Analyzing auto-advance timing and state management issues...\n')
    
    // Step 1: Analyze the current flow
    console.log('1️⃣ CURRENT AUTO-ADVANCE FLOW:')
    console.log('   Step 1: User clicks "Complete Lesson"')
    console.log('   Step 2: refreshUserProgress() - fetches latest progress from DB')
    console.log('   Step 3: 1000ms delay')
    console.log('   Step 4: canCompleteLesson() check')
    console.log('   Step 5: handleMarkLessonCompleted() - updates DB + local state')
    console.log('   Step 6: 1500ms delay')
    console.log('   Step 7: autoAdvanceToNextLesson() called')
    console.log('   Step 8: refreshUserProgress() again - fetches progress from DB')
    console.log('   Step 9: getNextUnlockedLesson() - finds next lesson')
    console.log('   Step 10: setSelectedLesson() + setCurrentLessonContent()')
    console.log('')
    
    // Step 2: Identify potential issues
    console.log('2️⃣ POTENTIAL TIMING ISSUES:')
    console.log('')
    
    console.log('❌ ISSUE 1: Double Progress Refresh')
    console.log('   • refreshUserProgress() called twice (steps 2 & 8)')
    console.log('   • Second refresh might overwrite local state updates')
    console.log('   • Race condition between DB update and local state')
    console.log('')
    
    console.log('❌ ISSUE 2: State Update Race Condition')
    console.log('   • handleMarkLessonCompleted() updates local state immediately')
    console.log('   • autoAdvanceToNextLesson() calls refreshUserProgress() again')
    console.log('   • This might overwrite the local state with stale DB data')
    console.log('')
    
    console.log('❌ ISSUE 3: Async State Updates')
    console.log('   • setUserProgress() is async and might not complete before getNextUnlockedLesson()')
    console.log('   • getNextUnlockedLesson() depends on userProgress state')
    console.log('   • If state is stale, it might find wrong next lesson')
    console.log('')
    
    console.log('❌ ISSUE 4: Multiple setTimeout Calls')
    console.log('   • 1000ms delay in completion handler')
    console.log('   • 1500ms delay before auto-advance')
    console.log('   • 300ms delay in auto-advance function')
    console.log('   • 500ms delay for transition end')
    console.log('   • Total: 3300ms of delays - too much complexity')
    console.log('')
    
    // Step 3: Check for duplicate completion handlers
    console.log('3️⃣ DUPLICATE COMPLETION HANDLERS:')
    console.log('   • Found TWO different completion button handlers in the code')
    console.log('   • Handler 1 (lines 700-750): Uses auto-advance with 1500ms delay')
    console.log('   • Handler 2 (lines 1020-1050): Uses window.location.reload() with 1000ms delay')
    console.log('   • This suggests inconsistent behavior across different UI states')
    console.log('')
    
    // Step 4: Analyze the getNextUnlockedLesson dependency
    console.log('4️⃣ getNextUnlockedLesson DEPENDENCY ISSUE:')
    console.log('   • getNextUnlockedLesson() depends on userProgress state')
    console.log('   • userProgress state is updated by setUserProgress()')
    console.log('   • setUserProgress() is called by refreshUserProgress()')
    console.log('   • refreshUserProgress() is async and might not complete before getNextUnlockedLesson()')
    console.log('   • This creates a race condition')
    console.log('')
    
    // Step 5: Check for state reset issues
    console.log('5️⃣ POTENTIAL STATE RESET ISSUES:')
    console.log('   • Course data might be reloading and resetting selectedLesson')
    console.log('   • useEffect hooks might be interfering with state updates')
    console.log('   • Multiple state updates happening simultaneously')
    console.log('')
    
    // Step 6: Proposed solutions
    console.log('6️⃣ PROPOSED SOLUTIONS:')
    console.log('')
    
    console.log('🔧 SOLUTION 1: Fix Race Condition')
    console.log('   • Remove the second refreshUserProgress() call in autoAdvanceToNextLesson()')
    console.log('   • Use the local state that was already updated by handleMarkLessonCompleted()')
    console.log('   • This eliminates the race condition')
    console.log('')
    
    console.log('🔧 SOLUTION 2: Simplify Timing')
    console.log('   • Remove unnecessary delays')
    console.log('   • Use a single, shorter delay for user feedback')
    console.log('   • Make the flow more predictable')
    console.log('')
    
    console.log('🔧 SOLUTION 3: Fix getNextUnlockedLesson Logic')
    console.log('   • Pass the updated progress directly to getNextUnlockedLesson()')
    console.log('   • Don\'t rely on state that might be stale')
    console.log('   • Make the function more deterministic')
    console.log('')
    
    console.log('🔧 SOLUTION 4: Consolidate Completion Handlers')
    console.log('   • Remove duplicate completion button handlers')
    console.log('   • Use consistent auto-advance behavior everywhere')
    console.log('   • Eliminate window.location.reload() calls')
    console.log('')
    
    // Step 7: Root cause summary
    console.log('7️⃣ ROOT CAUSE SUMMARY:')
    console.log('='.repeat(60))
    console.log('🎯 PRIMARY ISSUE: Race condition between local state and DB refresh')
    console.log('   • handleMarkLessonCompleted() updates local state')
    console.log('   • autoAdvanceToNextLesson() calls refreshUserProgress() again')
    console.log('   • This overwrites the local state with potentially stale DB data')
    console.log('   • getNextUnlockedLesson() then uses stale data to find next lesson')
    console.log('')
    console.log('🎯 SECONDARY ISSUES:')
    console.log('   • Too many delays and async operations')
    console.log('   • Duplicate completion handlers with different behavior')
    console.log('   • Complex state management with multiple async updates')
    console.log('')
    console.log('💡 RECOMMENDED FIX:')
    console.log('   1. Remove refreshUserProgress() call from autoAdvanceToNextLesson()')
    console.log('   2. Pass updated progress directly to getNextUnlockedLesson()')
    console.log('   3. Simplify timing and remove unnecessary delays')
    console.log('   4. Consolidate completion handlers')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

analyzeAutoAdvanceTiming()
