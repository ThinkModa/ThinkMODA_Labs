// Test script to simulate a Typeform webhook submission
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDY2OTUsImV4cCI6MjA3MTg4MjY5NX0.vNLTiiwfLmN15mpNagL1q_m2WHJ0QNJHRIKSKy4unig'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testTypeformWebhook() {
  try {
    console.log('Testing Typeform webhook simulation...')
    
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
    
    // Simulate a Typeform webhook submission
    console.log('Simulating Typeform webhook submission...')
    
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        completed: false, // Not completed yet, just Typeform submitted
        typeform_submitted: true,
        typeform_submission_id: 'test_submission_' + Date.now(),
        typeform_completed_at: new Date().toISOString(),
        typeform_url: 'https://form.typeform.com/to/pZp1eiDj',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (progressError) {
      console.error('Error simulating Typeform submission:', progressError)
      return
    }
    
    console.log('Typeform submission simulated successfully:', progress)
    
    // Now test if the lesson can be completed
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

testTypeformWebhook()
