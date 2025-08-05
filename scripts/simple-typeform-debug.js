// Simple Typeform completion debug script
// Run this in the browser console on the lesson page

console.log('=== SIMPLE TYPEFORM DEBUG ===')

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

// Check for specific Typeform URLs
const typeformUrls = [
  'form.typeform.com/to/pZp1eiDj', // The Visionary
  'form.typeform.com/to/ZIevyTG8', // The Mission
  'form.typeform.com/to/xHocdpeq', // The Plan
  'form.typeform.com/to/TgYsSfUX', // The Baseline
  'form.typeform.com/to/NjzuCVgZ'  // The Assessment
]

const foundTypeform = typeformUrls.find(url => lessonContent.includes(url))
console.log('Found Typeform URL:', foundTypeform)

// Check if Typeform iframe is present
const typeformIframes = document.querySelectorAll('iframe[src*="typeform.com"]')
console.log('Typeform iframes found:', typeformIframes.length)

typeformIframes.forEach((iframe, index) => {
  console.log(`Typeform ${index + 1} src:`, iframe.src)
  
  // Check if URL has hidden fields
  const hasHiddenFields = iframe.src.includes('#') && iframe.src.includes('user_id')
  console.log(`Typeform ${index + 1} has hidden fields:`, hasHiddenFields)
})

// Test URL generation
function generateTypeformUrl(formId, userData, lessonId, courseId) {
  const baseUrl = `https://form.typeform.com/to/${formId}`
  const params = new URLSearchParams({
    user_id: userData.id,
    lesson_id: lessonId,
    course_id: courseId,
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    email: userData.email || '',
    company_name: userData.company_name || '',
    phone_number: userData.phone_number || ''
  })
  
  return `${baseUrl}#${params.toString()}`
}

// Generate expected URL for current lesson
if (foundTypeform) {
  const formId = foundTypeform.split('/').pop()
  const courseId = window.location.pathname.split('/')[2] // /user/course/[id]/lesson/[lessonId]
  const expectedUrl = generateTypeformUrl(formId, userData, lessonId, courseId)
  console.log('Expected Typeform URL:', expectedUrl)
}

// Check localStorage for any Typeform completion data
const allKeys = Object.keys(localStorage)
const typeformKeys = allKeys.filter(key => key.includes('typeform') || key.includes('progress'))
console.log('Typeform-related localStorage keys:', typeformKeys)

// Check if there's any progress data in localStorage
const progressData = localStorage.getItem('userProgress')
if (progressData) {
  try {
    const progress = JSON.parse(progressData)
    console.log('Progress data in localStorage:', progress)
    
    const lessonProgress = progress.find(p => p.lesson_id === lessonId)
    if (lessonProgress) {
      console.log('Current lesson progress:', lessonProgress)
    }
  } catch (error) {
    console.log('No valid progress data in localStorage')
  }
}

console.log('=== DEBUG SUMMARY ===')
console.log('1. User ID:', userData?.id)
console.log('2. Lesson ID:', lessonId)
console.log('3. Has Typeform:', hasTypeform)
console.log('4. Typeform URL:', foundTypeform)
console.log('5. Iframes found:', typeformIframes.length)
console.log('6. Course ID:', window.location.pathname.split('/')[2]) 