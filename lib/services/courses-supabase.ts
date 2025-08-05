import { supabase } from '@/lib/supabase'
import type { Course, Section, Lesson } from '@/lib/supabase'

// Re-export types for compatibility
export type { Course, Section, Lesson }

export interface CourseWithSections extends Course {
  sections: (Section & {
    lessons: Lesson[]
  })[]
}

export const courseService = {
  // Get all courses
  async getAllCourses(): Promise<CourseWithSections[]> {
    try {
      const { data: courses, error } = await supabase
        .from('courses')
        .select(`
          *,
          sections (
            *,
            lessons (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching courses:', error)
        throw new Error('Failed to fetch courses')
      }

      return courses || []
    } catch (error) {
      console.error('Error in getAllCourses:', error)
      throw error
    }
  },

  // Get a single course
  async getCourse(id: string): Promise<CourseWithSections | null> {
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select(`
          *,
          sections (
            *,
            lessons (*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching course:', error)
        return null
      }

      return course
    } catch (error) {
      console.error('Error in getCourse:', error)
      return null
    }
  },

  // Create a new course
  async createCourse(courseData: {
    title: string
    description?: string
    visibility?: 'OPEN' | 'PRIVATE'
  }): Promise<Course> {
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description || '',
          visibility: courseData.visibility || 'OPEN'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating course:', error)
        throw new Error('Failed to create course')
      }

      return course
    } catch (error) {
      console.error('Error in createCourse:', error)
      throw error
    }
  },

  // Update a course
  async updateCourse(id: string, updates: {
    title?: string
    description?: string
    visibility?: 'OPEN' | 'PRIVATE'
  }): Promise<Course> {
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating course:', error)
        throw new Error('Failed to update course')
      }

      return course
    } catch (error) {
      console.error('Error in updateCourse:', error)
      throw error
    }
  },

  // Delete a course
  async deleteCourse(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting course:', error)
        throw new Error('Failed to delete course')
      }
    } catch (error) {
      console.error('Error in deleteCourse:', error)
      throw error
    }
  },

  // Create a section
  async createSection(sectionData: {
    title: string
    description?: string
    courseId: string
  }): Promise<Section> {
    try {
      const { data: section, error } = await supabase
        .from('sections')
        .insert({
          title: sectionData.title,
          description: sectionData.description || '',
          course_id: sectionData.courseId
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating section:', error)
        throw new Error('Failed to create section')
      }

      return section
    } catch (error) {
      console.error('Error in createSection:', error)
      throw error
    }
  },

  // Delete a section
  async deleteSection(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('sections')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting section:', error)
        throw new Error('Failed to delete section')
      }
    } catch (error) {
      console.error('Error in deleteSection:', error)
      throw error
    }
  },

  // Create a lesson
  async createLesson(lessonData: {
    title: string
    content: string
    details?: string
    sectionId: string
  }): Promise<Lesson> {
    try {
      const { data: lesson, error } = await supabase
        .from('lessons')
        .insert({
          title: lessonData.title,
          content: lessonData.content,
          details: lessonData.details || '',
          section_id: lessonData.sectionId
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating lesson:', error)
        throw new Error('Failed to create lesson')
      }

      return lesson
    } catch (error) {
      console.error('Error in createLesson:', error)
      throw error
    }
  },

  // Update a lesson
  async updateLesson(id: string, updates: {
    title?: string
    content?: string
    details?: string
  }): Promise<Lesson> {
    try {
      const { data: lesson, error } = await supabase
        .from('lessons')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating lesson:', error)
        throw new Error('Failed to update lesson')
      }

      return lesson
    } catch (error) {
      console.error('Error in updateLesson:', error)
      throw error
    }
  },

  // Delete a lesson
  async deleteLesson(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting lesson:', error)
        throw new Error('Failed to delete lesson')
      }
    } catch (error) {
      console.error('Error in deleteLesson:', error)
      throw error
    }
  }
} 