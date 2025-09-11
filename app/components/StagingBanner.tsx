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
      
      console.log('StagingBanner - hostname:', hostname)
      console.log('StagingBanner - isStaging:', isStagingEnv)
      setIsStaging(isStagingEnv)
    }

    checkStaging()
  }, [])

  if (!isStaging) return null

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
