'use client'

import { useState, useEffect } from 'react'
import { courseService } from '@/lib/services/courses-supabase'

export default function TestPage() {
  const [result, setResult] = useState<string>('Loading...')

  useEffect(() => {
    const testCourses = async () => {
      try {
        console.log('Test: Starting course test...')
        
        // Test 1: Direct Supabase import
        console.log('Test: Importing Supabase...')
        const { supabase } = await import('@/lib/supabase')
        console.log('Test: Supabase imported:', !!supabase)
        
        // Test 2: Simple query
        console.log('Test: Making simple query...')
        const { data, error } = await supabase
          .from('courses')
          .select('id, title')
          .limit(1)
        
        console.log('Test: Query result:', { data, error })
        
        if (error) {
          setResult(`Error: ${error.message}`)
          return
        }
        
        // Test 3: Course service
        console.log('Test: Testing course service...')
        const courses = await courseService.getAllCourses()
        console.log('Test: Course service result:', courses)
        
        setResult(`Success! Found ${courses.length} courses`)
        
      } catch (error: any) {
        console.error('Test: Error:', error)
        setResult(`Error: ${error.message}`)
      }
    }
    
    testCourses()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Course Loading Test</h1>
      <div className="bg-gray-100 p-4 rounded">
        <p className="font-mono">{result}</p>
      </div>
      <button 
        onClick={() => window.location.href = '/admin/courses'}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Back to Courses
      </button>
    </div>
  )
}
