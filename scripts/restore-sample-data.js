// Script to restore sample data after database recreation
// Run with: node scripts/restore-sample-data.js

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function restoreSampleData() {
  try {
    console.log('Starting to restore sample data...')
    
    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    const user1 = await prisma.user.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'BASIC'
      }
    })
    console.log('Created user:', user1.email)
    
    const user2 = await prisma.user.create({
      data: {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        role: 'BASIC'
      }
    })
    console.log('Created user:', user2.email)
    
    // Create LaunchPad Onboarding course
    const course1 = await prisma.course.create({
      data: {
        title: 'LaunchPad Onboarding',
        description: 'Welcome to LaunchPad. Please complete the onboarding process to access the curriculum!',
        visibility: 'OPEN'
      }
    })
    console.log('Created course:', course1.title)
    
    // Create sections for LaunchPad course
    const section1 = await prisma.section.create({
      data: {
        title: 'Getting Started',
        description: 'Complete these initial steps to get started with LaunchPad',
        courseId: course1.id
      }
    })
    console.log('Created section:', section1.title)
    
    const section2 = await prisma.section.create({
      data: {
        title: 'Core Training',
        description: 'Essential training modules for LaunchPad success',
        courseId: course1.id
      }
    })
    console.log('Created section:', section2.title)
    
    // Create lessons for section 1
    const lesson1 = await prisma.lesson.create({
      data: {
        title: 'Welcome to LaunchPad',
        content: '**Click "Complete Lesson" to start the Onboarding process**\n\nWelcome to LaunchPad! This is your first step in the onboarding journey.',
        details: 'Introduction to LaunchPad platform',
        sectionId: section1.id
      }
    })
    console.log('Created lesson:', lesson1.title)
    
    const lesson2 = await prisma.lesson.create({
      data: {
        title: 'Platform Overview',
        content: '### Platform Overview\n\nLearn about the key features and navigation of the LaunchPad platform.\n\n/embed https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        details: 'Understanding the platform interface',
        sectionId: section1.id
      }
    })
    console.log('Created lesson:', lesson2.title)
    
    // Create lessons for section 2
    const lesson3 = await prisma.lesson.create({
      data: {
        title: 'Core Principles',
        content: '### Core Principles\n\n**Bold text example**\n\n*Italic text example*\n\n__Underlined text example__\n\n# Large heading example',
        details: 'Understanding fundamental principles',
        sectionId: section2.id
      }
    })
    console.log('Created lesson:', lesson3.title)
    
    const lesson4 = await prisma.lesson.create({
      data: {
        title: 'Best Practices',
        content: '### Best Practices\n\nLearn the best practices for success in LaunchPad.\n\n/embed https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        details: 'Implementing best practices',
        sectionId: section2.id
      }
    })
    console.log('Created lesson:', lesson4.title)
    
    // Create ThinkMODA Studios course
    const course2 = await prisma.course.create({
      data: {
        title: 'ThinkMODA Studios',
        description: 'Design and Aligns',
        visibility: 'OPEN'
      }
    })
    console.log('Created course:', course2.title)
    
    // Create section for ThinkMODA course
    const section3 = await prisma.section.create({
      data: {
        title: 'Studio Basics',
        description: 'Learn the basics of ThinkMODA Studios',
        courseId: course2.id
      }
    })
    console.log('Created section:', section3.title)
    
    // Create lesson for ThinkMODA course
    const lesson5 = await prisma.lesson.create({
      data: {
        title: 'Studio Introduction',
        content: '### Studio Introduction\n\nWelcome to ThinkMODA Studios! This is where creativity meets technology.',
        details: 'Introduction to studio environment',
        sectionId: section3.id
      }
    })
    console.log('Created lesson:', lesson5.title)
    
    // Create some sample progress
    await prisma.userProgress.create({
      data: {
        userId: user1.id,
        lessonId: lesson1.id,
        completed: true,
        completedAt: new Date()
      }
    })
    console.log('Created sample progress for user 1')
    
    await prisma.userProgress.create({
      data: {
        userId: user2.id,
        lessonId: lesson1.id,
        completed: true,
        completedAt: new Date()
      }
    })
    console.log('Created sample progress for user 2')
    
    console.log('✅ Sample data restored successfully!')
    console.log('\nCreated:')
    console.log('- 2 users (john@example.com, jane@example.com)')
    console.log('- 2 courses (LaunchPad Onboarding, ThinkMODA Studios)')
    console.log('- 3 sections with 5 lessons total')
    console.log('- Sample progress data')
    console.log('\nYou can now sign in with:')
    console.log('Email: john@example.com')
    console.log('Password: password123')
    
  } catch (error) {
    console.error('Error restoring sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

restoreSampleData() 