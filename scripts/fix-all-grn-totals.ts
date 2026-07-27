import prisma from '../src/db'

async function fixAllGRNTotals() {
  console.log('Starting GRN totalAmount fix...')
  
  const grns = await prisma.gRN.findMany({
    where: {
      totalAmount: 0
    }
  })
  
  console.log(`Found ${grns.length} GRNs with totalAmount = 0`)
  
  for (const grn of grns) {
    // Calculate correct total amount: quantity * unitCost
    const correctTotalAmount = grn.quantity * grn.unitCost
    const correctBalance = correctTotalAmount - (grn.paidAmount || 0)
    
    await prisma.gRN.update({
      where: { id: grn.id },
      data: {
        totalAmount: correctTotalAmount,
        balanceAmount: correctBalance
      }
    })
    
    console.log(`Fixed GRN #${grn.id}: totalAmount set to Rs. ${correctTotalAmount.toFixed(2)}, balance set to Rs. ${correctBalance.toFixed(2)}`)
  }
  
  console.log('All GRN totals fixed successfully!')
}

fixAllGRNTotals()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error fixing GRN totals:', error)
    process.exit(1)
  })
