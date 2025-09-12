// Script to check the actual schema of the lessons table
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://gnyuzloqayuhqaikghmm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdueXV6bG9xYXl1aHFhaWtnaG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMDY2OTUsImV4cCI6MjA3MTg4MjY5NX0.vNLTiiwfLmN15mpNagL1q_m2WHJ0QNJHRIKSKy4unig'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkLessonSchema() {
  try {
    console.log('Checking lessons table schema...')
    
    // Get an existing lesson to see all the fields
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error fetching lessons:', error)
      return
    }
    
    if (lessons && lessons.length > 0) {
      const lesson = lessons[0]
      console.log('Existing lesson fields:')
      Object.keys(lesson).forEach(key => {
        console.log(`  ${key}: ${lesson[key]} (${typeof lesson[key]})`)
      })
    } else {
      console.log('No lessons found')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkLessonSchema()
