'use server'

import { getBackupService, BackupMetadata } from '@/lib/backup-service'
import { revalidatePath } from 'next/cache'

/**
 * Create a manual backup
 */
export async function createBackup(description?: string) {
  try {
    const backupService = getBackupService()
    const metadata = await backupService.createBackup('MANUAL', description)
    
    revalidatePath('/settings/backups')
    return { success: true, metadata }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to create backup' 
    }
  }
}

/**
 * List all available backups
 */
export async function listBackups() {
  try {
    const backupService = getBackupService()
    const backups = await backupService.listBackups()
    const stats = await backupService.getBackupStats()
    
    return { 
      success: true, 
      backups, 
      stats 
    }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to list backups' 
    }
  }
}

/**
 * Restore database from a backup
 */
export async function restoreBackup(backupId: string) {
  try {
    const backupService = getBackupService()
    await backupService.restoreBackup(backupId)
    
    revalidatePath('/settings/backups')
    return { success: true }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to restore backup' 
    }
  }
}

/**
 * Delete a backup
 */
export async function deleteBackup(backupId: string) {
  try {
    const backupService = getBackupService()
    await backupService.deleteBackup(backupId)
    
    revalidatePath('/settings/backups')
    return { success: true }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to delete backup' 
    }
  }
}

/**
 * Get backup statistics
 */
export async function getBackupStats() {
  try {
    const backupService = getBackupService()
    const stats = await backupService.getBackupStats()
    
    return { success: true, stats }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || 'Failed to get backup stats' 
    }
  }
}
