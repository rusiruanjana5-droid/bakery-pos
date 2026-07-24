import type { SalesFilter } from '@/lib/excelGenerator'

export interface DateRange {
  start: Date
  end: Date
  label: string
}

export function resolveDateRange(
  filter: SalesFilter,
  startDateStr?: string,
  endDateStr?: string
): DateRange {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay)
  endOfDay.setHours(23, 59, 59, 999)

  switch (filter) {
    case '7days': {
      const start = new Date(startOfDay)
      start.setDate(start.getDate() - 6)
      return { start, end: endOfDay, label: 'Last 7 Days' }
    }
    case 'thisMonth': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start, end: endOfDay, label: 'This Month' }
    }
    case 'thisYear': {
      const start = new Date(now.getFullYear(), 0, 1)
      return { start, end: endOfDay, label: 'This Year' }
    }
    case 'custom': {
      if (!startDateStr || !endDateStr) {
        throw new Error('Custom range requires start and end dates')
      }
      const start = new Date(startDateStr)
      start.setHours(0, 0, 0, 0)
      const end = new Date(endDateStr)
      end.setHours(23, 59, 59, 999)
      const label = `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`
      return { start, end, label }
    }
    default:
      throw new Error(`Unknown filter: ${filter}`)
  }
}

export function getLast24HoursRange(): DateRange {
  const end = new Date()
  const start = new Date(end.getTime() - 24 * 60 * 60 * 1000)
  return {
    start,
    end,
    label: `Last 24 Hours (${start.toLocaleString()} – ${end.toLocaleString()})`,
  }
}
