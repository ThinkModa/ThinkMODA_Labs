export interface Course {
  id: string
  title: string
  description: string
  visibility: 'public' | 'private'
  sections: Section[]
  createdAt: string
  updatedAt: string
}

export interface Section {
  id: string
  title: string
  description: string
  courseId: string
  lessons: Lesson[]
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  title: string
  content: string
  details: string
  sectionId: string
  createdAt: string
  updatedAt: string
}

// Course API functions
export const courseService = {
  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    const response = await fetch('/api/courses')
    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }
    return response.json()
  },

  // Get a specific course
  async getCourse(id: string): Promise<Course> {
    const response = await fetch(`/api/courses/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch course')
    }
    return response.json()
  },

  // Create a new course
  async createCourse(data: { title: string; description: string; visibility?: 'public' | 'private' }): Promise<Course> {
    const response = await fetch('/api/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create course')
    }
    return response.json()
  },

  // Update a course
  async updateCourse(id: string, data: { title: string; description: string; visibility?: 'public' | 'private' }): Promise<Course> {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update course')
    }
    return response.json()
  },

  // Delete a course
  async deleteCourse(id: string): Promise<void> {
    const response = await fetch(`/api/courses/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete course')
    }
  },

  // Create a section
  async createSection(courseId: string, data: { title: string; description: string }): Promise<Section> {
    const response = await fetch(`/api/courses/${courseId}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create section')
    }
    return response.json()
  },

  // Create a lesson
  async createLesson(sectionId: string, data: { title: string; content: string; details: string }): Promise<Lesson> {
    const response = await fetch(`/api/sections/${sectionId}/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to create lesson')
    }
    return response.json()
  },

  // Update a lesson
  async updateLesson(id: string, data: { title: string; content: string; details: string }): Promise<Lesson> {
    const response = await fetch(`/api/lessons/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error('Failed to update lesson')
    }
    return response.json()
  },

  // Delete a lesson
  async deleteLesson(id: string): Promise<void> {
    const response = await fetch(`/api/lessons/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete lesson')
    }
  },
} 