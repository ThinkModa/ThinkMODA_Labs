import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Production Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    console.log('🔗 Typeform webhook received')
    
    // Parse the request body
    const body = await request.json()
    console.log('📝 Typeform payload:', JSON.stringify(body, null, 2))
    
    // Extract data from Typeform response
    const { 
      form_response,
      event_id,
      event_type 
    } = body
    
    if (!form_response) {
      console.error('❌ No form_response in payload')
      return NextResponse.json(
        { error: 'No form_response in payload' },
        { status: 400 }
      )
    }
    
    const { 
      answers,
      hidden,
      submitted_at,
      token 
    } = form_response
    
    // Extract hidden fields (these should contain our course/lesson data)
    const userEmail = hidden?.user_email || hidden?.email
    const lessonId = hidden?.lesson_id
    const courseId = hidden?.course_id
    
    console.log('📧 User email:', userEmail)
    console.log('📚 Lesson ID:', lessonId)
    console.log('🎓 Course ID:', courseId)
    
    // Validate required fields
    if (!userEmail || !lessonId) {
      console.error('❌ Missing required hidden fields: user_email and lesson_id')
      return NextResponse.json(
        { error: 'Missing required hidden fields: user_email and lesson_id' },
        { status: 400 }
      )
    }
    
    // Find the user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('email', userEmail)
      .single()
    
    if (userError || !user) {
      console.error('❌ User not found:', userEmail, userError)
      return NextResponse.json(
        { error: `User not found with email: ${userEmail}` },
        { status: 404 }
      )
    }
    
    console.log('✅ User found:', user.id, user.email)
    
    // Check if the lesson exists
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, section_id')
      .eq('id', lessonId)
      .single()
    
    if (lessonError || !lesson) {
      console.error('❌ Lesson not found:', lessonId, lessonError)
      return NextResponse.json(
        { error: `Lesson not found with ID: ${lessonId}` },
        { status: 404 }
      )
    }
    
    console.log('✅ Lesson found:', lesson.title)
    
    // Check if progress already exists
    const { data: existingProgress, error: progressCheckError } = await supabase
      .from('user_progress')
      .select('id, completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()
    
    if (progressCheckError && progressCheckError.code !== 'PGRST116') {
      console.error('❌ Error checking existing progress:', progressCheckError)
      return NextResponse.json(
        { error: 'Error checking existing progress' },
        { status: 500 }
      )
    }
    
    // Prepare completion data with Typeform response
    const completionData = {
      typeform_token: token,
      typeform_submitted_at: submitted_at,
      typeform_event_id: event_id,
      answers: answers,
      hidden_fields: hidden
    }
    
    if (existingProgress && existingProgress.completed) {
      console.log('ℹ️ Lesson already completed, updating timestamp')
      
      // Update existing progress with new timestamp
      const { error: updateError } = await supabase
        .from('user_progress')
        .update({
          completed_at: new Date().toISOString(),
          completion_data: completionData,
          source: 'typeform'
        })
        .eq('id', existingProgress.id)
      
      if (updateError) {
        console.error('❌ Error updating progress:', updateError)
        return NextResponse.json(
          { error: 'Error updating progress' },
          { status: 500 }
        )
      }
      
      console.log('✅ Progress updated successfully')
      
    } else {
      console.log('🆕 Creating new progress record')
      
      // Create new progress record
      const { error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          completion_data: completionData,
          source: 'typeform'
        })
      
      if (insertError) {
        console.error('❌ Error creating progress:', insertError)
        return NextResponse.json(
          { error: 'Error creating progress' },
          { status: 500 }
        )
      }
      
      console.log('✅ Progress created successfully')
    }
    
    // Return success response
    const response = {
      success: true,
      message: 'Typeform exercise completion recorded successfully',
      data: {
        user_id: user.id,
        user_email: user.email,
        lesson_id: lessonId,
        lesson_title: lesson.title,
        typeform_token: token,
        completed_at: new Date().toISOString()
      }
    }
    
    console.log('🎉 Typeform webhook processed successfully:', response)
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error('❌ Typeform webhook processing error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Typeform Exercise Completion Webhook Endpoint',
    status: 'active',
    methods: ['POST', 'GET'],
    description: 'This endpoint handles exercise completion webhooks from Typeform',
    required_hidden_fields: ['user_email', 'lesson_id'],
    optional_hidden_fields: ['course_id']
  })
}

