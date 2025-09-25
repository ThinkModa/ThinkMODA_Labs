import { supabase } from '@/lib/supabase'
import type { Course, Section, Lesson } from '@/lib/supabase'

// Cache bust version: 2025-09-12-18:50

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

      // Sort sections and lessons by order_position after fetching
      if (courses) {
        courses.forEach((course: any) => {
          if (course.sections) {
            course.sections.sort((a: any, b: any) => (a.order_position || 0) - (b.order_position || 0))
            course.sections.forEach((section: any) => {
              if (section.lessons) {
                section.lessons.sort((a: any, b: any) => (a.order_position || 0) - (b.order_position || 0))
              }
            })
          }
        })
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

      // Sort sections and lessons by order_position after fetching
      if (course && course.sections) {
        course.sections.sort((a: any, b: any) => (a.order_position || 0) - (b.order_position || 0))
        course.sections.forEach((section: any) => {
          if (section.lessons) {
            section.lessons.sort((a: any, b: any) => (a.order_position || 0) - (b.order_position || 0))
          }
        })
      }

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
      console.log('createCourse called with (v2.2 - cache bust):', courseData)
      
      // Convert frontend visibility values to database enum values
      const dbVisibility = courseData.visibility === 'private' ? 'PRIVATE' : 'OPEN'
      
      console.log('Converted visibility:', dbVisibility)
      
      const insertData = {
        title: courseData.title,
        description: courseData.description || '',
        visibility: dbVisibility
      }
      
      console.log('Inserting course with data:', insertData)
      
      const { data: course, error } = await supabase
        .from('courses')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Error creating course:', error)
        throw new Error('Failed to create course')
      }

      console.log('Course created successfully:', course)
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
      // Convert frontend visibility values to database enum values
      const updateData: any = { ...updates }
      if (updates.visibility !== undefined) {
        updateData.visibility = updates.visibility === 'private' ? 'PRIVATE' : 'OPEN'
      }
      updateData.updated_at = new Date().toISOString()
      
      const { data: course, error } = await supabase
        .from('courses')
        .update(updateData)
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
      // Get the next order position for this course
      let nextOrderPosition = 1
      
      try {
        const { data: existingSections, error: countError } = await supabase
          .from('sections')
          .select('order_position')
          .eq('course_id', sectionData.courseId)
          .order('order_position', { ascending: false })
          .limit(1)

        if (!countError && existingSections && existingSections.length > 0) {
          nextOrderPosition = (existingSections[0].order_position || 0) + 1
        }
      } catch (orderError) {
        console.log('Order position query failed, using default:', orderError)
        // If order_position column doesn't exist, just use 1
        nextOrderPosition = 1
      }

      const { data: section, error } = await supabase
        .from('sections')
        .insert({
          title: sectionData.title,
          description: sectionData.description || '',
          course_id: sectionData.courseId,
          order_position: nextOrderPosition
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
      
      // Try to get the next order position for this section
      let nextOrderPosition = '1'
      
      try {
        const { data: existingLessons, error: countError } = await supabase
          .from('lessons')
          .select('order_position')
          .eq('section_id', lessonData.sectionId)
          .order('order_position', { ascending: false })
          .limit(1)

        if (!countError && existingLessons && existingLessons.length > 0) {
          nextOrderPosition = (parseInt(existingLessons[0].order_position) + 1).toString()
        }
      } catch (orderError) {
        console.log('Order position query failed, using default:', orderError)
        // If order_position column doesn't exist, just use '1'
        nextOrderPosition = '1'
      }

      console.log('Next order position:', nextOrderPosition)

      // Start with only the absolutely required fields that we know exist
      const insertData: any = {
        title: lessonData.title,
        content: lessonData.content,
        section_id: lessonData.sectionId,
        order_position: parseInt(nextOrderPosition)
      }

      // Add details if provided (this column exists)
      if (lessonData.details) {
        insertData.details = lessonData.details
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
  },

  // Reorder lessons within a section
  async reorderLessons(sectionId: string, lessonIds: string[]): Promise<void> {
    try {
      console.log('Reordering lessons:', { sectionId, lessonIds })
      
      // Update each lesson's order_position based on its position in the array
      const updates = lessonIds.map((lessonId, index) => ({
        id: lessonId,
        order_position: index + 1
      }))

      // Update lessons one by one to ensure proper ordering
      for (const update of updates) {
        const { error } = await supabase
          .from('lessons')
          .update({ order_position: update.order_position })
          .eq('id', update.id)
          .eq('section_id', sectionId)

        if (error) {
          console.error('Error updating lesson order:', error)
          throw new Error(`Failed to update lesson order for ${update.id}`)
        }
      }

      console.log('Lessons reordered successfully')
    } catch (error) {
      console.error('Error in reorderLessons:', error)
      throw error
    }
  },

  // Reorder sections within a course
  async reorderSections(courseId: string, sectionIds: string[]): Promise<void> {
    try {
      console.log('Reordering sections:', { courseId, sectionIds })
      
      // Update each section's order_position based on its position in the array
      const updates = sectionIds.map((sectionId, index) => ({
        id: sectionId,
        order_position: index + 1
      }))

      // Update sections one by one to ensure proper ordering
      for (const update of updates) {
        const { error } = await supabase
          .from('sections')
          .update({ order_position: update.order_position })
          .eq('id', update.id)
          .eq('course_id', courseId)

        if (error) {
          console.error('Error updating section order:', error)
          throw new Error(`Failed to update section order for ${update.id}`)
        }
      }

      console.log('Sections reordered successfully')
    } catch (error) {
      console.error('Error in reorderSections:', error)
      throw error
    }
  }
} 