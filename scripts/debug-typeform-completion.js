// Debug script for Typeform completion
// Run this in the browser console on the lesson page

console.log('=== TYPEFORM COMPLETION DEBUG ===')

// Get current user and lesson data
const userData = JSON.parse(localStorage.getItem('user'))
const lessonId = window.location.pathname.split('/').pop()
const lessonContent = document.querySelector('.lesson-content')?.textContent || ''

console.log('Current user:', userData)
console.log('Current lesson ID:', lessonId)
console.log('Lesson content preview:', lessonContent.substring(0, 200) + '...')

// Check if lesson has Typeform
const hasTypeform = lessonContent.includes('typeform.com')
console.log('Lesson has Typeform:', hasTypeform)

// Test the canCompleteLesson function
async function testCanComplete() {
  try {
    // Import the progress service
    const { progressService } = await import('/lib/services/progress-supabase.js')
    
    console.log('Testing canCompleteLesson...')
    const canComplete = await progressService.canCompleteLesson(userData.id, lessonId, lessonContent)
    console.log('Can complete lesson:', canComplete)
    
    // Test Typeform completion check
    console.log('Testing isTypeformCompleted...')
    const isCompleted = await progressService.isTypeformCompleted(userData.id, lessonId)
    console.log('Typeform completed:', isCompleted)
    
    return { canComplete, isCompleted }
  } catch (error) {
    console.error('Error testing completion:', error)
    return null
  }
}

// Test the function
testCanComplete().then(result => {
  if (result) {
    console.log('=== COMPLETION TEST RESULTS ===')
    console.log('Can complete lesson:', result.canComplete)
    console.log('Typeform completed:', result.isCompleted)
    
    if (hasTypeform && !result.isCompleted) {
      console.log('❌ ISSUE: Lesson has Typeform but it\'s not marked as completed')
    } else if (hasTypeform && result.isCompleted) {
      console.log('✅ SUCCESS: Typeform is completed')
    } else if (!hasTypeform) {
      console.log('ℹ️ INFO: Lesson has no Typeform requirement')
    }
  }
})

// Check user progress directly
async function checkUserProgress() {
  try {
    const { progressService } = await import('/lib/services/progress-supabase.js')
    const progress = await progressService.getUserProgress(userData.id)
    
    console.log('=== USER PROGRESS ===')
    console.log('Total progress entries:', progress.length)
    
    const lessonProgress = progress.find(p => p.lesson_id === lessonId)
    if (lessonProgress) {
      console.log('Current lesson progress:', lessonProgress)
      console.log('Typeform submitted:', lessonProgress.typeform_submitted)
      console.log('Lesson completed:', lessonProgress.completed)
    } else {
      console.log('No progress found for current lesson')
    }
    
    // Check all Typeform submissions
    const typeformSubmissions = progress.filter(p => p.typeform_submitted)
    console.log('Typeform submissions:', typeformSubmissions)
    
  } catch (error) {
    console.error('Error checking progress:', error)
  }
}

checkUserProgress() 