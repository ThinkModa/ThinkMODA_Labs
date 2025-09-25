require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugAutoAdvance() {
  try {
    console.log('🔍 Debugging auto-advance issue for rahwalton9@gmail.com...\n')
    
    // Step 1: Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'rahwalton9@gmail.com')
      .single()
    
    if (userError || !user) {
      console.error('❌ User not found:', userError)
      return
    }
    
    console.log('✅ User found:', user.first_name, user.last_name)
    
    // Step 2: Get LaunchPad course structure
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select(`
        *,
        sections (
          *,
          lessons (*)
        )
      `)
      .eq('title', 'LaunchPad Accelerator')
    
    if (coursesError || !courses || courses.length === 0) {
      console.error('❌ Course not found:', coursesError)
      return
    }
    
    const course = courses[0]
    console.log('✅ Course found:', course.title)
    console.log(`   Sections: ${course.sections?.length || 0}`)
    
    // Step 3: Get user progress
    const { data: userProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
    
    if (progressError) {
      console.error('❌ Error fetching progress:', progressError)
      return
    }
    
    console.log(`\n📊 User has completed ${userProgress?.length || 0} lessons:`)
    if (userProgress && userProgress.length > 0) {
      userProgress.forEach((p, index) => {
        console.log(`   ${index + 1}. Lesson ID: ${p.lesson_id} - ${p.completed_at}`)
      })
    }
    
    // Step 4: Simulate the getNextUnlockedLesson logic
    console.log('\n🔍 Simulating getNextUnlockedLesson logic...')
    
    // This is the exact logic from the frontend
    const isLessonCompleted = (lessonId) => {
      return userProgress?.some(p => p.lesson_id === lessonId && p.completed) || false
    }
    
    const getNextUnlockedLesson = () => {
      for (const section of course.sections) {
        if (section.lessons) {
          for (const lesson of section.lessons) {
            if (!isLessonCompleted(lesson.id)) {
              return lesson.id
            }
          }
        }
      }
      return null
    }
    
    // Step 5: Show course structure and completion status
    console.log('\n📚 Course structure and completion status:')
    let lessonIndex = 0
    course.sections?.forEach((section, sectionIndex) => {
      console.log(`\n   Section ${sectionIndex + 1}: "${section.title}"`)
      if (section.lessons) {
        section.lessons.forEach((lesson, lessonIndexInSection) => {
          lessonIndex++
          const isCompleted = isLessonCompleted(lesson.id)
          const status = isCompleted ? '✅ COMPLETED' : '⏳ PENDING'
          console.log(`     ${lessonIndex}. "${lesson.title}" - ${status}`)
          console.log(`        ID: ${lesson.id}`)
        })
      }
    })
    
    // Step 6: Find next unlocked lesson
    const nextLessonId = getNextUnlockedLesson()
    console.log(`\n🎯 getNextUnlockedLesson() result: ${nextLessonId || 'null'}`)
    
    if (nextLessonId) {
      // Find the lesson details
      let nextLesson = null
      let nextLessonPosition = 0
      for (const section of course.sections) {
        if (section.lessons) {
          for (const lesson of section.lessons) {
            nextLessonPosition++
            if (lesson.id === nextLessonId) {
              nextLesson = lesson
              break
            }
          }
        }
        if (nextLesson) break
      }
      
      if (nextLesson) {
        console.log(`\n✅ Next lesson to advance to:`)
        console.log(`   Title: "${nextLesson.title}"`)
        console.log(`   Position: Lesson ${nextLessonPosition}`)
        console.log(`   ID: ${nextLesson.id}`)
        
        // Check if this is the first lesson
        if (nextLessonPosition === 1) {
          console.log(`\n🚨 ISSUE IDENTIFIED:`)
          console.log(`   • Auto-advance is taking you to the FIRST lesson`)
          console.log(`   • This suggests there's a gap in your completion records`)
          console.log(`   • The system thinks you haven't completed the first lesson`)
        }
      }
    } else {
      console.log(`\n🎉 All lessons completed!`)
    }
    
    // Step 7: Check for gaps in completion
    console.log(`\n🔍 Checking for completion gaps...`)
    const allLessonIds = []
    course.sections?.forEach(section => {
      if (section.lessons) {
        section.lessons.forEach(lesson => {
          allLessonIds.push(lesson.id)
        })
      }
    })
    
    const completedLessonIds = userProgress?.map(p => p.lesson_id) || []
    const missingCompletions = allLessonIds.filter(id => !completedLessonIds.includes(id))
    
    if (missingCompletions.length > 0) {
      console.log(`\n❌ GAPS FOUND: ${missingCompletions.length} lessons missing completion records`)
      missingCompletions.forEach((lessonId, index) => {
        // Find lesson title
        let lessonTitle = 'Unknown'
        for (const section of course.sections) {
          if (section.lessons) {
            const lesson = section.lessons.find(l => l.id === lessonId)
            if (lesson) {
              lessonTitle = lesson.title
              break
            }
          }
        }
        console.log(`   ${index + 1}. "${lessonTitle}" (ID: ${lessonId})`)
      })
      
      console.log(`\n💡 ROOT CAUSE:`)
      console.log(`   • You have gaps in your completion records`)
      console.log(`   • getNextUnlockedLesson() finds the FIRST incomplete lesson`)
      console.log(`   • This is why auto-advance takes you back to the beginning`)
    } else {
      console.log(`\n✅ No gaps found - all lessons have completion records`)
    }
    
    // Step 8: Summary and recommendations
    console.log(`\n📊 DIAGNOSIS SUMMARY:`)
    console.log('='.repeat(60))
    
    if (missingCompletions.length > 0) {
      console.log(`🎯 ISSUE: Completion record gaps causing auto-advance to reset`)
      console.log(`🔧 SOLUTION: Need to fix the getNextUnlockedLesson logic`)
      console.log(`   • Current logic: Find first incomplete lesson (causes reset)`)
      console.log(`   • Better logic: Find next lesson after current one`)
    } else {
      console.log(`✅ No gaps found - issue might be elsewhere`)
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

debugAutoAdvance()
