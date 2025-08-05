'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Clock, ArrowLeft, CheckCircle, Circle, LogOut, Video, Image, FormInput, Lock } from 'lucide-react'
import { courseService, Course } from '@/lib/services/courses'
import { progressService, UserProgress } from '@/lib/services/progress'

export default function CourseLessonsPage({ params }: { params: { id: string } }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [completedLessons] = useState(['intro-to-framer', 'design-system-styles'])
  const [course, setCourse] = useState<any>(null)
  const [currentLessonContent, setCurrentLessonContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])

    // Check authentication and load user data
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user')
      if (!userData) {
        window.location.href = '/'
        return
      }

      try {
        const user = JSON.parse(userData)
        setUser(user)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
        window.location.href = '/'
      }
    }

    checkAuth()
  }, [])

  // Load course data and progress from API
  useEffect(() => {
    if (!user) return

    const loadCourseDataAndProgress = async () => {
      try {
        setIsLoading(true)
        
        // Load course and progress in parallel
        const [foundCourse, progress] = await Promise.all([
          courseService.getCourse(params.id),
          progressService.getUserProgress(user.id)
        ])
        
        console.log('User side - Loading course data for ID:', params.id)
        console.log('User side - Found course:', foundCourse)
        console.log('User side - Loading progress:', progress.length, progress)
        
        setCourse(foundCourse)
        setUserProgress(progress)
        
        // Set first lesson as selected by default if no lesson is currently selected
        if (!selectedLesson && foundCourse.sections.length > 0 && foundCourse.sections[0].lessons.length > 0) {
          const firstLesson = foundCourse.sections[0].lessons[0]
          setSelectedLesson(firstLesson.id)
          setCurrentLessonContent(firstLesson.content)
          console.log('User side - Set first lesson:', firstLesson.title, 'Content:', firstLesson.content)
        } else if (selectedLesson) {
          // Update current lesson content if lesson is still selected
          for (const section of foundCourse.sections) {
            const lesson = section.lessons.find((l: any) => l.id === selectedLesson)
            if (lesson) {
              console.log('User side - Updated lesson content:', lesson.title, 'New content:', lesson.content)
              setCurrentLessonContent(lesson.content)
              break
            }
          }
        }
      } catch (error) {
        console.error('Error loading course:', error)
        setCourse({
          id: params.id,
          title: "Course Not Found",
          sections: []
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    // Load course data initially
    loadCourseDataAndProgress()
    
    // Listen for custom course update events
    const handleCourseUpdate = (e: CustomEvent) => {
      console.log('User side - Custom event triggered:', e.detail)
      if (e.detail.courseId === params.id) {
        console.log('User side - Course update event matches current course, reloading...')
        loadCourseDataAndProgress()
      }
    }
    window.addEventListener('coursesUpdated', handleCourseUpdate as EventListener)
    
    return () => {
      window.removeEventListener('coursesUpdated', handleCourseUpdate as EventListener)
    }
  }, [params.id, selectedLesson, user])

  // Keep track of last courses data for comparison
  const lastCoursesRef = useRef<string | null>(null)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const totalLessons = course.sections.reduce((acc: number, section: any) => acc + section.lessons.length, 0)
  const completedCount = userProgress.filter(p => p.completed && course.sections.some((s: any) => s.lessons.some((l: any) => l.id === p.lessonId))).length
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  // Helper functions for progression system
  const isLessonCompleted = (lessonId: string) => {
    return userProgress.some(p => p.lessonId === lessonId && p.completed)
  }

  const isSectionCompleted = (section: any) => {
    return section.lessons.every((lesson: any) => isLessonCompleted(lesson.id))
  }

  const getNextUnlockedLesson = () => {
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        if (!isLessonCompleted(lesson.id)) {
          return lesson.id
        }
      }
    }
    return null
  }

  const isLessonUnlocked = (lessonId: string) => {
    const nextUnlocked = getNextUnlockedLesson()
    return nextUnlocked === lessonId
  }

  const isSectionUnlocked = (sectionIndex: number) => {
    if (sectionIndex === 0) return true // First section is always unlocked
    
    // Check if previous section is completed
    const previousSection = course.sections[sectionIndex - 1]
    return isSectionCompleted(previousSection)
  }

  const handleLessonClick = (lessonId: string) => {
    setSelectedLesson(lessonId)
    
    // Find the lesson content
    if (course) {
      for (const section of course.sections) {
        const lesson = section.lessons.find((l: any) => l.id === lessonId)
        if (lesson) {
          console.log('Selected lesson:', lesson.title) // Debug log
          console.log('Lesson content:', lesson.content) // Debug log
          setCurrentLessonContent(lesson.content)
          break
        }
      }
    }
  }

  const renderLessonContent = (content: string) => {
    if (!content) return <p className="text-gray-500">No content available for this lesson.</p>
    
    console.log('User side - Original content:', content) // Debug log
    
    // Handle backward compatibility - convert all old formats to new embed format
    let processedContent = content
    if (!content.includes('/embed ')) {
      // Old format - convert to new format
      const lines = content.split('\n').filter(line => line.trim())
      processedContent = lines.map(line => {
        // If line looks like a URL, convert to embed
        if (line.match(/^https?:\/\//)) {
          return `/embed ${line}`
        }
        // Otherwise keep as regular text
        return line
      }).join('\n')
      console.log('User side - Migrated old content to new format:', processedContent) // Debug log
    }
    
    console.log('User side - Final processed content:', processedContent) // Debug log
    
          const lines = processedContent.split('\n')
      const elements: JSX.Element[] = []
      
      lines.forEach((line, index) => {
        console.log('Processing line:', line) // Debug log
        
        // Handle different content types (including old formats for backward compatibility)
        if (line.startsWith('/embed ')) {
          const originalUrl = line.substring(7).trim()
          console.log('Found /embed line, URL:', originalUrl) // Debug log
          if (originalUrl) {
            // Determine content type based on URL
            let contentType = 'iframe'
            let icon = Video
            let label = 'Embedded Content'
            let embedUrl = originalUrl
            
            if (originalUrl.includes('youtube.com') || originalUrl.includes('youtu.be')) {
              contentType = 'video'
              icon = Video
              label = 'Video'
              // Convert YouTube URL to embed format
              const videoId = originalUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
              if (videoId) {
                embedUrl = `https://www.youtube.com/embed/${videoId}`
              }
            } else if (originalUrl.includes('vimeo.com')) {
              contentType = 'video'
              icon = Video
              label = 'Video'
              // Convert Vimeo URL to embed format
              const videoId = originalUrl.match(/vimeo\.com\/(\d+)/)?.[1]
              if (videoId) {
                embedUrl = `https://player.vimeo.com/video/${videoId}`
              }
            } else if (originalUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
              contentType = 'image'
              icon = Image
              label = 'Image'
            } else if (originalUrl.includes('typeform.com')) {
              contentType = 'form'
              icon = FormInput
              label = 'Form'
            }
            
            const Icon = icon
            elements.push(
              <div key={index} className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon size={16} className="text-purple-500" />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  {contentType === 'image' ? (
                    <img src={embedUrl} alt="Lesson content" className="w-full rounded-lg" />
                  ) : (
                    <iframe 
                      src={embedUrl} 
                      className="w-full h-96 rounded-lg"
                      frameBorder="0"
                      allowFullScreen
                      title="Embedded content"
                    />
                  )}
                </div>
              </div>
            )
          }
        } else if (line.startsWith('/https://') || line.startsWith('/http://')) {
          // Handle URLs that were saved with extra slash
          const originalUrl = line.substring(1).trim()
          console.log('Processing URL with extra slash:', originalUrl)
          
          // Convert to embed format
          let contentType = 'iframe'
          let icon = Video
          let label = 'Embedded Content'
          let embedUrl = originalUrl
          
          if (originalUrl.includes('youtube.com') || originalUrl.includes('youtu.be')) {
            contentType = 'video'
            icon = Video
            label = 'Video'
            // Convert YouTube URL to embed format
            const videoId = originalUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
            if (videoId) {
              embedUrl = `https://www.youtube.com/embed/${videoId}`
            }
          } else if (originalUrl.includes('vimeo.com')) {
            contentType = 'video'
            icon = Video
            label = 'Video'
            // Convert Vimeo URL to embed format
            const videoId = originalUrl.match(/vimeo\.com\/(\d+)/)?.[1]
            if (videoId) {
              embedUrl = `https://player.vimeo.com/video/${videoId}`
            }
          } else if (originalUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            contentType = 'image'
            icon = Image
            label = 'Image'
          } else if (originalUrl.includes('typeform.com')) {
            contentType = 'form'
            icon = FormInput
            label = 'Form'
          }
          
          const Icon = icon
          elements.push(
            <div key={index} className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon size={16} className="text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                {contentType === 'image' ? (
                  <img src={embedUrl} alt="Lesson content" className="w-full rounded-lg" />
                ) : (
                  <iframe 
                    src={embedUrl} 
                    className="w-full h-96 rounded-lg"
                    frameBorder="0"
                    allowFullScreen
                    title="Embedded content"
                  />
                )}
              </div>
            </div>
          )
        } else if (line.startsWith('/text ')) {
          // Handle old text format for backward compatibility
          const text = line.substring(6).trim()
          if (text) {
            elements.push(
              <div key={index} className="mb-4">
                <p className="text-gray-700 leading-relaxed">{text}</p>
              </div>
            )
          }
        } else if (line.startsWith('/image ')) {
          // Handle old image format for backward compatibility
          const url = line.substring(7).trim()
          if (url) {
            elements.push(
              <div key={index} className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Image size={16} className="text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Image</span>
                  </div>
                  <img src={url} alt="Lesson content" className="w-full rounded-lg" />
                </div>
              </div>
            )
          }
        } else if (line.startsWith('/typeform ')) {
          // Handle old typeform format for backward compatibility
          const url = line.substring(10).trim()
          if (url) {
            elements.push(
              <div key={index} className="mb-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <FormInput size={16} className="text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Form</span>
                  </div>
                  <iframe 
                    src={url} 
                    className="w-full h-96 rounded-lg"
                    frameBorder="0"
                    title="Form content"
                  />
                </div>
              </div>
            )
          }
        } else if (line.trim()) {
          // Handle regular text content with formatting
          const formattedText = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/__(.*?)__/g, '<u>$1</u>') // Underline
            .replace(/^# (.*)/, '<h1 class="text-2xl font-bold text-gray-900 mb-3">$1</h1>') // H1
            .replace(/^## (.*)/, '<h2 class="text-xl font-bold text-gray-900 mb-2">$1</h2>') // H2
            .replace(/^### (.*)/, '<h3 class="text-lg font-bold text-gray-900 mb-2">$1</h3>') // H3
          
          elements.push(
            <div key={index} className="mb-4">
              <div 
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formattedText }}
              />
            </div>
          )
        }
    })
    
    console.log('Generated elements:', elements.length) // Debug log
    return elements.length > 0 ? elements : <p className="text-gray-500">No content available for this lesson.</p>
  }

  const handleBackToCourses = () => {
    window.location.href = '/user'
  }

  const handleSignOut = () => {
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const handleMarkLessonCompleted = async (lessonId: string, completed: boolean) => {
    if (!user) return

    try {
      await progressService.markLessonCompleted(user.id, lessonId, completed)
      
      // Update local progress state
      setUserProgress(prev => {
        const existing = prev.find(p => p.lessonId === lessonId)
        if (existing) {
          return prev.map(p => 
            p.lessonId === lessonId 
              ? { ...p, completed, completedAt: completed ? new Date().toISOString() : null }
              : p
          )
        } else {
          // Add new progress entry
          return [...prev, {
            id: Date.now().toString(), // Temporary ID
            userId: user.id,
            lessonId,
            completed,
            completedAt: completed ? new Date().toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lesson: {
              id: lessonId,
              title: '', // Will be filled by the API
              section: {
                id: '',
                title: '',
                course: {
                  id: params.id,
                  title: course.title
                }
              }
            }
          }]
        }
      })

      // If lesson was completed, automatically select the next unlocked lesson
      if (completed) {
        const nextUnlockedLesson = getNextUnlockedLesson()
        if (nextUnlockedLesson && nextUnlockedLesson !== lessonId) {
          // Find the lesson content for the next unlocked lesson
          for (const section of course.sections) {
            const lesson = section.lessons.find((l: any) => l.id === nextUnlockedLesson)
            if (lesson) {
              setSelectedLesson(nextUnlockedLesson)
              setCurrentLessonContent(lesson.content)
              break
            }
          }
        }
      }
    } catch (error) {
      console.error('Error marking lesson as completed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToCourses}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Back to Courses</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Progress: {completedCount}/{totalLessons}</span>
              </div>
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

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
                    {/* Course Title */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
        </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{completedCount}/{totalLessons}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>



            {/* Sections */}
            <div className="space-y-6">
              {course.sections.map((section: any, sectionIndex: number) => {
                const isSectionUnlockedState = isSectionUnlocked(sectionIndex)
                const isSectionCompletedState = isSectionCompleted(section)
                
                return (
                  <div key={section.id} className={`${!isSectionUnlockedState ? 'opacity-50' : ''}`}>
                    <div className="flex items-center space-x-2 mb-3">
                      {isSectionCompletedState ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : isSectionUnlockedState ? (
                        <Play size={20} className="text-blue-500" />
                      ) : (
                        <Lock size={20} className="text-gray-400" />
                      )}
                      <h3 className={`text-lg font-semibold ${isSectionUnlockedState ? 'text-gray-900' : 'text-gray-500'}`}>
                        {section.title}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {section.lessons.map((lesson: any) => {
                        const isCompleted = isLessonCompleted(lesson.id)
                        const isUnlocked = isLessonUnlocked(lesson.id)
                        const isSelected = selectedLesson === lesson.id
                        const canClick = isUnlocked || isCompleted
                        
                        return (
                          <div key={lesson.id} className={`flex items-center space-x-2 ${!isSectionUnlockedState ? 'opacity-50' : ''}`}>
                            <button
                              onClick={() => canClick ? handleLessonClick(lesson.id) : null}
                              disabled={!canClick}
                              className={`flex-1 text-left p-3 rounded-lg transition-colors ${
                                !canClick 
                                  ? 'cursor-not-allowed bg-gray-100' 
                                  : isSelected 
                                    ? 'bg-primary-50 border border-primary-200' 
                                    : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {isCompleted ? (
                                    <CheckCircle size={20} className="text-green-500" />
                                  ) : isUnlocked ? (
                                    <Play size={20} className="text-blue-500" />
                                  ) : (
                                    <Lock size={20} className="text-gray-400" />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className={`font-medium ${canClick ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {lesson.title}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                      <span>{lesson.details}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </button>

                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Lesson Content */}
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                {selectedLesson ? (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {course.sections.flatMap((s: any) => s.lessons).find((l: any) => l.id === selectedLesson)?.title}
                      </h2>
                      <p className="text-gray-600">
                        {course.sections.flatMap((s: any) => s.lessons).find((l: any) => l.id === selectedLesson)?.details}
                      </p>
                    </div>
                    
                    {/* Lesson Content */}
                    <div className="prose max-w-none">
                      {renderLessonContent(currentLessonContent)}
                    </div>

                    {/* Complete Lesson Button */}
                    {(() => {
                      const nextUnlockedLesson = getNextUnlockedLesson()
                      const currentLesson = nextUnlockedLesson ? course.sections.flatMap((s: any) => s.lessons).find((l: any) => l.id === nextUnlockedLesson) : null
                      
                      return nextUnlockedLesson && currentLesson && selectedLesson === nextUnlockedLesson ? (
                        <div className="mt-8 text-center">
                          <button
                            onClick={() => handleMarkLessonCompleted(nextUnlockedLesson, true)}
                            className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 mx-auto"
                          >
                            <CheckCircle size={20} />
                            <span>Complete Lesson</span>
                          </button>
                        </div>
                      ) : null
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Lesson</h3>
                    <p className="text-gray-600">Choose a lesson from the sidebar to start learning.</p>
                  </div>
                )}
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 