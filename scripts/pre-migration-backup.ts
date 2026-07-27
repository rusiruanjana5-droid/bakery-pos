import { getBackupService } from '../src/lib/backup-service'

/**
 * Pre-migration backup script
 * Run this before any database migration or schema update
 */
async function preMigrationBackup() {
  console.log('Creating pre-migration backup...')
  
  try {
    const backupService = getBackupService()
    const metadata = await backupService.createBackup(
      'PRE_UPDATE',
      'Pre-migration backup before schema update'
    )
    
    console.log('✓ Pre-migration backup created successfully')
    console.log(`Backup ID: ${metadata.id}`)
    console.log(`Backup file: ${metadata.fileName}`)
    console.log(`Size: ${(metadata.size / 1024).toFixed(2)} KB`)
    console.log(`Compressed: ${(metadata.compressedSize / 1024).toFixed(2)} KB`)
    
    process.exit(0)
  } catch (error) {
    console.error('✗ Pre-migration backup failed:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  preMigrationBackup()
}

export { preMigrationBackup }
