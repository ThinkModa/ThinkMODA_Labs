import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'

export interface AuthUser {
  id: string
  first_name: string
  last_name: string
  email: string
  company_name?: string
  phone_number?: string
  role: 'ADMIN' | 'BASIC'
}

export const authService = {
  // Sign up a new user
  async signUp(userData: {
    first_name: string
    last_name: string
    email: string
    password: string
    company_name?: string
    phone_number?: string
  }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single()

      if (existingUser) {
        return { success: false, error: 'User already exists' }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Create user
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: hashedPassword,
          company_name: userData.company_name || null,
          phone_number: userData.phone_number || null,
          role: 'BASIC'
        })
        .select()
        .single()

      if (error) {
        console.error('Signup error:', error)
        return { success: false, error: 'Failed to create user' }
      }

      return {
        success: true,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          company_name: user.company_name,
          phone_number: user.phone_number,
          role: user.role
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  // Sign in user
  async signIn(credentials: { email: string; password: string }): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    try {
      // Get user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single()

      if (error || !user) {
        return { success: false, error: 'Invalid credentials' }
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user.password)
      if (!isValidPassword) {
        return { success: false, error: 'Invalid credentials' }
      }

      return {
        success: true,
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          company_name: user.company_name,
          phone_number: user.phone_number,
          role: user.role
        }
      }
    } catch (error) {
      console.error('Signin error:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  // Get current user from localStorage
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null
    
    const userData = localStorage.getItem('user')
    if (!userData) return null

    try {
      return JSON.parse(userData)
    } catch {
      return null
    }
  },

  // Sign out user
  signOut(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('user')
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
} 