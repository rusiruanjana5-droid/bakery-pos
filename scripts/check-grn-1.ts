import prisma from '../src/db'

async function checkGRN1() {
  const grn = await prisma.gRN.findUnique({
    where: { id: 1 },
    include: {
      product: true,
      supplier: true
    }
  })
  
  console.log('GRN #1 Details:')
  console.log(JSON.stringify(grn, null, 2))
}

checkGRN1()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
