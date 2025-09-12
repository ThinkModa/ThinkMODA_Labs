// Test script to check lesson creation functionality
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDY2OTUsImV4cCI6MjA3MTg4MjY5NX0.vNLTiiwfLmN15mpNagL1q_m2WHJ0QNJHRIKSKy4unig'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testLessonCreation() {
  try {
    console.log('Testing lesson creation...')
    
    // First, let's check the lessons table structure
    console.log('Checking lessons table structure...')
    const { data: tableInfo, error: tableError } = await supabase
      .from('lessons')
      .select('*')
      .limit(1)
    
    if (tableError) {
      console.error('Error checking lessons table:', tableError)
      return
    }
    
    console.log('Lessons table structure check passed')
    
    // Get a course and section to test with
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select(`
        *,
        sections (
          *,
          lessons (*)
        )
      `)
      .limit(1)
    
    if (courseError) {
      console.error('Error fetching courses:', courseError)
      return
    }
    
    if (!courses || courses.length === 0) {
      console.log('No courses found')
      return
    }
    
    const course = courses[0]
    console.log('Found course:', course.title)
    console.log('Course sections:', course.sections?.length || 0)
    
    if (!course.sections || course.sections.length === 0) {
      console.log('No sections found in course')
      return
    }
    
    const section = course.sections[0]
    console.log('Using section:', section.title)
    
    // Try to create a test lesson using the service function
    console.log('Attempting to create test lesson...')
    
    // Import the course service
    const { courseService } = require('./lib/services/courses-supabase')
    
    let lesson
    try {
      lesson = await courseService.createLesson({
        title: 'Test Lesson ' + Date.now(),
        content: 'This is a test lesson content',
        details: 'Test lesson details',
        sectionId: section.id
      })
      
      console.log('Lesson created successfully:', lesson)
    } catch (lessonError) {
      console.error('Error creating lesson:', lessonError)
      console.error('Error details:', JSON.stringify(lessonError, null, 2))
      return
    }
    
    // Clean up - delete the test lesson
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

testLessonCreation()
