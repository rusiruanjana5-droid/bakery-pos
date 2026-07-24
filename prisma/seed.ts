import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const cashierPassword = await bcrypt.hash('cashier123', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create cashier user
  const cashier = await prisma.user.upsert({
    where: { username: 'cashier' },
    update: {},
    create: {
      username: 'cashier',
      password: cashierPassword,
      role: 'CASHIER',
    },
  })

  // Create initial categories
  const bakeryItems = await prisma.category.upsert({
    where: { name: 'Bakery Items' },
    update: {},
    create: {
      name: 'Bakery Items',
      description: 'Bread, buns, pastries, cakes, and other bakery products'
    }
  })

  const hotKitchen = await prisma.category.upsert({
    where: { name: 'Hot Kitchen (Kottu/Rice)' },
    update: {},
    create: {
      name: 'Hot Kitchen (Kottu/Rice)',
      description: 'Hot meals including kottu, rice dishes, and cooked food'
    }
  })

  const beverages = await prisma.category.upsert({
    where: { name: 'Beverages' },
    update: {},
    create: {
      name: 'Beverages',
      description: 'Tea, coffee, soft drinks, juices, and other beverages'
    }
  })

  const desserts = await prisma.category.upsert({
    where: { name: 'Desserts' },
    update: {},
    create: {
      name: 'Desserts',
      description: 'Sweet treats, ice cream, and desserts'
    }
  })

  // Create subcategories for Bakery Items
  await prisma.subCategory.upsert({
    where: { categoryId_name: { categoryId: bakeryItems.id, name: 'Bread' } },
    update: {},
    create: {
      name: 'Bread',
      categoryId: bakeryItems.id
    }
  })

  await prisma.subCategory.upsert({
    where: { categoryId_name: { categoryId: bakeryItems.id, name: 'Buns' } },
    update: {},
    create: {
      name: 'Buns',
      categoryId: bakeryItems.id
    }
  })

  await prisma.subCategory.upsert({
    where: { categoryId_name: { categoryId: bakeryItems.id, name: 'Pastries' } },
    update: {},
    create: {
      name: 'Pastries',
      categoryId: bakeryItems.id
    }
  })

  await prisma.subCategory.upsert({
    where: { categoryId_name: { categoryId: bakeryItems.id, name: 'Cakes' } },
    update: {},
    create: {
      name: 'Cakes',
      categoryId: bakeryItems.id
    }
  })

  // Create subcategories for Hot Kitchen
  await prisma.subCategory.upsert({
    where: { categoryId_name: { categoryId: hotKitchen.id, name: 'Kottu' } },
    update: {},
    create: {
      name: 'Kottu',
      categoryId: hotKitchen.id
    }
  })

  await prisma.subCategory.upsert({
    where: { categoryId_name: { categoryId: hotKitchen.id, name: 'Rice' } },
    update: {},
    create: {
      name: 'Rice',
      categoryId: hotKitchen.id
    }
  })

  // Create subcategories for Beverages
  await prisma.subCategory.upsert({
    where: { categoryId_name: { categoryId: beverages.id, name: 'Hot Drinks' } },
    update: {},
    create: {
      name: 'Hot Drinks',
      categoryId: beverages.id
    }
  })

  await prisma.subCategory.upsert({
    where: { categoryId_name: { categoryId: beverages.id, name: 'Cold Drinks' } },
    update: {},
    create: {
      name: 'Cold Drinks',
      categoryId: beverages.id
    }
  })

  // Create supplier-specific categories
  const bakeryRawMaterials = await prisma.category.upsert({
    where: { name: 'Bakery Raw Materials' },
    update: {},
    create: {
      name: 'Bakery Raw Materials',
      description: 'Flour, yeast, sugar, and other baking ingredients'
    }
  })

  const hotKitchenSupplies = await prisma.category.upsert({
    where: { name: 'Hot Kitchen (Meat/Veg)' },
    update: {},
    create: {
      name: 'Hot Kitchen (Meat/Veg)',
      description: 'Meat, vegetables, and cooking supplies for hot kitchen'
    }
  })

  const packaging = await prisma.category.upsert({
    where: { name: 'Packaging' },
    update: {},
    create: {
      name: 'Packaging',
      description: 'Bags, boxes, and packaging materials'
    }
  })

  const utilities = await prisma.category.upsert({
    where: { name: 'Utilities' },
    update: {},
    create: {
      name: 'Utilities',
      description: 'Electricity, water, and other utilities'
    }
  })

  console.log('Seed completed:')
  console.log('Admin user created:', admin.username)
  console.log('Cashier user created:', cashier.username)
  console.log('Categories created:', bakeryItems.name, hotKitchen.name, beverages.name, desserts.name)
  console.log('Supplier categories created:', bakeryRawMaterials.name, hotKitchenSupplies.name, packaging.name, utilities.name)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
