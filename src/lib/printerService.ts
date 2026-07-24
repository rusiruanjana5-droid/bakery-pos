import { getStoreSettings } from '@/actions/store'

interface StoreSettings {
  id?: number
  shopName: string
  slogan?: string | null
  description?: string | null
  logoUrl?: string | null
  phone1?: string | null
  phone2?: string | null
  address?: string | null
  reportEmail?: string | null
  themeType?: string | null
  primaryColor?: string | null
  gradientFrom?: string | null
  gradientTo?: string | null
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
}

interface PrintReceiptOptions {
  orderData: {
    items: Array<{ 
      productId: number
      quantity: number
      note?: string
      productName?: string
      unitPrice?: number
      subtotal?: number
    }>
    totalAmount: number
    paymentMethod: string
    orderType: string
    discount?: number
    discountType?: 'percentage' | 'flat'
    subtotal: number
    orderNote?: string
    extraCharges?: Array<{ label: string; amount: number }>
    cashGiven?: number
    cashChange?: number
    cashierName?: string
  }
  orderDetails: {
    id: string
    createdAt: Date
  }
}

/**
 * ESC/POS Print Service
 * Handles receipt printing and cash drawer triggering for thermal printers
 */
export class PrinterService {
  /**
   * Generate ESC/POS commands for cash drawer trigger
   * Uses standard ESC/POS command: ESC p m t1 t2
   * ESC = 0x1B, p = 0x70, m = 0x00 (pulse), t1 = 0x19 (25 * 2ms = 50ms), t2 = 0xFA (250 * 2ms = 500ms)
   */
  private static getCashDrawerCommand(): Buffer {
    return Buffer.from([0x1B, 0x70, 0x00, 0x19, 0xFA])
  }

  /**
   * Generate ESC/POS receipt buffer
   * Professional 80mm thermal receipt format
   */
  private static async generateReceiptBuffer(
    options: PrintReceiptOptions,
    storeSettings: any
  ): Promise<Buffer> {
    const { orderData, orderDetails } = options
    const currencySymbol = storeSettings.currencySymbol || 'Rs.'
    
    // Format date/time
    const orderDate = new Date(orderDetails.createdAt)
    const formattedDate = orderDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    const formattedTime = orderDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    // Build receipt content as text (simplified - in production use proper ESC/POS library)
    let receipt = '\n'
    
    // ========================================
    // HEADER SECTION
    // ========================================
    if (storeSettings.printLogoOnReceipt && storeSettings.logoUrl) {
      receipt += '[LOGO CENTERED]\n'
    }
    
    // Store Name (Uppercase / Bold)
    receipt += `${storeSettings.shopName.toUpperCase()}\n`
    
    // Address & Phone (small font)
    if (storeSettings.address) {
      receipt += `${storeSettings.address}\n`
    }
    if (storeSettings.phone1) {
      receipt += `Tel: ${storeSettings.phone1}`
      if (storeSettings.phone2) {
        receipt += ` / ${storeSettings.phone2}`
      }
      receipt += '\n'
    }
    if (storeSettings.brNumber) {
      receipt += `BR/Tax No: ${storeSettings.brNumber}\n`
    }
    
    receipt += '\n'
    receipt += '================================\n'
    
    // ========================================
    // ORDER DETAILS SECTION
    // ========================================
    receipt += `ORDER #: ORD-${String(orderDetails.id).padStart(4, '0')}\n`
    receipt += `Date: ${formattedDate}, ${formattedTime}\n`
    receipt += `Type: ${orderData.orderType.toUpperCase()}\n`
    if (orderData.cashierName) {
      receipt += `Served by: ${orderData.cashierName}\n`
    }
    
    receipt += '================================\n'
    
    // ========================================
    // ITEMS SECTION (Clear Unit Pricing)
    // ========================================
    receipt += 'ITEM                     QTY   AMOUNT\n'
    receipt += '----------------------------------------\n'
    
    orderData.items.forEach(item => {
      const name = item.productName || `Product #${item.productId}`
      const qty = item.quantity
      const unitPrice = item.unitPrice || 0
      const subtotal = item.subtotal || (qty * unitPrice)
      
      // Item name on first line
      receipt += `${name}\n`
      // Quantity x Unit Price = Subtotal (right-aligned)
      receipt += `  ${qty} x ${currencySymbol}${unitPrice.toFixed(2)}${' '.repeat(20 - String(qty).length - String(unitPrice.toFixed(2)).length)}${currencySymbol}${subtotal.toFixed(2)}\n`
      
      if (item.note) {
        receipt += `    Note: ${item.note}\n`
      }
    })
    
    receipt += '================================\n'
    
    // ========================================
    // PRICE BREAKDOWN SECTION
    // ========================================
    receipt += `SUBTOTAL:                ${currencySymbol}${orderData.subtotal.toFixed(2)}\n`
    
    // Tax breakdown if enabled
    if (storeSettings.displayTaxBreakdown) {
      if (storeSettings.vatRate && storeSettings.vatRate > 0) {
        const vatAmount = orderData.subtotal * (storeSettings.vatRate / 100)
        receipt += `VAT (${storeSettings.vatRate}%):           ${currencySymbol}${vatAmount.toFixed(2)}\n`
      }
      if (storeSettings.nbtRate && storeSettings.nbtRate > 0) {
        const nbtAmount = orderData.subtotal * (storeSettings.nbtRate / 100)
        receipt += `NBT (${storeSettings.nbtRate}%):           ${currencySymbol}${nbtAmount.toFixed(2)}\n`
      }
    }
    
    // Discount
    if (orderData.discount && orderData.discount > 0) {
      const discountLabel = orderData.discountType === 'percentage' 
        ? `${orderData.discount}%` 
        : 'Flat'
      receipt += `DISCOUNT (${discountLabel}):    -${currencySymbol}${orderData.discount.toFixed(2)}\n`
    }
    
    // Extra charges (delivery, etc.)
    if (orderData.extraCharges && orderData.extraCharges.length > 0) {
      orderData.extraCharges.forEach(charge => {
        receipt += `${charge.label.toUpperCase()}:${' '.repeat(24 - charge.label.length)}${currencySymbol}${charge.amount.toFixed(2)}\n`
      })
    }
    
    receipt += '================================\n'
    
    // ========================================
    // TOTAL (Bold/Large)
    // ========================================
    receipt += `TOTAL:                   ${currencySymbol}${orderData.totalAmount.toFixed(2)}\n`
    receipt += '================================\n'
    
    // ========================================
    // PAYMENT & CASH CHANGE DETAILS
    // ========================================
    receipt += `PAYMENT METHOD: ${orderData.paymentMethod.toUpperCase()}\n`
    
    if (orderData.paymentMethod.toUpperCase() === 'CASH') {
      if (orderData.cashGiven !== undefined) {
        receipt += `CASH GIVEN:              ${currencySymbol}${orderData.cashGiven.toFixed(2)}\n`
      }
      if (orderData.cashChange !== undefined) {
        receipt += `CHANGE:                  ${currencySymbol}${orderData.cashChange.toFixed(2)}\n`
      }
    }
    
    receipt += '================================\n'
    
    // ========================================
    // FOOTER SECTION
    // ========================================
    if (storeSettings.receiptHeaderMessage) {
      receipt += `${storeSettings.receiptHeaderMessage}\n`
    }
    
    if (orderData.orderNote) {
      receipt += `Order Note: ${orderData.orderNote}\n`
    }
    
    receipt += '\n'
    
    // QR Code if enabled
    if (storeSettings.includeQRCode && storeSettings.qrCodeUrl) {
      receipt += '[QR CODE CENTERED]\n'
      if (storeSettings.qrCodeLabel) {
        receipt += `${storeSettings.qrCodeLabel}\n`
      }
    }
    
    // Barcode (simulated - in production use proper barcode generation)
    receipt += '[BARCODE: ORD-' + String(orderDetails.id).padStart(4, '0') + ']\n'
    
    if (storeSettings.receiptFooterMessage) {
      receipt += '\n'
      receipt += `${storeSettings.receiptFooterMessage}\n`
    }
    
    receipt += '\n'
    receipt += 'Thank you for your purchase!\n'
    receipt += '\n\n\n'
    
    return Buffer.from(receipt, 'utf-8')
  }

  /**
   * Print receipt with optional cash drawer trigger
   * Only triggers cash drawer if:
   * 1. Payment method is CASH
   * 2. Auto open cash drawer is enabled in store settings
   */
  static async printReceipt(options: PrintReceiptOptions): Promise<{ success: boolean; message: string }> {
    try {
      // Get store settings
      const settings = await getStoreSettings()
      const storeSettings = settings as StoreSettings | null
      
      if (!storeSettings) {
        return { success: false, message: 'Store settings not found' }
      }

      // Generate receipt buffer
      const receiptBuffer = await this.generateReceiptBuffer(options, storeSettings)
      
      // In a real implementation, you would:
      // 1. Connect to the printer via network (IP/port) or USB
      // 2. Send the receipt buffer to the printer
      // 3. If payment is CASH and autoOpenCashDrawer is enabled, append drawer command
      
      // For now, we'll simulate the printer connection
      console.log('Printing receipt for order:', options.orderDetails.id)
      console.log('Payment method:', options.orderData.paymentMethod)
      console.log('Auto open cash drawer:', storeSettings.autoOpenCashDrawer)
      
      // Check if we should trigger cash drawer
      const shouldTriggerDrawer = 
        options.orderData.paymentMethod.toUpperCase() === 'CASH' &&
        storeSettings.autoOpenCashDrawer === true
      
      if (shouldTriggerDrawer) {
        const drawerCommand = this.getCashDrawerCommand()
        console.log('Triggering cash drawer with command:', drawerCommand.toString('hex'))
        
        // In production, you would send this to the printer
        // printer.write(receiptBuffer)
        // printer.write(drawerCommand)
      }
      
      return {
        success: true,
        message: shouldTriggerDrawer
          ? 'Receipt printed and cash drawer opened'
          : 'Receipt printed'
      }
    } catch (error: any) {
      console.error('Print error:', error)
      return { success: false, message: error.message || 'Failed to print receipt' }
    }
  }

  /**
   * Manually trigger cash drawer (admin/manager only)
   */
  static async triggerCashDrawer(): Promise<{ success: boolean; message: string }> {
    try {
      const drawerCommand = this.getCashDrawerCommand()
      console.log('Manually triggering cash drawer with command:', drawerCommand.toString('hex'))

      // In production, you would send this to the printer
      // printer.write(drawerCommand)

      return { success: true, message: 'Cash drawer triggered' }
    } catch (error: any) {
      console.error('Cash drawer trigger error:', error)
      return { success: false, message: error.message || 'Failed to trigger cash drawer' }
    }
  }
}

/**
 * Server action to print receipt after order creation
 * NOTE: This function is now exported from ./src/app/actions/printerActions.ts
 * This file contains only the PrinterService class and utilities
 */
// export async function printReceiptAfterOrder(orderData: any, orderDetails: any) {
//   'use server'
//   return PrinterService.printReceipt({
//     orderData,
//     orderDetails
//   })
// }

/**
 * Server action to manually trigger cash drawer (admin/manager only)
 * NOTE: This function is now exported from ./src/app/actions/printerActions.ts
 * This file contains only the PrinterService class and utilities
 */
// export async function manualTriggerCashDrawer() {
//   'use server'
//   return PrinterService.triggerCashDrawer()
// }
