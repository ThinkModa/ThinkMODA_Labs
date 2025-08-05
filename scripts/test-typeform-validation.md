# Typeform Validation Testing Guide

## 🔧 **Step 1: Test Webhook Endpoint**

**Check if the webhook is active:**
1. Go to: `https://think-moda-labs-vans.vercel.app/api/typeform/webhook`
2. Should show: `{"message":"Typeform webhook endpoint is active","supported_forms":["The Visionary","The Mission","The Plan","The Baseline","The Assessment"]}`

## 🔧 **Step 2: Test Typeform URL Generation**

**Run this in browser console on the user course page:**

```javascript
// Test Typeform URL generation
const userData = JSON.parse(localStorage.getItem('user'))
const lessonId = 'your-lesson-id' // Get from current lesson
const courseId = 'your-course-id'  // Get from current course

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

// Test The Visionary form
const visionaryUrl = generateTypeformUrl('pZp1eiDj', userData, lessonId, courseId)
console.log('Visionary URL:', visionaryUrl)
```

## 🔧 **Step 3: Test Lesson with Typeform**

**Steps to test:**

1. **Go to user course page**: `https://think-moda-labs-vans.vercel.app/user`
2. **Click on "LaunchPad Onboarding" course**
3. **Find "The Visionary" lesson** (should have Typeform embed)
4. **Check if Typeform loads** with hidden fields
5. **Complete the Typeform** and submit
6. **Check if next lesson unlocks**

## 🔧 **Step 4: Verify Database Updates**

**Check if submission was recorded:**

```sql
-- Run in Supabase SQL editor
SELECT 
  up.*,
  u.first_name,
  u.last_name,
  u.email
FROM user_progress up
JOIN users u ON up.user_id = u.id
WHERE up.typeform_submitted = true
ORDER BY up.created_at DESC
LIMIT 5;
```

## 🔧 **Step 5: Test Progress Validation**

**Check if lesson completion is blocked without Typeform:**

1. **Try to complete a lesson** with Typeform without submitting
2. **Should be blocked** from marking as complete
3. **Submit Typeform** and try again
4. **Should now be able** to mark as complete

## 🔧 **Step 6: Test Hidden Field Capture**

**Verify hidden fields are captured:**

1. **Submit Typeform** with test data
2. **Check webhook logs** in Vercel dashboard
3. **Verify user profile** is updated with form data
4. **Check progress record** has typeform_submitted = true

## 🔧 **Expected Behavior:**

✅ **Typeform loads** with hidden fields in URL
✅ **Submission updates** user_progress table
✅ **User profile** gets updated with form data
✅ **Next lesson unlocks** only after submission
✅ **Progress shows** typeform_submitted = true

## 🔧 **Troubleshooting:**

**If Typeform doesn't load:**
- Check if URL has hidden fields
- Verify form ID is correct
- Check browser console for errors

**If submission isn't recorded:**
- Check Vercel function logs
- Verify webhook URL in Typeform
- Check database permissions

**If next lesson doesn't unlock:**
- Check typeform_submitted field
- Verify lesson completion logic
- Check progress service 