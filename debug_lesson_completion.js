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

async function debugLessonCompletion() {
  try {
    console.log('🔍 Debugging lesson completion for rahwalton9@gmail.com...\n')
    
    // Step 1: Find the user
    console.log('1️⃣ Finding user: rahwalton9@gmail.com')
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'rahwalton9@gmail.com')
      .single()
    
    if (userError || !user) {
      console.error('❌ User not found:', userError)
      return
    }
    
    console.log('✅ User found:')
    console.log(`   Name: ${user.first_name} ${user.last_name}`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Company: ${user.company_name}`)
    console.log(`   ID: ${user.id}`)
    
    // Step 2: Find the "The Visionary" lesson
    console.log('\n2️⃣ Finding "The Visionary" lesson...')
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select(`
        *,
        sections (
          *,
          courses (*)
        )
      `)
      .ilike('title', '%visionary%')
    
    if (lessonsError) {
      console.error('❌ Error finding lessons:', lessonsError)
      return
    }
    
    if (!lessons || lessons.length === 0) {
      console.log('❌ No lessons found with "visionary" in title')
      return
    }
    
    const visionaryLesson = lessons[0]
    console.log('✅ Found lesson:')
    console.log(`   Title: ${visionaryLesson.title}`)
    console.log(`   ID: ${visionaryLesson.id}`)
    console.log(`   Section: ${visionaryLesson.sections?.title}`)
    console.log(`   Course: ${visionaryLesson.sections?.courses?.title}`)
    
    // Step 3: Check user's progress on this lesson
    console.log('\n3️⃣ Checking user progress on this lesson...')
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', visionaryLesson.id)
      .single()
    
    if (progressError && progressError.code !== 'PGRST116') {
      console.error('❌ Error checking progress:', progressError)
      return
    }
    
    if (progress) {
      console.log('📊 Progress record found:')
      console.log(`   Completed: ${progress.completed}`)
      console.log(`   Completed at: ${progress.completed_at}`)
      console.log(`   Source: ${progress.source}`)
      console.log(`   Has completion data: ${progress.completion_data ? 'Yes' : 'No'}`)
    } else {
      console.log('📊 No progress record found - lesson not completed yet')
    }
    
    // Step 4: Check the lesson content for Typeform requirements
    console.log('\n4️⃣ Analyzing lesson content for Typeform requirements...')
    console.log('Lesson content preview:')
    console.log(visionaryLesson.content ? visionaryLesson.content.substring(0, 500) + '...' : 'No content')
    
    // Check if content contains typeform embed
    const hasTypeform = visionaryLesson.content && visionaryLesson.content.includes('typeform')
    console.log(`   Contains Typeform embed: ${hasTypeform ? 'Yes' : 'No'}`)
    
    // Step 5: Check recent typeform webhook activity
    console.log('\n5️⃣ Checking recent typeform webhook activity...')
    const { data: recentProgress, error: recentError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('source', 'typeform')
      .order('completed_at', { ascending: false })
      .limit(5)
    
    if (recentError) {
      console.error('❌ Error checking recent typeform activity:', recentError)
    } else if (recentProgress && recentProgress.length > 0) {
      console.log('📝 Recent typeform completions:')
      recentProgress.forEach((p, index) => {
        console.log(`   ${index + 1}. Lesson ID: ${p.lesson_id} - Completed: ${p.completed_at}`)
      })
    } else {
      console.log('📝 No recent typeform completions found')
    }
    
    // Step 6: Check all user progress to see what's completed
    console.log('\n6️⃣ Checking all user progress...')
    const { data: allProgress, error: allProgressError } = await supabase
      .from('user_progress')
      .select(`
        *,
        lessons (
          title,
          sections (
            title,
            courses (title)
          )
        )
      `)
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
    
    if (allProgressError) {
      console.error('❌ Error checking all progress:', allProgressError)
    } else if (allProgress && allProgress.length > 0) {
      console.log('📚 All completed lessons:')
      allProgress.forEach((p, index) => {
        const lessonTitle = p.lessons?.title || 'Unknown'
        const courseTitle = p.lessons?.sections?.courses?.title || 'Unknown'
        console.log(`   ${index + 1}. ${lessonTitle} (${courseTitle}) - ${p.completed_at}`)
      })
    } else {
      console.log('📚 No completed lessons found')
    }
    
    // Step 7: Simulate the canCompleteLesson logic
    console.log('\n7️⃣ Simulating canCompleteLesson logic...')
    
    // This is the logic from progressService.canCompleteLesson
    const lessonContent = visionaryLesson.content || ''
    const hasTypeformEmbed = lessonContent.includes('typeform.com') || lessonContent.includes('typeform')
    
    console.log(`   Lesson has Typeform embed: ${hasTypeformEmbed}`)
    
    if (hasTypeformEmbed) {
      // Check if there's a typeform completion for this lesson
      const { data: typeformProgress, error: typeformError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', visionaryLesson.id)
        .eq('source', 'typeform')
        .single()
      
      if (typeformError && typeformError.code !== 'PGRST116') {
        console.log(`   ❌ Error checking typeform progress: ${typeformError.message}`)
      } else if (typeformProgress) {
        console.log(`   ✅ Typeform completion found: ${typeformProgress.completed_at}`)
        console.log(`   ✅ Lesson should be completable: YES`)
      } else {
        console.log(`   ❌ No typeform completion found for this lesson`)
        console.log(`   ❌ Lesson should be completable: NO`)
        console.log(`   💡 This is likely why you can't complete the lesson!`)
      }
    } else {
      console.log(`   ✅ No typeform required - lesson should be completable: YES`)
    }
    
    // Step 8: Summary and recommendations
    console.log('\n📊 DIAGNOSIS SUMMARY:')
    console.log('='.repeat(60))
    
    if (hasTypeformEmbed && !progress) {
      console.log('🎯 ISSUE IDENTIFIED:')
      console.log('   • Lesson contains Typeform embed')
      console.log('   • No typeform completion record found')
      console.log('   • System requires typeform completion before lesson completion')
      console.log('')
      console.log('🔧 POSSIBLE CAUSES:')
      console.log('   1. Typeform webhook not triggered after form submission')
      console.log('   2. Typeform webhook failed to process')
      console.log('   3. Form submission didn\'t include required hidden fields')
      console.log('   4. Network/connection issue during form submission')
      console.log('')
      console.log('💡 RECOMMENDATIONS:')
      console.log('   1. Check if the typeform was actually submitted successfully')
      console.log('   2. Try submitting the typeform again')
      console.log('   3. Check browser console for any errors during form submission')
      console.log('   4. Verify the typeform webhook is working properly')
    } else if (progress && progress.completed) {
      console.log('✅ LESSON ALREADY COMPLETED:')
      console.log(`   • Lesson was completed at: ${progress.completed_at}`)
      console.log(`   • Source: ${progress.source}`)
      console.log('   • You should be able to proceed to the next lesson')
    } else {
      console.log('❓ UNKNOWN ISSUE:')
      console.log('   • Need more investigation to determine the cause')
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

debugLessonCompletion()
