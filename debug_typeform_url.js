const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugTypeformUrl() {
  try {
    console.log('🔍 Debugging Typeform URL generation...\n')
    
    // Find the "Know Your Flow" lesson
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id, title, content, section_id')
      .ilike('title', '%Know Your Flow%')
    
    if (lessonsError) {
      console.error('❌ Error fetching lessons:', lessonsError)
      return
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('❌ No "Know Your Flow" lessons found')
      return
    }
    
    console.log(`📚 Found ${lessons.length} "Know Your Flow" lesson(s):\n`)
    
    for (const lesson of lessons) {
      console.log(`📖 Lesson: ${lesson.title}`)
      console.log(`🆔 ID: ${lesson.id}`)
      console.log(`📁 Section ID: ${lesson.section_id}`)
      console.log(`📝 Content Preview:`)
      console.log(lesson.content.substring(0, 500) + '...')
      console.log('\n' + '='.repeat(80) + '\n')
    }
    
    // Check if any lesson has the specific Typeform ID from the webhook
    const targetFormId = 'AMeQc5ZN'
    const lessonsWithTargetForm = lessons.filter(lesson => 
      lesson.content.includes(targetFormId)
    )
    
    if (lessonsWithTargetForm.length > 0) {
      console.log(`🎯 Found lesson(s) with Typeform ID ${targetFormId}:`)
      lessonsWithTargetForm.forEach(lesson => {
        console.log(`- ${lesson.title} (ID: ${lesson.id})`)
        
        // Extract the Typeform URL from content
        const lines = lesson.content.split('\n')
        const typeformLine = lines.find(line => line.includes(targetFormId))
        if (typeformLine) {
          console.log(`  Typeform URL: ${typeformLine}`)
        }
      })
    } else {
      console.log(`❌ No lessons found with Typeform ID ${targetFormId}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

debugTypeformUrl()
