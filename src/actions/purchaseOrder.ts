'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'
import { POStatus } from '@prisma/client'

/**
 * Get all purchase orders
 */
export async function getPurchaseOrders() {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        orderDate: 'desc'
      }
    })
    return { success: true, purchaseOrders }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get purchase order by ID
 */
export async function getPurchaseOrderById(id: number) {
  try {
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })
    return { success: true, purchaseOrder }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get purchase orders by supplier
 */
export async function getPurchaseOrdersBySupplier(supplierId: number) {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: { 
        supplierId,
        status: {
          in: [POStatus.DRAFT, POStatus.PENDING_APPROVAL, POStatus.ORDERED, POStatus.PARTIALLY_RECEIVED]
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        orderDate: 'desc'
      }
    })
    return { success: true, purchaseOrders }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Get purchase orders by supplier (client-side friendly)
 */
export async function getActivePurchaseOrdersBySupplier(supplierId: number) {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: { 
        supplierId,
        status: {
          in: [POStatus.DRAFT, POStatus.PENDING_APPROVAL, POStatus.ORDERED, POStatus.PARTIALLY_RECEIVED]
        }
      },
      select: {
        id: true,
        poNumber: true,
        orderDate: true,
        expectedDate: true,
        status: true,
        totalAmount: true,
        items: {
          select: {
            id: true,
            productId: true,
            quantity: true,
            receivedQuantity: true,
            unitCost: true,
            product: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        orderDate: 'desc'
      }
    })
    return { success: true, purchaseOrders }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Create a new purchase order
 */
export async function createPurchaseOrder(formData: FormData) {
  try {
    const supplierId = parseInt(formData.get('supplierId') as string)
    const expectedDate = formData.get('expectedDate') as string
    const notes = formData.get('notes') as string
    const itemsJson = formData.get('items') as string
    
    if (!supplierId) {
      return { success: false, error: 'Supplier is required' }
    }

    const items = JSON.parse(itemsJson)
    
    if (!items || items.length === 0) {
      return { success: false, error: 'At least one item is required' }
    }

    // Generate PO number
    const poNumber = `PO-${Date.now()}`

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitCost)
    }, 0)

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        status: POStatus.DRAFT,
        totalAmount,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitCost: item.unitCost,
            totalAmount: item.quantity * item.unitCost
          }))
        }
      },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    revalidatePath('/purchase-orders')
    revalidatePath('/grn')
    return { success: true, purchaseOrder }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Update purchase order
 */
export async function updatePurchaseOrder(formData: FormData) {
  try {
    const id = parseInt(formData.get('id') as string)
    const supplierId = parseInt(formData.get('supplierId') as string)
    const expectedDate = formData.get('expectedDate') as string
    const status = formData.get('status') as POStatus
    const notes = formData.get('notes') as string
    const itemsJson = formData.get('items') as string

    if (!id) {
      return { success: false, error: 'Purchase Order ID is required' }
    }

    const items = itemsJson ? JSON.parse(itemsJson) : null

    // Calculate total amount if items provided
    let totalAmount
    if (items && items.length > 0) {
      totalAmount = items.reduce((sum: number, item: any) => {
        return sum + (item.quantity * item.unitCost)
      }, 0)
    }

    // Update purchase order
    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: {
        supplierId,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        status,
        notes,
        totalAmount,
        // Update items if provided
        ...(items && {
          items: {
            deleteMany: {},
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitCost: item.unitCost,
              totalAmount: item.quantity * item.unitCost
            }))
          }
        })
      },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    revalidatePath('/purchase-orders')
    revalidatePath('/grn')
    return { success: true, purchaseOrder }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Update purchase order status
 */
export async function updatePurchaseOrderStatus(id: number, status: POStatus) {
  try {
    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { id },
      data: { status },
      include: {
        supplier: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    revalidatePath('/purchase-orders')
    revalidatePath('/grn')
    return { success: true, purchaseOrder }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Delete purchase order
 */
export async function deletePurchaseOrder(id: number) {
  try {
    await prisma.purchaseOrder.delete({
      where: { id }
    })

    revalidatePath('/purchase-orders')
    revalidatePath('/grn')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Update PO status based on received quantities (called from GRN)
 */
export async function updatePOStatusFromGRN(poNumber: string) {
  try {
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { poNumber },
      include: {
        items: true
      }
    })

    if (!purchaseOrder) {
      return { success: false, error: 'Purchase Order not found' }
    }

    // Check if all items are fully received
    let allFullyReceived = true
    let anyPartiallyReceived = false

    for (const item of purchaseOrder.items) {
      if (item.receivedQuantity < item.quantity) {
        allFullyReceived = false
      }
      if (item.receivedQuantity > 0 && item.receivedQuantity < item.quantity) {
        anyPartiallyReceived = true
      }
    }

    // Update status based on received quantities
    let newStatus = purchaseOrder.status
    if (allFullyReceived) {
      newStatus = POStatus.COMPLETED
    } else if (anyPartiallyReceived) {
      newStatus = POStatus.PARTIALLY_RECEIVED
    }

    if (newStatus !== purchaseOrder.status) {
      await prisma.purchaseOrder.update({
        where: { id: purchaseOrder.id },
        data: { status: newStatus }
      })
    }

    revalidatePath('/purchase-orders')
    return { success: true, status: newStatus }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
