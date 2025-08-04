// Migration script to move localStorage data to the database
// Run this in the browser console on the admin page

async function migrateLocalStorageToDatabase() {
  try {
    console.log('Starting migration from localStorage to database...')
    
    // Get courses from localStorage
    const coursesData = localStorage.getItem('courses')
    if (!coursesData) {
      console.log('No courses found in localStorage')
      return
    }
    
    const courses = JSON.parse(coursesData)
    console.log(`Found ${courses.length} courses to migrate`)
    
    for (const courseData of courses) {
      console.log(`Migrating course: ${courseData.title}`)
      
      // Create course
      const courseResponse = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: courseData.title,
          description: courseData.description || '',
        }),
      })
      
      if (!courseResponse.ok) {
        console.error(`Failed to create course: ${courseData.title}`)
        continue
      }
      
      const course = await courseResponse.json()
      console.log(`Created course with ID: ${course.id}`)
      
      // Create sections and lessons
      for (const sectionData of courseData.sections) {
        console.log(`Migrating section: ${sectionData.title}`)
        
        const sectionResponse = await fetch(`/api/courses/${course.id}/sections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: sectionData.title,
            description: sectionData.description || '',
          }),
        })
        
        if (!sectionResponse.ok) {
          console.error(`Failed to create section: ${sectionData.title}`)
          continue
        }
        
        const section = await sectionResponse.json()
        console.log(`Created section with ID: ${section.id}`)
        
        // Create lessons
        for (const lessonData of sectionData.lessons) {
          console.log(`Migrating lesson: ${lessonData.title}`)
          
          const lessonResponse = await fetch(`/api/sections/${section.id}/lessons`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: lessonData.title,
              content: lessonData.content || '',
              duration: lessonData.duration || '',
            }),
          })
          
          if (!lessonResponse.ok) {
            console.error(`Failed to create lesson: ${lessonData.title}`)
            continue
          }
          
          const lesson = await lessonResponse.json()
          console.log(`Created lesson with ID: ${lesson.id}`)
        }
      }
    }
    
    console.log('Migration completed successfully!')
    console.log('You can now clear localStorage if desired: localStorage.removeItem("courses")')
  } catch (error) {
    console.error('Migration failed:', error)
  }
}

// Run the migration
migrateLocalStorageToDatabase() 