import prisma from '@/db'
import {
  generateSalesReportExcel,
  buildReportFilename,
  type ReportOrder,
  type SalesSummary,
  type SalesFilter,
} from '@/lib/excelGenerator'
import { resolveDateRange, type DateRange } from '@/lib/reportUtils'

async function calculatePeriodTotal(start: Date, end: Date): Promise<number> {
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start, lte: end } },
  })
  return orders.reduce((sum, order) => sum + order.totalPrice, 0)
}

export async function getOrdersInRange(start: Date, end: Date): Promise<ReportOrder[]> {
  return prisma.order.findMany({
    where: {
      createdAt: { gte: start, lte: end },
    },
    include: { product: { select: { name: true, category: true } } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getSalesSummary(dateRange: DateRange): Promise<SalesSummary> {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(
    startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1)
  )
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfYear = new Date(now.getFullYear(), 0, 1)

  const [today, week, month, year, periodOrders] = await Promise.all([
    calculatePeriodTotal(startOfToday, now),
    calculatePeriodTotal(startOfWeek, now),
    calculatePeriodTotal(startOfMonth, now),
    calculatePeriodTotal(startOfYear, now),
    getOrdersInRange(dateRange.start, dateRange.end),
  ])

  const periodTotal = periodOrders.reduce((sum, o) => sum + o.totalPrice, 0)

  return {
    today,
    week,
    month,
    year,
    periodTotal,
    orderCount: periodOrders.length,
  }
}

export async function buildSalesReportBuffer(
  filter: SalesFilter,
  startDateStr?: string,
  endDateStr?: string
): Promise<{ buffer: Buffer; filename: string; dateRange: DateRange }> {
  const dateRange = resolveDateRange(filter, startDateStr, endDateStr)
  const [orders, summary, storeSettings] = await Promise.all([
    getOrdersInRange(dateRange.start, dateRange.end),
    getSalesSummary(dateRange),
    prisma.storeSettings.findFirst(),
  ])

  const shopName = storeSettings?.shopName ?? 'Bakery POS'
  const buffer = await generateSalesReportExcel(orders, summary, {
    shopName,
    dateRangeLabel: dateRange.label,
    generatedAt: new Date(),
  })

  const filename = buildReportFilename(shopName, dateRange.label)

  return { buffer, filename, dateRange }
}

export async function buildSalesReportForRange(
  dateRange: DateRange
): Promise<{ buffer: Buffer; filename: string }> {
  const [orders, summary, storeSettings] = await Promise.all([
    getOrdersInRange(dateRange.start, dateRange.end),
    getSalesSummary(dateRange),
    prisma.storeSettings.findFirst(),
  ])

  const shopName = storeSettings?.shopName ?? 'Bakery POS'
  const buffer = await generateSalesReportExcel(orders, summary, {
    shopName,
    dateRangeLabel: dateRange.label,
    generatedAt: new Date(),
  })

  return { buffer, filename: buildReportFilename(shopName, dateRange.label) }
}
