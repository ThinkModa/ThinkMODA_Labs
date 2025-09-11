import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thinkmoda Course Builder',
  description: 'Course management platform for Thinkmoda',
}

// Staging Banner Component
function StagingBanner() {
  // Only show banner in staging environment
  const isStaging = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('gnyuzloqayuhqaikghmm') || 
                   process.env.VERCEL_URL?.includes('staging')
  
  if (!isStaging) return null

  return (
    <div className="bg-gray-100 border-b border-gray-200 py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          <span className="font-medium">STAGING ENVIRONMENT</span>
          <span className="text-gray-400">•</span>
          <span className="text-xs">For testing purposes only</span>
        </div>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <StagingBanner />
        {children}
      </body>
    </html>
  )
} 