import './globals.css'
import type { Metadata } from 'next'
import StagingBanner from './components/StagingBanner'

export const metadata: Metadata = {
  title: 'Thinkmoda Course Builder',
  description: 'Course management platform for Thinkmoda',
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