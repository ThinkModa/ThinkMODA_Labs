// Script to create an admin user
// Run with: node scripts/create-admin-user.js

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: {
        email: 'admin@thinkmoda.com'
      }
    })
    
    if (existingAdmin) {
      console.log('Admin user already exists!')
      console.log('Email: admin@thinkmoda.com')
      console.log('Password: admin123')
      return
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const adminUser = await prisma.user.create({
      data: {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@thinkmoda.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    })
    
    console.log('✅ Admin user created successfully!')
    console.log('\nAdmin credentials:')
    console.log('Email: admin@thinkmoda.com')
    console.log('Password: admin123')
    console.log('\nYou can now sign in to access the admin dashboard.')
    
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser() 