const { createClient } = require('@supabase/supabase-js')

// Production Supabase configuration
const supabaseUrl = 'https://mqnzukqkumtfcnnahhyp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbnp1a3FrdW10ZmNubmFoaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDk5MzksImV4cCI6MjA2OTkyNTkzOX0.XyRX0E9KG9X3TQMzDe8FeEsq5dtofZrH1CNqDJ3bd-I'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAllContentFields() {
  try {
    console.log('🔍 Checking all possible content fields in lessons...')
    
    // Get a few sample lessons to see all available fields
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', '3d1aa6fe-28e9-42d5-80e6-09960ced8e1f')
      .limit(3)

    if (error) {
      console.error('❌ Error fetching lessons:', error)
      return
    }
    
    console.log('📋 Available fields in lessons table:')
    console.log('='.repeat(80))
    
    if (lessons.length > 0) {
      const sampleLesson = lessons[0]
      console.log('Sample lesson fields:')
      Object.keys(sampleLesson).forEach(field => {
        const value = sampleLesson[field]
        console.log(`  ${field}: ${typeof value} - ${value ? (typeof value === 'string' ? value.substring(0, 100) + '...' : JSON.stringify(value).substring(0, 100) + '...') : 'null/empty'}`)
      })
      
      console.log('\n🔍 Checking for embedded content in all fields...')
      lessons.forEach((lesson, index) => {
        console.log(`\nLesson ${index + 1}: ${lesson.title}`)
        
        // Check all fields for embedded content
        Object.keys(lesson).forEach(field => {
          const value = lesson[field]
          if (value && typeof value === 'string') {
            const lowerValue = value.toLowerCase()
            if (lowerValue.includes('typeform') || lowerValue.includes('youtube') || lowerValue.includes('iframe') || lowerValue.includes('embed')) {
              console.log(`  ✅ Found embedded content in field: ${field}`)
              console.log(`     Content: ${value.substring(0, 200)}...`)
            }
          } else if (value && typeof value === 'object') {
            const valueStr = JSON.stringify(value).toLowerCase()
            if (valueStr.includes('typeform') || valueStr.includes('youtube') || valueStr.includes('iframe') || valueStr.includes('embed')) {
              console.log(`  ✅ Found embedded content in field: ${field}`)
              console.log(`     Content: ${JSON.stringify(value).substring(0, 200)}...`)
            }
          }
        })
      })
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

checkAllContentFields()


