import { getBackupService } from '../src/lib/backup-service'

/**
 * List all available backups
 * Usage: npm run backup:list
 */
async function listBackups() {
  console.log('Fetching backup list...\n')
  
  try {
    const backupService = getBackupService()
    const backups = await backupService.listBackups()
    const stats = await backupService.getBackupStats()
    
    if (backups.length === 0) {
      console.log('No backups found')
      process.exit(0)
    }
    
    console.log(`Total backups: ${stats.totalBackups}`)
    console.log(`Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Oldest: ${stats.oldestBackup ? new Date(stats.oldestBackup).toLocaleString() : 'N/A'}`)
    console.log(`Newest: ${stats.newestBackup ? new Date(stats.newestBackup).toLocaleString() : 'N/A'}`)
    console.log('\n--- Backup Details ---\n')
    
    backups.forEach((backup, index) => {
      console.log(`${index + 1}. ${backup.fileName}`)
      console.log(`   ID: ${backup.id}`)
      console.log(`   Type: ${backup.type}`)
      console.log(`   Timestamp: ${new Date(backup.timestamp).toLocaleString()}`)
      console.log(`   Size: ${(backup.size / 1024).toFixed(2)} KB (compressed: ${(backup.compressedSize / 1024).toFixed(2)} KB)`)
      if (backup.description) {
        console.log(`   Description: ${backup.description}`)
      }
      console.log(`   Checksum: ${backup.checksum.substring(0, 16)}...`)
      console.log('')
    })
    
    process.exit(0)
  } catch (error) {
    console.error('✗ Failed to list backups:', error)
    process.exit(1)
  }
}

listBackups()
