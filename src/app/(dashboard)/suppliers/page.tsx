import { getSuppliers } from '@/actions/supplier'
import { getCategories } from '@/actions/category'
import { getSupplierAnalytics } from '@/actions/supplier-analytics'
import EnhancedSupplierTable from './EnhancedSupplierTable'

export default async function SuppliersPage() {
  const suppliers = await getSuppliers()
  const categories = await getCategories()
  const analytics = await getSupplierAnalytics()

  // Serialize data to fix type mismatches
  const plainSuppliers = JSON.parse(JSON.stringify(suppliers))
  const plainCategories = JSON.parse(JSON.stringify(categories))
  const plainAnalytics = JSON.parse(JSON.stringify(analytics))

  return (
    <EnhancedSupplierTable suppliers={plainSuppliers} categories={plainCategories} analytics={plainAnalytics} />
  )
}
