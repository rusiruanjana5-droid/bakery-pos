import { getBackupScheduler } from './backup-scheduler'

/**
 * Initialize backup system on app startup
 * This should be called when the application starts
 */
export function initializeBackupSystem() {
  // Only run in server environment
  if (typeof window !== 'undefined') {
    return
  }

  try {
    const scheduler = getBackupScheduler()
    
    // Start scheduled backups (daily at 2 AM = 24 hours interval)
    // In production, you might want to use a more sophisticated cron scheduler
    scheduler.start(24 * 60 * 60 * 1000) // 24 hours
    
    console.log('Backup system initialized successfully')
    console.log('Scheduled backups: Daily (24-hour interval)')
  } catch (error) {
    console.error('Failed to initialize backup system:', error)
  }
}

/**
 * Cleanup backup system on app shutdown
 */
export function shutdownBackupSystem() {
  if (typeof window !== 'undefined') {
    return
  }

  try {
    const scheduler = getBackupScheduler()
    scheduler.stop()
    console.log('Backup system shutdown successfully')
  } catch (error) {
    console.error('Failed to shutdown backup system:', error)
  }
}
