import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thinkmoda Course Builder',
  description: 'Course management platform for Thinkmoda',
}

// Simple server-side staging banner
function StagingBanner() {
  // Force show banner in staging - we'll use a different approach
  // Check multiple ways to detect staging
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const vercelUrl = process.env.VERCEL_URL || ''
  const nodeEnv = process.env.NODE_ENV || ''
  
  // Log for debugging
  console.log('StagingBanner Debug:', {
    supabaseUrl,
    vercelUrl,
    nodeEnv,
    includesStaging: supabaseUrl.includes('gnyuzloqayuhqaikghmm'),
    includesVercelStaging: vercelUrl.includes('staging')
  })
  
  // Show banner if we detect staging environment
  const isStaging = supabaseUrl.includes('gnyuzloqayuhqaikghmm') || 
                   vercelUrl.includes('staging') ||
                   supabaseUrl.includes('staging')
  
  // TEMPORARY: Force show banner for debugging
  const forceShow = true // Change this to false once we fix the detection
  
  if (!isStaging && !forceShow) {
    console.log('StagingBanner: Not showing - not in staging environment')
    return null
  }

  console.log('StagingBanner: Showing banner')
  return (
    <div className="bg-orange-50 border-b-2 border-orange-200 py-3 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center space-x-2 text-sm text-orange-800">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span className="font-semibold">STAGING ENVIRONMENT</span>
          <span className="text-orange-600">•</span>
          <span className="text-xs text-orange-700">For testing purposes only</span>
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