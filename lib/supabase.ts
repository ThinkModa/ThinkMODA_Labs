import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length
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