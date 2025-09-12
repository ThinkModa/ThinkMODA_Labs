const { createClient } = require('@supabase/supabase-js')

// Production Supabase configuration
const supabaseUrl = 'https://mqnzukqkumtfcnnahhyp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbnp1a3FrdW10ZmNubmFoaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDk5MzksImV4cCI6MjA2OTkyNTkzOX0.XyRX0E9KG9X3TQMzDe8FeEsq5dtofZrH1CNqDJ3bd-I'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCourseCreationFixed() {
  try {
    console.log('🔍 Testing course creation with fixed enum values...')
    
    // Test course creation with OPEN visibility
    console.log('\n1. Testing course creation with OPEN visibility...')
    const testCourseData = {
      title: `Test Course ${Date.now()}`,
      description: 'Test course for debugging',
      visibility: 'OPEN'
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

    // Test course creation with PRIVATE visibility
    console.log('\n2. Testing course creation with PRIVATE visibility...')
    const testCourseData2 = {
      title: `Test Private Course ${Date.now()}`,
      description: 'Test private course for debugging',
      visibility: 'PRIVATE'
    }

    const { data: newCourse2, error: createError2 } = await supabase
      .from('courses')
      .insert(testCourseData2)
      .select()
      .single()

    if (createError2) {
      console.error('❌ Private course creation failed:', createError2)
    } else {
      console.log('✅ Private course created successfully:', {
        id: newCourse2.id,
        title: newCourse2.title,
        visibility: newCourse2.visibility
      })
    }

    // Clean up test data
    console.log('\n3. Cleaning up test data...')
    await supabase.from('courses').delete().eq('id', newCourse.id)
    if (newCourse2) {
      await supabase.from('courses').delete().eq('id', newCourse2.id)
    }
    console.log('✅ Test data cleaned up')

    console.log('\n🎉 Course creation is now working with correct enum values!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

testCourseCreationFixed()
