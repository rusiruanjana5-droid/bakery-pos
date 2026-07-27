'use client'

import { useState, useEffect, useRef } from 'react'
import { logout, switchUserByPin } from '@/actions/auth'
import { getActiveShift, getLastShift } from '@/actions/shift'
import { usePathname, useRouter } from 'next/navigation'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { sanitizeImageUrl } from '@/lib/imageUtils'
import ShiftEndModal from '@/components/ShiftEndModal'
import CashDenominationModal from '@/components/CashDenominationModal'
import { getSyncService, type SyncStatus } from '@/lib/syncService'

interface HeaderProps {
  session: any
  storeSettings: any
}

export default function Header({ session, storeSettings }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false)
  const [activeShift, setActiveShift] = useState<any>(null)
  const [lastShift, setLastShift] = useState<any>(null)
  const [showShiftEndModal, setShowShiftEndModal] = useState(false)
  const [showCashCalculator, setShowCashCalculator] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const syncService = getSyncService()

  useEffect(() => {
    if (session?.userId) {
      loadShiftData()
    } else {
      // Clear shift data when session is cleared (logout)
      setActiveShift(null)
      setLastShift(null)
    }
  }, [session?.userId, pathname])

  // Initialize sync service monitoring
  useEffect(() => {
    const handleSyncStatusChange = (status: SyncStatus) => {
      setSyncStatus(status)
    }

    syncService.onStatusChange(handleSyncStatusChange)

    return () => {
      syncService.offStatusChange(handleSyncStatusChange)
    }
  }, [syncService])

  // Additional effect to refresh shift data when the component mounts or pathname changes
  useEffect(() => {
    if (session?.userId && pathname === '/pos') {
      loadShiftData()
    }
  }, [pathname])

  // Listen for custom shift refresh event from other components
  useEffect(() => {
    const handleShiftRefresh = () => {
      console.log('Shift refresh event received, reloading shift data')
      loadShiftData()
    }

    window.addEventListener('shift-refresh', handleShiftRefresh)
    return () => window.removeEventListener('shift-refresh', handleShiftRefresh)
  }, [session?.userId])

  const loadShiftData = async () => {
    console.log('Loading shift data for user:', session?.userId)
    const active = await getActiveShift(session.userId)
    const last = await getLastShift(session.userId)

    console.log('Shift data loaded:', { active, last })

    setActiveShift(active)
    setLastShift(last)

    // If there's an active shift, fetch real-time summary for accurate cash sales
    if (active) {
      const { getShiftSummary } = await import('@/actions/shift')
      const summary = await getShiftSummary(active.id)
      if (summary) {
        setActiveShift({ ...active, ...summary })
      }
    }
  }

  const handleSwitchUser = async (pin: string) => {
    // Pass current user and shift info for pause/resume logic
    const currentUserId = session?.userId
    const currentShiftId = activeShift?.id

    const result = await switchUserByPin(pin, currentUserId, currentShiftId)
    if (result.success) {
      setShowSwitchUserModal(false)

      // Redirect based on user role
      if (result.user) {
        const userRole = result.user.role
        if (userRole === 'ADMIN' || userRole === 'MANAGER') {
          // Redirect to admin dashboard for admin/manager roles
          router.push('/')
        } else if (userRole === 'CASHIER') {
          // Keep cashiers on POS screen - refresh to get new shift data
          router.push('/pos')
        } else {
          // Other roles go to dashboard
          router.push('/')
        }
      } else {
        router.refresh()
      }
    }
    return result
  }

  const formatTime = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (d.toDateString() === today.toDateString()) {
      return `Today ${formatTime(date)}`
    } else if (d.toDateString() === yesterday.toDateString()) {
      return `Yesterday ${formatTime(date)}`
    }
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleShiftEnd = async (closingCash: number, notes?: string) => {
    try {
      const { endShift } = await import('@/actions/shift')
      const result = await endShift(activeShift.id, closingCash, notes)
      
      if (result.success) {
        setShowShiftEndModal(false)
        // Dispatch custom event to update shift state immediately
        window.dispatchEvent(new CustomEvent('shift-refresh'))
        await loadShiftData()
        await logout()
        router.push('/login')
      } else {
        alert(`Failed to end shift: ${result.error || 'Unknown error'}`)
      }
    } catch (error) {
      // Re-throw redirect errors to allow Next.js to handle them
      if (isRedirectError(error)) {
        throw error
      }
      console.error('Error ending shift:', error)
      alert(`Failed to end shift: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    return pathSegments.map((segment, index) => {
      const isLast = index === pathSegments.length - 1
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      
      return {
        label,
        href: `/${pathSegments.slice(0, index + 1).join('/')}`,
        isLast
      }
    })
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      {/* Breadcrumbs - Hide on POS page */}
      {pathname !== '/pos' && (
        <div className="flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-2">
              {index > 0 && (
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              <span className={`text-sm ${crumb.isLast ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-700 cursor-pointer'}`}>
                {crumb.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Sync Status Indicator */}
        {syncStatus && (
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
            !syncStatus.isOnline 
              ? 'bg-orange-50 border-orange-200' 
              : 'bg-green-50 border-green-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              !syncStatus.isOnline 
                ? 'bg-orange-500 animate-pulse' 
                : 'bg-green-500'
            }`}></div>
            <span className={`text-xs font-medium ${
              !syncStatus.isOnline 
                ? 'text-orange-700' 
                : 'text-green-700'
            }`}>
              {!syncStatus.isOnline 
                ? 'Offline' 
                : 'Online'}
            </span>
          </div>
        )}

        {/* Cash Calculator Button */}
        <button
          onClick={() => setShowCashCalculator(true)}
          className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
          title="Cash Denomination Calculator"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Shift Status Badge */}
        {session?.role === 'CASHIER' && (
          <button
            onClick={() => activeShift ? setShowShiftEndModal(true) : null}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-colors ${
              activeShift 
                ? 'bg-green-50 border-green-200 hover:bg-green-100' 
                : 'bg-red-50 border-red-200 hover:bg-red-100'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeShift ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-xs font-medium ${activeShift ? 'text-green-700' : 'text-red-700'}`}>
              {activeShift ? 'Shift Active' : 'Shift Ended'}
            </span>
          </button>
        )}

        {/* Cashier Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="text-right">
            <div className="text-xs font-medium text-slate-700">
              {session?.user?.role || 'User'}: {session?.username || 'User'}
            </div>
            {activeShift && (
              <div className="text-[10px] text-slate-500">
                Logged in: {formatTime(activeShift.openedAt)}
              </div>
            )}
            {!activeShift && lastShift && (
              <div className="text-[10px] text-slate-500">
                Last Logout: {formatDate(lastShift.closedAt)}
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-sm">👤</span>
          </div>
        </div>

        {/* Switch User */}
        <button
          onClick={() => setShowSwitchUserModal(true)}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          title="Switch User"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* Logout / End Shift */}
        {session?.role === 'CASHIER' ? (
          <button
            onClick={() => activeShift ? setShowShiftEndModal(true) : logout()}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title={activeShift ? 'End Shift' : 'Logout'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        ) : (
          <button
            onClick={logout}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>

      {/* Switch User Modal */}
      {showSwitchUserModal && (
        <SwitchUserModal
          onClose={() => setShowSwitchUserModal(false)}
          onSwitch={handleSwitchUser}
        />
      )}

      {/* Shift End Modal */}
      {showShiftEndModal && activeShift && (
        <ShiftEndModal
          isOpen={showShiftEndModal}
          cashierName={session?.username || 'Cashier'}
          shiftStartTime={activeShift.openedAt}
          openingBalance={activeShift.startingCash || 0}
          totalCashSales={activeShift.cashSales || 0}
          onSubmit={handleShiftEnd}
          onClose={() => setShowShiftEndModal(false)}
        />
      )}

      {/* Cash Denomination Calculator Modal */}
      <CashDenominationModal
        isOpen={showCashCalculator}
        onClose={() => setShowCashCalculator(false)}
      />
    </div>
  )
}

function SwitchUserModal({ onClose, onSwitch }: any) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const pinInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    pinInputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pin.length !== 4) {
      setError('PIN must be 4 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await onSwitch(pin)
      if (!result.success) {
        setError(result.error || 'Invalid PIN')
      }
    } catch (err) {
      setError('Failed to switch user')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onKeyDown={handleKeyDown}>
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Switch User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter User PIN
            </label>
            <input
              ref={pinInputRef}
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                setError('')
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-2xl tracking-widest"
              placeholder="••••"
              maxLength={4}
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors"
              disabled={loading || pin.length !== 4}
            >
              {loading ? 'Switching...' : 'Switch User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
