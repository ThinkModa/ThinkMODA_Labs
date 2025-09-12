// Test script to manually test lesson completion
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDY2OTUsImV4cCI6MjA3MTg4MjY5NX0.vNLTiiwfLmN15mpNagL1q_m2WHJ0QNJHRIKSKy4unig'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLessonCompletion() {
  try {
    console.log('Testing lesson completion...')
    
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
    
    const lesson = lessons[0]
    console.log('Lesson found:', lesson.title)
    
    // Test the completion logic from the progress service
    const content = lesson.content || ''
    const hasTypeform = content.includes('form.typeform.com') || content.includes('typeform.com') || content.includes('/typeform ')
    
    console.log('Has embedded Typeform:', hasTypeform)
    console.log('Should be completable:', !hasTypeform)
    
    if (!hasTypeform) {
      console.log('Lesson has no Typeform - should be completable')
      
      // Try to mark as completed
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      if (progressError) {
        console.error('Error marking lesson as completed:', progressError)
        return
      }
      
      console.log('Lesson marked as completed successfully:', progress)
      
      // Verify the completion
      const { data: verifyProgress, error: verifyError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson.id)
        .single()
      
      if (verifyError) {
        console.error('Error verifying progress:', verifyError)
        return
      }
      
      console.log('Verified progress:', verifyProgress)
      console.log('Is completed:', verifyProgress.completed)
      
    } else {
      console.log('Lesson has Typeform - checking Typeform completion...')
      
      // Check if Typeform is completed
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
      
      console.log('Typeform completed:', !!typeformProgress?.typeform_submitted)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testLessonCompletion()
