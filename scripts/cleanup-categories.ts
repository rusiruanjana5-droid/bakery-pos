import prisma from '@/db'

async function cleanupCategories() {
  console.log('Fetching all categories...')
  const allCategories = await prisma.category.findMany({
    orderBy: { id: 'asc' }
  })

  console.log(`Found ${allCategories.length} categories:`)
  allCategories.forEach(cat => {
    console.log(`ID: ${cat.id}, Name: "${cat.name}", ParentID: ${cat.parentId}`)
  })

  // Find the root "Bakery Items" category
  const bakeryItems = allCategories.find(cat => 
    cat.name.toLowerCase() === 'bakery items' && cat.parentId === null
  )

  if (!bakeryItems) {
    console.log('No "Bakery Items" category found')
    return
  }

  console.log(`Found "Bakery Items" category (ID: ${bakeryItems.id})`)

  // Check if "Buns" category exists under Bakery Items
  let bunsCategory = allCategories.find(cat => 
    cat.name.toLowerCase() === 'buns' && cat.parentId === bakeryItems.id
  )

  if (!bunsCategory) {
    console.log('Creating "Buns" category under "Bakery Items"...')
    bunsCategory = await prisma.category.create({
      data: {
        name: 'Buns',
        parentId: bakeryItems.id,
        isActive: true,
        displayOrder: 0
      }
    })
    console.log(`Created "Buns" category with ID: ${bunsCategory.id}`)
  } else {
    console.log(`Found existing "Buns" category (ID: ${bunsCategory.id})`)
  }

  // Find bun-related categories that should be under "Buns"
  const bunCategories = allCategories.filter(cat => 
    cat.parentId === bakeryItems.id && 
    (cat.name.toLowerCase().includes('bun') || 
     cat.name.toLowerCase().includes('fish') ||
     cat.name.toLowerCase().includes('sausage'))
  )

  console.log(`\nFound ${bunCategories.length} bun-related categories to move under "Buns":`)
  bunCategories.forEach(cat => {
    console.log(`ID: ${cat.id}, Name: "${cat.name}"`)
  })

  // Move them to Buns parent
  for (const bunCat of bunCategories) {
    console.log(`Moving "${bunCat.name}" (ID: ${bunCat.id}) to parent "Buns" (ID: ${bunsCategory.id})`)
    await prisma.category.update({
      where: { id: bunCat.id },
      data: { parentId: bunsCategory.id }
    })
  }

  console.log('\nCleanup complete!')
}

cleanupCategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
