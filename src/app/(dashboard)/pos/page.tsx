import { getStoreSettings } from '@/actions/store'
import { getProducts } from '@/actions/product'
import { getSpecialOffers } from '@/actions/specialOffer'
import { getCategories } from '@/actions/category'
import { getSession } from '@/actions/auth'
import { getActiveShift, getLastShift } from '@/actions/shift'
import POSPageClient from '@/components/POSPageClient'

// Disable caching to ensure fresh data on every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = {
  searchParams: Promise<{ checkShift?: string; forceRefresh?: string }>;
};

export default async function POSPage(props: PageProps) {
  const searchParams = await props.searchParams
  const session = await getSession()
  const storeSettings = await getStoreSettings()
  const products = await getProducts()
  const specialOffers = await getSpecialOffers()
  const categories = await getCategories()
  
  // Check for active shift for cashiers
  let activeShift = null
  let lastShift = null
  
  if (session?.role === 'CASHIER') {
    activeShift = await getActiveShift(session.userId)
    if (!activeShift) {
      lastShift = await getLastShift(session.userId)
    }
  }
  
  // Serialize data to avoid Next.js serialization errors
  const plainSettings = JSON.parse(JSON.stringify(storeSettings))
  const plainProducts = JSON.parse(JSON.stringify(products))
  const plainSpecialOffers = JSON.parse(JSON.stringify(specialOffers))
  const plainCategories = JSON.parse(JSON.stringify(categories))
  const plainActiveShift = activeShift ? JSON.parse(JSON.stringify(activeShift)) : null
  const plainLastShift = lastShift ? JSON.parse(JSON.stringify(lastShift)) : null
  
  return <POSPageClient 
    initialSettings={plainSettings} 
    initialProducts={plainProducts} 
    initialSpecialOffers={plainSpecialOffers} 
    initialCategories={plainCategories}
    initialActiveShift={plainActiveShift}
    initialLastShift={plainLastShift}
    currentUserId={session?.userId}
    currentUsername={session?.username}
    currentUserRole={session?.role}
    defaultShiftFloat={storeSettings?.defaultShiftFloat || 0}
    allowEditOpeningBalance={storeSettings?.allowEditOpeningBalance ?? true}
  />
}
