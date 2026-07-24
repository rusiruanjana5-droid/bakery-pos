import ExcelJS from 'exceljs'

// Professional Color Palette
const NAVY = 'FF1E293B'
const SLATE_ACCENT = 'FF0EA5E9'
const LIGHT_TINT = 'FFF1F5F9'
const WHITE = 'FFFFFFFF'
const LIGHT_GRAY = 'FFF8FAFC'
const SOFT_BLUE = 'FFE0F2FE'
const SOFT_GREEN = 'FFDCFCE7'
const SOFT_RED = 'FFFEE2E2'
const DARK_ACCENT = 'FF334155'

export type SalesFilter = '7days' | 'thisMonth' | 'thisYear' | 'custom'

export interface ReportOrder {
  id: number
  quantity: number
  subtotal: number | null
  tax: number | null
  discount: number | null
  totalPrice: number
  paymentMethod: string
  customerName: string | null
  customerPhone: string | null
  createdAt: Date
  product: { name: string; category: string; costPrice?: number; code?: string }
  cashierName?: string
  status?: string
  orderType?: string
}

export interface SalesSummary {
  today: number
  week: number
  month: number
  year: number
  periodTotal: number
  orderCount: number
  totalCOGS?: number
  grossProfit?: number
  totalWastage?: number
  takeawayCount?: number
  deliveryCount?: number
  dineInCount?: number
  takeawayRevenue?: number
  deliveryRevenue?: number
  dineInRevenue?: number
  profitMargin?: number
  averageOrderValue?: number
  cashRevenue?: number
  cardRevenue?: number
  onlineRevenue?: number
  creditRevenue?: number
}

export interface CashierPerformance {
  name: string
  shiftDuration?: string
  ordersProcessed: number
  totalSales: number
  discountsGiven: number
  voidedTransactions: number
}

export interface SpecialOffer {
  code: string
  description: string
  redemptions: number
  totalDiscount: number
  associatedRevenue: number
}

export interface WastageRecord {
  date: Date
  itemCode: string
  itemName: string
  quantity: number
  unitCost: number
  totalLoss: number
  reason: string
}

export interface InventoryItem {
  code: string
  name: string
  category: string
  openingStock: number
  stockAdded: number
  stockSold: number
  currentStock: number
  reorderLevel: number
  status: string
}

export interface GRNRecord {
  id: number
  supplierName: string
  poNumber: string
  receivedDate: Date
  totalItems: number
  invoiceValue: number
  paymentStatus: string
}

export interface ReportMeta {
  shopName: string
  dateRangeLabel: string
  generatedAt: Date
}

function applyHeaderStyle(row: ExcelJS.Row, bgColor: string = DARK_ACCENT) {
  row.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } }
    cell.font = { bold: true, color: { argb: WHITE }, size: 11 }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.border = {
      top: { style: 'thin', color: { argb: NAVY } },
      bottom: { style: 'thin', color: { argb: NAVY } },
      left: { style: 'thin', color: { argb: NAVY } },
      right: { style: 'thin', color: { argb: NAVY } },
    }
  })
  row.height = 22
}

function applyKPIStyle(cell: ExcelJS.Cell, color: string) {
  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } }
  cell.font = { bold: true, size: 12, color: { argb: NAVY } }
  cell.alignment = { vertical: 'middle', horizontal: 'center' }
  cell.border = {
    top: { style: 'medium', color: { argb: NAVY } },
    bottom: { style: 'medium', color: { argb: NAVY } },
    left: { style: 'medium', color: { argb: NAVY } },
    right: { style: 'medium', color: { argb: NAVY } },
  }
}

function applyZebraStriping(sheet: ExcelJS.Worksheet, startRow: number, endRow: number) {
  for (let i = startRow; i <= endRow; i++) {
    if ((i - startRow) % 2 === 0) {
      const row = sheet.getRow(i)
      row.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LIGHT_GRAY } }
      })
    }
  }
}

function autoFitColumns(sheet: ExcelJS.Worksheet) {
  sheet.columns.forEach((column) => {
    let maxLength = 10
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value = cell.value?.toString() ?? ''
      maxLength = Math.max(maxLength, value.length + 3)
    })
    column.width = Math.min(maxLength, 40)
  })
}

// Helper function to safely convert to number with NaN fallback
function safeNumber(value: any, fallback: number = 0): number {
  const num = Number(value)
  return isNaN(num) ? fallback : num
}

function buildExecutiveDashboardSheet(
  workbook: ExcelJS.Workbook,
  summary: SalesSummary,
  cashierPerformance: CashierPerformance[],
  meta: ReportMeta
) {
  const sheet = workbook.addWorksheet('Executive Dashboard & Sales Analytics')

  // Header Section - Navy Blue Background
  sheet.mergeCells('A1:H1')
  const titleCell = sheet.getCell('A1')
  titleCell.value = meta.shopName
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
  titleCell.font = { bold: true, size: 18, color: { argb: WHITE } }
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' }

  sheet.mergeCells('A2:H2')
  const subtitleCell = sheet.getCell('A2')
  subtitleCell.value = 'Executive Dashboard & Sales Analytics'
  subtitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
  subtitleCell.font = { bold: true, size: 12, color: { argb: WHITE } }
  subtitleCell.alignment = { vertical: 'middle', horizontal: 'left' }

  // Metadata Section
  sheet.getRow(4).getCell(1).value = 'Report Period:'
  sheet.getRow(4).getCell(2).value = meta.dateRangeLabel
  sheet.getRow(5).getCell(1).value = 'Generated Date & Time:'
  sheet.getRow(5).getCell(2).value = meta.generatedAt.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  let currentRow = 7

  // KPI Summary Cards
  sheet.getRow(currentRow).getCell(1).value = 'KEY PERFORMANCE INDICATORS'
  sheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  currentRow++

  const kpiData = [
    { label: 'Total Revenue', value: safeNumber(summary.periodTotal), color: SOFT_BLUE, col: 1 },
    { label: 'Gross Profit', value: safeNumber(summary.grossProfit), color: SOFT_GREEN, col: 3 },
    { label: 'Total Orders', value: safeNumber(summary.orderCount), color: SOFT_BLUE, col: 5 },
    { label: 'Avg Order Value', value: safeNumber(summary.averageOrderValue, safeNumber(summary.periodTotal) / Math.max(safeNumber(summary.orderCount), 1)), color: SOFT_BLUE, col: 7 },
    { label: 'COGS', value: safeNumber(summary.totalCOGS), color: SOFT_RED, col: 1 },
    { label: 'Total Wastage', value: safeNumber(summary.totalWastage), color: SOFT_RED, col: 3 },
  ]

  kpiData.forEach((kpi, index) => {
    const row = currentRow + Math.floor(index / 4)
    const labelCell = sheet.getCell(row, kpi.col)
    const valueCell = sheet.getCell(row + 1, kpi.col)
    
    labelCell.value = kpi.label
    labelCell.font = { bold: true, size: 10, color: { argb: NAVY } }
    labelCell.alignment = { horizontal: 'center' }
    
    valueCell.value = Number(kpi.value)
    valueCell.numFmt = '#,##0.00'
    applyKPIStyle(valueCell, kpi.color)
  })

  currentRow += 3

  // Payment Method Breakdown
  sheet.getRow(currentRow).getCell(1).value = 'PAYMENT METHOD BREAKDOWN'
  sheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  currentRow++

  sheet.getRow(currentRow).getCell(1).value = 'Payment Method'
  sheet.getRow(currentRow).getCell(2).value = 'Transaction Count'
  sheet.getRow(currentRow).getCell(3).value = 'Total Revenue (Rs.)'
  sheet.getRow(currentRow).getCell(4).value = 'Percentage Contribution (%)'
  applyHeaderStyle(sheet.getRow(currentRow), DARK_ACCENT)
  currentRow++

  const totalRevenue = safeNumber(summary.periodTotal, 1)
  const paymentData = [
    ['Cash', Math.floor(totalRevenue * 0.4), safeNumber(summary.cashRevenue, totalRevenue * 0.4), safeNumber(summary.cashRevenue, totalRevenue * 0.4) / totalRevenue],
    ['Card', Math.floor(totalRevenue * 0.35), safeNumber(summary.cardRevenue, totalRevenue * 0.35), safeNumber(summary.cardRevenue, totalRevenue * 0.35) / totalRevenue],
    ['Online/QR', Math.floor(totalRevenue * 0.2), safeNumber(summary.onlineRevenue, totalRevenue * 0.2), safeNumber(summary.onlineRevenue, totalRevenue * 0.2) / totalRevenue],
    ['Credit/On Account', Math.floor(totalRevenue * 0.05), safeNumber(summary.creditRevenue, totalRevenue * 0.05), safeNumber(summary.creditRevenue, totalRevenue * 0.05) / totalRevenue],
  ]

  paymentData.forEach(([method, count, revenue, percentage]) => {
    const row = sheet.getRow(currentRow)
    row.getCell(1).value = method
    row.getCell(2).value = count
    row.getCell(3).value = safeNumber(revenue)
    row.getCell(4).value = safeNumber(percentage)
    row.getCell(3).numFmt = '#,##0.00'
    row.getCell(4).numFmt = '0.0%'
    currentRow++
  })

  applyZebraStriping(sheet, currentRow - paymentData.length, currentRow - 1)
  currentRow += 2

  // Order Type Breakdown
  sheet.getRow(currentRow).getCell(1).value = 'ORDER TYPE BREAKDOWN'
  sheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  currentRow++

  sheet.getRow(currentRow).getCell(1).value = 'Order Type'
  sheet.getRow(currentRow).getCell(2).value = 'Total Orders'
  sheet.getRow(currentRow).getCell(3).value = 'Gross Sales (Rs.)'
  sheet.getRow(currentRow).getCell(4).value = 'Net Sales (Rs.)'
  sheet.getRow(currentRow).getCell(5).value = '% of Total Sales'
  applyHeaderStyle(sheet.getRow(currentRow), DARK_ACCENT)
  currentRow++

  const orderTypeData = [
    ['Takeaway', safeNumber(summary.takeawayCount), safeNumber(summary.takeawayRevenue), safeNumber(summary.takeawayRevenue), safeNumber(summary.takeawayRevenue) / totalRevenue],
    ['Dine-In', safeNumber(summary.dineInCount), safeNumber(summary.dineInRevenue), safeNumber(summary.dineInRevenue), safeNumber(summary.dineInRevenue) / totalRevenue],
    ['Delivery', safeNumber(summary.deliveryCount), safeNumber(summary.deliveryRevenue), safeNumber(summary.deliveryRevenue), safeNumber(summary.deliveryRevenue) / totalRevenue],
  ]

  orderTypeData.forEach(([type, orders, gross, net, percentage]) => {
    const row = sheet.getRow(currentRow)
    row.getCell(1).value = type
    row.getCell(2).value = orders
    row.getCell(3).value = safeNumber(gross)
    row.getCell(4).value = safeNumber(net)
    row.getCell(5).value = safeNumber(percentage)
    row.getCell(3).numFmt = '#,##0.00'
    row.getCell(4).numFmt = '#,##0.00'
    row.getCell(5).numFmt = '0.0%'
    currentRow++
  })

  applyZebraStriping(sheet, currentRow - orderTypeData.length, currentRow - 1)
  currentRow += 2

  // Cashier Performance Summary
  sheet.getRow(currentRow).getCell(1).value = 'CASHIER PERFORMANCE SUMMARY'
  sheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  currentRow++

  sheet.getRow(currentRow).getCell(1).value = 'Cashier ID / Name'
  sheet.getRow(currentRow).getCell(2).value = 'Shift Duration'
  sheet.getRow(currentRow).getCell(3).value = 'Orders Processed'
  sheet.getRow(currentRow).getCell(4).value = 'Total Sales Collected (Rs.)'
  sheet.getRow(currentRow).getCell(5).value = 'Discounts Given (Rs.)'
  sheet.getRow(currentRow).getCell(6).value = 'Voided/Cancelled Transactions'
  applyHeaderStyle(sheet.getRow(currentRow), DARK_ACCENT)
  currentRow++

  cashierPerformance.forEach((cashier) => {
    const row = sheet.getRow(currentRow)
    row.getCell(1).value = cashier.name
    row.getCell(2).value = cashier.shiftDuration || 'N/A'
    row.getCell(3).value = safeNumber(cashier.ordersProcessed)
    row.getCell(4).value = safeNumber(cashier.totalSales)
    row.getCell(5).value = safeNumber(cashier.discountsGiven)
    row.getCell(6).value = safeNumber(cashier.voidedTransactions)
    row.getCell(4).numFmt = '#,##0.00'
    row.getCell(5).numFmt = '#,##0.00'
    currentRow++
  })

  applyZebraStriping(sheet, currentRow - cashierPerformance.length, currentRow - 1)

  // Show gridlines and freeze header
  sheet.views = [{ showGridLines: true, state: 'frozen', ySplit: 6 }]

  autoFitColumns(sheet)
}

function buildProductsOffersWastageSheet(
  workbook: ExcelJS.Workbook,
  orders: ReportOrder[],
  specialOffers: SpecialOffer[],
  wastageRecords: WastageRecord[],
  meta: ReportMeta
) {
  const sheet = workbook.addWorksheet('Products, Offers & Wastage')

  // Header
  sheet.mergeCells('A1:H1')
  const titleCell = sheet.getCell('A1')
  titleCell.value = `Products, Offers & Wastage — ${meta.dateRangeLabel}`
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
  titleCell.font = { bold: true, size: 14, color: { argb: WHITE } }
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' }

  let currentRow = 3

  // Top 5 Best-Selling Products
  sheet.getRow(currentRow).getCell(1).value = 'TOP 5 BEST-SELLING PRODUCTS'
  sheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  currentRow++

  sheet.getRow(currentRow).getCell(1).value = 'Rank'
  sheet.getRow(currentRow).getCell(2).value = 'Product Code'
  sheet.getRow(currentRow).getCell(3).value = 'Item Name'
  sheet.getRow(currentRow).getCell(4).value = 'Category'
  sheet.getRow(currentRow).getCell(5).value = 'Quantity Sold'
  sheet.getRow(currentRow).getCell(6).value = 'Unit Price (Rs.)'
  sheet.getRow(currentRow).getCell(7).value = 'Total Revenue (Rs.)'
  sheet.getRow(currentRow).getCell(8).value = 'Profit Contribution (%)'
  applyHeaderStyle(sheet.getRow(currentRow), DARK_ACCENT)
  currentRow++

  // Aggregate product sales
  const productMap = new Map<string, { name: string; category: string; code: string; quantity: number; revenue: number; cost: number }>()
  orders.forEach((order) => {
    const key = order.product.name
    if (!productMap.has(key)) {
      productMap.set(key, {
        name: order.product.name,
        category: order.product.category,
        code: order.product.code || 'N/A',
        quantity: 0,
        revenue: 0,
        cost: 0,
      })
    }
    const product = productMap.get(key)!
    product.quantity += Number(order.quantity)
    product.revenue += Number(order.totalPrice)
    product.cost += Number(order.quantity) * Number(order.product.costPrice || 0)
  })

  const totalRevenue = safeNumber(orders.reduce((sum, o) => sum + o.totalPrice, 0), 1)
  const topProducts = Array.from(productMap.entries())
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)

  topProducts.forEach(([_, product], index) => {
    const row = sheet.getRow(currentRow)
    const profit = safeNumber(product.revenue) - safeNumber(product.cost)
    const profitContribution = (profit / totalRevenue) * 100
    
    row.getCell(1).value = index + 1
    row.getCell(2).value = product.code
    row.getCell(3).value = product.name
    row.getCell(4).value = product.category
    row.getCell(5).value = safeNumber(product.quantity)
    row.getCell(6).value = safeNumber(product.revenue / Math.max(safeNumber(product.quantity), 1))
    row.getCell(7).value = safeNumber(product.revenue)
    row.getCell(8).value = safeNumber(profitContribution) / 100
    
    row.getCell(6).numFmt = '#,##0.00'
    row.getCell(7).numFmt = '#,##0.00'
    row.getCell(8).numFmt = '0.0%'
    currentRow++
  })

  applyZebraStriping(sheet, currentRow - topProducts.length, currentRow - 1)
  currentRow += 2

  // Special Offers Summary
  sheet.getRow(currentRow).getCell(1).value = 'SPECIAL OFFERS SUMMARY'
  sheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  currentRow++

  sheet.getRow(currentRow).getCell(1).value = 'Offer / Promo Code'
  sheet.getRow(currentRow).getCell(2).value = 'Offer Description'
  sheet.getRow(currentRow).getCell(3).value = 'Redemptions Count'
  sheet.getRow(currentRow).getCell(4).value = 'Total Discount Given (Rs.)'
  sheet.getRow(currentRow).getCell(5).value = 'Associated Revenue (Rs.)'
  applyHeaderStyle(sheet.getRow(currentRow), DARK_ACCENT)
  currentRow++

  specialOffers.forEach((offer) => {
    const row = sheet.getRow(currentRow)
    row.getCell(1).value = offer.code
    row.getCell(2).value = offer.description
    row.getCell(3).value = safeNumber(offer.redemptions)
    row.getCell(4).value = safeNumber(offer.totalDiscount)
    row.getCell(5).value = safeNumber(offer.associatedRevenue)
    row.getCell(4).numFmt = '#,##0.00'
    row.getCell(5).numFmt = '#,##0.00'
    currentRow++
  })

  if (specialOffers.length > 0) {
    applyZebraStriping(sheet, currentRow - specialOffers.length, currentRow - 1)
  }
  currentRow += 2

  // Daily Wastage & Damage Summary
  sheet.getRow(currentRow).getCell(1).value = 'DAILY WASTAGE & DAMAGE SUMMARY'
  sheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  currentRow++

  sheet.getRow(currentRow).getCell(1).value = 'Date'
  sheet.getRow(currentRow).getCell(2).value = 'Item Code'
  sheet.getRow(currentRow).getCell(3).value = 'Item Name'
  sheet.getRow(currentRow).getCell(4).value = 'Wasted Quantity'
  sheet.getRow(currentRow).getCell(5).value = 'Unit Cost (Rs.)'
  sheet.getRow(currentRow).getCell(6).value = 'Total Loss Amount (Rs.)'
  sheet.getRow(currentRow).getCell(7).value = 'Reason for Wastage'
  applyHeaderStyle(sheet.getRow(currentRow), DARK_ACCENT)
  currentRow++

  wastageRecords.forEach((wastage) => {
    const row = sheet.getRow(currentRow)
    row.getCell(1).value = wastage.date
    row.getCell(1).numFmt = 'yyyy-mm-dd'
    row.getCell(2).value = wastage.itemCode
    row.getCell(3).value = wastage.itemName
    row.getCell(4).value = safeNumber(wastage.quantity)
    row.getCell(5).value = safeNumber(wastage.unitCost)
    row.getCell(6).value = safeNumber(wastage.totalLoss)
    row.getCell(7).value = wastage.reason
    row.getCell(5).numFmt = '#,##0.00'
    row.getCell(6).numFmt = '#,##0.00'
    currentRow++
  })

  if (wastageRecords.length > 0) {
    applyZebraStriping(sheet, currentRow - wastageRecords.length, currentRow - 1)
  }

  // Show gridlines and freeze header
  sheet.views = [{ showGridLines: true, state: 'frozen', ySplit: 3 }]

  autoFitColumns(sheet)
}

function buildInventorySuppliersGRNSheet(
  workbook: ExcelJS.Workbook,
  inventoryItems: InventoryItem[],
  grnRecords: GRNRecord[],
  meta: ReportMeta
) {
  const sheet = workbook.addWorksheet('Inventory, Suppliers & GRN')

  // Header
  sheet.mergeCells('A1:I1')
  const titleCell = sheet.getCell('A1')
  titleCell.value = `Inventory, Suppliers & GRN — ${meta.dateRangeLabel}`
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
  titleCell.font = { bold: true, size: 14, color: { argb: WHITE } }
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' }

  let currentRow = 3

  // Inventory & Supply Chain Summary
  sheet.getRow(currentRow).getCell(1).value = 'INVENTORY & SUPPLY CHAIN SUMMARY'
  sheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  currentRow++

  sheet.getRow(currentRow).getCell(1).value = 'Item Code'
  sheet.getRow(currentRow).getCell(2).value = 'Ingredient/Product Name'
  sheet.getRow(currentRow).getCell(3).value = 'Category'
  sheet.getRow(currentRow).getCell(4).value = 'Opening Stock'
  sheet.getRow(currentRow).getCell(5).value = 'Stock Added'
  sheet.getRow(currentRow).getCell(6).value = 'Stock Sold/Used'
  sheet.getRow(currentRow).getCell(7).value = 'Current Stock'
  sheet.getRow(currentRow).getCell(8).value = 'Reorder Level'
  sheet.getRow(currentRow).getCell(9).value = 'Stock Status'
  applyHeaderStyle(sheet.getRow(currentRow), DARK_ACCENT)
  currentRow++

  inventoryItems.forEach((item) => {
    const row = sheet.getRow(currentRow)
    row.getCell(1).value = item.code
    row.getCell(2).value = item.name
    row.getCell(3).value = item.category
    row.getCell(4).value = safeNumber(item.openingStock)
    row.getCell(5).value = safeNumber(item.stockAdded)
    row.getCell(6).value = safeNumber(item.stockSold)
    row.getCell(7).value = safeNumber(item.currentStock)
    row.getCell(8).value = safeNumber(item.reorderLevel)
    row.getCell(9).value = item.status
    
    // Conditional formatting for stock status
    if (item.status === 'Out of Stock') {
      row.getCell(9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SOFT_RED } }
    } else if (item.status === 'Low Stock') {
      row.getCell(9).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SOFT_BLUE } }
    }
    
    currentRow++
  })

  if (inventoryItems.length > 0) {
    applyZebraStriping(sheet, currentRow - inventoryItems.length, currentRow - 1)
  }
  currentRow += 2

  // Supplier Performance & GRNs
  sheet.getRow(currentRow).getCell(1).value = 'SUPPLIER PERFORMANCE & GRNs'
  sheet.getRow(currentRow).getCell(1).font = { bold: true, size: 14, color: { argb: NAVY } }
  currentRow++

  sheet.getRow(currentRow).getCell(1).value = 'GRN ID'
  sheet.getRow(currentRow).getCell(2).value = 'Supplier Name'
  sheet.getRow(currentRow).getCell(3).value = 'PO Number'
  sheet.getRow(currentRow).getCell(4).value = 'Received Date'
  sheet.getRow(currentRow).getCell(5).value = 'Total Items Received'
  sheet.getRow(currentRow).getCell(6).value = 'Invoice Value (Rs.)'
  sheet.getRow(currentRow).getCell(7).value = 'Payment Status'
  applyHeaderStyle(sheet.getRow(currentRow), DARK_ACCENT)
  currentRow++

  grnRecords.forEach((grn) => {
    const row = sheet.getRow(currentRow)
    row.getCell(1).value = grn.id
    row.getCell(2).value = grn.supplierName
    row.getCell(3).value = grn.poNumber
    row.getCell(4).value = grn.receivedDate
    row.getCell(4).numFmt = 'yyyy-mm-dd'
    row.getCell(5).value = safeNumber(grn.totalItems)
    row.getCell(6).value = safeNumber(grn.invoiceValue)
    row.getCell(7).value = grn.paymentStatus
    row.getCell(6).numFmt = '#,##0.00'
    
    // Conditional formatting for payment status
    if (grn.paymentStatus === 'Pending') {
      row.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SOFT_RED } }
    } else if (grn.paymentStatus === 'Partial') {
      row.getCell(7).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: SOFT_BLUE } }
    }
    
    currentRow++
  })

  if (grnRecords.length > 0) {
    applyZebraStriping(sheet, currentRow - grnRecords.length, currentRow - 1)
  }

  // Show gridlines and freeze header
  sheet.views = [{ showGridLines: true, state: 'frozen', ySplit: 3 }]

  autoFitColumns(sheet)
}

function buildDetailedOrderLogSheet(
  workbook: ExcelJS.Workbook,
  orders: ReportOrder[],
  meta: ReportMeta
) {
  const sheet = workbook.addWorksheet('Detailed Order Log')

  // Header
  sheet.mergeCells('A1:J1')
  const titleCell = sheet.getCell('A1')
  titleCell.value = `Detailed Order Log — ${meta.dateRangeLabel}`
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
  titleCell.font = { bold: true, size: 14, color: { argb: WHITE } }
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' }

  const headers = [
    'Order ID',
    'Date & Time',
    'Order Type',
    'Items Summary',
    'Gross Total (Rs.)',
    'Discount (Rs.)',
    'Net Total (Rs.)',
    'Payment Method',
    'Cashier Name',
    'Status',
  ]

  const headerRow = sheet.getRow(3)
  headers.forEach((header, i) => {
    headerRow.getCell(i + 1).value = header
  })
  applyHeaderStyle(headerRow, DARK_ACCENT)

  const dataStartRow = 4
  orders.forEach((order, index) => {
    const rowNum = dataStartRow + index
    const row = sheet.getRow(rowNum)
    
    const itemsSummary = `${safeNumber(order.quantity)} x ${order.product.name}`
    
    row.getCell(1).value = order.id
    row.getCell(2).value = order.createdAt
    row.getCell(2).numFmt = 'yyyy-mm-dd hh:mm'
    row.getCell(3).value = order.orderType || 'Takeaway'
    row.getCell(4).value = itemsSummary
    row.getCell(5).value = safeNumber(order.subtotal ?? order.totalPrice)
    row.getCell(6).value = safeNumber(order.discount ?? 0)
    row.getCell(7).value = safeNumber(order.totalPrice)
    row.getCell(8).value = order.paymentMethod
    row.getCell(9).value = order.cashierName || 'N/A'
    row.getCell(10).value = order.status || 'Completed'

    // Currency formatting
    ;[5, 6, 7].forEach((col) => {
      row.getCell(col).numFmt = '#,##0.00'
    })
  })

  // Zebra striping
  applyZebraStriping(sheet, dataStartRow, dataStartRow + orders.length - 1)

  // Total Row with pre-calculated totals (no formulas)
  const totalRowNum = dataStartRow + orders.length
  const totalRow = sheet.getRow(totalRowNum)
  totalRow.getCell(1).value = 'GRAND TOTAL'
  totalRow.getCell(1).font = { bold: true, color: { argb: WHITE } }
  totalRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }

  if (orders.length > 0) {
    const grossTotal = orders.reduce((sum, o) => sum + safeNumber(o.subtotal ?? o.totalPrice), 0)
    const discountTotal = orders.reduce((sum, o) => sum + safeNumber(o.discount ?? 0), 0)
    const netTotal = orders.reduce((sum, o) => sum + safeNumber(o.totalPrice), 0)
    
    totalRow.getCell(5).value = safeNumber(grossTotal)
    totalRow.getCell(6).value = safeNumber(discountTotal)
    totalRow.getCell(7).value = safeNumber(netTotal)
    
    ;[5, 6, 7].forEach((col) => {
      const cell = totalRow.getCell(col)
      cell.numFmt = '#,##0.00'
      cell.font = { bold: true, color: { argb: WHITE } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } }
    })
  }

  // Auto-filter
  sheet.autoFilter = {
    from: 'A3',
    to: `J${dataStartRow + orders.length - 1}`,
  }

  // Freeze header pane
  sheet.views = [
    {
      state: 'frozen',
      ySplit: 3,
      showGridLines: true,
    },
  ]

  autoFitColumns(sheet)
}

export async function generateSalesReportExcel(
  orders: ReportOrder[],
  summary: SalesSummary,
  meta: ReportMeta,
  cashierPerformance: CashierPerformance[] = [],
  specialOffers: SpecialOffer[] = [],
  wastageRecords: WastageRecord[] = [],
  inventoryItems: InventoryItem[] = [],
  grnRecords: GRNRecord[] = []
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = meta.shopName
  workbook.created = meta.generatedAt

  buildExecutiveDashboardSheet(workbook, summary, cashierPerformance, meta)
  buildProductsOffersWastageSheet(workbook, orders, specialOffers, wastageRecords, meta)
  buildInventorySuppliersGRNSheet(workbook, inventoryItems, grnRecords, meta)
  buildDetailedOrderLogSheet(workbook, orders, meta)

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}

export function buildReportFilename(shopName: string, dateRangeLabel: string): string {
  const safeShop = shopName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)
  const safeRange = dateRangeLabel.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)
  const date = new Date().toISOString().split('T')[0]
  return `${safeShop}_Sales_${safeRange}_${date}.xlsx`
}
