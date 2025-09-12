import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Production Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    console.log('🔗 Webhook received for exercise completion')
    
    // Parse the request body
    const body = await request.json()
    console.log('📝 Webhook payload:', JSON.stringify(body, null, 2))
    
    // Extract data from the webhook payload
    const { 
      user_email, 
      lesson_id, 
      course_id, 
      completion_data,
      timestamp,
      source = 'webhook'
    } = body
    
    // Validate required fields
    if (!user_email || !lesson_id) {
      console.error('❌ Missing required fields: user_email and lesson_id are required')
      return NextResponse.json(
        { error: 'Missing required fields: user_email and lesson_id are required' },
        { status: 400 }
      )
    }
    
    console.log(`🎯 Processing completion for user: ${user_email}, lesson: ${lesson_id}`)
    
    // Find the user by email
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('email', user_email)
      .single()
    
    if (userError || !user) {
      console.error('❌ User not found:', user_email, userError)
      return NextResponse.json(
        { error: `User not found with email: ${user_email}` },
        { status: 404 }
      )
    }
    
    console.log('✅ User found:', user.id, user.email)
    
    // Check if the lesson exists
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, section_id')
      .eq('id', lesson_id)
      .single()
    
    if (lessonError || !lesson) {
      console.error('❌ Lesson not found:', lesson_id, lessonError)
      return NextResponse.json(
        { error: `Lesson not found with ID: ${lesson_id}` },
        { status: 404 }
      )
    }
    
    console.log('✅ Lesson found:', lesson.title)
    
    // Check if progress already exists
    const { data: existingProgress, error: progressCheckError } = await supabase
      .from('user_progress')
      .select('id, completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson_id)
      .single()
    
    if (progressCheckError && progressCheckError.code !== 'PGRST116') {
      console.error('❌ Error checking existing progress:', progressCheckError)
      return NextResponse.json(
        { error: 'Error checking existing progress' },
        { status: 500 }
      )
    }
    
    if (existingProgress && existingProgress.completed) {
      console.log('ℹ️ Lesson already completed, updating timestamp')
      
      // Update existing progress with new timestamp
      const { error: updateError } = await supabase
        .from('user_progress')
        .update({
          completed_at: new Date().toISOString(),
          completion_data: completion_data || null,
          source: source
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
          lesson_id: lesson_id,
          completed: true,
          completed_at: new Date().toISOString(),
          completion_data: completion_data || null,
          source: source
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
      message: 'Exercise completion recorded successfully',
      data: {
        user_id: user.id,
        user_email: user.email,
        lesson_id: lesson_id,
        lesson_title: lesson.title,
        completed_at: new Date().toISOString()
      }
    }
    
    console.log('🎉 Webhook processed successfully:', response)
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error)
    
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
  const url = new URL(request.url)
  const challenge = url.searchParams.get('challenge')
  
  if (challenge) {
    // Handle webhook verification challenge
    return NextResponse.json({ challenge })
  }
  
  return NextResponse.json({
    message: 'Exercise Completion Webhook Endpoint',
    status: 'active',
    methods: ['POST', 'GET'],
    description: 'This endpoint handles exercise completion webhooks from external sources like Typeform'
  })
}
