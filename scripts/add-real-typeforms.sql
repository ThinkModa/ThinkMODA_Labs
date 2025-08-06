-- Template for adding real TypeForm IDs
-- Replace the placeholder values with your actual TypeForm data

-- Step 1: Update the webhook route.ts file with your TypeForm IDs
-- Replace these in app/api/typeform/webhook/route.ts:

/*
const TYPEFORM_FORMS = {
  'pZp1eiDj': 'The Visionary',
  'ZIevyTG8': 'The Mission', 
  'xHocdpeq': 'The Plan',
  'TgYsSfUX': 'The Baseline',
  'NjzuCVgZ': 'The Assessment',
  // ADD YOUR REAL TYPEFORM IDs HERE:
  'YOUR_FORM_ID_1': 'Your Lesson Title 1',
  'YOUR_FORM_ID_2': 'Your Lesson Title 2',
  'YOUR_FORM_ID_3': 'Your Lesson Title 3',
  // etc.
}
*/

-- Step 2: Update the progress service with your TypeForm URLs
-- Replace these in lib/services/progress-supabase.ts:

/*
const typeformUrls = [
  'form.typeform.com/to/pZp1eiDj', // The Visionary
  'form.typeform.com/to/ZIevyTG8', // The Mission
  'form.typeform.com/to/xHocdpeq', // The Plan
  'form.typeform.com/to/TgYsSfUX', // The Baseline
  'form.typeform.com/to/NjzuCVgZ', // The Assessment
  // ADD YOUR REAL TYPEFORM URLs HERE:
  'form.typeform.com/to/YOUR_FORM_ID_1', // Your Lesson Title 1
  'form.typeform.com/to/YOUR_FORM_ID_2', // Your Lesson Title 2
  'form.typeform.com/to/YOUR_FORM_ID_3', // Your Lesson Title 3
  // etc.
]
*/

-- Step 3: Create your lessons in the admin panel
-- For each lesson with a TypeForm, add content like:
/*
Lesson Title: Your Lesson Title
Content: 
Your lesson content here...

/embed https://form.typeform.com/to/YOUR_FORM_ID_1

More lesson content...
*/

-- Step 4: Add webhook to each TypeForm
-- Go to each TypeForm dashboard:
-- Settings → Integrations → Webhooks
-- Add: https://think-moda-labs-vans.vercel.app/api/typeform/webhook
-- Set trigger to "Form response"

-- Step 5: Test each lesson
-- 1. Complete the TypeForm
-- 2. Check if lesson unlocks
-- 3. Verify auto-advance works 