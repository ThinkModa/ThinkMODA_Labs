'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Users, User, Mail, Calendar, BookOpen, CheckCircle, Clock, LogOut } from 'lucide-react'
import { authService } from '@/lib/services/auth'
import { courseService } from '@/lib/services/courses'
import { progressService } from '@/lib/services/progress'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  updatedAt: string
}

interface Course {
  id: string
  title: string
  description: string
  visibility: 'OPEN' | 'PRIVATE'
  sections: Section[]
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  sectionId: string
}

interface UserProgress {
  id: string
  userId: string
  lessonId: string
  completed: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

interface UserWithProgress {
  user: User
  courses: Course[]
  progress: UserProgress[]
  totalLessons: number
  completedLessons: number
  progressPercentage: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserWithProgress[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUsersAndData = async () => {
      try {
        setIsLoading(true)
        
        // Load all users, courses, and progress data
        const [allUsers, allCourses, allProgress] = await Promise.all([
          fetch('/api/users').then(res => res.json()),
          courseService.getAllCourses(),
          fetch('/api/progress/all').then(res => res.json())
        ])

        // Process and combine the data
        const usersWithProgress: UserWithProgress[] = allUsers.map((user: User) => {
          const userProgress = allProgress.filter((p: UserProgress) => p.userId === user.id)
          const userCourses = allCourses // For now, all users have access to all courses
          
          // Calculate progress for each user
          const totalLessons = userCourses.reduce((acc: number, course: Course) => 
            acc + course.sections.reduce((sectionAcc: number, section: Section) => 
              sectionAcc + section.lessons.length, 0), 0)
          
          const completedLessons = userProgress.filter((p: UserProgress) => p.completed).length
          const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

          return {
            user,
            courses: userCourses,
            progress: userProgress,
            totalLessons,
            completedLessons,
            progressPercentage
          }
        })

        setUsers(usersWithProgress)
        setCourses(allCourses)
      } catch (error) {
        console.error('Error loading users data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsersAndData()
  }, [])

  const handleBackToDashboard = () => {
    window.location.href = '/admin'
  }

  const handleSignOut = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Back to Dashboard</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">User Management</h1>
            </div>
            <div className="flex items-center space-x-4">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Learners</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.completedLessons > 0).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.length > 0 
                      ? Math.round(users.reduce((acc, u) => acc + u.progressPercentage, 0) / users.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Registered Users</h2>
            <p className="text-sm text-gray-600">View all users and their course progress</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userData) => (
                  <tr key={userData.user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userData.user.firstName} {userData.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {userData.user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{userData.user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {formatDate(userData.user.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {userData.courses.filter(c => c.visibility === 'OPEN').length} open courses
                      </div>
                      <div className="text-sm text-gray-500">
                        {userData.courses.filter(c => c.visibility === 'OPEN').map(c => c.title).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 mr-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${userData.progressPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-900">
                          {userData.completedLessons}/{userData.totalLessons}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round(userData.progressPercentage)}% complete
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userData.progressPercentage === 0
                          ? 'bg-gray-100 text-gray-800'
                          : userData.progressPercentage === 100
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {userData.progressPercentage === 0
                          ? 'Not Started'
                          : userData.progressPercentage === 100
                          ? 'Completed'
                          : 'In Progress'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 