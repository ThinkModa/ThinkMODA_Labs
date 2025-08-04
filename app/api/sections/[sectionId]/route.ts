import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/sections/[sectionId] - Get a specific section
export async function GET(
  request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  try {
    const section = await prisma.section.findUnique({
      where: { id: params.sectionId },
      include: {
        lessons: true
      }
    })
    
    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching section:', error)
    return NextResponse.json(
      { error: 'Failed to fetch section' },
      { status: 500 }
    )
  }
}

// PUT /api/sections/[sectionId] - Update a section
export async function PUT(
  request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  try {
    const body = await request.json()
    const { title, description } = body
    
    const updatedSection = await prisma.section.update({
      where: { id: params.sectionId },
      data: {
        title,
        description: description || '',
      },
      include: {
        lessons: true
      }
    })
    
    return NextResponse.json(updatedSection)
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    )
  }
}

// DELETE /api/sections/[sectionId] - Delete a section
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  try {
    // Delete the section (lessons will be cascaded due to onDelete: Cascade)
    await prisma.section.delete({
      where: { id: params.sectionId }
    })
    
    return NextResponse.json({ message: 'Section deleted successfully' })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    )
  }
} 