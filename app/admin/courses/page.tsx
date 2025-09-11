// @ts-nocheck
'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  ArrowLeft, 
  Plus, 
  Folder, 
  BookOpen, 
  Play, 
  Edit, 
  Trash2,
  Save,
  X,
  Video,
  FileText,
  Image,
  FormInput,
  ChevronDown
} from 'lucide-react'
import { courseService, CourseWithSections, Section, Lesson } from '@/lib/services/courses-supabase'

export default function CourseBuilderPage() {
  const [courses, setCourses] = useState<CourseWithSections[]>([])
  const [selectedCourse, setSelectedCourse] = useState<CourseWithSections | null>(null)
  const [isCreatingCourse, setIsCreatingCourse] = useState(false)
  const [isCreatingSection, setIsCreatingSection] = useState(false)
  const [isCreatingLesson, setIsCreatingLesson] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  
  const [newCourse, setNewCourse] = useState({ title: '', description: '', visibility: 'public' as 'public' | 'private' })
  const [newSection, setNewSection] = useState({ title: '', description: '' })
  const [newLesson, setNewLesson] = useState({ title: '', content: '', details: '' })
  
  // Inline content editor state
  const [content, setContent] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 })
  const [currentCommand, setCurrentCommand] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [showEmbedInput, setShowEmbedInput] = useState(false)
  const [embedUrl, setEmbedUrl] = useState('')
  const [embedPreview, setEmbedPreview] = useState('')
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false)
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)



  // Load existing courses from API on component mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courses = await courseService.getAllCourses()
        setCourses(courses)
      } catch (error: any) {
        console.error('Error loading courses:', error)
        setCourses([])
      }
    }
    
    loadCourses()
  }, [])

  const handleBackToDashboard = () => {
    window.location.href = '/admin'
  }

  const handleCreateCourse = () => {
    setIsCreatingCourse(true)
  }

  const handleCreateNewCourse = async () => {
    if (newCourse.title && newCourse.description) {
      try {
        const course = await courseService.createCourse({
          title: newCourse.title,
          description: newCourse.description,
          visibility: newCourse.visibility
        })
        
        console.log('New course created via API:', course.title)
        
        // Update local state with course that has empty sections array
        const courseWithSections: CourseWithSections = {
          ...course,
          sections: []
        }
        setCourses([...courses, courseWithSections])
        setNewCourse({ title: '', description: '', visibility: 'public' })
        setIsCreatingCourse(false)
        
        // Trigger real-time update for user side
        window.dispatchEvent(new CustomEvent('coursesUpdated', { 
          detail: { courseId: course.id } 
        }))
      } catch (error) {
        console.error('Error creating course:', error)
        alert('Failed to create course. Please try again.')
      }
    }
  }

  const handleCreateSection = () => {
    setIsCreatingSection(true)
  }

  const handleSaveSection = async () => {
    console.log('handleSaveSection called')
    console.log('newSection:', newSection)
    console.log('selectedCourse:', selectedCourse)
    
    if (!newSection.title) {
      alert('Please enter a section title')
      return
    }
    
    if (!selectedCourse) {
      alert('Please select a course first')
      return
    }
    
    try {
      console.log('Creating section for course:', selectedCourse.id)
      const section = await courseService.createSection({
        title: newSection.title,
        description: newSection.description,
        courseId: selectedCourse.id
      })
      
      console.log('Section created successfully:', section)
      
      // Add lessons array to the new section
      const sectionWithLessons = {
        ...section,
        lessons: []
      }
      
      const updatedCourse = {
        ...selectedCourse,
        sections: [...selectedCourse.sections, sectionWithLessons]
      }
      setSelectedCourse(updatedCourse)
      setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c))
      
      setNewSection({ title: '', description: '' })
      setIsCreatingSection(false)
      
      // Trigger real-time update for user side
      window.dispatchEvent(new CustomEvent('coursesUpdated', { 
        detail: { courseId: selectedCourse.id } 
      }))
      
      console.log('New section created via API:', section.title)
    } catch (error) {
      console.error('Error creating section:', error)
      alert(`Failed to create section: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleCreateLesson = (sectionId: string) => {
    setIsCreatingLesson(true)
    setSelectedSectionId(sectionId)
    setContent('')
    setNewLesson({ title: '', content: '', details: '' })
    
    // Reset embed states
    setShowEmbedInput(false)
    setEmbedUrl('')
    setEmbedPreview('')
    setShowDropdown(false)
    setCurrentCommand('')
    setSelectedText({ start: 0, end: 0 })
  }

  const handleSaveLesson = async () => {
    if (newLesson.title && selectedCourse && selectedCourse.sections.length > 0) {
      // Use selectedSectionId if available, otherwise use first section
      const targetSectionId = selectedSectionId || selectedCourse.sections[0].id
      
      try {
        const lesson = await courseService.createLesson({
          title: newLesson.title,
          content: content, // Use content state directly
          details: newLesson.details,
          sectionId: targetSectionId
        })
        
        console.log('Saving lesson via API:', lesson.title)
        console.log('Lesson content:', lesson.content)
        
        // Add lesson to the selected section
        // Ensure all sections have lessons array
        const updatedSections = selectedCourse.sections.map((section) => {
          const sectionWithLessons = {
            ...section,
            lessons: section.lessons || []
          }
          
          if (section.id === targetSectionId) {
            return { 
              ...sectionWithLessons, 
              lessons: [...sectionWithLessons.lessons, lesson] 
            }
          }
          return sectionWithLessons
        })
        
        const updatedCourse = {
          ...selectedCourse,
          sections: updatedSections
        }
        setSelectedCourse(updatedCourse)
        setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c))
        
        // Trigger real-time update for user side
        window.dispatchEvent(new CustomEvent('coursesUpdated', { 
          detail: { courseId: selectedCourse.id } 
        }))
        
        setNewLesson({ title: '', content: '', details: '' })
        setContent('')
        setIsCreatingLesson(false)
        setSelectedSectionId(null)
      } catch (error) {
        console.error('Error creating lesson:', error)
        alert('Failed to create lesson. Please try again.')
      }
    }
  }

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setNewLesson({ title: lesson.title, content: lesson.content, details: lesson.details })
    
    // Reset embed states
    setShowEmbedInput(false)
    setEmbedUrl('')
    setEmbedPreview('')
    setShowDropdown(false)
    setCurrentCommand('')
    setSelectedText({ start: 0, end: 0 })
    
    // Convert old content format to new format for editing
    let editableContent = lesson.content || ''
    if (editableContent && !editableContent.includes('/embed ')) {
      // Convert old formats to new embed format
      const lines = editableContent.split('\n').filter(line => line.trim())
      editableContent = lines.map(line => {
        // If line looks like a URL, convert to embed
        if (line.match(/^https?:\/\//)) {
          return `/embed ${line}`
        }
        // Otherwise keep as regular text
        return line
      }).join('\n')
      console.log('Converted old content for editing:', editableContent) // Debug log
    }
    
    // Load existing content into the editor
    setContent(editableContent)
    console.log('Loading lesson content for editing:', editableContent) // Debug log
  }

  const handleSaveLessonEdit = async () => {
    if (editingLesson && selectedCourse) {
      try {
        console.log('Saving lesson edit with content:', content)
        
        const updatedLesson = await courseService.updateLesson(editingLesson.id, {
          title: newLesson.title,
          content: content,
          details: newLesson.details
        })
        
        const updatedSections = selectedCourse.sections.map(section => ({
          ...section,
          lessons: section.lessons.map(lesson => 
            lesson.id === editingLesson.id 
              ? updatedLesson
              : lesson
          )
        }))
        
        const updatedCourse = {
          ...selectedCourse,
          sections: updatedSections
        }
        setSelectedCourse(updatedCourse)
        setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c))
        
        setEditingLesson(null)
        setNewLesson({ title: '', content: '', details: '' })
        setContent('')
        
        // Trigger real-time update for user side
        console.log('Admin side - Dispatching coursesUpdated event for course:', selectedCourse.id)
        window.dispatchEvent(new CustomEvent('coursesUpdated', { 
          detail: { courseId: selectedCourse.id } 
        }))
      } catch (error) {
        console.error('Error updating lesson:', error)
        alert('Failed to update lesson. Please try again.')
      }
    }
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        // Delete the lesson via Supabase service
        await courseService.deleteLesson(lessonId)
        
        // Update local state
        if (selectedCourse) {
          const updatedSections = selectedCourse.sections.map(section => ({
            ...section,
            lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
          }))
          
          const updatedCourse = {
            ...selectedCourse,
            sections: updatedSections
          }
          setSelectedCourse(updatedCourse)
          setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c))
          
          // Trigger real-time update
          window.dispatchEvent(new CustomEvent('coursesUpdated', { 
            detail: { courseId: selectedCourse.id } 
          }))
        }
        
        console.log('Lesson deleted successfully')
      } catch (error) {
        console.error('Error deleting lesson:', error)
        alert('Failed to delete lesson. Please try again.')
      }
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section? This will also delete all lessons within it.')) {
      try {
        // Delete the section via Supabase service
        await courseService.deleteSection(sectionId)
        
        // Update local state
        if (selectedCourse) {
          const updatedSections = selectedCourse.sections.filter(section => section.id !== sectionId)
          const updatedCourse = {
            ...selectedCourse,
            sections: updatedSections
          }
          
          setSelectedCourse(updatedCourse)
          setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c))
          
          // Trigger real-time update
          window.dispatchEvent(new CustomEvent('coursesUpdated', { 
            detail: { courseId: selectedCourse.id } 
          }))
        }
        
        console.log('Section deleted successfully')
      } catch (error) {
        console.error('Error deleting section:', error)
        alert('Failed to delete section. Please try again.')
      }
    }
  }

  // Inline content editor functions
  const contentOptions = [
    { type: 'embed', label: 'Embed', icon: Video, description: 'Add any URL (video, image, form, etc.)' }
  ]

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart
    const selectionEnd = e.target.selectionEnd
    setContent(value)
    setCursorPosition(cursorPos)
    setSelectedText({ start: cursorPos, end: selectionEnd })

    // Check for backslash command
    const beforeCursor = value.substring(0, cursorPos)
    const lines = beforeCursor.split('\n')
    const currentLine = lines[lines.length - 1]
    
    if (currentLine.startsWith('/') && !currentLine.includes(' ')) {
      setCurrentCommand(currentLine.substring(1))
      setShowDropdown(true)
      
      // Calculate dropdown position
      const textarea = e.target
      const rect = textarea.getBoundingClientRect()
      const lineHeight = 20 // Approximate line height
      const lineNumber = beforeCursor.split('\n').length - 1
      
      setDropdownPosition({
        x: rect.left + (currentLine.length * 8), // Approximate character width
        y: rect.top + (lineNumber * lineHeight) + 20
      })
    } else {
      setShowDropdown(false)
    }
  }

  const handleTextSelection = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement
    const selectionStart = textarea.selectionStart
    const selectionEnd = textarea.selectionEnd

    setSelectedText({ start: selectionStart, end: selectionEnd })
  }

  const insertContent = (type: string) => {
    if (type === 'embed') {
      setShowEmbedInput(true)
      setShowDropdown(false)
      setCurrentCommand('')
    } else {
      const beforeCursor = content.substring(0, cursorPosition)
      const afterCursor = content.substring(cursorPosition)
      
      const lines = beforeCursor.split('\n')
      const currentLineIndex = lines.length - 1
      const currentLine = lines[currentLineIndex]
      
      // Replace the current line with the command
      const newLine = `/${type} `
      lines[currentLineIndex] = newLine
      
      const newContent = lines.join('\n') + afterCursor
      setContent(newContent)
      setShowDropdown(false)
      setCurrentCommand('')
      
      // Set cursor position after the command
      const newCursorPos = beforeCursor.length - currentLine.length + newLine.length
      setTimeout(() => {
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement
        if (textarea) {
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          textarea.focus()
        }
      }, 0)
    }
  }

  const handleEmbedUrlChange = (url: string) => {
    setEmbedUrl(url)
    
    // Generate preview based on URL type
    if (url) {
      try {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          setEmbedPreview('video')
          // Convert YouTube URL to embed format for preview
          const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1]
          if (videoId) {
            setEmbedUrl(`https://www.youtube.com/embed/${videoId}`)
          }
        } else if (url.includes('vimeo.com')) {
          setEmbedPreview('video')
          // Convert Vimeo URL to embed format for preview
          const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
          if (videoId) {
            setEmbedUrl(`https://player.vimeo.com/video/${videoId}`)
          }
        } else if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          setEmbedPreview('image')
        } else if (url.includes('typeform.com')) {
          setEmbedPreview('form')
        } else {
          setEmbedPreview('iframe')
        }
      } catch (error) {
        console.error('Error processing URL:', error)
        setEmbedPreview('iframe') // Fallback to iframe
      }
    } else {
      setEmbedPreview('')
    }
  }

  const confirmEmbed = () => {
    if (embedUrl.trim()) {
      const beforeCursor = content.substring(0, cursorPosition)
      const afterCursor = content.substring(cursorPosition)
      
      const lines = beforeCursor.split('\n')
      const currentLineIndex = lines.length - 1
      const currentLine = lines[currentLineIndex]
      
      // Replace the current line with the embed command
      const newLine = `/embed ${embedUrl.trim()}`
      lines[currentLineIndex] = newLine
      
      const newContent = lines.join('\n') + '\n' + afterCursor
      console.log('Admin side - Saving embed content:', newContent)
      setContent(newContent)
      setShowEmbedInput(false)
      setEmbedUrl('')
      setEmbedPreview('')
      
      // Set cursor position after the embed
      const newCursorPos = beforeCursor.length - currentLine.length + newLine.length + 1
      setTimeout(() => {
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement
        if (textarea) {
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          textarea.focus()
        }
      }, 0)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && showDropdown) {
      e.preventDefault()
      // Select first option
      const firstOption = contentOptions[0]
      insertContent(firstOption.type)
    }
  }

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'h1' | 'h2' | 'h3' | 'link' | 'regular') => {
    const textarea = textareaRef.current
    if (!textarea) {
      console.log('Textarea not found')
      return
    }

    // Get current selection directly from textarea
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedContent = content.substring(start, end)
    
    console.log('Formatting text:', { format, start, end, selectedContent })
    

    
    if (selectedContent) {
      let formattedText = ''
      switch (format) {
        case 'bold':
          formattedText = `**${selectedContent}**`
          break
        case 'italic':
          formattedText = `*${selectedContent}*`
          break
        case 'underline':
          formattedText = `__${selectedContent}__`
          break
        case 'h1':
          formattedText = `# ${selectedContent}`
          break
        case 'h2':
          formattedText = `## ${selectedContent}`
          break
        case 'h3':
          formattedText = `### ${selectedContent}`
          break
        case 'link':
          // For links, we need to prompt for URL
          const url = prompt('Enter the URL for the link:')
          if (url) {
            formattedText = `[${selectedContent}](${url})`
          } else {
            return // Don't format if user cancels
          }
          break
        case 'regular':
          // Remove any heading markers
          formattedText = selectedContent.replace(/^#{1,3}\s+/, '')
          break
      }
      
      const newContent = content.substring(0, start) + formattedText + content.substring(end)
      setContent(newContent)
      
      // Set cursor position after formatted text
      setTimeout(() => {
        textarea.setSelectionRange(start + formattedText.length, start + formattedText.length)
        textarea.focus()
      }, 0)
    } else {
      // If no text is selected, insert formatting markers at cursor position
      let markers = ''
      switch (format) {
        case 'bold':
          markers = '**text**'
          break
        case 'italic':
          markers = '*text*'
          break
        case 'underline':
          markers = '__text__'
          break
        case 'h1':
          markers = '# Heading 1'
          break
        case 'h2':
          markers = '## Heading 2'
          break
        case 'h3':
          markers = '### Heading 3'
          break
        case 'link':
          markers = '[Link Text](https://example.com)'
          break
        case 'regular':
          markers = 'Regular text'
          break
      }
      
      const newContent = content.substring(0, start) + markers + content.substring(start)
      setContent(newContent)
      
              // Set cursor position between markers
        setTimeout(() => {
          let newPos = start + markers.length
          if (format === 'h1') {
            newPos = start + markers.length - 9 // "# Heading 1" -> position after "Heading "
          } else if (format === 'h2') {
            newPos = start + markers.length - 9 // "## Heading 2" -> position after "Heading "
          } else if (format === 'h3') {
            newPos = start + markers.length - 9 // "### Heading 3" -> position after "Heading "
          } else if (format === 'regular') {
            newPos = start + markers.length - 12 // "Regular text" -> position after "Regular "
          } else {
            newPos = start + markers.length - 4 // For bold, italic, underline
          }
          textarea.setSelectionRange(newPos, newPos)
          textarea.focus()
        }, 0)
    }
  }

  const handleSaveCourseToStorage = async () => {
    if (!selectedCourse) return
    
    setIsSaving(true)
    
    try {
      console.log('Saving course to localStorage:', selectedCourse.title) // Debug log
      console.log('Course sections:', selectedCourse.sections.length) // Debug log
      
      // Save to localStorage for now (in future, this will be Supabase)
      const savedCourses = JSON.parse(localStorage.getItem('courses') || '[]')
      const existingCourseIndex = savedCourses.findIndex((c: Course) => c.id === selectedCourse.id)
      
      if (existingCourseIndex >= 0) {
        savedCourses[existingCourseIndex] = selectedCourse
      } else {
        savedCourses.push(selectedCourse)
      }
      
      localStorage.setItem('courses', JSON.stringify(savedCourses))
      console.log('Saved courses to localStorage:', savedCourses.length) // Debug log
      
      // Update local state
      setCourses(courses.map(c => c.id === selectedCourse.id ? selectedCourse : c))
      
      // Trigger a custom event to notify other tabs/windows
      window.dispatchEvent(new CustomEvent('coursesUpdated', { 
        detail: { courseId: selectedCourse.id } 
      }))
      
      // Show success message
      alert('Course saved successfully! Users can now access this course.')
      
    } catch (error) {
      console.error('Error saving course:', error)
      alert('Error saving course. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return
    }

    try {
      await courseService.deleteCourse(courseId)
      
      // Remove from local state
      setCourses(courses.filter(c => c.id !== courseId))
      
      // If the deleted course was selected, clear selection
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(null)
      }
      
      // Trigger real-time update for user side
      window.dispatchEvent(new CustomEvent('coursesUpdated', { 
        detail: { courseId: courseId, action: 'deleted' } 
      }))
      
      console.log('Course deleted via API:', courseId)
    } catch (error) {
      console.error('Error deleting course:', error)
      alert('Failed to delete course. Please try again.')
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
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Back to Dashboard</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Course Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCreateCourse}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus size={18} />
                <span>Create Course</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCourse ? (
          /* Course List View */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Courses</h2>
              <p className="text-gray-600">Manage and create courses for your curriculum.</p>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Folder size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first course.</p>
                <button
                  onClick={handleCreateCourse}
                  className="btn-primary flex items-center space-x-2 mx-auto"
                >
                  <Plus size={18} />
                  <span>Create Your First Course</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow relative group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Folder size={24} className="text-primary-600" />
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{course.sections.length} sections</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteCourse(course.id)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div 
                      className="cursor-pointer"
                      onClick={() => setSelectedCourse(course)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm text-primary-600">
                          <span>Click to edit</span>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.visibility === 'public'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {course.visibility === 'public' ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Course Editor View */
          <div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                  <p className="text-gray-600">{selectedCourse.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSaveCourseToStorage}
                    disabled={isSaving}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Course</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="btn-secondary"
                  >
                    Back to Courses
                  </button>
                  <button
                    onClick={() => handleDeleteCourse(selectedCourse.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 size={18} />
                    <span>Delete Course</span>
                  </button>
                </div>
              </div>
              
              {/* Course Visibility Toggle */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">Course Visibility</h3>
                    <p className="text-sm text-gray-600">
                      {selectedCourse.visibility === 'public' 
                        ? 'This course is visible to all users' 
                        : 'This course is private and only available to invited users'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`visibility-${selectedCourse.id}`}
                        value="public"
                        checked={selectedCourse.visibility === 'public'}
                        onChange={async (e) => {
                          const newVisibility = e.target.value as 'public' | 'private'
                          try {
                            const updatedCourse = await courseService.updateCourse(selectedCourse.id, {
                              title: selectedCourse.title,
                              description: selectedCourse.description,
                              visibility: newVisibility
                            })
                            setSelectedCourse(updatedCourse)
                            setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c))
                            // Trigger real-time update for user side
                            window.dispatchEvent(new CustomEvent('coursesUpdated', { 
                              detail: { courseId: selectedCourse.id } 
                            }))
                          } catch (error) {
                            console.error('Error updating course visibility:', error)
                            alert('Failed to update course visibility. Please try again.')
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Public (All Users)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`visibility-${selectedCourse.id}`}
                        value="private"
                        checked={selectedCourse.visibility === 'private'}
                        onChange={async (e) => {
                          const newVisibility = e.target.value as 'public' | 'private'
                          try {
                            const updatedCourse = await courseService.updateCourse(selectedCourse.id, {
                              title: selectedCourse.title,
                              description: selectedCourse.description,
                              visibility: newVisibility
                            })
                            setSelectedCourse(updatedCourse)
                            setCourses(courses.map(c => c.id === selectedCourse.id ? updatedCourse : c))
                            // Trigger real-time update for user side
                            window.dispatchEvent(new CustomEvent('coursesUpdated', { 
                              detail: { courseId: selectedCourse.id } 
                            }))
                          } catch (error) {
                            console.error('Error updating course visibility:', error)
                            alert('Failed to update course visibility. Please try again.')
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Private (Invite Only)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Sections</h3>
                <button
                  onClick={handleCreateSection}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Add Section</span>
                </button>
              </div>

              {selectedCourse.sections.map((section, sectionIndex) => (
                <div key={section.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
                      <p className="text-gray-600 text-sm">{section.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{section.lessons.length} lessons</span>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete section"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-3">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Play size={16} className="text-gray-400" />
                          <div>
                            <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                            <p className="text-sm text-gray-500">{lesson.details}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditLesson(lesson)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(lesson.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Lesson Button */}
                  <button
                    onClick={() => handleCreateLesson(section.id)}
                    className="mt-4 w-full flex items-center justify-center space-x-2 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Lesson</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      {isCreatingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Course</h3>
              <button
                onClick={() => setIsCreatingCourse(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter course title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Enter course description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={newCourse.visibility === 'public'}
                      onChange={(e) => setNewCourse({ ...newCourse, visibility: e.target.value as 'public' | 'private' })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Public (All Users)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={newCourse.visibility === 'private'}
                      onChange={(e) => setNewCourse({ ...newCourse, visibility: e.target.value as 'public' | 'private' })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Private (Invite Only)</span>
                  </label>
                </div>
              </div>
              <div className="flex space-x-3">
                                 <button
                   onClick={handleCreateNewCourse}
                   className="btn-primary flex-1"
                 >
                   <Save size={16} className="mr-2" />
                   Create Course
                 </button>
                <button
                  onClick={() => setIsCreatingCourse(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Section Modal */}
      {isCreatingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Section</h3>
              <button
                onClick={() => setIsCreatingSection(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  value={newSection.title}
                  onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter section title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newSection.description}
                  onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Enter section description"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveSection}
                  className="btn-primary flex-1"
                >
                  <Save size={16} className="mr-2" />
                  Create Section
                </button>
                <button
                  onClick={() => setIsCreatingSection(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Lesson Modal */}
      {(isCreatingLesson || editingLesson) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
              </h3>
              <button
                onClick={() => {
                  setIsCreatingLesson(false)
                  setEditingLesson(null)
                  setNewLesson({ title: '', content: '', details: '' })
                  setContent('')
                  
                  // Reset embed states
                  setShowEmbedInput(false)
                  setEmbedUrl('')
                  setEmbedPreview('')
                  setShowDropdown(false)
                  setCurrentCommand('')
                  setSelectedText({ start: 0, end: 0 })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                  <input
                    type="text"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter lesson title"
                  />
                </div>
                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Details</label>
                <input
                  type="text"
                  value={newLesson.details}
                  onChange={(e) => setNewLesson({ ...newLesson, details: e.target.value })}
                  className="input-field"
                  placeholder="Enter details"
                />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                
                {/* Inline Content Editor */}
                <div className="relative">
                  {/* Formatting Toolbar */}
                  <div className="mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 mr-2">Format:</span>
                      <button
                        onClick={() => formatText('bold')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Bold"
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        onClick={() => formatText('italic')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Italic"
                      >
                        <em>I</em>
                      </button>
                      <button
                        onClick={() => formatText('underline')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Underline"
                      >
                        <u>U</u>
                      </button>
                      <button
                        onClick={() => formatText('h1')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Heading 1"
                      >
                        <span className="text-lg font-bold">H1</span>
                      </button>
                      <button
                        onClick={() => formatText('h2')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Heading 2"
                      >
                        <span className="text-base font-bold">H2</span>
                      </button>
                      <button
                        onClick={() => formatText('h3')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Heading 3"
                      >
                        <span className="text-sm font-bold">H3</span>
                      </button>
                      <button
                        onClick={() => formatText('link')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Link"
                      >
                        <span className="text-sm text-blue-600 font-bold">L</span>
                      </button>
                      <button
                        onClick={() => formatText('regular')}
                        className="px-2 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
                        title="Regular Text"
                      >
                        <span className="text-sm">T</span>
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Select text and click format buttons (Bold, Italic, Underline, H1, H2, H3, Link, Regular), or type / for embed options
                    </div>
                  </div>
                  
                        <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        onMouseUp={handleTextSelection}
        onKeyUp={handleTextSelection}
        className="input-field w-full min-h-[300px] font-mono text-sm"
        placeholder="Start typing your lesson content...

Type / to add embedded content"
      />
                  
                  {/* Content Type Dropdown */}
                  {showDropdown && (
                    <div 
                      className="absolute bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]"
                      style={{
                        left: `${dropdownPosition.x}px`,
                        top: `${dropdownPosition.y}px`
                      }}
                    >
                      <div className="p-2 space-y-1">
                        {contentOptions
                          .filter(option => 
                            option.label.toLowerCase().includes(currentCommand.toLowerCase()) ||
                            option.type.toLowerCase().includes(currentCommand.toLowerCase())
                          )
                          .map((option, index) => {
                            const Icon = option.icon
                            return (
                              <button
                                key={option.type}
                                onClick={() => insertContent(option.type)}
                                className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded"
                              >
                                <Icon size={16} className="text-gray-500" />
                                <div>
                                  <div className="font-medium text-gray-900">{option.label}</div>
                                  <div className="text-xs text-gray-500">{option.description}</div>
                                </div>
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  )}
                  
                  {/* Embed URL Input */}
                  {showEmbedInput && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center space-x-2 mb-3">
                        <Video size={16} className="text-purple-500" />
                        <span className="font-medium text-gray-900">Add Embedded Content</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                          <input
                            type="url"
                            value={embedUrl}
                            onChange={(e) => handleEmbedUrlChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                confirmEmbed()
                              }
                            }}
                            className="input-field w-full"
                            placeholder="Paste your URL here (YouTube, Vimeo, image, form, etc.)"
                            autoFocus
                          />
                        </div>
                        
                        {embedPreview && (
                          <div className="p-3 bg-white rounded border border-gray-200">
                            <div className="flex items-center space-x-2 mb-2">
                              {embedPreview === 'video' && <Video size={14} className="text-purple-500" />}
                              {embedPreview === 'image' && <Image size={14} className="text-green-500" />}
                              {embedPreview === 'form' && <FormInput size={14} className="text-orange-500" />}
                              {embedPreview === 'iframe' && <Video size={14} className="text-blue-500" />}
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {embedPreview === 'video' && 'Video Preview'}
                                {embedPreview === 'image' && 'Image Preview'}
                                {embedPreview === 'form' && 'Form Preview'}
                                {embedPreview === 'iframe' && 'Embedded Content Preview'}
                              </span>
                            </div>
                            
                            {/* Live Preview */}
                            <div className="mt-3">
                              {embedPreview === 'video' && (
                                <iframe 
                                  src={embedUrl} 
                                  className="w-full h-32 rounded"
                                  frameBorder="0"
                                  allowFullScreen
                                  title="Video preview"
                                />
                              )}
                              {embedPreview === 'image' && (
                                <img src={embedUrl} alt="Preview" className="w-full h-32 object-cover rounded" />
                              )}
                              {embedPreview === 'form' && (
                                <iframe 
                                  src={embedUrl} 
                                  className="w-full h-32 rounded"
                                  frameBorder="0"
                                  title="Form preview"
                                />
                              )}
                              {embedPreview === 'iframe' && (
                                <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                                  <span className="text-gray-500 text-sm">Embedded content preview</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-2">
                              {embedPreview === 'video' && 'This will display as a video player'}
                              {embedPreview === 'image' && 'This will display as an image'}
                              {embedPreview === 'form' && 'This will display as an embedded form'}
                              {embedPreview === 'iframe' && 'This will display as embedded content'}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={confirmEmbed}
                            disabled={!embedUrl.trim()}
                            className="btn-primary text-sm px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Embed
                          </button>
                          <button
                            onClick={() => {
                              setShowEmbedInput(false)
                              setEmbedUrl('')
                              setEmbedPreview('')
                            }}
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  <p>💡 Tip: Type / to add embedded content. Press Enter to confirm the URL.</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    console.log('Saving content:', content) // Debug log
                    const updatedLesson = { ...newLesson, content: content }
                    setNewLesson(updatedLesson)
                    
                    if (editingLesson) {
                      handleSaveLessonEdit()
                    } else {
                      handleSaveLesson()
                    }
                  }}
                  className="btn-primary flex-1"
                >
                  <Save size={16} className="mr-2" />
                  {editingLesson ? 'Save Changes' : 'Create Lesson'}
                </button>
                <button
                  onClick={() => {
                    setIsCreatingLesson(false)
                    setEditingLesson(null)
                    setNewLesson({ title: '', content: '', details: '' })
                    setContent('')
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 