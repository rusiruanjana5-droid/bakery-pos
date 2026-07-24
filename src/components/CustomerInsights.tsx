'use client'

import { useEffect, useState } from 'react'

interface Customer {
  phone: string
  name?: string
  orderCount: number
  totalSpent: number
  lastOrderDate: Date
}

export default function CustomerInsights() {
  const [topCustomers, setTopCustomers] = useState<Customer[]>([])
  const [inactiveCustomers, setInactiveCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/customer-insights')
        if (response.ok) {
          const data = await response.json()
          setTopCustomers(data.topCustomers.map((c: any) => ({
            ...c,
            lastOrderDate: new Date(c.lastOrderDate)
          })))
          setInactiveCustomers(data.inactiveCustomers.map((c: any) => ({
            ...c,
            lastOrderDate: new Date(c.lastOrderDate)
          })))
        }
      } catch (error) {
        console.error('Error fetching customer insights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Top Customers */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-amber-500">👑</span>
          Top 5 Customers
        </h2>
        {topCustomers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No customer data yet</p>
            <p className="text-sm">Add customer info to orders to see insights</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-sm font-medium text-gray-600">Customer</th>
                  <th className="px-3 py-2 text-sm font-medium text-gray-600 text-center">Orders</th>
                  <th className="px-3 py-2 text-sm font-medium text-gray-600 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topCustomers.map((customer, index) => (
                  <tr key={customer.phone} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {customer.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">{customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-sm font-semibold text-gray-800">
                      Rs. {customer.totalSpent.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inactive Customers */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-orange-500">⚠️</span>
          Customers to Follow Up
        </h2>
        {inactiveCustomers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No inactive customers</p>
            <p className="text-sm">All customers have ordered in the last 30 days</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-sm font-medium text-gray-600">Customer</th>
                  <th className="px-3 py-2 text-sm font-medium text-gray-600 text-center">Orders</th>
                  <th className="px-3 py-2 text-sm font-medium text-gray-600 text-right">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inactiveCustomers.map((customer) => (
                  <tr key={customer.phone} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {customer.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">{customer.phone}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {customer.orderCount}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right text-sm text-gray-600">
                      {customer.lastOrderDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
