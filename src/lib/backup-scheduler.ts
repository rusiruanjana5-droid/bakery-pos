import { getBackupService } from './backup-service'

class BackupScheduler {
  private intervalId: NodeJS.Timeout | null = null
  private isRunning = false

  /**
   * Start scheduled backups
   * @param intervalMs - Interval in milliseconds (default: 24 hours)
   */
  start(intervalMs: number = 24 * 60 * 60 * 1000): void {
    if (this.isRunning) {
      console.log('Backup scheduler already running')
      return
    }

    this.isRunning = true
    console.log(`Starting backup scheduler (interval: ${intervalMs}ms)`)

    // Run immediately on start
    this.runScheduledBackup()

    // Schedule recurring backups
    this.intervalId = setInterval(() => {
      this.runScheduledBackup()
    }, intervalMs)
  }

  /**
   * Stop scheduled backups
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
    console.log('Backup scheduler stopped')
  }

  /**
   * Run a scheduled backup
   */
  private async runScheduledBackup(): Promise<void> {
    try {
      const backupService = getBackupService()
      await backupService.createBackup('SCHEDULED', 'Automated daily backup')
      console.log('Scheduled backup completed successfully')
    } catch (error: any) {
      // Gracefully handle case where no SQLite DB exists yet
      if (error.message === 'NO_SQLITE_DB') {
        console.log('Scheduled backup skipped - no offline data to backup')
      } else {
        console.error('Scheduled backup failed:', error)
      }
    }
  }

  /**
   * Check if scheduler is running
   */
  isActive(): boolean {
    return this.isRunning
  }
}

// Singleton instance
let backupSchedulerInstance: BackupScheduler | null = null

export function getBackupScheduler(): BackupScheduler {
  if (!backupSchedulerInstance) {
    backupSchedulerInstance = new BackupScheduler()
  }
  return backupSchedulerInstance
}

export default BackupScheduler
