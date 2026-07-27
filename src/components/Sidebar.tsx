'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/actions/auth'
import { sanitizeImageUrl } from '@/lib/imageUtils'

interface SidebarProps {
  role: 'ADMIN' | 'MANAGER' | 'CASHIER' | 'KITCHEN'
  storeSettings: any
}

const defaultAdminNavItems = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Suppliers', href: '/suppliers', icon: '🏭' },
  { name: 'Products', href: '/products', icon: '🍞' },
  { name: 'GRN', href: '/grn', icon: '📥' },
  { name: 'POS Billing Screen', href: '/pos', icon: '💳', isBilling: true },
  { name: 'Special Offers', href: '/admin/special-offers', icon: '🎁' },
  { name: 'Categories', href: '/admin/categories', icon: '📂' },
  { name: 'Manage Users', href: '/admin/users', icon: '👥' },
  { name: 'Store Profile', href: '/admin/profile', icon: '⚙️' },
]

const cashierNavItems = [
  { name: 'POS Billing Screen', href: '/pos', icon: '💳', isBilling: true },
]

export default function Sidebar({ role, storeSettings }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [navItems, setNavItems] = useState(defaultAdminNavItems)
  const [draggedItem, setDraggedItem] = useState<number | null>(null)

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebarCollapsed')
    if (savedCollapsed !== null) {
      setIsCollapsed(JSON.parse(savedCollapsed))
    }
  }, [])

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  // Listen for toggle event from Header
  useEffect(() => {
    const handleToggle = () => {
      setIsCollapsed(prev => !prev)
    }
    window.addEventListener('toggleSidebar', handleToggle)
    return () => window.removeEventListener('toggleSidebar', handleToggle)
  }, [])

  // Load custom nav order from localStorage (for admin only)
  useEffect(() => {
    if (role !== 'CASHIER' && role !== 'KITCHEN') {
      const savedOrder = localStorage.getItem('sidebarNavOrder')
      if (savedOrder) {
        try {
          const order = JSON.parse(savedOrder)
          const reorderedItems = order.map((name: string) => 
            defaultAdminNavItems.find(item => item.name === name)
          ).filter(Boolean)
          if (reorderedItems.length === defaultAdminNavItems.length) {
            setNavItems(reorderedItems)
          }
        } catch (e) {
          console.error('Failed to load sidebar order:', e)
        }
      }
    }
  }, [role])

  const navItemsToUse = role === 'CASHIER' || role === 'KITCHEN' ? cashierNavItems : navItems

  const getAccentStyle = () => {
    if (storeSettings?.themeType === 'gradient') {
      return {
        backgroundColor: `linear-gradient(to right, var(--gradient-from, #f59e0b), var(--gradient-to, #ec4899))`,
        backgroundImage: `linear-gradient(to right, var(--gradient-from, #f59e0b), var(--gradient-to, #ec4899))`
      }
    }
    return {
      backgroundColor: 'var(--primary-color, #f59e0b)'
    }
  }

  const accentBg = getAccentStyle()

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedItem(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (dropIndex: number) => {
    if (draggedItem === null || draggedItem === dropIndex) return
    
    const newNavItems = [...navItems]
    const [dragged] = newNavItems.splice(draggedItem, 1)
    newNavItems.splice(dropIndex, 0, dragged)
    
    setNavItems(newNavItems)
    localStorage.setItem('sidebarNavOrder', JSON.stringify(newNavItems.map(item => item.name)))
    setDraggedItem(null)
  }

  const resetNavOrder = () => {
    setNavItems(defaultAdminNavItems)
    localStorage.removeItem('sidebarNavOrder')
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed lg:static inset-y-0 left-0 z-50 text-white min-h-screen flex flex-col transform transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ backgroundColor: 'var(--sidebar-bg, #0f172a)' }}
      >
        {/* Header with logo and collapse toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            {(() => {
              const sanitizedUrl = sanitizeImageUrl(storeSettings?.logoUrl)
              if (sanitizedUrl) {
                return (
                  <img
                    src={sanitizedUrl}
                    alt="Store Logo"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                )
              }
              return (
                <div className="w-8 h-8 rounded-full grid place-items-center flex-shrink-0" style={accentBg}>
                  <span className="text-white text-sm">🏪</span>
                </div>
              )
            })()}
            {!isCollapsed && (
              <span className="text-lg font-bold truncate">{storeSettings?.shopName || "Bakery POS"}</span>
            )}
          </div>
          {/* Collapse Toggle Button (Desktop) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <svg 
              className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItemsToUse.map((item: any, index: number) => (
              <li key={item.name}>
                <div
                  draggable={role !== 'CASHIER' && role !== 'KITCHEN' && !isCollapsed}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className="group"
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      item.isBilling && pathname === item.href
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-lg hover:from-purple-700 hover:to-pink-700'
                        : pathname === item.href
                        ? 'text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                    style={!(item.isBilling && pathname === item.href) && pathname === item.href ? accentBg : undefined}
                    title={isCollapsed ? item.name : ''}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="font-medium flex-1 truncate">{item.name}</span>
                        {/* Drag handle for admin/manager */}
                        {role !== 'CASHIER' && role !== 'KITCHEN' && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                            </svg>
                          </div>
                        )}
                      </>
                    )}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer with reset */}
        <div className="px-2 py-4 border-t border-gray-700">
          {/* Reset Menu Order Button (Admin only) */}
          {role !== 'CASHIER' && role !== 'KITCHEN' && !isCollapsed && (
            <button
              onClick={resetNavOrder}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all text-xs"
              title="Reset menu order to default"
            >
              <span className="text-sm">🔄</span>
              <span className="font-medium">Reset Menu Order</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}
