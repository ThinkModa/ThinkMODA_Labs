// Test script to verify lesson content is being read correctly
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDY2OTUsImV4cCI6MjA3MTg4MjY5NX0.vNLTiiwfLmN15mpNagL1q_m2WHJ0QNJHRIKSKy4unig'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLessonContent() {
  try {
    console.log('Testing lesson content...')
    
    // Get the first lesson (WELCOME TO LAUNCHPAD)
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('id, title, content, content_data, description, details')
      .eq('title', 'WELCOME TO LAUNCHPAD!')
      .limit(1)
    
    if (error) {
      console.error('Error fetching lessons:', error)
      return
    }
    
    if (lessons && lessons.length > 0) {
      const lesson = lessons[0]
      console.log('Lesson found:', lesson.title)
      console.log('Content field:', lesson.content)
      console.log('Content_data field:', lesson.content_data)
      console.log('Description field:', lesson.description)
      console.log('Details field:', lesson.details)
      
      // Test the hasEmbeddedTypeform function logic
      const content = lesson.content || ''
      const hasTypeform = content.includes('form.typeform.com') || content.includes('typeform.com') || content.includes('/typeform ')
      
      console.log('Has embedded Typeform:', hasTypeform)
      console.log('Should be completable:', !hasTypeform)
    } else {
      console.log('No lessons found')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testLessonContent()
