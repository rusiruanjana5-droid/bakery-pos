import prisma from '../src/db'

async function fixGRNBalances() {
  console.log('Starting GRN balance fix...')
  
  const grns = await prisma.gRN.findMany({
    where: {
      OR: [
        { balanceAmount: null },
        { balanceAmount: 0 }
      ]
    }
  })
  
  console.log(`Found ${grns.length} GRNs with incorrect balance`)
  
  for (const grn of grns) {
    const correctBalance = (grn.totalAmount || 0) - (grn.paidAmount || 0)
    
    await prisma.gRN.update({
      where: { id: grn.id },
      data: { balanceAmount: correctBalance }
    })
    
    console.log(`Fixed GRN #${grn.id}: balance set to Rs. ${correctBalance.toFixed(2)}`)
  }
  
  console.log('GRN balance fix completed!')
}

fixGRNBalances()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error fixing GRN balances:', error)
    process.exit(1)
  })
