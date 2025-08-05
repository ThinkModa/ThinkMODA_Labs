// Debug script to check authentication issues
// Run this in your browser console

console.log('=== AUTH DEBUG SCRIPT ===')

// Check localStorage
console.log('localStorage user data:', localStorage.getItem('user'))

// Parse and show user data
try {
  const userData = localStorage.getItem('user')
  if (userData) {
    const user = JSON.parse(userData)
    console.log('Parsed user data:', user)
    console.log('User email:', user.email)
    console.log('User role:', user.role)
  } else {
    console.log('No user data in localStorage')
  }
} catch (error) {
  console.error('Error parsing user data:', error)
}

// Clear localStorage (uncomment to clear)
// localStorage.removeItem('user')
// console.log('localStorage cleared')

// Check if there are multiple user entries
console.log('=== CHECKING FOR MULTIPLE USERS ===')
console.log('All localStorage keys:', Object.keys(localStorage))

// Function to clear all auth data
function clearAllAuthData() {
  localStorage.removeItem('user')
  sessionStorage.clear()
  console.log('All auth data cleared')
}

// Function to check current page user
function checkCurrentPageUser() {
  const userData = localStorage.getItem('user')
  if (userData) {
    const user = JSON.parse(userData)
    console.log('Current page user:', user)
    return user
  }
  return null
}

// Make functions available globally
window.clearAllAuthData = clearAllAuthData
window.checkCurrentPageUser = checkCurrentPageUser

console.log('Debug functions available:')
console.log('- clearAllAuthData() - clears all auth data')
console.log('- checkCurrentPageUser() - shows current user') 