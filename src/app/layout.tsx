import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import ThemeProvider from '@/components/ThemeProvider'
import { getSession } from '@/lib/session'
import { getStoreSettings } from '@/actions/store'
import { initializeBackupSystem } from '@/lib/backup-init'
import { initializeSQLiteDatabase } from '@/lib/sqlite-init'

// Initialize backup system on server startup
initializeBackupSystem()

// Initialize SQLite database for offline operations
initializeSQLiteDatabase()

export const metadata: Metadata = {
  title: 'Bakery POS',
  description: 'Point of Sale for Bakery',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const storeSettings = await getStoreSettings()

  // Serialize session role to plain string to avoid Next.js serialization errors
  const role = session?.role as 'ADMIN' | 'CASHIER' | 'MANAGER' | 'KITCHEN' | null

  // Serialize storeSettings to plain JSON to avoid Next.js serialization errors
  const plainStoreSettings = storeSettings ? JSON.parse(JSON.stringify(storeSettings)) : null
  const plainSession = session ? JSON.parse(JSON.stringify(session)) : null

  return (
    <html lang="en" className="h-screen overflow-hidden">
      <body className="h-screen overflow-hidden bg-slate-50" suppressHydrationWarning>
        <ThemeProvider settings={plainStoreSettings} />
        {children}
      </body>
    </html>
  )
}
