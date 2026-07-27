'use client'

import { useSearchParams, useRouter } from 'next/navigation'

interface GRNTabNavigationProps {
  activeTab: string
}

const tabs = [
  { id: 'purchase-orders', label: 'Purchase Orders', icon: '�' },
  { id: 'grn', label: 'Create / Edit GRN', icon: '�' },
  { id: 'settlement', label: 'Bill-to-Bill Settlement', icon: '💰' },
  { id: 'cheques', label: 'Cheque Registry', icon: '🏦' }
]

export function GRNTabNavigation({ activeTab }: GRNTabNavigationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tabId)
    router.push(`/grn?${params.toString()}`)
  }

  return (
    <div className="border-b border-gray-200 bg-white">
      <nav className="flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
