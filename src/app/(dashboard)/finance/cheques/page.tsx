import { getAllCheques, getChequeStats, getMaturingCheques } from '@/actions/cheque'
import { ChequeManagementDashboard } from './ChequeManagementDashboard'

export default async function ChequesPage() {
  const chequesResult = await getAllCheques()
  const statsResult = await getChequeStats()
  const maturingResult = await getMaturingCheques(3)

  const cheques = chequesResult.success ? chequesResult.cheques ?? [] : []
  const stats = statsResult.success ? (statsResult.stats ?? null) : null
  const maturingCheques = maturingResult.success ? maturingResult.cheques ?? [] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cheque Management</h1>
        <p className="text-gray-600 mt-1">Track and manage post-dated cheques (PDCs)</p>
      </div>

      <ChequeManagementDashboard 
        cheques={cheques} 
        stats={stats}
        maturingCheques={maturingCheques}
      />
    </div>
  )
}
