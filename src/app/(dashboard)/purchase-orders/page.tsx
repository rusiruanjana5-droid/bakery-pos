import { getPurchaseOrders } from '@/actions/purchaseOrder'
import { getSuppliers } from '@/actions/supplier'
import { getProducts } from '@/actions/product'
import { PurchaseOrderList } from './PurchaseOrderList'
import { CreatePurchaseOrderModal } from './CreatePurchaseOrderModal'

export default async function PurchaseOrdersPage() {
  const purchaseOrdersResult = await getPurchaseOrders()
  const suppliers = await getSuppliers()
  const products = await getProducts()

  const purchaseOrders = purchaseOrdersResult.success ? (purchaseOrdersResult.purchaseOrders ?? []) : [] as any

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600 mt-1">Manage supplier purchase orders and track deliveries</p>
        </div>
        <CreatePurchaseOrderModal suppliers={suppliers} products={products} />
      </div>

      <PurchaseOrderList purchaseOrders={purchaseOrders} />
    </div>
  )
}
