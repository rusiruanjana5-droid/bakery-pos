'use client'

import { useState } from 'react'
import { getPurchaseOrders } from '@/actions/purchaseOrder'
import { PurchaseOrderList } from '../purchase-orders/PurchaseOrderList'
import { CreatePurchaseOrderModal } from '../purchase-orders/CreatePurchaseOrderModal'

interface PurchaseOrdersSectionProps {
  initialPurchaseOrders: any[]
  suppliers: any[]
  products: any[]
}

export function PurchaseOrdersSection({ initialPurchaseOrders, suppliers, products }: PurchaseOrdersSectionProps) {
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders)
  const [editingPO, setEditingPO] = useState<any | null>(null)

  const handleRefetch = async () => {
    const result = await getPurchaseOrders()
    if (result.success) {
      setPurchaseOrders(result.purchaseOrders || [])
    }
  }

  const handlePOCreated = () => {
    handleRefetch()
  }

  const handlePOUpdated = () => {
    handleRefetch()
    setEditingPO(null)
  }

  const handleEditPO = (po: any) => {
    setEditingPO(po)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Purchase Orders</h2>
          <p className="text-gray-600 mt-1">Manage supplier purchase orders and track deliveries</p>
        </div>
        <CreatePurchaseOrderModal 
          suppliers={suppliers} 
          products={products} 
          onPOCreated={handlePOCreated}
          onPOUpdated={handlePOUpdated}
          editingPO={editingPO}
        />
      </div>
      <PurchaseOrderList 
        purchaseOrders={purchaseOrders} 
        onRefetch={handleRefetch}
        onEdit={handleEditPO}
      />
    </div>
  )
}
