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
  // Only initialize localPrisma if LOCAL_DATABASE_URL is set
  // This prevents errors during build time when LOCAL_DATABASE_URL is not set
  if (!process.env.LOCAL_DATABASE_URL) {
    console.log('LOCAL_DATABASE_URL not set, skipping localPrisma initialization')
    return null
  }
  
  try {
    // Import the Prisma Client generated from schema-local.prisma
    // This is generated to a separate directory to avoid conflicts with the MySQL client
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

const localPrisma = (process.env.LOCAL_DATABASE_URL) 
  ? (globalThis.localPrismaGlobal ?? localPrismaClientSingleton())
  : null

export default prisma
export { localPrisma }

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
  if (localPrisma) {
    globalThis.localPrismaGlobal = localPrisma
  }
}
