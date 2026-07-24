import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { getSession } from '@/lib/session'
import { getStoreSettings } from '@/actions/store'
import { headers } from 'next/headers'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const storeSettings = await getStoreSettings()
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'

  // Check if we're on the POS page
  const isPOSPage = pathname === '/pos'

  // Serialize session role to plain string to avoid Next.js serialization errors
  const role = session?.role as 'ADMIN' | 'CASHIER' | 'MANAGER' | 'KITCHEN' | null

  // Serialize storeSettings to plain JSON to avoid Next.js serialization errors
  const plainStoreSettings = storeSettings ? JSON.parse(JSON.stringify(storeSettings)) : null
  const plainSession = session ? JSON.parse(JSON.stringify(session)) : null

  // Show sidebar if: NOT on POS page, OR user is ADMIN/MANAGER (even on POS page)
  const shouldShowSidebar = !isPOSPage || role === 'ADMIN' || role === 'MANAGER'

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Show sidebar for non-POS pages, or for Admin/Manager users on POS page */}
      {shouldShowSidebar && (
        <Sidebar 
          role={role || 'CASHIER'} 
          storeSettings={plainStoreSettings} 
        />
      )}
      <div className="flex-1 h-screen overflow-hidden flex flex-col">
        <Header 
          session={plainSession}
          storeSettings={plainStoreSettings}
        />
        <main className="flex-1 h-screen overflow-hidden overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
