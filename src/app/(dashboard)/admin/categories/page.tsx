import { getCategories, getAllCategories } from '@/actions/category'
import { getSession } from '@/lib/session'
import CategoryManagement from './CategoryManagement'

export default async function CategoriesPage() {
  const session = await getSession()
  const categories = await getAllCategories()

  // Serialize data to avoid Next.js serialization errors
  const plainCategories = JSON.parse(JSON.stringify(categories))
  const userRole = (session?.role as 'ADMIN' | 'CASHIER' | null) || 'ADMIN'

  return (
    <CategoryManagement categories={plainCategories} userRole={userRole} />
  )
}
