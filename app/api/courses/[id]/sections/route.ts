import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/courses/[id]/sections - Get all sections for a course
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sections = await prisma.section.findMany({
      where: { courseId: params.id },
      include: {
        lessons: true
      }
    })
    
    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    )
  }
}

// POST /api/courses/[id]/sections - Create a new section
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Creating section for course ID:', params.id)
    const body = await request.json()
    console.log('Request body:', body)
    const { title, description } = body
    
    if (!title) {
      console.error('Missing title in request body')
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
    
    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
    })
    
    if (!course) {
      console.error('Course not found:', params.id)
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }
    
    const section = await prisma.section.create({
      data: {
        title,
        description: description || '',
        courseId: params.id,
      },
      include: {
        lessons: true
      }
    })
    
    console.log('Section created successfully:', section)
    return NextResponse.json(section, { status: 201 })
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json(
      { error: `Failed to create section: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 