const { createClient } = require('@supabase/supabase-js')

// Production Supabase configuration with service role
const supabaseUrl = 'https://mqnzukqkumtfcnnahhyp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbnp1a3FrdW10ZmNubmFoaHlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDM0OTkzOSwiZXhwIjoyMDY5OTI1OTM5fQ.w90p5DrCg04Qz_7lqrxk_d-zYE5NqnDxHIO1pzcVd_Q'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCourseVisibilityEnum() {
  try {
    console.log('🔍 Checking course visibility enum values...')
    
    // Check the enum values for course_visibility
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT unnest(enum_range(NULL::course_visibility)) as visibility_value;
      `
    })
    
    if (error) {
      console.log('exec_sql not available, trying alternative approach...')
      
      // Try to get the enum values by checking the table structure
      const { data: tableInfo, error: tableError } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type, udt_name 
          FROM information_schema.columns 
          WHERE table_name = 'courses' AND column_name = 'visibility';
        `
      })
      
      if (tableError) {
        console.log('Alternative approach failed, trying to test different values...')
        
        // Test different possible enum values
        const possibleValues = ['OPEN', 'PRIVATE', 'public', 'private', 'PUBLIC', 'PRIVATE']
        
        for (const value of possibleValues) {
          try {
            const { data: testCourse, error: testError } = await supabase
              .from('courses')
              .insert({
                title: `Test Course ${Date.now()}`,
                description: 'Test course',
                visibility: value
              })
              .select()
              .single()
            
            if (!testError) {
              console.log(`✅ Valid enum value found: "${value}"`)
              // Clean up
              await supabase.from('courses').delete().eq('id', testCourse.id)
              break
            } else {
              console.log(`❌ "${value}" is not valid:`, testError.message)
            }
          } catch (err) {
            console.log(`❌ "${value}" failed:`, err.message)
          }
        }
      } else {
        console.log('Table info:', tableInfo)
      }
    } else {
      console.log('Enum values:', data)
    }

  } catch (error) {
    console.error('❌ Error checking enum:', error)
  }
}

checkCourseVisibilityEnum()
