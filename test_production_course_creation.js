const { createClient } = require('@supabase/supabase-js')

// Production Supabase configuration
const supabaseUrl = 'https://mqnzukqkumtfcnnahhyp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbnp1a3FrdW10ZmNubmFoaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDk5MzksImV4cCI6MjA2OTkyNTkzOX0.XyRX0E9KG9X3TQMzDe8FeEsq5dtofZrH1CNqDJ3bd-I'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testProductionCourseCreation() {
  try {
    console.log('🔍 Testing production course creation...')
    
    // Test 1: Check if courses table exists and is accessible
    console.log('\n1. Testing courses table access...')
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .limit(1)

    if (coursesError) {
      console.error('❌ Courses table error:', coursesError)
      return
    }
    console.log('✅ Courses table accessible, found', courses?.length || 0, 'courses')

    // Test 2: Check if sections table exists
    console.log('\n2. Testing sections table access...')
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
      .limit(1)

    if (sectionsError) {
      console.error('❌ Sections table error:', sectionsError)
      return
    }
    console.log('✅ Sections table accessible, found', sections?.length || 0, 'sections')

    // Test 3: Check if lessons table exists
    console.log('\n3. Testing lessons table access...')
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .limit(1)

    if (lessonsError) {
      console.error('❌ Lessons table error:', lessonsError)
      return
    }
    console.log('✅ Lessons table accessible, found', lessons?.length || 0, 'lessons')

    // Test 4: Try to create a test course
    console.log('\n4. Testing course creation...')
    const testCourseData = {
      title: `Test Course ${Date.now()}`,
      description: 'Test course for debugging',
      visibility: 'public'
    }

    const { data: newCourse, error: createError } = await supabase
      .from('courses')
      .insert(testCourseData)
      .select()
      .single()

    if (createError) {
      console.error('❌ Course creation failed:', createError)
      return
    }
    console.log('✅ Course created successfully:', {
      id: newCourse.id,
      title: newCourse.title,
      visibility: newCourse.visibility
    })

    // Test 5: Try to create a test section
    console.log('\n5. Testing section creation...')
    const testSectionData = {
      title: 'Test Section',
      description: 'Test section for debugging',
      course_id: newCourse.id
    }

    const { data: newSection, error: sectionError } = await supabase
      .from('sections')
      .insert(testSectionData)
      .select()
      .single()

    if (sectionError) {
      console.error('❌ Section creation failed:', sectionError)
      return
    }
    console.log('✅ Section created successfully:', {
      id: newSection.id,
      title: newSection.title,
      course_id: newSection.course_id
    })

    // Test 6: Try to create a test lesson
    console.log('\n6. Testing lesson creation...')
    const testLessonData = {
      title: 'Test Lesson',
      content: 'Test lesson content',
      details: 'Test lesson details',
      description: 'Test lesson details',
      section_id: newSection.id,
      content_type: 'rich_text',
      order_position: '1',
      is_published: true,
      content_data: { content: 'Test lesson content' }
    }

    const { data: newLesson, error: lessonError } = await supabase
      .from('lessons')
      .insert(testLessonData)
      .select()
      .single()

    if (lessonError) {
      console.error('❌ Lesson creation failed:', lessonError)
      return
    }
    console.log('✅ Lesson created successfully:', {
      id: newLesson.id,
      title: newLesson.title,
      section_id: newLesson.section_id
    })

    // Clean up test data
    console.log('\n7. Cleaning up test data...')
    await supabase.from('lessons').delete().eq('id', newLesson.id)
    await supabase.from('sections').delete().eq('id', newSection.id)
    await supabase.from('courses').delete().eq('id', newCourse.id)
    console.log('✅ Test data cleaned up')

    console.log('\n🎉 All tests passed! Course creation should work on production.')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testProductionCourseCreation()
