'use client'

import { useEffect } from 'react'

interface ThemeProviderProps {
  settings?: {
    primaryColor?: string
    sidebarBg?: string
    accentColor?: string
    gradientFrom?: string
    gradientTo?: string
  }
}

export default function ThemeProvider({ settings }: ThemeProviderProps) {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      
      if (settings?.primaryColor) {
        root.style.setProperty('--primary-color', settings.primaryColor)
      }
      if (settings?.sidebarBg) {
        root.style.setProperty('--sidebar-bg', settings.sidebarBg)
      }
      if (settings?.accentColor) {
        root.style.setProperty('--accent-color', settings.accentColor)
      }
      if (settings?.gradientFrom) {
        root.style.setProperty('--gradient-from', settings.gradientFrom)
      }
      if (settings?.gradientTo) {
        root.style.setProperty('--gradient-to', settings.gradientTo)
      }
    }
  }, [settings])

  return null
}
