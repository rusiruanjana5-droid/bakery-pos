import { getLocalPrisma } from '@/db'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

/**
 * SQLite Database Initialization
 * 
 * Automatically creates the SQLite database file in a safe app data directory
 * and initializes the schema for offline-first operations.
 * 
 * When running in Electron, uses app.getPath('userData') for the database path.
 */

let isInitialized = false

export async function initializeSQLiteDatabase() {
  if (isInitialized) {
    return
  }

  // Skip initialization during build time
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production' && !process.env.LOCAL_DATABASE_URL) {
    console.log('Skipping SQLite initialization during build')
    return
  }

  try {
    let dbDir: string
    let dbPath: string
    
    // Check if running in Electron
    const isElectron = typeof window !== 'undefined' && (window as any).electronAPI
    
    if (isElectron) {
      // Running in Electron - use Electron's userData path
      try {
        const electronDbPath = await (window as any).electronAPI.getLocalDbPath()
        dbPath = electronDbPath
        dbDir = path.dirname(electronDbPath)
      } catch (error) {
        // Fallback to platform-specific path if Electron API fails
        console.warn('Electron API not available, using fallback path')
        dbDir = getPlatformDataDir()
        dbPath = path.join(dbDir, 'bakery-pos-local.db')
      }
    } else {
      // Not running in Electron - use platform-specific path
      dbDir = getPlatformDataDir()
      dbPath = path.join(dbDir, 'bakery-pos-local.db')
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true })
    }
    
    // Set environment variable for the local database
    process.env.LOCAL_DATABASE_URL = `file:${dbPath}`
    
    // Push schema to create tables if they don't exist
    // Only run this in development or when not in Electron packaged mode
    // In Electron production, the main process handles schema initialization
    const isPackaged = process.env.NODE_ENV === 'production' && isElectron
    
    if (!isPackaged) {
      try {
        // Determine schema path
        let schemaPath = 'prisma/schema-local.prisma'
        if (fs.existsSync('prisma/schema-local.prisma')) {
          schemaPath = 'prisma/schema-local.prisma'
        }
        
        execSync(`npx prisma db push --schema=${schemaPath} --skip-generate`, {
          stdio: 'pipe',
          env: { ...process.env, LOCAL_DATABASE_URL: process.env.LOCAL_DATABASE_URL }
        })
      } catch (error) {
        // Schema push might fail if tables already exist, which is okay
        console.log('ℹ️  Schema push skipped or tables already exist')
      }
    }
    
    const localPrisma = getLocalPrisma()
    if (!localPrisma) {
      console.warn('Local database client not initialized; skipping SQLite setup')
      return
    }

    // Test connection with localPrisma
    try {
      await localPrisma.$connect()
    } catch (error) {
      console.error('Failed to connect to local SQLite database:', error)
      // Don't throw - allow app to continue even if SQLite fails
      return
    }
    
    // Create sync metadata record if it doesn't exist
    try {
      const syncMetadata = await localPrisma.syncMetadata.findFirst()
      if (!syncMetadata) {
        await localPrisma.syncMetadata.create({
          data: {
            syncStatus: 'IDLE',
            pendingCount: 0,
            failedCount: 0
          }
        })
      }
    } catch (error) {
      // If syncMetadata table doesn't exist, that's okay - it will be created by schema push
      console.log('ℹ️  Sync metadata check skipped')
    }
    
    await localPrisma.$disconnect()
    
    isInitialized = true
    console.log(`✅ SQLite database initialized at: ${dbPath}`)
    
  } catch (error) {
    console.error('Failed to initialize SQLite database:', error)
    // Don't throw error - allow app to continue even if SQLite fails
    // The app will fall back to online-only mode
  }
}

function getPlatformDataDir(): string {
  if (process.platform === 'win32') {
    // Windows: %APPDATA%\BakeryPOS
    return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), 'BakeryPOS')
  } else if (process.platform === 'darwin') {
    // macOS: ~/Library/Application Support/BakeryPOS
    return path.join(os.homedir(), 'Library', 'Application Support', 'BakeryPOS')
  } else {
    // Linux: ~/.local/share/BakeryPOS
    return path.join(os.homedir(), '.local', 'share', 'BakeryPOS')
  }
}
