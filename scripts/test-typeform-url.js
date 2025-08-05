// Test script for Typeform URL generation
// Run this in your browser console

console.log('=== TYPEFORM URL TEST ===')

// Mock user data
const userData = {
  id: 'test-user-123',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  company_name: 'Test Company',
  phone_number: '+1-555-1234'
}

// Mock lesson and course data
const lessonId = 'test-lesson-456'
const courseId = 'test-course-789'

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

// Test with The Visionary form
const visionaryUrl = generateTypeformUrl('pZp1eiDj', userData, lessonId, courseId)
console.log('The Visionary URL:', visionaryUrl)

// Test with The Mission form
const missionUrl = generateTypeformUrl('ZIevyTG8', userData, lessonId, courseId)
console.log('The Mission URL:', missionUrl)

// Test URL parsing
function parseHiddenFields(url) {
  const hashPart = url.split('#')[1]
  if (!hashPart) return {}
  
  const params = new URLSearchParams(hashPart)
  return {
    user_id: params.get('user_id'),
    lesson_id: params.get('lesson_id'),
    course_id: params.get('course_id'),
    first_name: params.get('first_name'),
    last_name: params.get('last_name'),
    email: params.get('email'),
    company_name: params.get('company_name'),
    phone_number: params.get('phone_number')
  }
}

console.log('Parsed hidden fields from Visionary URL:', parseHiddenFields(visionaryUrl))
console.log('Parsed hidden fields from Mission URL:', parseHiddenFields(missionUrl))

// Test current user data
console.log('=== CURRENT USER TEST ===')
const currentUser = localStorage.getItem('user')
if (currentUser) {
  const user = JSON.parse(currentUser)
  console.log('Current user:', user)
  
  // Generate URL for current user
  const currentUserUrl = generateTypeformUrl('pZp1eiDj', user, 'test-lesson', 'test-course')
  console.log('Current user Visionary URL:', currentUserUrl)
  console.log('Current user hidden fields:', parseHiddenFields(currentUserUrl))
} else {
  console.log('No user data found in localStorage')
} 