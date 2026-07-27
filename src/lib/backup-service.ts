import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import zlib from 'zlib'
import crypto from 'crypto'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const copyFile = promisify(fs.copyFile)
const mkdir = promisify(fs.mkdir)
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const unlink = promisify(fs.unlink)

export interface BackupMetadata {
  id: string
  timestamp: string
  size: number
  compressedSize: number
  fileName: string
  checksum: string
  type: 'SCHEDULED' | 'MANUAL' | 'PRE_UPDATE'
  description?: string
}

export interface BackupConfig {
  backupDir: string
  maxBackups: number
  compress: boolean
  backupSchedule: string // cron-like expression or interval
}

const DEFAULT_BACKUP_DIR = path.join(
  process.env.APPDATA || process.env.HOME || '.',
  'BakeryPOS',
  'Backups'
)

const DEFAULT_CONFIG: BackupConfig = {
  backupDir: DEFAULT_BACKUP_DIR,
  maxBackups: 30, // Keep last 30 backups
  compress: true,
  backupSchedule: '0 2 * * *' // Daily at 2 AM
}

class BackupService {
  private config: BackupConfig
  private sqliteDbPath: string
  private mysqlBackupEnabled: boolean

  constructor(config: Partial<BackupConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    // Local SQLite database path
    this.sqliteDbPath = path.join(process.cwd(), 'prisma', 'local.db')
    // MySQL backup enabled if mysqldump is available
    this.mysqlBackupEnabled = process.env.DATABASE_URL?.includes('mysql') || false
  }

  /**
   * Initialize backup directory
   */
  async initialize(): Promise<void> {
    try {
      await mkdir(this.config.backupDir, { recursive: true })
      console.log(`Backup directory initialized: ${this.config.backupDir}`)
    } catch (error) {
      console.error('Failed to initialize backup directory:', error)
      throw error
    }
  }

  /**
   * Create a backup of the local SQLite database
   */
  async createBackup(type: 'SCHEDULED' | 'MANUAL' | 'PRE_UPDATE' = 'MANUAL', description?: string): Promise<BackupMetadata> {
    await this.initialize()

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupId = crypto.randomUUID()
    const fileName = `bakery-pos-backup-${timestamp}-${backupId}.db${this.config.compress ? '.gz' : ''}`
    const backupPath = path.join(this.config.backupDir, fileName)

    try {
      // Check if SQLite database exists
      if (!fs.existsSync(this.sqliteDbPath)) {
        console.log('Local SQLite database not found - no offline data to backup')
        console.log('This is normal if offline mode hasn\'t been used yet')
        // Return gracefully without error - SQLite is only used for offline operations
        throw new Error('NO_SQLITE_DB')
      }

      // Read database file (SQLite only for now)
      if (fs.existsSync(this.sqliteDbPath)) {
        const dbBuffer = await readFile(this.sqliteDbPath)
        const checksum = crypto.createHash('sha256').update(dbBuffer).digest('hex')

        let finalBuffer = dbBuffer
        if (this.config.compress) {
          finalBuffer = await promisify(zlib.gzip)(dbBuffer)
        }

        // Write backup file
        await writeFile(backupPath, finalBuffer)

        const metadata: BackupMetadata = {
          id: backupId,
          timestamp: new Date().toISOString(),
          size: dbBuffer.length,
          compressedSize: finalBuffer.length,
          fileName,
          checksum,
          type,
          description
        }

        // Save metadata
        await this.saveMetadata(metadata)

        // Clean up old backups
        await this.cleanupOldBackups()

        console.log(`Backup created successfully: ${fileName}`)
        return metadata
      } else {
        throw new Error('NO_SQLITE_DB')
      }
    } catch (error: any) {
      if (error.message === 'NO_SQLITE_DB') {
        console.log('Skipping backup - no SQLite database found')
        throw error
      }
      console.error('Failed to create backup:', error)
      throw error
    }
  }

  /**
   * Save backup metadata to a JSON file
   */
  private async saveMetadata(metadata: BackupMetadata): Promise<void> {
    const metadataPath = path.join(this.config.backupDir, `${metadata.id}.json`)
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2))
  }

  /**
   * Load backup metadata
   */
  private async loadMetadata(backupId: string): Promise<BackupMetadata | null> {
    const metadataPath = path.join(this.config.backupDir, `${backupId}.json`)
    try {
      const content = await readFile(metadataPath, 'utf-8')
      return JSON.parse(content) as BackupMetadata
    } catch {
      return null
    }
  }

  /**
   * List all available backups
   */
  async listBackups(): Promise<BackupMetadata[]> {
    await this.initialize()

    try {
      const files = await readdir(this.config.backupDir)
      const metadataFiles = files.filter(f => f.endsWith('.json'))
      
      const backups: BackupMetadata[] = []
      for (const file of metadataFiles) {
        const backupId = file.replace('.json', '')
        const metadata = await this.loadMetadata(backupId)
        if (metadata) {
          backups.push(metadata)
        }
      }

      // Sort by timestamp descending
      return backups.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    } catch (error) {
      console.error('Failed to list backups:', error)
      return []
    }
  }

  /**
   * Restore database from a backup
   */
  async restoreBackup(backupId: string): Promise<void> {
    const metadata = await this.loadMetadata(backupId)
    if (!metadata) {
      throw new Error('Backup not found')
    }

    const backupPath = path.join(this.config.backupDir, metadata.fileName)
    
    try {
      // Read backup file
      let buffer = await readFile(backupPath)
      
      // Decompress if needed
      if (this.config.compress && metadata.fileName.endsWith('.gz')) {
        buffer = await promisify(zlib.gunzip)(buffer)
      }

      // Verify checksum
      const checksum = crypto.createHash('sha256').update(buffer).digest('hex')
      if (checksum !== metadata.checksum) {
        throw new Error('Backup checksum verification failed')
      }

      // Create a backup of current database before restore
      await this.createBackup('PRE_UPDATE', 'Pre-restore backup')

      // Restore database
      await writeFile(this.sqliteDbPath, buffer)

      console.log(`Database restored successfully from backup: ${metadata.fileName}`)
    } catch (error) {
      console.error('Failed to restore backup:', error)
      throw error
    }
  }

  /**
   * Delete a backup
   */
  async deleteBackup(backupId: string): Promise<void> {
    const metadata = await this.loadMetadata(backupId)
    if (!metadata) {
      throw new Error('Backup not found')
    }

    const backupPath = path.join(this.config.backupDir, metadata.fileName)
    const metadataPath = path.join(this.config.backupDir, `${backupId}.json`)

    try {
      await unlink(backupPath)
      await unlink(metadataPath)
      console.log(`Backup deleted: ${metadata.fileName}`)
    } catch (error) {
      console.error('Failed to delete backup:', error)
      throw error
    }
  }

  /**
   * Clean up old backups exceeding maxBackups limit
   */
  private async cleanupOldBackups(): Promise<void> {
    const backups = await this.listBackups()
    
    if (backups.length <= this.config.maxBackups) {
      return
    }

    const backupsToDelete = backups.slice(this.config.maxBackups)
    
    for (const backup of backupsToDelete) {
      try {
        await this.deleteBackup(backup.id)
      } catch (error) {
        console.error(`Failed to delete old backup ${backup.id}:`, error)
      }
    }

    console.log(`Cleaned up ${backupsToDelete.length} old backups`)
  }

  /**
   * Get backup statistics
   */
  async getBackupStats(): Promise<{
    totalBackups: number
    totalSize: number
    oldestBackup: string | null
    newestBackup: string | null
  }> {
    const backups = await this.listBackups()
    
    if (backups.length === 0) {
      return {
        totalBackups: 0,
        totalSize: 0,
        oldestBackup: null,
        newestBackup: null
      }
    }

    const totalSize = backups.reduce((sum, b) => sum + b.compressedSize, 0)
    
    return {
      totalBackups: backups.length,
      totalSize,
      oldestBackup: backups[backups.length - 1].timestamp,
      newestBackup: backups[0].timestamp
    }
  }
}

// Singleton instance
let backupServiceInstance: BackupService | null = null

export function getBackupService(config?: Partial<BackupConfig>): BackupService {
  if (!backupServiceInstance) {
    backupServiceInstance = new BackupService(config)
  }
  return backupServiceInstance
}

export default BackupService
