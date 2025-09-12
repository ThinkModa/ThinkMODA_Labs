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
      console.log('courses-supabase: Starting getAllCourses...')
      console.log('courses-supabase: Supabase client:', !!supabase)
      
      const query = supabase
        .from('courses')
        .select(`
          *,
          sections (
            *,
            lessons (*)
          )
        `)
        .order('created_at', { ascending: false })

      console.log('courses-supabase: About to execute query...')
      const { data: courses, error } = await query
      console.log('courses-supabase: Query executed, response:', { data: courses, error })

      if (error) {
        console.error('courses-supabase: Error fetching courses:', error)
        throw new Error('Failed to fetch courses')
      }

      console.log('courses-supabase: Courses fetched successfully:', courses?.length || 0)
      if (courses && courses.length > 0) {
        courses.forEach((course, index) => {
          console.log(`courses-supabase: Course ${index + 1}:`, {
            id: course.id,
            title: course.title,
            visibility: course.visibility,
            sectionsCount: course.sections?.length || 0
          })
        })
      }

      return courses || []
    } catch (error) {
      console.error('courses-supabase: Error in getAllCourses:', error)
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
    visibility?: 'public' | 'private'
  }): Promise<Course> {
    try {
      const { data: course, error } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description || '',
          visibility: courseData.visibility || 'public'
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
    visibility?: 'public' | 'private'
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
      console.log('createLesson called with:', lessonData)
      
      // Get the next order position for this section
      const { data: existingLessons, error: countError } = await supabase
        .from('lessons')
        .select('order_position')
        .eq('section_id', lessonData.sectionId)
        .order('order_position', { ascending: false })
        .limit(1)

      if (countError) {
        console.error('Error getting lesson count:', countError)
        throw new Error('Failed to get lesson count')
      }

      const nextOrderPosition = existingLessons && existingLessons.length > 0 
        ? (parseInt(existingLessons[0].order_position) + 1).toString()
        : '1'

      console.log('Next order position:', nextOrderPosition)

      const insertData = {
        title: lessonData.title,
        content: lessonData.content,
        details: lessonData.details || '',
        description: lessonData.details || '', // Use details as description
        section_id: lessonData.sectionId,
        content_type: 'rich_text',
        order_position: nextOrderPosition,
        is_published: true,
        content_data: { content: lessonData.content } // Store content in content_data as well
      }

      console.log('Inserting lesson with data:', insertData)

      const { data: lesson, error } = await supabase
        .from('lessons')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error creating lesson:', error)
        throw new Error('Failed to create lesson')
      }

      console.log('Lesson created successfully:', lesson)
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