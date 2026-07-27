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
  // Buy X Get Y fields
  const appliesToScope = formData.get('appliesToScope') as string || undefined
  const minQtyStr = formData.get('minQty') as string
  const minQty = minQtyStr ? parseInt(minQtyStr) : 2
  const minSpendStr = formData.get('minSpend') as string
  const minSpend = minSpendStr ? parseFloat(minSpendStr) : undefined
  const rewardProductIdStr = formData.get('rewardProductId') as string
  const rewardProductId = rewardProductIdStr ? parseInt(rewardProductIdStr) : undefined
  const rewardQtyStr = formData.get('rewardQty') as string
  const rewardQty = rewardQtyStr ? parseInt(rewardQtyStr) : 1
  const rewardDiscountPercentStr = formData.get('rewardDiscountPercent') as string
  const rewardDiscountPercent = rewardDiscountPercentStr ? parseFloat(rewardDiscountPercentStr) : 100.0
  // Cart Threshold fields
  const minCartAmountStr = formData.get('minCartAmount') as string
  const minCartAmount = minCartAmountStr ? parseFloat(minCartAmountStr) : undefined
  const rewardType = formData.get('rewardType') as string || undefined

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
  if (appliesToScope !== undefined) data.appliesToScope = appliesToScope as any
  if (minQty !== undefined) data.minQty = minQty
  if (minSpend !== undefined) data.minSpend = minSpend
  if (rewardProductId !== undefined) data.rewardProductId = rewardProductId
  if (rewardQty !== undefined) data.rewardQty = rewardQty
  if (rewardDiscountPercent !== undefined) data.rewardDiscountPercent = rewardDiscountPercent
  if (minCartAmount !== undefined) data.minCartAmount = minCartAmount
  if (rewardType !== undefined) data.rewardType = rewardType

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
  // Buy X Get Y fields
  const appliesToScope = formData.get('appliesToScope') as string || undefined
  const minQtyStr = formData.get('minQty') as string
  const minQty = minQtyStr ? parseInt(minQtyStr) : 2
  const minSpendStr = formData.get('minSpend') as string
  const minSpend = minSpendStr ? parseFloat(minSpendStr) : undefined
  const rewardProductIdStr = formData.get('rewardProductId') as string
  const rewardProductId = rewardProductIdStr ? parseInt(rewardProductIdStr) : undefined
  const rewardQtyStr = formData.get('rewardQty') as string
  const rewardQty = rewardQtyStr ? parseInt(rewardQtyStr) : 1
  const rewardDiscountPercentStr = formData.get('rewardDiscountPercent') as string
  const rewardDiscountPercent = rewardDiscountPercentStr ? parseFloat(rewardDiscountPercentStr) : 100.0
  // Cart Threshold fields
  const minCartAmountStr = formData.get('minCartAmount') as string
  const minCartAmount = minCartAmountStr ? parseFloat(minCartAmountStr) : undefined
  const rewardType = formData.get('rewardType') as string || undefined

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
  if (appliesToScope !== undefined) data.appliesToScope = appliesToScope as any
  if (minQty !== undefined) data.minQty = minQty
  if (minSpend !== undefined) data.minSpend = minSpend
  if (rewardProductId !== undefined) data.rewardProductId = rewardProductId
  if (rewardQty !== undefined) data.rewardQty = rewardQty
  if (rewardDiscountPercent !== undefined) data.rewardDiscountPercent = rewardDiscountPercent
  if (minCartAmount !== undefined) data.minCartAmount = minCartAmount
  if (rewardType !== undefined) data.rewardType = rewardType

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
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  // Check if offer is active
  if (!offer.isActive) return false
  
  // Check date range
  if (offer.startDate) {
    const startDate = new Date(offer.startDate)
    const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
    // If start date is in the future, it's not valid
    if (startDateOnly > today) return false
  }
  
  if (offer.endDate) {
    const endDate = new Date(offer.endDate)
    const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
    // If end date is in the past, it's not valid
    if (endDateOnly < today) return false
  }
  
  // Check time window - only if both start and end time are provided
  if (offer.startTime && offer.endTime) {
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [startHour, startMin] = offer.startTime.split(':').map(Number)
    const [endHour, endMin] = offer.endTime.split(':').map(Number)
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin
    
    if (currentTime < startTime || currentTime > endTime) return false
  }
  
  // Check active days - only if activeDays is provided
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
  console.log('[DEBUG] checkOfferEligibility called with cartItems:', cartItems)
  const allOffers = await prisma.specialOffer.findMany({
    where: {
      isActive: true
    }
  })
  console.log('[DEBUG] Active offers from DB:', allOffers)

  const eligibleOffers = []

  for (const offer of allOffers) {
    console.log('[DEBUG] Checking offer:', offer.name, 'Type:', offer.offerType)
    // Check if offer is currently valid (time/date)
    const isValid = isOfferValid(offer)
    console.log('[DEBUG] Offer isOfferValid:', isValid)
    if (!isValid) continue

    let isEligible = false

    if (offer.offerType === 'BUY_X_GET_Y' || offer.offerType === 'BOGO') {
      console.log('[DEBUG] Processing BUY_X_GET_Y/BOGO offer')
      // Handle Buy X Get Y offers
      let qualifyingQty = 0
      let qualifyingSpend = 0
      let rewardProductId = offer.rewardProductId
      let minQty = offer.minQty

      // Check if this is a combo-style BOGO offer (uses items field instead of triggerProducts/rewardProductId)
      if (offer.items && !offer.triggerProducts && !rewardProductId) {
        try {
          const comboItems = JSON.parse(offer.items)
          console.log('[DEBUG] Combo-style BOGO offer detected, items:', comboItems)
          
          // Find the trigger product (non-free item) and reward product (free item)
          const triggerItem = comboItems.find((item: any) => !item.isFree)
          const rewardItem = comboItems.find((item: any) => item.isFree)
          
          if (triggerItem) {
            // Use the trigger product's quantity as minQty
            minQty = triggerItem.quantity || 1
            // Use SPECIFIC_ITEMS scope with the trigger product ID
            const scope = 'SPECIFIC_ITEMS'
            const triggerProductIds = [triggerItem.productId]
            console.log('[DEBUG] Combo-style - using trigger product:', triggerItem.productId, 'minQty:', minQty)
            
            qualifyingQty = cartItems
              .filter(item => triggerProductIds.includes(item.productId))
              .reduce((sum, item) => sum + item.quantity, 0)
            console.log('[DEBUG] SPECIFIC_ITEMS scope - qualifyingQty:', qualifyingQty)
            
            if (rewardItem) {
              rewardProductId = rewardItem.productId
              console.log('[DEBUG] Combo-style - reward product:', rewardProductId)
            }
          } else {
            console.log('[DEBUG] No trigger item found in combo items')
            qualifyingQty = 0
          }
        } catch (e) {
          console.error('[DEBUG] Error parsing combo items:', e)
          qualifyingQty = 0
        }
      } else {
        // Standard BUY_X_GET_Y/BOGO offer with triggerProducts and rewardProductId
        // Fallback: if scope is null, try to use trigger products
        const scope = offer.appliesToScope || (offer.triggerProducts ? 'SPECIFIC_ITEMS' : 'ALL_ITEMS')
        console.log('[DEBUG] Using scope:', scope, '(original:', offer.appliesToScope, ')')

        switch (scope) {
          case 'ALL_ITEMS':
            qualifyingQty = cartItems.reduce((sum, item) => sum + item.quantity, 0)
            // Would need product prices for spend calculation
            qualifyingSpend = 0 // Placeholder - would need price data
            console.log('[DEBUG] ALL_ITEMS scope - qualifyingQty:', qualifyingQty)
            break

          case 'SPECIFIC_ITEMS':
            try {
              const triggerProductIds = JSON.parse(offer.triggerProducts || '[]')
              console.log('[DEBUG] SPECIFIC_ITEMS scope - triggerProductIds:', triggerProductIds)
              qualifyingQty = cartItems
                .filter(item => triggerProductIds.includes(item.productId))
                .reduce((sum, item) => sum + item.quantity, 0)
              console.log('[DEBUG] SPECIFIC_ITEMS scope - qualifyingQty:', qualifyingQty)
            } catch (e) {
              console.error('[DEBUG] Error parsing triggerProducts:', e)
              qualifyingQty = 0
            }
            break

          case 'CATEGORY':
            // Would need category data - for now, assume not implemented
            qualifyingQty = 0
            console.log('[DEBUG] CATEGORY scope - not implemented')
            break

          default:
            qualifyingQty = 0
            console.log('[DEBUG] Unknown scope:', scope)
        }
      }

      // Use the determined minQty, default to 1 for BOGO if not set
      minQty = minQty || (offer.offerType === 'BOGO' ? 1 : 2)
      const minSpend = offer.minSpend || 0
      console.log('[DEBUG] Thresholds - minQty:', minQty, 'minSpend:', minSpend)
      console.log('[DEBUG] Eligibility check - qualifyingQty >= minQty:', qualifyingQty, '>=', minQty, '=', qualifyingQty >= minQty)
      console.log('[DEBUG] Eligibility check - qualifyingSpend >= minSpend:', qualifyingSpend, '>=', minSpend, '=', qualifyingSpend >= minSpend)

      isEligible = qualifyingQty >= minQty && qualifyingSpend >= minSpend
      console.log('[DEBUG] Final isEligible:', isEligible)

      if (isEligible) {
        eligibleOffers.push({
          id: offer.id,
          name: offer.name,
          offerType: offer.offerType, // Preserve original offer type (BUY_X_GET_Y or BOGO)
          rewardProductId: rewardProductId || offer.rewardProductId, // Use extracted rewardProductId from combo items
          rewardQty: offer.rewardQty,
          rewardDiscountPercent: offer.rewardDiscountPercent,
          appliesToScope: offer.appliesToScope,
          minQty: minQty // Use the determined minQty (from combo items or offer)
        })
        console.log('[DEBUG] Added to eligibleOffers:', offer.name, 'Type:', offer.offerType, 'rewardProductId:', rewardProductId)
      }
    } else if (offer.offerType === 'CART_TRIGGER') {
      // Handle legacy CART_TRIGGER offers
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
  }

  return eligibleOffers
}

export async function checkCartThresholdOffers(cartSubtotal: number) {
  const allOffers = await prisma.specialOffer.findMany({
    where: {
      isActive: true,
      offerType: 'CART_THRESHOLD'
    }
  })

  const eligibleOffers = []

  for (const offer of allOffers) {
    // Check if offer is currently valid (time/date)
    if (!isOfferValid(offer)) continue

    const minCartAmount = offer.minCartAmount || 0

    if (cartSubtotal >= minCartAmount) {
      eligibleOffers.push({
        id: offer.id,
        name: offer.name,
        offerType: 'CART_THRESHOLD',
        rewardProductId: offer.rewardProductId,
        rewardQty: offer.rewardQty,
        rewardType: offer.rewardType,
        minCartAmount: offer.minCartAmount
      })
    }
  }

  return eligibleOffers
}

export async function checkPercentageDiscountOffers(cartSubtotal: number) {
  console.log('[DEBUG] checkPercentageDiscountOffers called with cartSubtotal:', cartSubtotal)
  const allOffers = await prisma.specialOffer.findMany({
    where: {
      isActive: true
    }
  })

  const eligibleOffers = []

  for (const offer of allOffers) {
    console.log('[DEBUG] Checking offer:', offer.name, 'Type:', offer.offerType, 'minBillAmount:', offer.minBillAmount, 'discountPercentage:', offer.discountPercentage)
    // Check if offer is currently valid (time/date)
    if (!isOfferValid(offer)) continue

    // Check for percentage discount offers (any offer type with minBillAmount and discountPercentage)
    const minBillAmount = offer.minBillAmount || 0
    const discountPercentage = offer.discountPercentage || 0

    if (minBillAmount > 0 && discountPercentage > 0 && cartSubtotal >= minBillAmount) {
      console.log('[DEBUG] Eligible percentage discount offer found:', offer.name)
      eligibleOffers.push({
        id: offer.id,
        name: offer.name,
        offerType: offer.offerType,
        minBillAmount: minBillAmount,
        discountPercentage: discountPercentage
      })
    }
  }

  console.log('[DEBUG] Eligible percentage discount offers:', eligibleOffers)
  return eligibleOffers
}
