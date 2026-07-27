import prisma from '../src/db'

async function fixGRN1Total() {
  const grn = await prisma.gRN.findUnique({
    where: { id: 1 }
  })
  
  if (!grn) {
    console.log('GRN #1 not found')
    return
  }
  
  // Calculate correct total amount: quantity * unitCost
  const correctTotalAmount = grn.quantity * grn.unitCost
  const correctBalance = correctTotalAmount - (grn.paidAmount || 0)
  
  console.log(`GRN #1 current totalAmount: ${grn.totalAmount}`)
  console.log(`GRN #1 calculated totalAmount: ${correctTotalAmount}`)
  console.log(`GRN #1 correct balance: ${correctBalance}`)
  
  await prisma.gRN.update({
    where: { id: 1 },
    data: {
      totalAmount: correctTotalAmount,
      balanceAmount: correctBalance
    }
  })
  
  console.log('GRN #1 fixed successfully!')
}

fixGRN1Total()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
