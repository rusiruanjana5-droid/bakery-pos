import { getProducts } from '@/actions/product';
import { getSuppliers } from '@/actions/supplier';
import { getCategories } from '@/actions/category';
import { getProductAnalytics } from '@/actions/product-analytics';
import { getStoreSettings } from '@/actions/store';
import EnhancedProductTable from './EnhancedProductTable';
import { getSession } from '@/lib/session';

export default async function ProductsPage() {
  const session = await getSession();
  const products: any[] = await getProducts();
  const suppliers: any[] = await getSuppliers();
  const categories: any[] = await getCategories();
  const analytics = await getProductAnalytics();
  const storeSettings = await getStoreSettings();

  // Serialize session role to plain string to avoid Next.js serialization errors
  const userRole = session?.role as 'ADMIN' | 'CASHIER' | null;

  return (
    <EnhancedProductTable products={products} suppliers={suppliers} categories={categories} userRole={userRole} analytics={analytics} storeSettings={storeSettings || undefined} />
  );
}
