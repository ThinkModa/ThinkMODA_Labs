import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client for database operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Typeform form IDs mapping
const TYPEFORM_FORMS = {
  'pZp1eiDj': 'The Visionary',
  'ZIevyTG8': 'The Mission', 
  'xHocdpeq': 'The Plan',
  'TgYsSfUX': 'The Baseline',
  'NjzuCVgZ': 'The Assessment'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Typeform webhook received:', JSON.stringify(body, null, 2))

    // Extract data from Typeform webhook
    const { form_response } = body
    
    if (!form_response) {
      console.error('No form_response in webhook payload')
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
    }

    // Extract hidden fields from URL parameters
    const hidden = form_response.hidden || {}
    const { user_id, lesson_id, course_id, first_name, last_name, email, company_name, phone_number } = hidden

    if (!user_id || !lesson_id) {
      console.error('Missing required hidden fields:', { user_id, lesson_id })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get form title for logging
    const formTitle = TYPEFORM_FORMS[form_response.form_id as keyof typeof TYPEFORM_FORMS] || 'Unknown Form'
    console.log(`Processing submission for: ${formTitle}`)

    // Extract user data from form answers (as backup to hidden fields)
    let extractedFirstName = first_name || ''
    let extractedLastName = last_name || ''
    let extractedEmail = email || ''
    let extractedCompanyName = company_name || ''
    let extractedPhoneNumber = phone_number || ''

    if (form_response.answers) {
      form_response.answers.forEach((answer: any) => {
        const fieldRef = answer.field?.ref || ''
        const value = answer.text || answer.choice?.label || ''
        
        if (fieldRef.includes('first_name') || fieldRef.includes('firstName')) {
          extractedFirstName = value
        }
        if (fieldRef.includes('last_name') || fieldRef.includes('lastName')) {
          extractedLastName = value
        }
        if (fieldRef.includes('email')) {
          extractedEmail = value
        }
        if (fieldRef.includes('company') || fieldRef.includes('company_name')) {
          extractedCompanyName = value
        }
        if (fieldRef.includes('phone') || fieldRef.includes('phone_number')) {
          extractedPhoneNumber = value
        }
      })
    }

    // Update user profile with extracted data (if not already set)
    if (extractedFirstName || extractedLastName || extractedEmail || extractedCompanyName || extractedPhoneNumber) {
      const updateData: any = {}
      if (extractedFirstName) updateData.first_name = extractedFirstName
      if (extractedLastName) updateData.last_name = extractedLastName
      if (extractedEmail) updateData.email = extractedEmail
      if (extractedCompanyName) updateData.company_name = extractedCompanyName
      if (extractedPhoneNumber) updateData.phone_number = extractedPhoneNumber

      if (Object.keys(updateData).length > 0) {
        const { error: userUpdateError } = await supabaseAdmin
          .from('users')
          .update(updateData)
          .eq('id', user_id)

        if (userUpdateError) {
          console.error('Error updating user profile:', userUpdateError)
        } else {
          console.log('User profile updated with form data')
        }
      }
    }

    // Update user_progress table
    const { data: progress, error } = await supabaseAdmin
      .from('user_progress')
      .upsert({
        user_id,
        lesson_id,
        completed: true,
        completed_at: new Date().toISOString(),
        typeform_submitted: true,
        typeform_submission_id: form_response.token,
        typeform_completed_at: new Date().toISOString(),
        typeform_url: `https://form.typeform.com/to/${form_response.form_id}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating progress:', error)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    console.log(`Progress updated successfully for ${formTitle}:`, progress)

    // Return success
    return NextResponse.json({ 
      success: true, 
      message: `Typeform submission recorded for ${formTitle}`,
      form_title: formTitle,
      progress 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({ 
    message: 'Typeform webhook endpoint is active',
    supported_forms: Object.values(TYPEFORM_FORMS)
  })
} 