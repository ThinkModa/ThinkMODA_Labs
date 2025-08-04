// Script to migrate data from SQLite to Supabase
// Run with: node scripts/migrate-to-supabase.js

require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')
const { createClient } = require('@supabase/supabase-js')

const prisma = new PrismaClient()

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin operations
const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateToSupabase() {
  try {
    console.log('Starting migration to Supabase...')

    // 1. Migrate users
    console.log('Migrating users...')
    const users = await prisma.user.findMany()
    
    for (const user of users) {
      const { error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          password: user.password,
          role: user.role,
          created_at: user.createdAt.toISOString(),
          updated_at: user.updatedAt.toISOString()
        })
      
      if (error) {
        console.error(`Error migrating user ${user.email}:`, error)
      } else {
        console.log(`Migrated user: ${user.email}`)
      }
    }

    // 2. Migrate courses
    console.log('Migrating courses...')
    const courses = await prisma.course.findMany()
    
    for (const course of courses) {
      const { error } = await supabase
        .from('courses')
        .insert({
          id: course.id,
          title: course.title,
          description: course.description,
          visibility: course.visibility,
          created_at: course.createdAt.toISOString(),
          updated_at: course.updatedAt.toISOString()
        })
      
      if (error) {
        console.error(`Error migrating course ${course.title}:`, error)
      } else {
        console.log(`Migrated course: ${course.title}`)
      }
    }

    // 3. Migrate sections
    console.log('Migrating sections...')
    const sections = await prisma.section.findMany()
    
    for (const section of sections) {
      const { error } = await supabase
        .from('sections')
        .insert({
          id: section.id,
          title: section.title,
          description: section.description,
          course_id: section.courseId,
          created_at: section.createdAt.toISOString(),
          updated_at: section.updatedAt.toISOString()
        })
      
      if (error) {
        console.error(`Error migrating section ${section.title}:`, error)
      } else {
        console.log(`Migrated section: ${section.title}`)
      }
    }

    // 4. Migrate lessons
    console.log('Migrating lessons...')
    const lessons = await prisma.lesson.findMany()
    
    for (const lesson of lessons) {
      const { error } = await supabase
        .from('lessons')
        .insert({
          id: lesson.id,
          title: lesson.title,
          content: lesson.content,
          details: lesson.details,
          section_id: lesson.sectionId,
          created_at: lesson.createdAt.toISOString(),
          updated_at: lesson.updatedAt.toISOString()
        })
      
      if (error) {
        console.error(`Error migrating lesson ${lesson.title}:`, error)
      } else {
        console.log(`Migrated lesson: ${lesson.title}`)
      }
    }

    // 5. Migrate user progress
    console.log('Migrating user progress...')
    const userProgress = await prisma.userProgress.findMany()
    
    for (const progress of userProgress) {
      const { error } = await supabase
        .from('user_progress')
        .insert({
          id: progress.id,
          user_id: progress.userId,
          lesson_id: progress.lessonId,
          completed: progress.completed,
          completed_at: progress.completedAt ? progress.completedAt.toISOString() : null,
          created_at: progress.createdAt.toISOString(),
          updated_at: progress.updatedAt.toISOString()
        })
      
      if (error) {
        console.error(`Error migrating progress for user ${progress.userId}:`, error)
      } else {
        console.log(`Migrated progress for user: ${progress.userId}`)
      }
    }

    console.log('✅ Migration completed successfully!')
    console.log(`Migrated:`)
    console.log(`- ${users.length} users`)
    console.log(`- ${courses.length} courses`)
    console.log(`- ${sections.length} sections`)
    console.log(`- ${lessons.length} lessons`)
    console.log(`- ${userProgress.length} progress records`)

  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Check if environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!')
  console.error('Please set:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

migrateToSupabase() 