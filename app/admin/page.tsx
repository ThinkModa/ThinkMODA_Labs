'use client'

import { useState } from 'react'
import { 
  User, 
  LogOut, 
  Settings, 
  Home, 
  Users, 
  Folder, 
  Calendar, 
  FileText, 
  BarChart3, 
  Database, 
  Bug,
  Plus,
  CheckCircle,
  Award,
  TrendingUp
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleSignOut = () => {
    // TODO: Implement sign out logic
    console.log('Admin sign out clicked')
    window.location.href = '/'
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: Folder },
    { id: 'database', label: 'Database Test', icon: Database },
    { id: 'debug', label: 'Debug Auth', icon: Bug },
  ]

  const quickActions = [
    {
      id: 'create-course',
      title: 'Create Course',
      description: 'Add a new course to the curriculum',
      icon: Plus,
      color: 'bg-blue-500',
      onClick: () => window.location.href = '/admin/courses'
    },
    {
      id: 'manage-users',
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      color: 'bg-green-500',
      onClick: () => window.location.href = '/admin/users'
    },
    {
      id: 'course-assignments',
      title: 'Course Assignments',
      description: 'Assign courses to users',
      icon: CheckCircle,
      color: 'bg-yellow-500',
      onClick: () => console.log('Course Assignments clicked')
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View learning analytics and reports',
      icon: TrendingUp,
      color: 'bg-purple-500',
      onClick: () => console.log('Analytics clicked')
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">LaunchPad Series</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (item.id === 'users') {
                        window.location.href = '/admin/users'
                      } else if (item.id === 'courses') {
                        window.location.href = '/admin/courses'
                      } else {
                        setActiveTab(item.id)
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">rod@thinkmoda.co</p>
              <p className="text-xs text-gray-500">Super_admin</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut size={16} />
            <span className="text-sm">Sign out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage courses, users, and curriculum content.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="flex flex-col items-center">
                <Folder size={32} className="text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="flex flex-col items-center">
                <CheckCircle size={32} className="text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">Published Courses</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="flex flex-col items-center">
                <Award size={32} className="text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">Featured Courses</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="flex flex-col items-center">
                <FileText size={32} className="text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-600 mb-1">Draft Courses</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color} mb-3`}>
                        <Icon size={24} className="text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recent Courses */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Courses</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-600">Get started by creating your first course.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 