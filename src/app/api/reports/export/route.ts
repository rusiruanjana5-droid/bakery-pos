import { NextResponse } from 'next/server'
import { getOrders } from '@/actions/order'
import { getProducts } from '@/actions/product'
import { getGRNs } from '@/actions/grn'
import { getSuppliers } from '@/actions/supplier'
import { getAllSpecialOffers } from '@/actions/specialOffer'
import { getStoreSettings } from '@/actions/store'
import { getUsers } from '@/actions/user'
import prisma from '@/db'
import { generateSalesReportExcel, buildReportFilename, type ReportOrder, type SalesSummary, type ReportMeta, type CashierPerformance, type SpecialOffer, type WastageRecord, type InventoryItem, type GRNRecord } from '@/lib/excelGenerator'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = (searchParams.get('filter') || 'thisMonth') as 'today' | '7days' | 'thisMonth' | 'thisYear' | 'custom'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const format = (searchParams.get('format') || 'csv') as 'csv' | 'xlsx' | 'pdf'

    const [allOrders, allProducts, allGRNs, allSuppliers, allOffers, storeSettings, allUsers, allShifts] = await Promise.all([
      getOrders(),
      getProducts(),
      getGRNs(),
      getSuppliers(),
      getAllSpecialOffers(),
      getStoreSettings(),
      getUsers(),
      prisma.shift.findMany()
    ])
    const now = new Date()

    // Filter data based on date range
    const filterByDate = (item: any, dateField: string) => {
      const itemDate = new Date(item[dateField] || Date.now())

      if (filter === 'today') {
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        return itemDate >= startOfDay && itemDate <= endOfDay
      } else if (filter === '7days') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return itemDate >= sevenDaysAgo
      } else if (filter === 'thisMonth') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
      } else if (filter === 'thisYear') {
        return itemDate.getFullYear() === now.getFullYear()
      } else if (filter === 'custom' && startDate && endDate) {
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        return itemDate >= start && itemDate <= end
      }
      return true
    }

    let filteredOrders = allOrders.filter((order: any) => filterByDate(order, 'createdAt'))
    let filteredGRNs = allGRNs.filter((grn: any) => filterByDate(grn, 'createdAt'))
    let filteredOffers = allOffers.filter((offer: any) => filterByDate(offer, 'createdAt'))

    // Transform to ReportOrder format
    const reportOrders: ReportOrder[] = filteredOrders.map((order: any) => {
      const customerPhoneData = order.customerPhone ? JSON.parse(order.customerPhone) : {}
      const product = allProducts.find((p: any) => p.id === order.productId)
      return {
        id: order.id,
        quantity: order.quantity,
        subtotal: order.subtotal || null,
        tax: order.tax || null,
        discount: order.discount || null,
        totalPrice: order.totalPrice,
        paymentMethod: order.paymentMethod,
        customerName: order.customerName || null,
        customerPhone: order.customerPhone || null,
        createdAt: order.createdAt || new Date(),
        product: {
          name: order.product?.name || 'Unknown',
          category: order.product?.category || 'Unknown',
          costPrice: product?.costPrice || 0
        },
        orderType: customerPhoneData.orderType || 'takeaway'
      }
    })

    // Calculate COGS and Gross Profit
    let totalCOGS = 0
    filteredOrders.forEach((order: any) => {
      const product = allProducts.find((p: any) => p.id === order.productId)
      if (product) {
        totalCOGS += product.costPrice * order.quantity
      }
    })
    const totalRevenue = reportOrders.reduce((sum, o) => sum + o.totalPrice, 0)
    const grossProfit = totalRevenue - totalCOGS

    // Calculate order type breakdown
    const takeawayOrders = reportOrders.filter(o => (o as any).orderType === 'takeaway')
    const deliveryOrders = reportOrders.filter(o => (o as any).orderType === 'dine-in')
    const takeawayRevenue = takeawayOrders.reduce((sum, o) => sum + o.totalPrice, 0)
    const deliveryRevenue = deliveryOrders.reduce((sum, o) => sum + o.totalPrice, 0)

    // Calculate payment method breakdown
    const cashOrders = reportOrders.filter(o => o.paymentMethod === 'Cash')
    const cardOrders = reportOrders.filter(o => o.paymentMethod === 'Card')
    const onlineOrders = reportOrders.filter(o => o.paymentMethod === 'Online')
    const cashRevenue = cashOrders.reduce((sum, o) => sum + o.totalPrice, 0)
    const cardRevenue = cardOrders.reduce((sum, o) => sum + o.totalPrice, 0)
    const onlineRevenue = onlineOrders.reduce((sum, o) => sum + o.totalPrice, 0)

    // Calculate GRN metrics
    const totalGRNCount = filteredGRNs.length
    const totalGRNCost = filteredGRNs.reduce((sum, grn: any) => sum + (grn.totalAmount || 0), 0)

    // Calculate product metrics
    const productSales = new Map()
    reportOrders.forEach(order => {
      const key = order.product.name
      productSales.set(key, (productSales.get(key) || 0) + order.quantity)
    })
    const topSellingProducts = Array.from(productSales.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, quantity: qty }))

    const lowStockProducts = allProducts.filter((p: any) => p.currentStock <= ((storeSettings as any)?.lowStockThreshold || 5))
    const totalInventoryValue = allProducts.reduce((sum, p: any) => sum + (p.currentStock * p.costPrice), 0)

    // Calculate offer metrics
    const totalDiscounts = reportOrders.reduce((sum, o) => sum + (o.discount || 0), 0)
    const activeOffersCount = allOffers.filter((o: any) => {
      const now = new Date()
      return new Date(o.startDate) <= now && new Date(o.endDate) >= now
    }).length

    // Calculate cashier performance
    const cashierPerformance = new Map()
    filteredOrders.forEach((order: any) => {
      if (order.shiftId) {
        const shift = allShifts.find((s: any) => s.id === order.shiftId)
        if (shift) {
          const userId = shift.userId
          const user = allUsers.find((u: any) => u.id === userId)
          const cashierName = user?.username || `Cashier ${userId}`
          if (!cashierPerformance.has(cashierName)) {
            cashierPerformance.set(cashierName, { orders: 0, revenue: 0 })
          }
          const perf = cashierPerformance.get(cashierName)
          perf.orders += 1
          perf.revenue += order.totalPrice
        }
      }
    })

    // Calculate supplier performance from GRNs
    const supplierPerformance = new Map()
    filteredGRNs.forEach((grn: any) => {
      const supplier = allSuppliers.find((s: any) => s.id === grn.supplierId)
      const supplierName = supplier?.name || `Supplier ${grn.supplierId}`
      if (!supplierPerformance.has(supplierName)) {
        supplierPerformance.set(supplierName, { grnCount: 0, totalValue: 0, paid: 0, pending: 0 })
      }
      const perf = supplierPerformance.get(supplierName)
      perf.grnCount += 1
      perf.totalValue += grn.totalAmount || 0
      if (grn.paymentStatus === 'PAID') {
        perf.paid += grn.totalAmount || 0
      } else {
        perf.pending += grn.totalAmount || 0
      }
    })

    // Calculate summary
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
    const yearStart = new Date(today.getFullYear(), 0, 1)

    const summary: SalesSummary = {
      today: reportOrders
        .filter(o => new Date(o.createdAt).toDateString() === today.toDateString())
        .reduce((sum, o) => sum + o.totalPrice, 0),
      week: reportOrders
        .filter(o => new Date(o.createdAt) >= weekAgo)
        .reduce((sum, o) => sum + o.totalPrice, 0),
      month: reportOrders
        .filter(o => new Date(o.createdAt) >= monthStart)
        .reduce((sum, o) => sum + o.totalPrice, 0),
      year: reportOrders
        .filter(o => new Date(o.createdAt) >= yearStart)
        .reduce((sum, o) => sum + o.totalPrice, 0),
      periodTotal: totalRevenue,
      orderCount: reportOrders.length,
      totalCOGS,
      grossProfit,
      totalWastage: 0, // Would need wastage data from inventory
      takeawayCount: takeawayOrders.length,
      deliveryCount: deliveryOrders.length,
      dineInCount: reportOrders.filter(o => (o as any).orderType === 'dine-in').length,
      takeawayRevenue,
      deliveryRevenue,
      dineInRevenue: reportOrders.filter(o => (o as any).orderType === 'dine-in').reduce((sum, o) => sum + o.totalPrice, 0),
      profitMargin: totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100) : 0,
      averageOrderValue: reportOrders.length > 0 ? (totalRevenue / reportOrders.length) : 0,
      cashRevenue,
      cardRevenue,
      onlineRevenue,
      creditRevenue: 0 // No credit/on-account tracking in current schema
    }

    // Build metadata
    const dateRangeLabel = filter === 'custom' && startDate && endDate
      ? `${startDate} to ${endDate}`
      : filter === 'today'
      ? 'Today'
      : filter === '7days'
      ? 'Last 7 Days'
      : filter === 'thisMonth'
      ? 'This Month'
      : filter === 'thisYear'
      ? 'This Year'
      : 'All Time'

    const meta: ReportMeta = {
      shopName: 'Bakery POS',
      dateRangeLabel,
      generatedAt: now
    }

    // Generate Excel, CSV, or PDF
    if (format === 'csv') {
      const csvContent = await generateSalesReportCSV(reportOrders, summary, meta)
      const filename = `Sales_Report_${filter}_${now.toISOString().split('T')[0]}.csv`
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    } else if (format === 'pdf') {
      const pdfBuffer = await generateSalesReportPDF(
        reportOrders,
        summary,
        meta,
        {
          cashRevenue,
          cardRevenue,
          onlineRevenue,
          totalGRNCount,
          totalGRNCost,
          topSellingProducts,
          lowStockProducts,
          totalInventoryValue,
          totalDiscounts,
          activeOffersCount,
          supplierCount: allSuppliers.length,
          cashierPerformance,
          supplierPerformance,
          wastageData: [] // No wastage model in schema - will show placeholder
        },
        storeSettings
      )
      const filename = `Sales_Report_${filter}_${now.toISOString().split('T')[0]}.pdf`
      return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    } else {
      // Prepare additional data for Excel export
      const cashierPerformanceData = Array.from(cashierPerformance.values()).map((cp: any) => ({
        name: cp.cashierName || 'Unknown',
        shiftDuration: cp.shiftDuration || 'N/A',
        ordersProcessed: cp.ordersProcessed || 0,
        totalSales: cp.totalSales || 0,
        discountsGiven: cp.discountsGiven || 0,
        voidedTransactions: cp.voidedTransactions || 0
      }))

      const specialOffersData = filteredOffers.map((offer: any) => ({
        code: offer.code || 'N/A',
        description: offer.description || 'No description',
        redemptions: offer.redemptions || 0,
        totalDiscount: offer.totalDiscount || 0,
        associatedRevenue: offer.associatedRevenue || 0
      }))

      // Mock wastage data (no wastage model in schema)
      const wastageData: WastageRecord[] = []

      // Prepare inventory data
      const inventoryData = allProducts.map((product: any) => ({
        code: product.code || 'N/A',
        name: product.name,
        category: product.category || 'Uncategorized',
        openingStock: product.quantity || 0,
        stockAdded: 0, // No tracking in current schema
        stockSold: product.quantity || 0,
        currentStock: product.quantity || 0,
        reorderLevel: product.reorderLevel || 10,
        status: (product.quantity || 0) > (product.reorderLevel || 10) ? 'In Stock' : (product.quantity || 0) > 0 ? 'Low Stock' : 'Out of Stock'
      }))

      // Prepare GRN data
      const grnData = filteredGRNs.map((grn: any) => ({
        id: grn.id,
        supplierName: grn.supplier?.name || 'Unknown',
        poNumber: grn.poNumber || 'N/A',
        receivedDate: grn.createdAt || new Date(),
        totalItems: grn.items?.length || 0,
        invoiceValue: grn.totalCost || 0,
        paymentStatus: grn.paymentStatus || 'Pending'
      }))

      const excelBuffer = await generateSalesReportExcel(
        reportOrders,
        summary,
        meta,
        cashierPerformanceData,
        specialOffersData,
        wastageData,
        inventoryData,
        grnData
      )
      const filename = buildReportFilename(meta.shopName, meta.dateRangeLabel)
      return new NextResponse(Buffer.from(excelBuffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    }
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

async function generateSalesReportCSV(
  orders: ReportOrder[],
  summary: SalesSummary,
  meta: ReportMeta
): Promise<string> {
  const headers = [
    'SALES SUMMARY REPORT',
    '',
    `Shop: ${meta.shopName}`,
    `Report Period: ${meta.dateRangeLabel}`,
    `Generated: ${meta.generatedAt.toLocaleString()}`,
    '',
    'SUMMARY METRICS',
    'Total Revenue',
    summary.periodTotal.toFixed(2),
    'Gross Profit',
    summary.grossProfit?.toFixed(2) || '0.00',
    'COGS',
    summary.totalCOGS?.toFixed(2) || '0.00',
    'Total Orders',
    summary.orderCount,
    'Takeaway Orders',
    summary.takeawayCount || 0,
    'Delivery Orders',
    summary.deliveryCount || 0,
    'Takeaway Revenue',
    summary.takeawayRevenue?.toFixed(2) || '0.00',
    'Delivery Revenue',
    summary.deliveryRevenue?.toFixed(2) || '0.00',
    'Daily Wastage',
    summary.totalWastage?.toFixed(2) || '0.00',
    '',
    'ORDER DETAILS',
    'Order ID,Date,Product,Category,Qty,Subtotal,Tax,Discount,Total,Payment Method,Customer,Phone,Order Type'
  ]

  const orderRows = orders.map(order => {
    const orderType = (order as any).orderType || 'takeaway'
    return [
      order.id,
      new Date(order.createdAt).toLocaleString(),
      order.product.name,
      order.product.category,
      order.quantity,
      order.subtotal?.toFixed(2) || '0.00',
      order.tax?.toFixed(2) || '0.00',
      order.discount?.toFixed(2) || '0.00',
      order.totalPrice.toFixed(2),
      order.paymentMethod,
      order.customerName || '—',
      order.customerPhone || '—',
      orderType
    ].join(',')
  })

  const csvContent = [...headers, ...orderRows].join('\n')
  return csvContent
}

interface CrossModuleData {
  cashRevenue: number
  cardRevenue: number
  onlineRevenue: number
  totalGRNCount: number
  totalGRNCost: number
  topSellingProducts: Array<{ name: string; quantity: number }>
  lowStockProducts: any[]
  totalInventoryValue: number
  totalDiscounts: number
  activeOffersCount: number
  supplierCount: number
  cashierPerformance: Map<string, { orders: number; revenue: number }>
  supplierPerformance: Map<string, { grnCount: number; totalValue: number; paid: number; pending: number }>
  wastageData: Array<{ itemName: string; quantity: number; unitCost: number; totalLoss: number }>
}

async function generateSalesReportPDF(
  orders: ReportOrder[],
  summary: SalesSummary,
  meta: ReportMeta,
  crossModuleData: CrossModuleData,
  storeSettings: any
): Promise<Buffer> {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const centerX = pageWidth / 2
  let yPos = 0

  // Dynamic Page Break Helper
  const checkSpaceAndAddPage = (neededSpace: number) => {
    if (yPos + neededSpace > pageHeight - 15) {
      doc.addPage()
      yPos = 20
    }
  }

  // 1. Professional Header with Branding (Centered)
  doc.setFillColor(31, 58, 96) // Navy blue
  doc.rect(0, 0, pageWidth, 45, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text(storeSettings?.shopName || 'Bakery POS', centerX, 18, { align: 'center' })

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Executive Business Report', centerX, 27, { align: 'center' })

  doc.setFontSize(9)
  doc.setTextColor(200, 200, 200)
  doc.text(`Generated: ${meta.generatedAt.toLocaleString()}  |  Period: ${meta.dateRangeLabel}`, centerX, 36, { align: 'center' })

  yPos = 55

  // 2. KPI Summary Cards Section
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('KEY PERFORMANCE INDICATORS', centerX, yPos, { align: 'center' })
  yPos += 10

  const totalWastageLoss = crossModuleData.wastageData.reduce((sum, w) => sum + w.totalLoss, 0)

  const kpiData = [
    { label: 'Total Revenue', value: `Rs. ${summary.periodTotal.toFixed(2)}`, color: [34, 197, 94] as [number, number, number] },
    { label: 'Gross Profit', value: `Rs. ${summary.grossProfit?.toFixed(2) || '0.00'}`, color: [59, 130, 246] as [number, number, number] },
    { label: 'Total Orders', value: summary.orderCount.toString(), color: [168, 85, 247] as [number, number, number] },
    { label: 'Avg Order Value', value: `Rs. ${(summary.periodTotal / Math.max(summary.orderCount, 1)).toFixed(2)}`, color: [249, 115, 22] as [number, number, number] },
    { label: 'COGS', value: `Rs. ${summary.totalCOGS?.toFixed(2) || '0.00'}`, color: [239, 68, 68] as [number, number, number] },
    { label: 'Wastage Loss', value: `Rs. ${totalWastageLoss.toFixed(2)}`, color: [234, 179, 8] as [number, number, number] },
  ]

  const cardWidth = (pageWidth - 50) / 3
  const cardHeight = 30

  kpiData.forEach((kpi, index) => {
    const col = index % 3
    const row = Math.floor(index / 3)
    const x = 20 + col * (cardWidth + 10)
    const y = yPos + row * (cardHeight + 10)

    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2])
    doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(kpi.label, x + cardWidth / 2, y + 10, { align: 'center' })

    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.text(kpi.value, x + cardWidth / 2, y + 22, { align: 'center' })
  })

  yPos += 80

  // Common Table Styles (All Center Aligned)
  const commonTableStyles = {
    theme: 'grid' as const,
    headStyles: { fillColor: [31, 58, 96] as [number, number, number], textColor: [255, 255, 255] as [number, number, number], fontStyle: 'bold' as const, halign: 'center' as const },
    styles: { cellPadding: 8, fontSize: 9, halign: 'center' as const },
  }

  // 3. Payment Method Breakdown Table
  checkSpaceAndAddPage(50)
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('PAYMENT METHOD BREAKDOWN', centerX, yPos, { align: 'center' })
  yPos += 8

  autoTable(doc, {
    ...commonTableStyles,
    startY: yPos,
    head: [['Payment Method', 'Orders', 'Revenue', '% of Total']],
    body: [
      ['Cash', orders.filter(o => o.paymentMethod === 'Cash').length, `Rs. ${crossModuleData.cashRevenue.toFixed(2)}`, `${((crossModuleData.cashRevenue / summary.periodTotal) * 100).toFixed(1)}%`],
      ['Card', orders.filter(o => o.paymentMethod === 'Card').length, `Rs. ${crossModuleData.cardRevenue.toFixed(2)}`, `${((crossModuleData.cardRevenue / summary.periodTotal) * 100).toFixed(1)}%`],
      ['Online', orders.filter(o => o.paymentMethod === 'Online').length, `Rs. ${crossModuleData.onlineRevenue.toFixed(2)}`, `${((crossModuleData.onlineRevenue / summary.periodTotal) * 100).toFixed(1)}%`],
    ],
  })
  yPos = (doc as any).lastAutoTable.finalY + 15

  // 4. Order Type Breakdown Table
  checkSpaceAndAddPage(40)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('ORDER TYPE BREAKDOWN', centerX, yPos, { align: 'center' })
  yPos += 8

  autoTable(doc, {
    ...commonTableStyles,
    startY: yPos,
    head: [['Order Type', 'Orders', 'Revenue', '% of Total']],
    body: [
      ['Takeaway', summary.takeawayCount || 0, `Rs. ${summary.takeawayRevenue?.toFixed(2) || '0.00'}`, `${(((summary.takeawayRevenue || 0) / summary.periodTotal) * 100).toFixed(1)}%`],
      ['Dine-In', summary.deliveryCount || 0, `Rs. ${summary.deliveryRevenue?.toFixed(2) || '0.00'}`, `${(((summary.deliveryRevenue || 0) / summary.periodTotal) * 100).toFixed(1)}%`],
    ],
  })
  yPos = (doc as any).lastAutoTable.finalY + 15

  // 5. Top Selling Products Table
  const topProductsRows = Math.max(crossModuleData.topSellingProducts.length, 1)
  checkSpaceAndAddPage(20 + topProductsRows * 12)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('TOP 5 BEST-SELLING PRODUCTS', centerX, yPos, { align: 'center' })
  yPos += 8

  const topProductsBody = crossModuleData.topSellingProducts.map(p => [
    p.name,
    p.quantity.toString(),
    `Rs. ${(orders.filter(o => o.product.name === p.name).reduce((sum, o) => sum + o.totalPrice, 0)).toFixed(2)}`
  ])

  autoTable(doc, {
    ...commonTableStyles,
    startY: yPos,
    head: [['Product Name', 'Quantity Sold', 'Revenue']],
    body: topProductsBody,
  })
  yPos = (doc as any).lastAutoTable.finalY + 15

  // 6. Inventory & GRN Summary
  checkSpaceAndAddPage(75)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('INVENTORY & SUPPLY CHAIN SUMMARY', centerX, yPos, { align: 'center' })
  yPos += 8

  autoTable(doc, {
    ...commonTableStyles,
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Total Inventory Value', `Rs. ${crossModuleData.totalInventoryValue.toFixed(2)}`],
      ['Low Stock Items', crossModuleData.lowStockProducts.length.toString()],
      ['Total GRN Count', crossModuleData.totalGRNCount.toString()],
      ['Total GRN Cost', `Rs. ${crossModuleData.totalGRNCost.toFixed(2)}`],
      ['Active Suppliers', crossModuleData.supplierCount.toString()],
    ],
  })
  yPos = (doc as any).lastAutoTable.finalY + 15

  // 7. Special Offers Summary
  checkSpaceAndAddPage(45)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('SPECIAL OFFERS SUMMARY', centerX, yPos, { align: 'center' })
  yPos += 8

  autoTable(doc, {
    ...commonTableStyles,
    startY: yPos,
    head: [['Metric', 'Value']],
    body: [
      ['Total Discounts Given', `Rs. ${crossModuleData.totalDiscounts.toFixed(2)}`],
      ['Active Offers', crossModuleData.activeOffersCount.toString()],
    ],
  })
  yPos = (doc as any).lastAutoTable.finalY + 15

  // 8. Cashier Performance Section
  const cashierRows = Math.max(crossModuleData.cashierPerformance.size, 1)
  checkSpaceAndAddPage(20 + cashierRows * 12)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('CASHIER PERFORMANCE SUMMARY', centerX, yPos, { align: 'center' })
  yPos += 8

  const cashierBody = Array.from(crossModuleData.cashierPerformance.entries()).map(([name, perf]) => [
    name,
    perf.orders.toString(),
    `Rs. ${perf.revenue.toFixed(2)}`,
    `${((perf.revenue / summary.periodTotal) * 100).toFixed(1)}%`
  ])

  if (cashierBody.length === 0) {
    cashierBody.push(['No cashier data available', '-', '-', '-'])
  }

  autoTable(doc, {
    ...commonTableStyles,
    startY: yPos,
    head: [['Cashier Name', 'Total Orders', 'Total Sales (Rs.)', '% Contribution']],
    body: cashierBody,
  })
  yPos = (doc as any).lastAutoTable.finalY + 15

  // 9. Daily Wastage Section
  const wastageRows = Math.max(crossModuleData.wastageData.length, 1)
  checkSpaceAndAddPage(20 + wastageRows * 12)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('DAILY WASTAGE & DAMAGE SUMMARY', centerX, yPos, { align: 'center' })
  yPos += 8

  const wastageBody = crossModuleData.wastageData.length > 0
    ? crossModuleData.wastageData.map(w => [
        w.itemName,
        w.quantity.toString(),
        `Rs. ${w.unitCost.toFixed(2)}`,
        `Rs. ${w.totalLoss.toFixed(2)}`
      ])
    : [['No wastage tracking data available', '-', '-', '-']]

  autoTable(doc, {
    ...commonTableStyles,
    startY: yPos,
    head: [['Item Name', 'Quantity Wasted', 'Unit Cost (Rs.)', 'Total Loss (Rs.)']],
    body: wastageBody,
  })
  yPos = (doc as any).lastAutoTable.finalY + 15

  // 10. Supplier Performance Section
  const supplierRows = Math.max(crossModuleData.supplierPerformance.size, 1)
  checkSpaceAndAddPage(20 + supplierRows * 12)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('SUPPLIER PERFORMANCE & GRNs', centerX, yPos, { align: 'center' })
  yPos += 8

  const supplierBody = Array.from(crossModuleData.supplierPerformance.entries()).map(([name, perf]) => [
    name,
    perf.grnCount.toString(),
    `Rs. ${perf.totalValue.toFixed(2)}`,
    perf.paid > 0 ? `Paid: Rs. ${perf.paid.toFixed(2)}` : `Pending: Rs. ${perf.pending.toFixed(2)}`
  ])

  if (supplierBody.length === 0) {
    supplierBody.push(['No supplier data available', '-', '-', '-'])
  }

  autoTable(doc, {
    ...commonTableStyles,
    startY: yPos,
    head: [['Supplier Name', 'Total GRNs', 'Total Goods Value (Rs.)', 'Payment Status']],
    body: supplierBody,
  })
  yPos = (doc as any).lastAutoTable.finalY + 15

  // 11. Detailed Orders Table
  checkSpaceAndAddPage(35)

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('DETAILED ORDER LIST', centerX, yPos, { align: 'center' })
  yPos += 8

  const orderBody = orders.map(order => {
    const orderType = (order as any).orderType || 'takeaway'
    return [
      order.id.toString(),
      new Date(order.createdAt).toLocaleDateString(),
      order.product.name,
      order.quantity.toString(),
      `Rs. ${order.totalPrice.toFixed(2)}`,
      order.paymentMethod,
      orderType,
    ]
  })

  autoTable(doc, {
    ...commonTableStyles,
    startY: yPos,
    head: [['Order ID', 'Date', 'Product', 'Qty', 'Total', 'Payment', 'Type']],
    body: orderBody,
    styles: { cellPadding: 6, fontSize: 8, halign: 'center' },
    pageBreak: 'auto',
  })

  return Buffer.from(doc.output('arraybuffer'))
}
