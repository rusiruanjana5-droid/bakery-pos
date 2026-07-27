import { getBackupService } from '../src/lib/backup-service'

/**
 * Manual backup creation script
 * Usage: npm run backup:create
 */
async function createManualBackup() {
  console.log('Creating manual backup...')
  
  try {
    const backupService = getBackupService()
    const metadata = await backupService.createBackup('MANUAL', 'Manual backup created by user')
    
    console.log('✓ Backup created successfully')
    console.log(`Backup ID: ${metadata.id}`)
    console.log(`Timestamp: ${metadata.timestamp}`)
    console.log(`File: ${metadata.fileName}`)
    console.log(`Original size: ${(metadata.size / 1024).toFixed(2)} KB`)
    console.log(`Compressed size: ${(metadata.compressedSize / 1024).toFixed(2)} KB`)
    console.log(`Compression ratio: ${((1 - metadata.compressedSize / metadata.size) * 100).toFixed(1)}%`)
    
    process.exit(0)
  } catch (error: any) {
    if (error.message === 'NO_SQLITE_DB') {
      console.log('ℹ No SQLite database found to backup')
      console.log('This is normal if offline mode hasn\'t been used yet')
      console.log('The backup system will automatically backup offline data when it exists')
      process.exit(0)
    }
    console.error('✗ Backup creation failed:', error)
    process.exit(1)
  }
}

createManualBackup()
