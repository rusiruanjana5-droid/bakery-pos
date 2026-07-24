'use server'

import prisma from '@/db'
import { revalidatePath } from 'next/cache'

export async function createSpecialOffer(formData: FormData) {
  const name = formData.get('name') as string
  const offerType = formData.get('offerType') as string
  const promoPriceStr = formData.get('promoPrice') as string
  const promoPrice = promoPriceStr ? parseFloat(promoPriceStr) : undefined
  const items = formData.get('items') as string
  const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : undefined
  const endDate = formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined
  const startTime = formData.get('startTime') as string || undefined
  const endTime = formData.get('endTime') as string || undefined
  const activeDays = formData.get('activeDays') as string || '0,1,2,3,4,5,6'
  const minBillAmountStr = formData.get('minBillAmount') as string
  const minBillAmount = minBillAmountStr ? parseFloat(minBillAmountStr) : undefined
  const discountPercentageStr = formData.get('discountPercentage') as string
  const discountPercentage = discountPercentageStr ? parseFloat(discountPercentageStr) : undefined
  // Cart Trigger fields
  const triggerType = formData.get('triggerType') as string || undefined
  const triggerCategories = formData.get('triggerCategories') as string || undefined
  const triggerProducts = formData.get('triggerProducts') as string || undefined
  const triggerMinAmountStr = formData.get('triggerMinAmount') as string
  const triggerMinAmount = triggerMinAmountStr ? parseFloat(triggerMinAmountStr) : undefined
  const rewardItems = formData.get('rewardItems') as string || undefined

  const data: any = {
    name,
    offerType: offerType as any,
    items,
    isActive: true,
    activeDays,
    triggerType: triggerType as any,
  }

  if (promoPrice !== undefined) data.promoPrice = promoPrice
  if (startDate !== undefined) data.startDate = startDate
  if (endDate !== undefined) data.endDate = endDate
  if (startTime !== undefined) data.startTime = startTime
  if (endTime !== undefined) data.endTime = endTime
  if (minBillAmount !== undefined) data.minBillAmount = minBillAmount
  if (discountPercentage !== undefined) data.discountPercentage = discountPercentage
  if (triggerCategories !== undefined) data.triggerCategories = triggerCategories
  if (triggerProducts !== undefined) data.triggerProducts = triggerProducts
  if (triggerMinAmount !== undefined) data.triggerMinAmount = triggerMinAmount
  if (rewardItems !== undefined) data.rewardItems = rewardItems

  await prisma.specialOffer.create({ data })
  revalidatePath('/admin/special-offers')
  revalidatePath('/pos')
}

export async function updateSpecialOffer(formData: FormData) {
  const id = parseInt(formData.get('id') as string)
  const name = formData.get('name') as string
  const offerType = formData.get('offerType') as string
  const promoPriceStr = formData.get('promoPrice') as string
  const promoPrice = promoPriceStr ? parseFloat(promoPriceStr) : undefined
  const items = formData.get('items') as string
  const isActive = formData.get('isActive') === 'true'
  const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : undefined
  const endDate = formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined
  const startTime = formData.get('startTime') as string || undefined
  const endTime = formData.get('endTime') as string || undefined
  const activeDays = formData.get('activeDays') as string || '0,1,2,3,4,5,6'
  const minBillAmountStr = formData.get('minBillAmount') as string
  const minBillAmount = minBillAmountStr ? parseFloat(minBillAmountStr) : undefined
  const discountPercentageStr = formData.get('discountPercentage') as string
  const discountPercentage = discountPercentageStr ? parseFloat(discountPercentageStr) : undefined
  // Cart Trigger fields
  const triggerType = formData.get('triggerType') as string || undefined
  const triggerCategories = formData.get('triggerCategories') as string || undefined
  const triggerProducts = formData.get('triggerProducts') as string || undefined
  const triggerMinAmountStr = formData.get('triggerMinAmount') as string
  const triggerMinAmount = triggerMinAmountStr ? parseFloat(triggerMinAmountStr) : undefined
  const rewardItems = formData.get('rewardItems') as string || undefined

  const data: any = {
    name,
    offerType: offerType as any,
    items,
    isActive,
    activeDays,
    triggerType: triggerType as any,
  }

  if (promoPrice !== undefined) data.promoPrice = promoPrice
  if (startDate !== undefined) data.startDate = startDate
  if (endDate !== undefined) data.endDate = endDate
  if (startTime !== undefined) data.startTime = startTime
  if (endTime !== undefined) data.endTime = endTime
  if (minBillAmount !== undefined) data.minBillAmount = minBillAmount
  if (discountPercentage !== undefined) data.discountPercentage = discountPercentage
  if (triggerCategories !== undefined) data.triggerCategories = triggerCategories
  if (triggerProducts !== undefined) data.triggerProducts = triggerProducts
  if (triggerMinAmount !== undefined) data.triggerMinAmount = triggerMinAmount
  if (rewardItems !== undefined) data.rewardItems = rewardItems

  await prisma.specialOffer.update({
    where: { id },
    data
  })
  revalidatePath('/admin/special-offers')
  revalidatePath('/pos')
}

export async function toggleSpecialOfferStatus(id: number, isActive: boolean) {
  await prisma.specialOffer.update({
    where: { id },
    data: { isActive }
  })
  revalidatePath('/admin/special-offers')
  revalidatePath('/pos')
  return { success: true }
}

export async function deleteSpecialOffer(id: number) {
  try {
    await prisma.specialOffer.delete({
      where: { id }
    })
    revalidatePath('/admin/special-offers')
    revalidatePath('/pos')
    return { success: true }
  } catch (error: any) {
    return {
      success: false,
      error: 'Failed to delete special offer. Please try again.'
    }
  }
}

function isOfferValid(offer: any): boolean {
  const now = new Date()
  
  // Check if offer is active
  if (!offer.isActive) return false
  
  // Check date range
  if (offer.startDate && new Date(offer.startDate) > now) return false
  if (offer.endDate && new Date(offer.endDate) < now) return false
  
  // Check time window
  if (offer.startTime && offer.endTime) {
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [startHour, startMin] = offer.startTime.split(':').map(Number)
    const [endHour, endMin] = offer.endTime.split(':').map(Number)
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin
    
    if (currentTime < startTime || currentTime > endTime) return false
  }
  
  // Check active days
  if (offer.activeDays) {
    const currentDay = now.getDay()
    const activeDaysArray = offer.activeDays.split(',').map(Number)
    if (!activeDaysArray.includes(currentDay)) return false
  }
  
  return true
}

export async function getSpecialOffers() {
  const allOffers = await prisma.specialOffer.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  // Filter offers that are currently valid
  return allOffers.filter(isOfferValid)
}

export async function getAllSpecialOffers() {
  return prisma.specialOffer.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function checkOfferEligibility(cartItems: Array<{ productId: number; quantity: number }>) {
  const allOffers = await prisma.specialOffer.findMany({
    where: {
      isActive: true,
      offerType: 'CART_TRIGGER'
    }
  })

  const eligibleOffers = []

  for (const offer of allOffers) {
    // Check if offer is currently valid (time/date)
    if (!isOfferValid(offer)) continue

    let isEligible = false

    switch (offer.triggerType) {
      case 'ALL_PRODUCTS':
        isEligible = cartItems.length > 0
        break

      case 'MIN_BILL_AMOUNT':
        // This would require product prices - for now, assume eligible if cart has items
        // In production, you'd calculate actual cart total
        isEligible = cartItems.length > 0
        break

      case 'SELECTED_PRODUCTS':
        try {
          const triggerProductIds = JSON.parse(offer.triggerProducts || '[]')
          const cartProductIds = cartItems.map(item => item.productId)
          // Check if any trigger product is in cart
          isEligible = triggerProductIds.some((id: number) => cartProductIds.includes(id))
        } catch {
          isEligible = false
        }
        break

      case 'SELECTED_CATEGORY':
        // Would require category data - for now, assume not implemented
        isEligible = false
        break

      default:
        isEligible = false
    }

    if (isEligible) {
      eligibleOffers.push({
        id: offer.id,
        name: offer.name,
        triggerType: offer.triggerType,
        rewardItems: offer.rewardItems
      })
    }
  }

  return eligibleOffers
}
