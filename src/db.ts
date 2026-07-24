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
// Using same PrismaClient with different datasource URL for SQLite
const localPrismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.LOCAL_DATABASE_URL || 'file:./prisma/local.db'
      }
    }
  })
}

const localPrisma = globalThis.localPrismaGlobal ?? localPrismaClientSingleton()

export default prisma
export { localPrisma }

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
  globalThis.localPrismaGlobal = localPrisma
}
