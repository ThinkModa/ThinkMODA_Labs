'use client'

import { useEffect, useState } from 'react'

export default function StagingBanner() {
  const [isStaging, setIsStaging] = useState(false)

  useEffect(() => {
    // Check if we're in staging environment
    const checkStaging = () => {
      const hostname = window.location.hostname
      const isStagingEnv = hostname.includes('staging') || 
                          hostname.includes('gnyuzloqayuhqaikghmm') ||
                          process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('gnyuzloqayuhqaikghmm')
      
      setIsStaging(isStagingEnv)
    }

    checkStaging()
  }, [])

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
