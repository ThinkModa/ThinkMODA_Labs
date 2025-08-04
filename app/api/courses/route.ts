import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses - Get all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        sections: {
          include: {
            lessons: true
          }
        }
      }
    })
    
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, visibility } = body
    
    const course = await prisma.course.create({
      data: {
        title,
        description: description || '',
        visibility: visibility || 'OPEN',
      },
      include: {
        sections: {
          include: {
            lessons: true
          }
        }
      }
    })
    
    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
} 