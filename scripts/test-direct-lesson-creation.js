// Test script to create a lesson directly with all required fields
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDY2OTUsImV4cCI6MjA3MTg4MjY5NX0.vNLTiiwfLmN15mpNagL1q_m2WHJ0QNJHRIKSKy4unig'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testDirectLessonCreation() {
  try {
    console.log('Testing direct lesson creation...')
    
    // Get a section to test with
    const { data: sections, error: sectionError } = await supabase
      .from('sections')
      .select('id, title, course_id')
      .limit(1)
    
    if (sectionError) {
      console.error('Error fetching sections:', sectionError)
      return
    }
    
    if (!sections || sections.length === 0) {
      console.log('No sections found')
      return
    }
    
    const section = sections[0]
    console.log('Using section:', section.title)
    
    // Get the next order position
    const { data: existingLessons, error: countError } = await supabase
      .from('lessons')
      .select('order_position')
      .eq('section_id', section.id)
      .order('order_position', { ascending: false })
      .limit(1)
    
    if (countError) {
      console.error('Error getting lesson count:', countError)
      return
    }
    
    const nextOrderPosition = existingLessons && existingLessons.length > 0 
      ? (parseInt(existingLessons[0].order_position) + 1).toString()
      : '1'
    
    console.log('Next order position:', nextOrderPosition)
    
    // Create lesson with all required fields
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .insert({
        title: 'Test Lesson ' + Date.now(),
        content: 'This is test content',
        details: 'Test details',
        description: 'Test details',
        section_id: section.id,
        content_type: 'rich_text',
        order_position: nextOrderPosition,
        is_published: true,
        content_data: { content: 'This is test content' }
      })
      .select()
      .single()
    
    if (lessonError) {
      console.error('Error creating lesson:', lessonError)
      console.error('Error details:', JSON.stringify(lessonError, null, 2))
      return
    }
    
    console.log('Lesson created successfully:', lesson)
    
    // Clean up
    console.log('Cleaning up test lesson...')
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lesson.id)
    
    if (deleteError) {
      console.error('Error deleting test lesson:', deleteError)
    } else {
      console.log('Test lesson deleted successfully')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

testDirectLessonCreation()
