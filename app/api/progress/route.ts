import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/progress - Get user's progress for all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            section: {
              include: {
                course: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

// POST /api/progress - Mark lesson as completed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, lessonId, completed } = body

    if (!userId || !lessonId) {
      return NextResponse.json(
        { error: 'User ID and lesson ID are required' },
        { status: 400 }
      )
    }

    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId
        }
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null
      },
      create: {
        userId,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null
      }
    })

    return NextResponse.json(progress, { status: 201 })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
} 