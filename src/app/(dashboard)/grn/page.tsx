import { getGRNs } from '@/actions/grn';
import { getProducts } from '@/actions/product';
import { getSuppliers } from '@/actions/supplier';
import { getCategories } from '@/actions/category';
import { GRNEntryForm } from './GRNEntryForm';
import { GRNHistory } from './GRNHistory';

export default async function GRNPage() {
  const grns: any[] = await getGRNs();
  const products: any[] = await getProducts();
  const suppliers: any[] = await getSuppliers();
  const categories: any[] = await getCategories();

  return (
    <div className="grid grid-cols-3 gap-3" suppressHydrationWarning>
      {/* Left: GRN Entry Form (2 columns) */}
      <div className="col-span-2" suppressHydrationWarning>
        <GRNEntryForm products={products} suppliers={suppliers} categories={categories} />
      </div>

      {/* Right: Recent GRN History Logs (1 column) */}
      <div className="col-span-1" suppressHydrationWarning>
        <GRNHistory grns={grns} />
      </div>
    </div>
  );
}
