import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/sections/[sectionId]/lessons - Get all lessons for a section
export async function GET(
  request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { sectionId: params.sectionId }
    })
    
    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}

// POST /api/sections/[sectionId]/lessons - Create a new lesson
export async function POST(
  request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  try {
    const body = await request.json()
    const { title, content, details } = body
    
    const lesson = await prisma.lesson.create({
      data: {
        title,
        content: content || '',
        details: details || '',
        sectionId: params.sectionId,
      }
    })
    
    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    )
  }
} 