'use client'

import { useState, useEffect } from 'react'
import { Play, Clock, User, LogOut, ArrowRight } from 'lucide-react'
import { courseService } from '@/lib/services/courses-supabase'
import { progressService } from '@/lib/services/progress-supabase'
import { authService } from '@/lib/services/auth-supabase'

export default function UserLandingPage() {
  const [assignedCourses, setAssignedCourses] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user')
      console.log('User page - Checking auth, userData:', userData)
      
      if (!userData) {
        console.log('User page - No user data found, redirecting to sign-in')
        window.location.href = '/'
        return
      }

      try {
        const user = JSON.parse(userData)
        console.log('User page - User data parsed successfully:', user)
        setUser(user)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
        setIsLoading(false)
        window.location.href = '/'
      }
    }

    checkAuth()
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('User page - Loading timeout, setting loading to false')
        setIsLoading(false)
      }
    }, 5000) // 5 second timeout
    
    return () => clearTimeout(timeout)
  }, [])

  // Load saved courses from Supabase
  useEffect(() => {
    if (!user) return

    const loadCoursesAndProgress = async () => {
      try {
        setIsLoading(true)
        
        // Load courses and progress in parallel
        const [courses, progress] = await Promise.all([
          courseService.getAllCourses(),
          progressService.getUserProgress(user.id)
        ])
        
        console.log('User side - Loading courses from Supabase:', courses.length, courses)
        console.log('User side - Course IDs:', courses.map(c => ({ id: c.id, title: c.title })))
        console.log('User side - Loading progress:', progress.length, progress)
        
        setUserProgress(progress)
        
        if (courses.length > 0) {
          // Filter to only show OPEN courses
          const openCourses = courses.filter((course: any) => course.visibility === 'OPEN')
          console.log('User side - Open courses:', openCourses.length, openCourses.map(c => ({ id: c.id, title: c.title })))
          
          const formattedCourses = openCourses.map((course: any) => {
            const courseProgress = progressService.calculateCourseProgress(course, progress)
            
            return {
              id: course.id,
              title: course.title,
              description: course.description,
              price: "$299.00",
              originalPrice: "$499.00",
              image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
              progress: courseProgress,
              totalLessons: course.sections.reduce((acc: number, section: any) => acc + section.lessons.length, 0),
              completedLessons: progress.filter((p: any) => p.completed).length
            }
          })
          console.log('User side - Formatted courses with progress:', formattedCourses)
          setAssignedCourses(formattedCourses)
        } else {
          console.log('User side - No courses found in Supabase')
          setAssignedCourses([]) // Clear default courses if none found
        }
      } catch (error) {
        console.error('Error loading courses and progress:', error)
        setAssignedCourses([]) // Clear on error
      } finally {
        setIsLoading(false)
      }
    }
    
    loadCoursesAndProgress()
  }, [user])

  const handleSignOut = () => {
    authService.signOut()
    window.location.href = '/'
  }

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    const courses = localStorage.getItem('courses')
    console.log('Debug - localStorage courses:', courses)
    console.log('Debug - Parsed courses:', JSON.parse(courses || '[]'))
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading... {!user ? '(No user data)' : '(Loading courses)'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Course Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <User size={20} />
                  <span className="text-sm">Hello, {user.firstName}!</span>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut size={20} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Meet the new home for your online course
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access your assigned courses and continue your professional development journey
          </p>
        </div>
      </section>

      {/* Course Cards Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assignedCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Course Image */}
                <div className="relative h-64 bg-gray-200">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                      <Play size={18} className="text-gray-700" />
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                      ASSIGNED COURSE
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center">
                    <button 
                      onClick={() => window.location.href = `/user/course/${course.id}`}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {assignedCourses.length === 0 && (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <User size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No courses assigned yet
                </h3>
                <p className="text-gray-600 text-lg">
                  Your admin will assign courses to you soon. Check back later!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 