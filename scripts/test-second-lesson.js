// Test script to check the second lesson (THE VISIONARY) and its Typeform
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDY2OTUsImV4cCI6MjA3MTg4MjY5NX0.vNLTiiwfLmN15mpNagL1q_m2WHJ0QNJHRIKSKy4unig'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSecondLesson() {
  try {
    console.log('Testing second lesson (THE VISIONARY)...')
    
    // Get the second lesson
    const { data: lessons, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, content, content_data, description, details')
      .eq('title', 'THE VISIONARY')
      .limit(1)
    
    if (lessonError) {
      console.error('Error fetching lesson:', lessonError)
      return
    }
    
    if (lessons && lessons.length > 0) {
      const lesson = lessons[0]
      console.log('Lesson found:', lesson.title)
      console.log('Content field:', lesson.content)
      console.log('Content_data field:', lesson.content_data)
      
      // Test the hasEmbeddedTypeform function logic
      const content = lesson.content || ''
      const hasTypeform = content.includes('form.typeform.com') || content.includes('typeform.com') || content.includes('/typeform ')
      
      console.log('Has embedded Typeform:', hasTypeform)
      console.log('Should be completable:', !hasTypeform)
      
      // Check for specific Typeform URLs
      const typeformUrls = [
        'form.typeform.com/to/pZp1eiDj', // The Visionary
        'form.typeform.com/to/ZIevyTG8', // The Mission
        'form.typeform.com/to/xHocdpeq', // The Plan
        'form.typeform.com/to/TgYsSfUX', // The Baseline
        'form.typeform.com/to/NjzuCVgZ', // The Assessment
      ]
      
      console.log('Checking for specific Typeform URLs:')
      typeformUrls.forEach(url => {
        const found = content.includes(url)
        console.log(`  ${url}: ${found ? 'FOUND' : 'NOT FOUND'}`)
      })
      
      // Check for any typeform.com reference
      console.log('Contains typeform.com:', content.includes('typeform.com'))
      console.log('Contains /typeform :', content.includes('/typeform '))
      
    } else {
      console.log('No lessons found with title "THE VISIONARY"')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testSecondLesson()
