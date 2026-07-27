import { getGRNs } from '@/actions/grn';
import { getProducts } from '@/actions/product';
import { getSuppliers } from '@/actions/supplier';
import { getCategories } from '@/actions/category';
import { getPurchaseOrders, getPurchaseOrdersBySupplier } from '@/actions/purchaseOrder';
import { getAllCheques, getChequeStats, getMaturingCheques } from '@/actions/cheque';
import { GRNEntryForm } from './GRNEntryForm';
import { GRNHistory } from './GRNHistory';
import { GRNTabNavigation } from '@/components/GRNTabNavigation';
import { PurchaseOrdersSection } from './PurchaseOrdersSection';
import { SupplierPaymentSettlement } from '../suppliers/payments/SupplierPaymentSettlement';
import { ChequeManagementDashboard } from '../finance/cheques/ChequeManagementDashboard';

export default async function GRNPage({
  searchParams
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const grns: any[] = await getGRNs();
  const products: any[] = await getProducts();
  const suppliers: any[] = await getSuppliers();
  const categories: any[] = await getCategories();
  
  // Get data for all tabs
  const purchaseOrdersResult = await getPurchaseOrders();
  const purchaseOrders = purchaseOrdersResult.success ? (purchaseOrdersResult.purchaseOrders || []) : [];
  
  const chequesResult = await getAllCheques();
  const cheques = chequesResult.success ? (chequesResult.cheques || []) : [];
  
  const statsResult = await getChequeStats();
  const stats = statsResult.success ? (statsResult.stats ?? null) : null;
  
  const maturingResult = await getMaturingCheques(3);
  const maturingCheques = maturingResult.success ? (maturingResult.cheques || []) : [];

  const activeTab = resolvedSearchParams.tab || 'purchase-orders';

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <GRNTabNavigation activeTab={activeTab} />

      {/* Tab Content */}
      {activeTab === 'grn' && (
        <div className="grid grid-cols-3 gap-3" suppressHydrationWarning>
          {/* Left: GRN Entry Form (2 columns) */}
          <div className="col-span-2" suppressHydrationWarning>
            <GRNEntryForm 
              products={products} 
              suppliers={suppliers} 
              categories={categories}
              getPurchaseOrdersBySupplier={getPurchaseOrdersBySupplier}
            />
          </div>

          {/* Right: Recent GRN History Logs (1 column) */}
          <div className="col-span-1" suppressHydrationWarning>
            <GRNHistory grns={grns} />
          </div>
        </div>
      )}

      {activeTab === 'purchase-orders' && (
        <PurchaseOrdersSection 
          initialPurchaseOrders={purchaseOrders}
          suppliers={suppliers}
          products={products}
        />
      )}

      {activeTab === 'settlement' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Supplier Bill-to-Bill Settlement</h2>
            <p className="text-gray-600 mt-1">Allocate payments against specific GRNs and invoices</p>
          </div>
          <SupplierPaymentSettlement suppliers={suppliers} />
        </div>
      )}

      {activeTab === 'cheques' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cheque Management</h2>
            <p className="text-gray-600 mt-1">Track and manage post-dated cheques (PDCs)</p>
          </div>
          <ChequeManagementDashboard 
            cheques={cheques} 
            stats={stats}
            maturingCheques={maturingCheques}
          />
        </div>
      )}
    </div>
  );
}
