import { supabase } from '@/lib/supabase'
import type { UserProgress } from '@/lib/supabase'

// Re-export types for compatibility
export type { UserProgress }

export const progressService = {
  // Get user progress
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    try {
      console.log('Progress service - Getting user progress for:', userId)
      const { data: progress, error } = await supabase
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
        // First check if a record already exists
        const { data: existingProgress, error: checkError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('lesson_id', lessonId)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing progress:', checkError)
        }

        if (existingProgress) {
          // Update existing record
          const { data: progress, error } = await supabase
            .from('user_progress')
            .update({
              completed: true,
              completed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('lesson_id', lessonId)
            .select()
            .single()

          if (error) {
            console.error('Error updating existing progress:', error)
            throw new Error('Failed to update lesson progress')
          }

          console.log('Progress service - Updated existing progress record')
          return progress
        } else {
          // Create new record
          const { data: progress, error } = await supabase
            .from('user_progress')
            .insert({
              user_id: userId,
              lesson_id: lessonId,
              completed: true,
              completed_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (error) {
            console.error('Error creating new progress record:', error)
            throw new Error('Failed to create lesson progress')
          }

          console.log('Progress service - Created new progress record')
          return progress
        }
      } else {
        // Delete progress record using regular client
        const { error } = await supabase
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

  // Generate Typeform URL with hidden fields
  generateTypeformUrl(formId: string, userData: any, lessonId: string, courseId: string): string {
    const baseUrl = `https://form.typeform.com/to/${formId}`
    const params = new URLSearchParams({
      user_id: userData.id,
      lesson_id: lessonId,
      course_id: courseId,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      company_name: userData.company_name || '',
      phone_number: userData.phone_number || ''
    })
    
    return `${baseUrl}#${params.toString()}`
  },

  // Check if lesson has embedded typeform
  hasEmbeddedTypeform(lessonContent: string): boolean {
    // Check for specific Typeform URLs
    const typeformUrls = [
      'form.typeform.com/to/pZp1eiDj', // The Visionary
      'form.typeform.com/to/ZIevyTG8', // The Mission
      'form.typeform.com/to/xHocdpeq', // The Plan
      'form.typeform.com/to/TgYsSfUX', // The Baseline
      'form.typeform.com/to/NjzuCVgZ', // The Assessment
      // Add your real TypeForm URLs here:
      // 'form.typeform.com/to/YOUR_FORM_ID_1', // Your Lesson Title 1
      // 'form.typeform.com/to/YOUR_FORM_ID_2', // Your Lesson Title 2
      // 'form.typeform.com/to/YOUR_FORM_ID_3', // Your Lesson Title 3
      // etc.
    ]
    
    return typeformUrls.some(url => lessonContent.includes(url)) || 
           lessonContent.includes('typeform.com') || 
           lessonContent.includes('/typeform ')
  },

  // Check if typeform is completed for a lesson
  async isTypeformCompleted(userId: string, lessonId: string): Promise<boolean> {
    try {
      const { data: progress, error } = await supabase
        .from('user_progress')
        .select('source, completed')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .eq('completed', true)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking typeform completion:', error)
        return false
      }

      // Check if the lesson was completed via typeform (source = 'typeform' or 'webhook')
      return !!(progress && (progress.source === 'typeform' || progress.source === 'webhook'))
    } catch (error) {
      console.error('Error in isTypeformCompleted:', error)
      return false
    }
  },

  // Check if lesson can be completed (considering typeform requirements)
  async canCompleteLesson(userId: string, lessonId: string, lessonContent: string): Promise<boolean> {
    // Check if lesson has embedded typeform
    const hasTypeform = this.hasEmbeddedTypeform(lessonContent)
    
    if (hasTypeform) {
      // If lesson has typeform, check if it's completed
      return await this.isTypeformCompleted(userId, lessonId)
    }
    
    // Regular lessons can always be completed
    return true
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