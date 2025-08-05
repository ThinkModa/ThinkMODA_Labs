import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create admin client for database operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

    // Extract hidden fields
    const hidden = form_response.hidden || {}
    const { user_id, lesson_id, course_id } = hidden

    if (!user_id || !lesson_id) {
      console.error('Missing required hidden fields:', { user_id, lesson_id })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Extract user data from form answers
    let firstName = ''
    let lastName = ''
    let email = ''

    if (form_response.answers) {
      form_response.answers.forEach((answer: any) => {
        if (answer.field?.ref === 'first_name' || answer.field?.ref === 'firstName') {
          firstName = answer.text || answer.choice?.label || ''
        }
        if (answer.field?.ref === 'last_name' || answer.field?.ref === 'lastName') {
          lastName = answer.text || answer.choice?.label || ''
        }
        if (answer.field?.ref === 'email') {
          email = answer.text || answer.choice?.label || ''
        }
      })
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

    console.log('Progress updated successfully:', progress)

    // Return success
    return NextResponse.json({ 
      success: true, 
      message: 'Typeform submission recorded',
      progress 
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({ message: 'Typeform webhook endpoint is active' })
} 