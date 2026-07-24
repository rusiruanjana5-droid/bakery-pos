'use client'

import { useEffect, useState } from 'react'
import {
  getTopSuppliers,
  getPurchaseVsSalesRatio,
  getCreditAgingReport,
  getExpiringBatches,
  getGRNAnalytics
} from '@/actions/grn-analytics'

export default function GRNAnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [topSuppliers, setTopSuppliers] = useState<any[]>([])
  const [purchaseVsSales, setPurchaseVsSales] = useState<any>(null)
  const [creditAging, setCreditAging] = useState<any>(null)
  const [expiringBatches, setExpiringBatches] = useState<any[]>([])
  const [grnAnalytics, setGrnAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const [suppliers, ratio, aging, batches, analytics] = await Promise.all([
        getTopSuppliers(),
        getPurchaseVsSalesRatio(),
        getCreditAgingReport(),
        getExpiringBatches(),
        getGRNAnalytics()
      ])

      setTopSuppliers(suppliers)
      setPurchaseVsSales(ratio)
      setCreditAging(aging)
      setExpiringBatches(batches)
      setGrnAnalytics(analytics)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-gray-600">Comprehensive insights into your Goods Received Note operations</p>
        </div>

        {/* Summary Cards */}
        {grnAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total GRNs</p>
                  <p className="text-2xl font-bold text-gray-900">{grnAnalytics.totalGRNs}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">Rs. {grnAnalytics.totalValue?.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Quantity</p>
                  <p className="text-2xl font-bold text-gray-900">{grnAnalytics.totalQuantity}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejection Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{grnAnalytics.rejectionRate?.toFixed(2)}%</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Suppliers */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Suppliers by Purchase Value</h2>
          {topSuppliers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Supplier</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Purchase Value</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Total Quantity</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">GRN Count</th>
                  </tr>
                </thead>
                <tbody>
                  {topSuppliers.slice(0, 5).map((supplier, index) => (
                    <tr key={supplier.supplierId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold mr-3">
                            {index + 1}
                          </span>
                          {supplier.supplierName}
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">Rs. {supplier.totalPurchaseValue.toFixed(2)}</td>
                      <td className="text-right py-3 px-4">{supplier.totalQuantity}</td>
                      <td className="text-right py-3 px-4">{supplier.grnCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No supplier data available</p>
          )}
        </div>

        {/* Purchase vs Sales Ratio */}
        {purchaseVsSales && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Purchase vs Sales Ratio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Total Purchase Cost</p>
                <p className="text-2xl font-bold text-blue-900">Rs. {purchaseVsSales.totalPurchaseCost.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Total Sales Revenue</p>
                <p className="text-2xl font-bold text-green-900">Rs. {purchaseVsSales.totalSalesRevenue.toFixed(2)}</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Cost to Revenue Ratio</p>
                <p className="text-2xl font-bold text-purple-900">{purchaseVsSales.ratio.toFixed(2)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Credit Aging Report */}
        {creditAging && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Credit Aging Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-2">Current (0-30 days)</p>
                <p className="text-2xl font-bold text-green-900">{creditAging.current.length}</p>
                <p className="text-sm text-green-700">entries</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-2">31-60 days</p>
                <p className="text-2xl font-bold text-yellow-900">{creditAging.thirtyToSixty.length}</p>
                <p className="text-sm text-yellow-700">entries</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-800 mb-2">60+ days</p>
                <p className="text-2xl font-bold text-orange-900">{creditAging.overSixty.length}</p>
                <p className="text-sm text-orange-700">entries</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-800 mb-2">Overdue</p>
                <p className="text-2xl font-bold text-red-900">{creditAging.overdue.length}</p>
                <p className="text-sm text-red-700">entries</p>
              </div>
            </div>
          </div>
        )}

        {/* Expiring Batches */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Batches Expiring Soon (30 days)</h2>
          {expiringBatches.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Batch Number</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Expiry Date</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Days Until Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringBatches.map((batch, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{batch.productName}</td>
                      <td className="py-3 px-4">{batch.batchNumber}</td>
                      <td className="text-right py-3 px-4">
                        {batch.quantity} {batch.uom}
                      </td>
                      <td className="py-3 px-4">
                        {new Date(batch.expiryDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="text-right py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                          batch.daysUntilExpiry <= 7 ? 'bg-red-100 text-red-800' :
                          batch.daysUntilExpiry <= 14 ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {batch.daysUntilExpiry} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No batches expiring within 30 days</p>
          )}
        </div>

        {/* QC Status Summary */}
        {grnAnalytics && grnAnalytics.qcStatusCounts && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">QC Status Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(grnAnalytics.qcStatusCounts).map(([status, count]) => (
                <div key={status} className={`p-4 rounded-lg ${
                  status === 'Passed' ? 'bg-green-50' :
                  status === 'Pending QC' ? 'bg-yellow-50' :
                  status === 'Rejected' ? 'bg-red-50' :
                  'bg-gray-50'
                }`}>
                  <p className="text-sm font-medium mb-2">{status}</p>
                  <p className="text-2xl font-bold">{count as number}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
