'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Play, Clock, ArrowLeft, CheckCircle, Circle, LogOut, Video, Image, FormInput, Lock, ChevronDown, ChevronRight, Eye, FileText } from 'lucide-react'
import { courseService, Course } from '@/lib/services/courses-supabase'
import { progressService, UserProgress } from '@/lib/services/progress-supabase'
import { supabase } from '@/lib/supabase'


export default function CourseLessonsPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null)
  const [completedLessons] = useState(['intro-to-framer', 'design-system-styles'])
  const [course, setCourse] = useState<any>(null)
  const [currentLessonContent, setCurrentLessonContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [userProgress, setUserProgress] = useState<UserProgress[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [previewProgress, setPreviewProgress] = useState<Set<string>>(new Set()) // For preview mode
  const [isTransitioning, setIsTransitioning] = useState(false) // For auto-advance transition
  
  // Preview mode detection
  const isPreviewMode = searchParams.get('preview') === 'true'
  const isAdminPreview = searchParams.get('admin') === 'true'
  

    // Check authentication and load user data
  useEffect(() => {
    const checkAuth = () => {
      // In preview mode, skip authentication check
      if (isPreviewMode) {
        setUser({ id: 'preview-user', first_name: 'Preview', last_name: 'User', role: 'ADMIN' })
        return
      }

      const userData = localStorage.getItem('user')
      if (!userData) {
        window.location.href = '/'
        return
      }

      try {
        const user = JSON.parse(userData)
        setUser(user)
        
        // Clear any cached progress when user changes
        const lastUserId = localStorage.getItem('lastUserId')
        if (lastUserId && lastUserId !== user.id) {
          localStorage.removeItem('userProgress')
          localStorage.removeItem('courseData')
        }
        localStorage.setItem('lastUserId', user.id)
      } catch (error) {
        localStorage.removeItem('user')
        window.location.href = '/'
      }
    }

    checkAuth()
  }, [isPreviewMode])

  // Load course data and progress from API
  useEffect(() => {
    if (!user) return

    const loadCourseDataAndProgress = async () => {
      try {
        setIsLoading(true)
        
        
        // Load course and progress in parallel (skip progress in preview mode)
        const [foundCourse, progress] = await Promise.all([
          courseService.getCourse(params.id),
          isPreviewMode ? Promise.resolve([]) : progressService.getUserProgress(user.id)
        ])
        
        if (!foundCourse) {
          alert('Course not found. Please check the course ID.')
          return
        }
        
        console.log('Course loaded:', foundCourse)
        console.log('Course sections:', foundCourse?.sections)
        
        // Ensure course has proper structure
        if (foundCourse.sections) {
          foundCourse.sections = foundCourse.sections.map((section: any) => ({
            ...section,
            lessons: section.lessons || []
          }))
        }
        
        setCourse(foundCourse)
        setUserProgress(progress)
        
        // Set next incomplete lesson as selected by default if no lesson is currently selected
        if (foundCourse && foundCourse.sections && !selectedLesson && foundCourse.sections.length > 0) {
          // Find the next incomplete lesson (inline logic)
          let nextIncompleteLesson = null
          for (const section of foundCourse.sections) {
            if (section.lessons) {
              for (const lesson of section.lessons) {
                // Check if lesson is not completed (using progress data)
                const isCompleted = progress.some((p: any) => p.lesson_id === lesson.id && p.completed)
                if (!isCompleted) {
                  nextIncompleteLesson = lesson
                  break
                }
              }
              if (nextIncompleteLesson) break
            }
          }
          
          if (nextIncompleteLesson) {
            setSelectedLesson(nextIncompleteLesson.id)
            setCurrentLessonContent(nextIncompleteLesson.content)
          } else {
            // If all lessons are completed, show the last lesson
            const lastSection = foundCourse.sections[foundCourse.sections.length - 1]
            if (lastSection && lastSection.lessons && lastSection.lessons.length > 0) {
              const lastLesson = lastSection.lessons[lastSection.lessons.length - 1]
              setSelectedLesson(lastLesson.id)
              setCurrentLessonContent(lastLesson.content)
            }
          }
        } else if (foundCourse && foundCourse.sections && selectedLesson) {
          // Update current lesson content if lesson is still selected
          for (const section of foundCourse.sections) {
            const lesson = section.lessons ? section.lessons.find((l: any) => l.id === selectedLesson) : null
            if (lesson) {
              setCurrentLessonContent(lesson.content)
              break
            }
          }
        }
      } catch (error) {
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
      if (e.detail.courseId === params.id) {
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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

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

  const totalLessons = course.sections.reduce((acc: number, section: any) => acc + (section.lessons ? section.lessons.length : 0), 0)
  const completedCount = userProgress.filter(p => p.completed && course.sections.some((s: any) => s.lessons && s.lessons.some((l: any) => l.id === p.lesson_id))).length
  const progressPercentage = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0

  // Helper functions for progression system
  const isLessonCompleted = (lessonId: string) => {
    // In preview mode, use local preview progress
    if (isPreviewMode) {
      return previewProgress.has(lessonId)
    }
    return userProgress.some(p => p.lesson_id === lessonId && p.completed)
  }

  const isSectionCompleted = (section: any) => {
    return section.lessons ? section.lessons.every((lesson: any) => isLessonCompleted(lesson.id)) : false
  }

  const getNextUnlockedLesson = () => {
    for (const section of course.sections) {
      if (section.lessons) {
        for (const lesson of section.lessons) {
          if (!isLessonCompleted(lesson.id)) {
            return lesson.id
          }
        }
      }
    }
    return null
  }

  // Get the next lesson in sequence after the current lesson
  const getNextLessonInSequence = (currentLessonId: string) => {
    if (!course || !course.sections) return null
    
    // Flatten all lessons into a single array with their positions
    const allLessons: Array<{id: string, title: string, content: string, position: number}> = []
    let position = 0
    
    for (const section of course.sections) {
      if (section.lessons) {
        for (const lesson of section.lessons) {
          allLessons.push({
            id: lesson.id,
            title: lesson.title,
            content: lesson.content,
            position: position++
          })
        }
      }
    }
    
    // Find current lesson position
    const currentLessonIndex = allLessons.findIndex(lesson => lesson.id === currentLessonId)
    
    if (currentLessonIndex === -1) {
      // Current lesson not found
      return null
    }
    
    // Return the next lesson in sequence
    const nextIndex = currentLessonIndex + 1
    if (nextIndex < allLessons.length) {
      return allLessons[nextIndex]
    }
    
    // No next lesson (end of course)
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
        const lesson = section.lessons ? section.lessons.find((l: any) => l.id === lessonId) : null
        if (lesson) {
          setCurrentLessonContent(lesson.content)
          break
        }
      }
    }
  }

  // Auto-advance to next lesson after completion
  const autoAdvanceToNextLesson = async (currentLessonId: string) => {
    try {
      // Start transition effect
      setIsTransitioning(true)
      
      // Get the next lesson in sequence (no need to refresh progress - use current state)
      const nextLesson = getNextLessonInSequence(currentLessonId)
      
      if (nextLesson) {
        // Add a brief delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // Smoothly transition to the next lesson
        setSelectedLesson(nextLesson.id)
        setCurrentLessonContent(nextLesson.content)
        
        // Scroll to top of lesson content
        const lessonContentElement = document.getElementById('lesson-content')
        if (lessonContentElement) {
          lessonContentElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        
        // End transition effect
        setTimeout(() => {
          setIsTransitioning(false)
        }, 500)
        
        return true // Successfully advanced
      }
      
      // End transition effect if no next lesson
      setIsTransitioning(false)
      return false // No next lesson found (end of course)
    } catch (error) {
      console.error('Error in auto-advance:', error)
      setIsTransitioning(false)
      return false
    }
  }

  const renderLessonContent = (content: string) => {
    if (!content) return <p className="text-gray-500">No content available for this lesson.</p>
    
    console.log('🎯 renderLessonContent called with content:', content.substring(0, 200) + '...')
    console.log('🎯 Current user:', user ? { id: user.id, email: user.email } : 'null')
    console.log('🎯 Current selectedLesson:', selectedLesson)
    
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
    }
    
    
          const lines = processedContent.split('\n')
      const elements: JSX.Element[] = []
      
      lines.forEach((line, index) => {
        
        // Handle different content types (including old formats for backward compatibility)
        if (line.startsWith('/embed ')) {
          const originalUrl = line.substring(7).trim()
          console.log('🔍 Processing embed URL:', originalUrl)
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
            } else if (originalUrl.includes('docs.google.com') || 
                       originalUrl.includes('coda.io') || 
                       originalUrl.includes('notion.so') ||
                       originalUrl.includes('airtable.com') ||
                       originalUrl.includes('figma.com')) {
              contentType = 'document'
              icon = FileText
              label = 'Document'
            
            // Handle Typeform URLs with dynamic hidden fields
            console.log('🔍 Checking Typeform detection (location 1):', { 
              hasUser: !!user, 
              hasSelectedLesson: !!selectedLesson, 
              url: originalUrl,
              isTypeform: originalUrl.includes('typeform.com')
            })
            
            if (user && selectedLesson) {
              // Extract form ID from URL
              const formIdMatch = originalUrl.match(/form\.typeform\.com\/to\/([a-zA-Z0-9]+)/)
              console.log('🔍 Form ID match result (location 1):', formIdMatch)
              
              if (formIdMatch) {
                const formId = formIdMatch[1]
                console.log('🔄 Generating dynamic Typeform URL (location 1):', { formId, userId: user.id, lessonId: selectedLesson, courseId: params.id })
                // Generate dynamic Typeform URL with hidden fields
                embedUrl = progressService.generateTypeformUrl(formId, user, selectedLesson, params.id)
                console.log('✅ Generated URL (location 1):', embedUrl)
              } else {
                console.log('❌ No form ID match found in URL (location 1):', originalUrl)
              }
            } else {
              console.log('❌ Cannot generate dynamic URL (location 1) - missing user or selectedLesson:', { user: !!user, selectedLesson })
            }
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
                      className={`w-full rounded-lg ${
                        contentType === 'form' ? 'h-[600px]' : 
                        contentType === 'document' ? 'h-[800px]' : 'h-96'
                      }`}
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
          } else if (originalUrl.includes('docs.google.com') || 
                     originalUrl.includes('coda.io') || 
                     originalUrl.includes('notion.so') ||
                     originalUrl.includes('airtable.com') ||
                     originalUrl.includes('figma.com')) {
            contentType = 'document'
            icon = FileText
            label = 'Document'
          
          // Handle Typeform URLs with dynamic hidden fields
          console.log('🔍 Checking Typeform detection (location 2):', { 
            hasUser: !!user, 
            hasSelectedLesson: !!selectedLesson, 
            url: originalUrl,
            isTypeform: originalUrl.includes('typeform.com')
          })
          
          if (user && selectedLesson) {
            // Extract form ID from URL
            const formIdMatch = originalUrl.match(/form\.typeform\.com\/to\/([a-zA-Z0-9]+)/)
            console.log('🔍 Form ID match result (location 2):', formIdMatch)
            
            if (formIdMatch) {
              const formId = formIdMatch[1]
              console.log('🔄 Generating dynamic Typeform URL (location 2):', { formId, userId: user.id, lessonId: selectedLesson, courseId: params.id })
              // Generate dynamic Typeform URL with hidden fields
              embedUrl = progressService.generateTypeformUrl(formId, user, selectedLesson, params.id)
              console.log('✅ Generated URL (location 2):', embedUrl)
            } else {
              console.log('❌ No form ID match found in URL (location 2):', originalUrl)
            }
          } else {
            console.log('❌ Cannot generate dynamic URL (location 2) - missing user or selectedLesson:', { user: !!user, selectedLesson })
          }
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
                    className={`w-full rounded-lg ${
                      contentType === 'form' ? 'h-[600px]' : 
                      contentType === 'document' ? 'h-[800px]' : 'h-96'
                    }`}
                    frameBorder="0"
                    allowFullScreen
                    title="Embedded content"
                  />
                )}
              </div>
            </div>
          )
        } else if (line.trim()) {
          // Handle regular text content with formatting
          const formattedText = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
            .replace(/__(.*?)__/g, '<u>$1</u>') // Underline
            .replace(/^# (.*)/, '<h1 class="text-2xl font-bold text-gray-900 mb-3">$1</h1>') // H1
            .replace(/^## (.*)/, '<h2 class="text-xl font-bold text-gray-900 mb-2">$1</h2>') // H2
            .replace(/^### (.*)/, '<h3 class="text-lg font-bold text-gray-900 mb-2">$1</h3>') // H3
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>') // Hyperlinks [text](url)
          
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
    
    return elements.length > 0 ? elements : <p className="text-gray-500">No content available for this lesson.</p>
  }

  const handleBackToCourses = () => {
    window.location.href = '/user'
  }

  const handleSignOut = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('userProgress')
    localStorage.removeItem('courseData')
    localStorage.removeItem('lastUserId')
    window.location.href = '/'
  }


  const handleMarkLessonCompleted = async (lessonId: string, completed: boolean) => {
    if (!user) return

    try {
      await progressService.markLessonCompleted(user.id, lessonId, completed)
      
      // Update local progress state
      setUserProgress(prev => {
        const existing = prev.find(p => p.lesson_id === lessonId)
        if (existing) {
          return prev.map(p => 
            p.lesson_id === lessonId 
              ? { ...p, completed, completed_at: completed ? new Date().toISOString() : null }
              : p
          )
        } else {
          // Add new progress entry
          return [...prev, {
            id: Date.now().toString(), // Temporary ID
            user_id: user.id,
            lesson_id: lessonId,
            completed,
            completed_at: completed ? new Date().toISOString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
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

      // Force a complete refresh of progress data from server
      setTimeout(async () => {
        try {
          const freshProgress = await progressService.getUserProgress(user.id)
          setUserProgress(freshProgress)
        } catch (error) {
        }
      }, 1000)

      // If lesson was completed, automatically select the next lesson in the same section
      if (completed) {
        
        // Find the current section and lesson index
        let currentSectionIndex = -1
        let currentLessonIndex = -1
        
        for (let i = 0; i < course.sections.length; i++) {
          const section = course.sections[i]
          const lessonIndex = section.lessons ? section.lessons.findIndex((l: any) => l.id === lessonId) : -1
          if (lessonIndex !== -1) {
            currentSectionIndex = i
            currentLessonIndex = lessonIndex
              break
            }
          }
        
        // Find the next lesson in the same section
        if (currentSectionIndex !== -1 && currentLessonIndex !== -1) {
          const currentSection = course.sections[currentSectionIndex]
          const nextLessonIndex = currentLessonIndex + 1
          
          if (nextLessonIndex < currentSection.lessons.length) {
            // Next lesson in same section
            const nextLesson = currentSection.lessons[nextLessonIndex]
            setSelectedLesson(nextLesson.id)
            setCurrentLessonContent(nextLesson.content)
          } else {
            // End of section, find next section with lessons
            for (let i = currentSectionIndex + 1; i < course.sections.length; i++) {
              const nextSection = course.sections[i]
              if (nextSection.lessons.length > 0) {
                const firstLesson = nextSection.lessons[0]
                setSelectedLesson(firstLesson.id)
                setCurrentLessonContent(firstLesson.content)
                break
              }
            }
          }
        } else {
        }
      }
    } catch (error) {
    }
  }

  // Add function to refresh user progress
  const refreshUserProgress = async () => {
    if (!user) return
    
    // In preview mode, skip progress refresh since we don't have a real user
    if (isPreviewMode) {
      return
    }
    
    try {
      const progress = await progressService.getUserProgress(user.id)
      setUserProgress(progress)
    } catch (error) {
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

      {/* Preview Mode Banner */}
      {isPreviewMode && (
        <div className="bg-blue-50 border-b-2 border-blue-200 py-3 px-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <div className="flex items-center space-x-2 text-sm text-blue-800">
              <Eye size={16} />
              <span className="font-semibold">PREVIEW MODE</span>
              <span className="text-blue-600">•</span>
              <span className="text-xs text-blue-700">Typeform requirements bypassed for testing</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Full-width content area */}
        <div className="bg-white border-b border-gray-200">
          <div className="p-6">
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
                <div 
                  id="lesson-content" 
                  className={`prose max-w-none transition-opacity duration-300 ${
                    isTransitioning ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  {renderLessonContent(currentLessonContent)}
                </div>

                {/* Transition Loading Indicator */}
                {isTransitioning && (
                  <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-sm font-medium">Advancing to next lesson...</span>
                    </div>
                  </div>
                )}

                {/* Complete Lesson Button */}
                {(() => {
                  const currentLesson = course.sections.flatMap((s: any) => s.lessons).find((l: any) => l.id === selectedLesson)
                  const isCurrentLessonCompleted = currentLesson ? isLessonCompleted(currentLesson.id) : false
                  
                  return selectedLesson && currentLesson && !isCurrentLessonCompleted && !isTransitioning ? (
                    <div className="mt-8 text-center">
                      <button
                        onClick={async (event) => {
                          // Prevent multiple rapid clicks
                          const button = event.target as HTMLButtonElement
                          if (button.disabled) return
                          button.disabled = true
                          
                          try {
                            // First refresh user progress to get latest Typeform completion status
                            await refreshUserProgress()
                            
                            // Add a small delay to ensure database has updated
                            await new Promise(resolve => setTimeout(resolve, 1000))
                            
                            // In preview mode, always allow completion
                            if (isPreviewMode) {
                              // Update local preview progress
                              setPreviewProgress(prev => {
                                const newSet = new Set(prev)
                                newSet.add(selectedLesson)
                                return newSet
                              })
                              alert('Lesson completed successfully! (Preview Mode)')
                            } else {
                              // Check if lesson can be completed (considering typeform requirements)
                              const canComplete = await progressService.canCompleteLesson(user.id, selectedLesson, currentLessonContent)
                              
                              if (canComplete) {
                                await handleMarkLessonCompleted(selectedLesson, true)
                                
                                // Show success message
                                alert('Lesson completed successfully! Auto-advancing to next lesson...')
                                
                                // Auto-advance to next lesson instead of refreshing page
                                setTimeout(async () => {
                                  const advanced = await autoAdvanceToNextLesson(selectedLesson)
                                  
                                  if (!advanced) {
                                    // If no next lesson, show completion message and refresh
                                    alert('Congratulations! You have completed all available lessons in this course!')
                                    window.location.reload()
                                  }
                                }, 1000) // Reduced delay for better UX
                              } else {
                                // Show message that typeform needs to be completed
                                alert('Please complete the embedded form before marking this lesson as complete. If you just completed the form, please wait a moment and try again.')
                              }
                            }
                          } catch (error) {
                            alert('There was an error completing the lesson. Please try again.')
                          } finally {
                            // Re-enable button after a delay
                            setTimeout(() => {
                              button.disabled = false
                            }, 2000)
                          }
                        }}
                        className="bg-green-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 mx-auto w-full"
                      >
                        <CheckCircle size={24} />
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
                <p className="text-gray-600">Choose a lesson from below to start learning.</p>
              </div>
            )}
          </div>
        </div>

        {/* Accordion sections */}
        <div className="bg-gray-50">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
            
            {course.sections && course.sections.length > 0 ? course.sections.map((section: any, sectionIndex: number) => {
              const isSectionUnlockedState = isSectionUnlocked(sectionIndex)
              const isSectionCompletedState = isSectionCompleted(section)
              const isExpanded = expandedSections.has(section.id)
              const sectionProgress = section.lessons ? section.lessons.filter((lesson: any) => isLessonCompleted(lesson.id)).length : 0
              const sectionTotal = section.lessons ? section.lessons.length : 0
              
              return (
                <div key={section.id} className={`mb-4 ${!isSectionUnlockedState ? 'opacity-50' : ''}`}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full p-4 bg-white rounded-lg border border-gray-200 text-left transition-all duration-200 ${
                      isExpanded ? 'shadow-md' : 'hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isSectionCompletedState ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : isSectionUnlockedState ? (
                          <Play size={20} className="text-blue-500" />
                        ) : (
                          <Lock size={20} className="text-gray-400" />
                        )}
                        <div>
                          <h4 className={`font-semibold ${isSectionUnlockedState ? 'text-gray-900' : 'text-gray-500'}`}>
                            {section.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {sectionProgress} of {sectionTotal} lessons complete
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={20} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="p-4 space-y-2">
                        {section.lessons ? section.lessons.map((lesson: any) => {
                          const isCompleted = isLessonCompleted(lesson.id)
                          const isUnlocked = isLessonUnlocked(lesson.id)
                          const isSelected = selectedLesson === lesson.id
                          const canClick = isUnlocked || isCompleted
                          
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => canClick ? handleLessonClick(lesson.id) : null}
                              disabled={!canClick}
                              className={`w-full p-3 rounded-lg transition-colors text-left ${
                                !canClick 
                                  ? 'cursor-not-allowed bg-gray-100' 
                                  : isSelected 
                                    ? 'bg-primary-50 border border-primary-200' 
                                    : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {isCompleted ? (
                                  <CheckCircle size={20} className="text-green-500" />
                                ) : isUnlocked ? (
                                  <Play size={20} className="text-blue-500" />
                                ) : (
                                  <Lock size={20} className="text-gray-400" />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">
                                    {lesson.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {lesson.details}
                                  </div>
                                </div>
                              </div>
                            </button>
                          )
                        }) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500">No lessons available in this section.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            }) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No sections available for this course yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
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
              {course.sections && course.sections.length > 0 ? course.sections.map((section: any, sectionIndex: number) => {
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
                      {section.lessons ? section.lessons.map((lesson: any) => {
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
                      }) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500">No lessons available in this section.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No sections available for this course yet.</p>
                </div>
              )}
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
                        {course.sections.flatMap((s: any) => s.lessons || []).find((l: any) => l.id === selectedLesson)?.title}
                      </h2>
                      <p className="text-gray-600">
                        {course.sections.flatMap((s: any) => s.lessons || []).find((l: any) => l.id === selectedLesson)?.details}
                      </p>
                    </div>
                    
                    {/* Lesson Content */}
                    <div className="prose max-w-none">
                      {renderLessonContent(currentLessonContent)}
                    </div>

                    {/* Complete Lesson Button */}
                    {(() => {
                      const currentLesson = course.sections.flatMap((s: any) => s.lessons).find((l: any) => l.id === selectedLesson)
                      const isCurrentLessonCompleted = currentLesson ? isLessonCompleted(currentLesson.id) : false
                      
                      return selectedLesson && currentLesson && !isCurrentLessonCompleted ? (
                        <div className="mt-8 text-center">
                          <button
                            onClick={async () => {
                              // In preview mode, always allow completion
                              if (isPreviewMode) {
                                // Update local preview progress
                                setPreviewProgress(prev => {
                                  const newSet = new Set(prev)
                                  newSet.add(selectedLesson)
                                  return newSet
                                })
                                alert('Lesson completed successfully! (Preview Mode)')
                              } else {
                                // Check if lesson can be completed (considering typeform requirements)
                                const canComplete = await progressService.canCompleteLesson(user.id, selectedLesson, currentLessonContent)
                                
                                if (canComplete) {
                                  await handleMarkLessonCompleted(selectedLesson, true)
                                  alert('Lesson completed successfully! Auto-advancing to next lesson...')
                                  // Auto-refresh the page after successful completion
                                  setTimeout(() => {
                                    window.location.reload()
                                  }, 1000)
                                } else {
                                  // Show message that typeform needs to be completed
                                  alert('Please complete the embedded form before marking this lesson as complete.')
                                }
                              }
                            }}
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