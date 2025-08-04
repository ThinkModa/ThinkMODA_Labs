import { supabase } from '@/lib/supabase'
import type { UserProgress } from '@/lib/supabase'

export const progressService = {
  // Get user progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching user progress:', error)
        throw new Error('Failed to fetch user progress')
      }

      return progress || []
    } catch (error) {
      console.error('Error in getUserProgress:', error)
      throw error
    }
  },

  // Mark lesson as completed
  async markLessonCompleted(userId: string, lessonId: string, completed: boolean): Promise<UserProgress> {
    try {
      if (completed) {
        // Insert or update progress
        const { data: progress, error } = await supabase
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

        return progress
      } else {
        // Delete progress record
        const { error } = await supabase
          .from('user_progress')
          .delete()
          .eq('user_id', userId)
          .eq('lesson_id', lessonId)

        if (error) {
          console.error('Error marking lesson incomplete:', error)
          throw new Error('Failed to mark lesson incomplete')
        }

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
      const { data: progress, error } = await supabase
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