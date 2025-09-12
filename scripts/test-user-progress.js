// Test script to check user progress and completion logic
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDY2OTUsImV4cCI6MjA3MTg4MjY5NX0.vNLTiiwfLmN15mpNagL1q_m2WHJ0QNJHRIKSKy4unig'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUserProgress() {
  try {
    console.log('Testing user progress...')
    
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
    
    if (!users || users.length === 0) {
      console.log('User not found')
      return
    }
    
    const user = users[0]
    console.log('User found:', user.email, user.first_name, user.last_name)
    
    // Get the first lesson
    const { data: lessons, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, content')
      .eq('title', 'WELCOME TO LAUNCHPAD!')
      .limit(1)
    
    if (lessonError) {
      console.error('Error fetching lesson:', lessonError)
      return
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('Lesson not found')
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
    
    // Test the completion logic
    const content = lesson.content || ''
    const hasTypeform = content.includes('form.typeform.com') || content.includes('typeform.com') || content.includes('/typeform ')
    
    console.log('Lesson content length:', content.length)
    console.log('Has embedded Typeform:', hasTypeform)
    console.log('Should be completable:', !hasTypeform)
    
    if (progress && progress.length > 0) {
      console.log('Progress record exists:', progress[0])
      console.log('Is completed:', progress[0].completed)
      console.log('Typeform submitted:', progress[0].typeform_submitted)
    } else {
      console.log('No progress record found - lesson not started')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testUserProgress()
