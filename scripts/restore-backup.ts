import { getBackupService } from '../src/lib/backup-service'

/**
 * Restore database from backup
 * Usage: npm run backup:restore <backup-id>
 */
async function restoreBackup() {
  const backupId = process.argv[2]
  
  if (!backupId) {
    console.error('Usage: npm run backup:restore <backup-id>')
    console.error('Run "npm run backup:list" to see available backups')
    process.exit(1)
  }
  
  console.log(`Restoring backup: ${backupId}`)
  console.log('WARNING: This will replace the current database!')
  console.log('A pre-restore backup will be created automatically.\n')
  
  try {
    const backupService = getBackupService()
    await backupService.restoreBackup(backupId)
    
    console.log('✓ Database restored successfully')
    console.log('Please restart the application to apply changes')
    
    process.exit(0)
  } catch (error) {
    console.error('✗ Restore failed:', error)
    process.exit(1)
  }
}

restoreBackup()
