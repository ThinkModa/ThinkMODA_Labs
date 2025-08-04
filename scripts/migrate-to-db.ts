import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateFromLocalStorage() {
  try {
    console.log('Starting migration from localStorage to database...')
    
    // Get courses from localStorage (this would be run in the browser)
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
      const course = await prisma.course.create({
        data: {
          title: courseData.title,
          description: courseData.description || '',
        }
      })
      
      console.log(`Created course with ID: ${course.id}`)
      
      // Create sections and lessons
      for (const sectionData of courseData.sections) {
        console.log(`Migrating section: ${sectionData.title}`)
        
        const section = await prisma.section.create({
          data: {
            title: sectionData.title,
            description: sectionData.description || '',
            courseId: course.id,
          }
        })
        
        console.log(`Created section with ID: ${section.id}`)
        
        // Create lessons
        for (const lessonData of sectionData.lessons) {
          console.log(`Migrating lesson: ${lessonData.title}`)
          
          await prisma.lesson.create({
            data: {
              title: lessonData.title,
              content: lessonData.content || '',
              duration: lessonData.duration || '',
              sectionId: section.id,
            }
          })
        }
      }
    }
    
    console.log('Migration completed successfully!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// This would be called from the browser
// migrateFromLocalStorage() 