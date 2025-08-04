export interface UserProgress {
  id: string
  userId: string
  lessonId: string
  completed: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
  lesson: {
    id: string
    title: string
    section: {
      id: string
      title: string
      course: {
        id: string
        title: string
      }
    }
  }
}

export const progressService = {
  // Get user's progress for all courses
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    const response = await fetch(`/api/progress?userId=${userId}`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch progress')
    }

    return response.json()
  },

  // Mark lesson as completed
  async markLessonCompleted(userId: string, lessonId: string, completed: boolean): Promise<UserProgress> {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        lessonId,
        completed
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update progress')
    }

    return response.json()
  },

  // Calculate course progress
  calculateCourseProgress(progress: UserProgress[], courseId: string): {
    totalLessons: number
    completedLessons: number
    percentage: number
  } {
    const courseProgress = progress.filter(p => p.lesson.section.course.id === courseId)
    const totalLessons = courseProgress.length
    const completedLessons = courseProgress.filter(p => p.completed).length
    const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    return {
      totalLessons,
      completedLessons,
      percentage
    }
  }
} 