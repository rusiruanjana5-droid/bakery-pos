'use server'

import { PrinterService } from '@/lib/printerService'

/**
 * Server action to print receipt after order creation
 */
export async function printReceiptAfterOrder(orderData: any, orderDetails: any) {
  return PrinterService.printReceipt({
    orderData,
    orderDetails
  })
}

/**
 * Server action to manually trigger cash drawer (admin/manager only)
 */
export async function manualTriggerCashDrawer() {
  return PrinterService.triggerCashDrawer()
}
