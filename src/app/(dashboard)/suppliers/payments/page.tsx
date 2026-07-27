import { getSuppliers } from '@/actions/supplier'
import { SupplierPaymentSettlement } from '@/app/(dashboard)/suppliers/payments/SupplierPaymentSettlement'

export default async function SupplierPaymentsPage() {
  const suppliers = await getSuppliers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Supplier Bill-to-Bill Settlement</h1>
        <p className="text-gray-600 mt-1">Allocate payments against specific GRNs and invoices</p>
      </div>

      <SupplierPaymentSettlement suppliers={suppliers} />
    </div>
  )
}
