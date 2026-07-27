import { PrismaClient } from '@prisma/client'

// Cloud MySQL client (existing - for cloud database operations)
const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
  localPrismaGlobal: any;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// Local SQLite client (for offline-first operations)
// Uses a separate PrismaClient instance generated from schema-local.prisma
const localPrismaClientSingleton = () => {
  if (!process.env.LOCAL_DATABASE_URL) {
    console.log('LOCAL_DATABASE_URL not set, skipping localPrisma initialization')
    return null
  }

  try {
    const { PrismaClient: LocalPrismaClient } = require('../generated/prisma-local')

    const localPrisma = new LocalPrismaClient({
      datasources: {
        db: {
          url: process.env.LOCAL_DATABASE_URL
        }
      }
    })

    return localPrisma
  } catch (error) {
    console.error('Failed to initialize localPrisma:', error)
    console.log('Make sure to run: npx prisma generate --schema=prisma/schema-local.prisma')
    return null
  }
}

export function getLocalPrisma() {
  if (globalThis.localPrismaGlobal) {
    return globalThis.localPrismaGlobal
  }

  const localPrisma = localPrismaClientSingleton()
  if (!localPrisma) {
    return null
  }

  if (process.env.NODE_ENV !== 'production') {
    globalThis.localPrismaGlobal = localPrisma
  }

  return localPrisma
}

export default prisma

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}
