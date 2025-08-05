import { supabase } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'
import type { UserProgress } from '@/lib/supabase'

// Re-export types for compatibility
export type { UserProgress }

// Create a service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Debug: Check if admin client is available
console.log('Progress service - Admin client available:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
console.log('Progress service - Admin client URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

export const progressService = {
  // Get user progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      console.log('Progress service - Getting user progress for:', userId)
      const { data: progress, error } = await supabaseAdmin
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching user progress:', error)
        throw new Error('Failed to fetch user progress')
      }

      console.log('Progress service - Found progress:', progress?.length || 0)
      return progress || []
    } catch (error) {
      console.error('Error in getUserProgress:', error)
      throw error
    }
  },

  // Mark lesson as completed
  async markLessonCompleted(userId: string, lessonId: string, completed: boolean): Promise<UserProgress> {
    try {
      console.log('Progress service - Marking lesson completed:', { userId, lessonId, completed })
      
      if (completed) {
        // Insert or update progress using admin client
        const { data: progress, error } = await supabaseAdmin
          .from('user_progress')
          .upsert({
            user_id: userId,
            lesson_id: lessonId,
            completed: true,
            completed_at: new Date().toISOString()
          })
          .select()
          .single()

        if (error) {
          console.error('Error marking lesson completed:', error)
          throw new Error('Failed to mark lesson completed')
        }

        console.log('Progress service - Lesson marked as completed successfully')
        return progress
      } else {
        // Delete progress record using admin client
        const { error } = await supabaseAdmin
          .from('user_progress')
          .delete()
          .eq('user_id', userId)
          .eq('lesson_id', lessonId)

        if (error) {
          console.error('Error marking lesson incomplete:', error)
          throw new Error('Failed to mark lesson incomplete')
        }

        console.log('Progress service - Lesson marked as incomplete successfully')
        // Return a mock progress object for consistency
        return {
          id: '',
          user_id: userId,
          lesson_id: lessonId,
          completed: false,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    } catch (error) {
      console.error('Error in markLessonCompleted:', error)
      throw error
    }
  },

  // Calculate course progress percentage
  calculateCourseProgress(course: any, userProgress: UserProgress[]): number {
    if (!course || !course.sections) return 0

    const totalLessons = course.sections.reduce((acc: number, section: any) => {
      return acc + (section.lessons ? section.lessons.length : 0)
    }, 0)

    if (totalLessons === 0) return 0

    const completedLessons = userProgress.filter(p => p.completed).length
    return Math.round((completedLessons / totalLessons) * 100)
  },

  // Get all progress data (for admin dashboard)
  async getAllProgress(): Promise<UserProgress[]> {
    try {
      const { data: progress, error } = await supabaseAdmin
        .from('user_progress')
        .select('*')

      if (error) {
        console.error('Error fetching all progress:', error)
        throw new Error('Failed to fetch all progress')
      }

      return progress || []
    } catch (error) {
      console.error('Error in getAllProgress:', error)
      throw error
    }
  }
} 