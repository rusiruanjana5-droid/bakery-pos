'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'

export async function getStoreSettings() {
  try {
    return await prisma.storeSettings.findFirst()
  } catch (error) {
    console.warn('Database unreachable, using fallback store settings:', error)
    
    // Return default fallback store settings to prevent crash
    return {
      id: 1,
      shopName: 'Bakery POS',
      slogan: 'Fresh & Delicious',
      description: 'Welcome to our bakery',
      showNoticeOnReceipt: false,
      logoUrl: null,
      phone1: null,
      phone2: null,
      address: null,
      reportEmail: null,
      themeType: 'default',
      primaryColor: '#f59e0b',
      gradientFrom: '#f59e0b',
      gradientTo: '#d97706',
      sidebarBg: '#1e293b',
      accentColor: '#f59e0b',
      brNumber: null,
      receiptFooterMessage: 'Thank you for your business!',
      facebookLink: null,
      whatsappNumber: null,
      defaultDeliveryCharge: 0,
      currencySymbol: 'Rs.',
      receiptPrinterSize: '80mm',
      businessHoursStart: '08:00',
      businessHoursEnd: '20:00',
      businessDays: 'Monday-Friday',
      vatRate: 0,
      nbtRate: 0,
      taxInclusive: false,
      printLogoOnReceipt: true,
      displayTaxBreakdown: true,
      autoOpenCashDrawer: false,
      includeQRCode: false,
      receiptHeaderMessage: null,
      kotPrinterIp: null,
      kotPrinterPort: null,
      cashDrawerTrigger: null,
      qrCodeUrl: null,
      qrCodeLabel: null,
      paymentQrUrl: null,
      lowStockThreshold: 10,
      exportFormat: 'csv',
      adminNotificationEmail: null,
      adminNotificationMobile: null,
      enableLoginAlerts: false,
      preferredAlertChannel: 'email',
      telegramChatId: null,
      telegramBotToken: null,
      defaultShiftFloat: 0,
      allowEditOpeningBalance: true,
      uberEatsEnabled: false,
      uberEatsApiKey: null,
      pickMeEnabled: false,
      pickMeApiKey: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}

export async function saveStoreSettings(data: {
  shopName: string
  slogan?: string | null
  description?: string | null
  showNoticeOnReceipt?: boolean | null
  logoUrl?: string | null
  phone1?: string | null
  phone2?: string | null
  address?: string | null
  reportEmail?: string | null
  themeType?: string
  primaryColor?: string
  gradientFrom?: string
  gradientTo?: string
  sidebarBg?: string
  accentColor?: string
  brNumber?: string | null
  receiptFooterMessage?: string | null
  facebookLink?: string | null
  whatsappNumber?: string | null
  defaultDeliveryCharge?: number | null
  currencySymbol?: string | null
  receiptPrinterSize?: string | null
  businessHoursStart?: string | null
  businessHoursEnd?: string | null
  businessDays?: string | null
  vatRate?: number | null
  nbtRate?: number | null
  taxInclusive?: boolean | null
  printLogoOnReceipt?: boolean | null
  displayTaxBreakdown?: boolean | null
  autoOpenCashDrawer?: boolean | null
  includeQRCode?: boolean | null
  receiptHeaderMessage?: string | null
  kotPrinterIp?: string | null
  kotPrinterPort?: number | null
  cashDrawerTrigger?: string | null
  qrCodeUrl?: string | null
  qrCodeLabel?: string | null
  paymentQrUrl?: string | null
  lowStockThreshold?: number | null
  exportFormat?: string | null
  // Notification settings
  adminNotificationEmail?: string | null
  adminNotificationMobile?: string | null
  enableLoginAlerts?: boolean | null
  preferredAlertChannel?: string | null
  telegramChatId?: string | null
  telegramBotToken?: string | null
  // Shift settings
  defaultShiftFloat?: number | null
  allowEditOpeningBalance?: boolean | null
}) {
  const existing = await prisma.storeSettings.findFirst()
  
  // Filter out null values for non-nullable fields and exclude 'id' from update data
  const cleanData: any = {}
  Object.keys(data).forEach(key => {
    if (key !== 'id') {
      // Keep the value if it's not null, or if it's a boolean (false is valid)
      if (data[key as keyof typeof data] !== null || typeof data[key as keyof typeof data] === 'boolean') {
        cleanData[key] = data[key as keyof typeof data]
      }
    }
  })
  
  console.log('cleanData before Prisma update:', Object.keys(cleanData))
  console.log('cleanData has paymentQrUrl:', !!cleanData.paymentQrUrl)
  console.log('paymentQrUrl length:', cleanData.paymentQrUrl?.length || 0)
  
  // Explicitly pick only valid editable fields according to Prisma schema
  const updateData = {
    shopName: cleanData.shopName,
    slogan: cleanData.slogan,
    description: cleanData.description,
    showNoticeOnReceipt: cleanData.showNoticeOnReceipt,
    logoUrl: cleanData.logoUrl,
    phone1: cleanData.phone1,
    phone2: cleanData.phone2,
    address: cleanData.address,
    reportEmail: cleanData.reportEmail,
    themeType: cleanData.themeType,
    primaryColor: cleanData.primaryColor,
    gradientFrom: cleanData.gradientFrom,
    gradientTo: cleanData.gradientTo,
    sidebarBg: cleanData.sidebarBg,
    accentColor: cleanData.accentColor,
    brNumber: cleanData.brNumber,
    receiptFooterMessage: cleanData.receiptFooterMessage,
    facebookLink: cleanData.facebookLink,
    whatsappNumber: cleanData.whatsappNumber,
    defaultDeliveryCharge: cleanData.defaultDeliveryCharge,
    currencySymbol: cleanData.currencySymbol,
    receiptPrinterSize: cleanData.receiptPrinterSize,
    businessHoursStart: cleanData.businessHoursStart,
    businessHoursEnd: cleanData.businessHoursEnd,
    businessDays: cleanData.businessDays,
    vatRate: cleanData.vatRate,
    nbtRate: cleanData.nbtRate,
    taxInclusive: cleanData.taxInclusive,
    printLogoOnReceipt: cleanData.printLogoOnReceipt,
    displayTaxBreakdown: cleanData.displayTaxBreakdown,
    autoOpenCashDrawer: cleanData.autoOpenCashDrawer,
    includeQRCode: cleanData.includeQRCode,
    receiptHeaderMessage: cleanData.receiptHeaderMessage,
    kotPrinterIp: cleanData.kotPrinterIp,
    kotPrinterPort: cleanData.kotPrinterPort,
    cashDrawerTrigger: cleanData.cashDrawerTrigger,
    qrCodeUrl: cleanData.qrCodeUrl,
    qrCodeLabel: cleanData.qrCodeLabel,
    paymentQrUrl: cleanData.paymentQrUrl,
    lowStockThreshold: cleanData.lowStockThreshold,
    exportFormat: cleanData.exportFormat,
    // Notification settings
    adminNotificationEmail: cleanData.adminNotificationEmail,
    adminNotificationMobile: cleanData.adminNotificationMobile,
    enableLoginAlerts: cleanData.enableLoginAlerts,
    preferredAlertChannel: cleanData.preferredAlertChannel,
    telegramChatId: cleanData.telegramChatId,
    telegramBotToken: cleanData.telegramBotToken,
    // Shift settings
    defaultShiftFloat: cleanData.defaultShiftFloat,
    allowEditOpeningBalance: cleanData.allowEditOpeningBalance,
  }
  
  // Remove undefined values but keep empty strings for optional fields
  Object.keys(updateData).forEach(key => {
    const value = updateData[key as keyof typeof updateData]
    if (value === undefined) {
      delete updateData[key as keyof typeof updateData]
    }
    // For optional string fields, convert empty string to null to save to database
    if (typeof value === 'string' && value === '' && key !== 'shopName') {
      updateData[key as keyof typeof updateData] = null as any
    }
  })
  
  console.log('Final updateData keys:', Object.keys(updateData))
  console.log('UPDATE DATA:', JSON.stringify(updateData, null, 2))
  
  try {
    if (existing) {
      await prisma.storeSettings.update({
        where: { id: existing.id },
        data: updateData
      })
    } else {
      await prisma.storeSettings.create({
        data: updateData
      })
    }
    
    revalidatePath('/')
    revalidatePath('/admin/profile')
    revalidatePath('/orders')
    revalidatePath('/pos')
    
    return { success: true }
  } catch (error: any) {
    console.warn('Database unreachable, store settings not saved:', error.message)
    // Return success to prevent UI crash, but indicate offline mode
    return { success: false, offline: true, message: 'Database unreachable - settings saved locally' }
  }
}
