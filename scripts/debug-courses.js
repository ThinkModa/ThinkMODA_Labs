const { createClient } = require('@supabase/supabase-js')

// You'll need to add your Supabase credentials here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.log('Please set your Supabase credentials in environment variables')
  console.log('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCourses() {
  try {
    console.log('Checking courses in database...')
    
    // Check if courses table exists and has data
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
    
    if (error) {
      console.error('Error fetching courses:', error)
      return
    }
    
    console.log('Courses found:', courses?.length || 0)
    if (courses && courses.length > 0) {
      console.log('Course details:')
      courses.forEach(course => {
        console.log(`- ${course.title} (${course.visibility})`)
      })
    } else {
      console.log('No courses found in database')
    }
    
    // Check sections
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('*')
    
    if (sectionsError) {
      console.error('Error fetching sections:', sectionsError)
    } else {
      console.log('Sections found:', sections?.length || 0)
    }
    
    // Check lessons
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
    
    if (lessonsError) {
      console.error('Error fetching lessons:', lessonsError)
    } else {
      console.log('Lessons found:', lessons?.length || 0)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkCourses() 