'use client'

import { useEffect, useState } from 'react'
import { getProducts } from '@/actions/product'
import { getSuppliers } from '@/actions/supplier'
import { getOrders } from '@/actions/order'
import { getStoreSettings } from '@/actions/store'
import { logout } from '@/actions/auth'
import SalesAnalytics from '@/components/SalesAnalytics'
import ExportButton from '@/components/ExportButton'
import LiveKitchenQueue from '@/components/LiveKitchenQueue'
import OrderTypeChart from '@/components/OrderTypeChart'
import {
  getDashboardAnalytics,
  getExpiringBatches,
  getUpcomingSupplierPayments,
  getTopSellingProducts,
  getKitchenWorkload,
  getCashDrawerSummary
} from '@/actions/dashboard-analytics'

interface DashboardData {
  totalRevenue: number
  totalCOGS: number
  grossProfit: number
  totalWastage: number
  totalOrders: number
}

export default function EnhancedDashboard({ session }: { session: any }) {
  const [mounted, setMounted] = useState(false)
  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'custom'>('today')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [loading, setLoading] = useState(true)
  
  // Data states
  const [products, setProducts] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [expiringBatches, setExpiringBatches] = useState<any[]>([])
  const [upcomingPayments, setUpcomingPayments] = useState<any[]>([])
  const [topSellingProducts, setTopSellingProducts] = useState<any[]>([])
  const [kitchenWorkload, setKitchenWorkload] = useState<any[]>([])
  const [cashDrawer, setCashDrawer] = useState<any>(null)
  const [storeSettings, setStoreSettings] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    loadInitialData()
  }, [])

  useEffect(() => {
    if (mounted) {
      loadDashboardData()
    }
  }, [dateRange, customStartDate, customEndDate])

  const getDateRange = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (dateRange) {
      case 'today':
        return { start: today, end: new Date(now.getTime() + 24 * 60 * 60 * 1000) }
      case 'yesterday':
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
        return { start: yesterday, end: today }
      case 'thisWeek':
        const weekStart = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000)
        return { start: weekStart, end: new Date(now.getTime() + 24 * 60 * 60 * 1000) }
      case 'thisMonth':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        return { start: monthStart, end: new Date(now.getTime() + 24 * 60 * 60 * 1000) }
      case 'custom':
        if (customStartDate && customEndDate) {
          return { start: new Date(customStartDate), end: new Date(customEndDate) }
        }
        return { start: today, end: new Date(now.getTime() + 24 * 60 * 60 * 1000) }
      default:
        return { start: today, end: new Date(now.getTime() + 24 * 60 * 60 * 1000) }
    }
  }

  const loadInitialData = async () => {
    try {
      const [productsData, suppliersData, ordersData, settingsData] = await Promise.all([
        getProducts(),
        getSuppliers(),
        getOrders(),
        getStoreSettings()
      ])
      setProducts(productsData)
      setSuppliers(suppliersData)
      setOrders(ordersData)
      setStoreSettings(settingsData)

      // Load additional dashboard data
      const [expiringData, paymentsData, workloadData, cashData] = await Promise.all([
        getExpiringBatches(3),
        getUpcomingSupplierPayments(3, 7),
        getKitchenWorkload(),
        getCashDrawerSummary()
      ])
      setExpiringBatches(expiringData)
      setUpcomingPayments(paymentsData)
      setKitchenWorkload(workloadData)
      setCashDrawer(cashData)
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      const { start, end } = getDateRange()
      const [analyticsData, topProducts] = await Promise.all([
        getDashboardAnalytics(start, end),
        getTopSellingProducts(start, end, 5)
      ])
      setDashboardData(analyticsData)
      setTopSellingProducts(topProducts)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const lowStockThreshold = storeSettings?.lowStockThreshold || 5
  const lowStockProducts = products.filter((p: any) => p.currentStock <= lowStockThreshold)
  const lowStockCount = lowStockProducts.length

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="p-3.5 max-w-full overflow-x-hidden">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <ExportButton />
      </div>

      {/* KPI Cards - 5 Column Layout */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        {/* Total Revenue */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                Rs. {dashboardData?.totalRevenue.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-sm">💰</span>
            </div>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Profit</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                Rs. {dashboardData?.grossProfit.toFixed(2) || '0.00'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                COGS: Rs. {dashboardData?.totalCOGS.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm">📈</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                {dashboardData?.totalOrders || 0}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm">📦</span>
            </div>
          </div>
        </div>

        {/* Daily Wastage */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Daily Wastage</p>
              <p className="text-lg font-bold text-slate-900 mt-1">
                Rs. {dashboardData?.totalWastage.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-sm">⚠️</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm ${lowStockCount > 0 ? 'border-red-300' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{lowStockCount}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-sm">🔔</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - 8/4 Layout */}
      <div className="grid grid-cols-12 gap-3 mb-4">
        <div className="col-span-8">
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm h-[220px]">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sales Analytics</h2>
            <div className="h-[180px]">
              <SalesAnalytics />
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm h-[220px]">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Order Distribution</h2>
            <div className="h-[180px]">
              <OrderTypeChart />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Widgets Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Expiry Alert Widget */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-orange-500 text-sm">⏰</span>
            Items Expiring Soon (3 days)
          </h2>
          {expiringBatches.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-[140px]">
              {expiringBatches.slice(0, 5).map((batch, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800 text-xs">{batch.productName}</p>
                    <p className="text-xs text-slate-600">Batch: {batch.batchNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-800">{batch.quantity} {batch.uom}</p>
                    <p className={`text-xs font-medium ${
                      batch.daysUntilExpiry <= 1 ? 'text-red-600' :
                      batch.daysUntilExpiry <= 2 ? 'text-orange-600' :
                      'text-yellow-600'
                    }`}>
                      {batch.daysUntilExpiry} days left
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-3 text-xs">No items expiring within 3 days</p>
          )}
        </div>

        {/* Upcoming Supplier Payments */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-blue-500 text-sm">💳</span>
            Upcoming Payments (3-7 days)
          </h2>
          {upcomingPayments.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-[140px]">
              {upcomingPayments.slice(0, 5).map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-800 text-xs">{payment.supplierName}</p>
                    <p className="text-xs text-slate-600">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-xs">Rs. {payment.amount.toFixed(2)}</p>
                    <p className="text-xs text-blue-600">{payment.daysUntilDue} days</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-3 text-xs">No payments due in next 3-7 days</p>
          )}
        </div>
      </div>

      {/* Low Stock Products List */}
      {lowStockCount > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm mb-4 border-red-300">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-red-600 text-sm">⚠️</span>
            Products to Restock
          </h2>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map((product: any) => (
              <div
                key={product.id}
                className="bg-red-50 text-red-800 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-2"
              >
                <span>{product.name}</span>
                <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded-full text-xs">
                  {product.currentStock} in stock
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Live Kitchen Queue with Workload Panel */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="col-span-2">
          <LiveKitchenQueue />
        </div>
        <div className="col-span-1">
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm h-full">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-amber-500 text-sm">👨‍🍳</span>
              Kitchen Workload Summary
            </h2>
            {kitchenWorkload.length > 0 ? (
              <div className="space-y-2 overflow-y-auto max-h-[140px]">
                {kitchenWorkload.slice(0, 8).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-800 text-xs">{item.productName}</p>
                      <p className="text-xs text-slate-600">{item.orderIds.length} orders</p>
                    </div>
                    <div className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold text-xs">
                      x{item.totalQuantity}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4 text-xs">No active orders</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Insights Section */}
      <div className="grid grid-cols-2 gap-3">
        {/* Top 5 Selling Products */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-green-500 text-sm">🏆</span>
            Top 5 Selling Products
          </h2>
          {topSellingProducts.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-[140px]">
              {topSellingProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-amber-600' :
                      'bg-green-500'
                    }`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800 text-xs">{product.productName}</p>
                      <p className="text-xs text-slate-600">{product.totalQuantity} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-xs">Rs. {product.totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4 text-xs">No sales data for selected period</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-sm">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="text-blue-500 text-sm">📋</span>
            Recent Orders
          </h2>
          <div className="overflow-x-auto overflow-y-auto max-h-[140px]">
            <table className="w-full text-left min-w-[400px]">
              <thead className="bg-slate-100 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-600">Product</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-600">Qty</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-600">Total</th>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-600">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.slice(0, 5).map((order: any) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-xs text-slate-800">
                      <div className="flex items-center gap-2">
                        <span>{order.product.name}</span>
                        {/* Delivery platform indicator */}
                        {/* @ts-ignore - orderSource field needs Prisma regeneration */}
                        {order.orderSource === 'UBER_EATS' && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" title="Uber Eats" />
                        )}
                        {/* @ts-ignore - orderSource field needs Prisma regeneration */}
                        {order.orderSource === 'PICKME' && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full" title="PickMe" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">{order.quantity}</td>
                    <td className="px-3 py-2 text-xs text-slate-800 font-medium">Rs. {order.totalPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 text-xs text-slate-600">{order.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
