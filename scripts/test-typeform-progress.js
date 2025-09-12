// Test script to check Typeform progress for the second lesson
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDY2OTUsImV4cCI6MjA3MTg4MjY5NX0.vNLTiiwfLmN15mpNagL1q_m2WHJ0QNJHRIKSKy4unig'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTypeformProgress() {
  try {
    console.log('Testing Typeform progress for THE VISIONARY lesson...')
    
    // Get the test user
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('email', 'rahwalton9@gmail.com')
      .limit(1)
    
    if (userError) {
      console.error('Error fetching user:', userError)
      return
    }
    
    const user = users[0]
    console.log('User found:', user.email)
    
    // Get the second lesson
    const { data: lessons, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, content')
      .eq('title', 'THE VISIONARY')
      .limit(1)
    
    if (lessonError) {
      console.error('Error fetching lesson:', lessonError)
      return
    }
    
    const lesson = lessons[0]
    console.log('Lesson found:', lesson.title)
    
    // Check current progress for this lesson
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .limit(1)
    
    if (progressError) {
      console.error('Error fetching progress:', progressError)
      return
    }
    
    console.log('Current progress:', progress)
    
    if (progress && progress.length > 0) {
      const progressRecord = progress[0]
      console.log('Progress record exists:')
      console.log('  - Completed:', progressRecord.completed)
      console.log('  - Typeform submitted:', progressRecord.typeform_submitted)
      console.log('  - Typeform submission ID:', progressRecord.typeform_submission_id)
      console.log('  - Typeform completed at:', progressRecord.typeform_completed_at)
      console.log('  - Typeform URL:', progressRecord.typeform_url)
    } else {
      console.log('No progress record found - lesson not started')
    }
    
    // Test the Typeform completion check
    const { data: typeformProgress, error: typeformError } = await supabase
      .from('user_progress')
      .select('typeform_submitted')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .eq('typeform_submitted', true)
      .single()
    
    if (typeformError && typeformError.code !== 'PGRST116') {
      console.error('Error checking Typeform completion:', typeformError)
      return
    }
    
    console.log('Typeform completion check result:', typeformProgress)
    console.log('Is Typeform completed:', !!typeformProgress?.typeform_submitted)
    
    // Test the canCompleteLesson logic
    const content = lesson.content || ''
    const hasTypeform = content.includes('form.typeform.com') || content.includes('typeform.com') || content.includes('/typeform ')
    
    console.log('Has embedded Typeform:', hasTypeform)
    
    if (hasTypeform) {
      const isTypeformCompleted = !!typeformProgress?.typeform_submitted
      console.log('Can complete lesson:', isTypeformCompleted)
    } else {
      console.log('Can complete lesson: true (no Typeform required)')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testTypeformProgress()
