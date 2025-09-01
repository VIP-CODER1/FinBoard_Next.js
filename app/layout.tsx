import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FinBoard - Finance Dashboard',
  description: 'Customizable Finance Dashboard with real-time data visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-950 text-white">
        {children}
      </body>
    </html>
  )
} 