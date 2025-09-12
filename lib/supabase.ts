import { createClient } from '@supabase/supabase-js'

// Production Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mqnzukqkumtfcnnahhyp.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xbnp1a3FrdW10ZmNubmFoaHlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNDk5MzksImV4cCI6MjA2OTkyNTkzOX0.XyRX0E9KG9X3TQMzDe8FeEsq5dtofZrH1CNqDJ3bd-I'

console.log('Supabase config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length,
  keyPreview: supabaseAnonKey?.substring(0, 20) + '...',
  fullKey: supabaseAnonKey
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  role: 'ADMIN' | 'BASIC'
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  visibility: 'OPEN' | 'PRIVATE'
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  title: string
  description: string | null
  course_id: string
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  title: string
  content: string
  details: string | null
  section_id: string
  created_at: string
  updated_at: string
}

export interface UserCourse {
  id: string
  user_id: string
  course_id: string
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
} 