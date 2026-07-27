import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

/**
 * SQLite Database Initialization Script
 * 
 * This script automatically creates the SQLite database file and runs migrations
 * for offline-first operations. It places the database in a safe app data directory.
 */

async function initializeSQLiteDatabase() {
  console.log('🗄️  Initializing SQLite database for offline operations...')
  
  try {
    // Determine safe database directory based on platform
    let dbDir: string
    
    if (process.platform === 'win32') {
      // Windows: %APPDATA%\BakeryPOS
      dbDir = path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'BakeryPOS')
    } else if (process.platform === 'darwin') {
      // macOS: ~/Library/Application Support/BakeryPOS
      dbDir = path.join(os.homedir(), 'Library', 'Application Support', 'BakeryPOS')
    } else {
      // Linux: ~/.local/share/BakeryPOS or ~/.bakerypos
      dbDir = path.join(os.homedir(), '.local', 'share', 'BakeryPOS')
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
      console.log(`📁 Created database directory: ${dbDir}`)
    }
    
    const dbPath = path.join(dbDir, 'bakery-pos-local.db')
    console.log(`📊 Database path: ${dbPath}`)
    
    // Set environment variable for the local database
    process.env.LOCAL_DATABASE_URL = `file:${dbPath}`
    
    // Push schema to create tables if they don't exist
    console.log('🔄 Creating database schema...')
    try {
      execSync('npx prisma db push --schema=prisma/schema-local.prisma', {
        stdio: 'inherit',
        env: { ...process.env, LOCAL_DATABASE_URL: process.env.LOCAL_DATABASE_URL }
      })
      console.log('✅ Database schema created successfully')
    } catch (error) {
      console.error('❌ Failed to push schema:', error)
      throw error
    }
    
    // Initialize Prisma client with SQLite schema
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.LOCAL_DATABASE_URL
        }
      }
    })
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Successfully connected to SQLite database')
    
    // Create sync metadata record if it doesn't exist
    const syncMetadata = await prisma.syncMetadata.findFirst()
    if (!syncMetadata) {
      await prisma.syncMetadata.create({
        data: {
          syncStatus: 'IDLE',
          pendingCount: 0,
          failedCount: 0
        }
      })
      console.log('✅ Created sync metadata record')
    }
    
    await prisma.$disconnect()
    
    console.log('\n✨ SQLite database initialization completed successfully!')
    console.log(`📍 Database location: ${dbPath}`)
    console.log('🔄 The database is ready for offline operations')
    
    return dbPath
    
  } catch (error) {
    console.error('❌ Failed to initialize SQLite database:', error)
    throw error
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeSQLiteDatabase()
    .then(() => {
      console.log('✅ Initialization script finished')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Initialization script failed:', error)
      process.exit(1)
    })
}

export { initializeSQLiteDatabase }
