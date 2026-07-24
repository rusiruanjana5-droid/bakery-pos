'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSalesAnalytics } from '@/actions/order'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SalesAnalyticsData {
  today: number
  week: number
  month: number
  year: number
  chartData: Array<{ name: string; sales: number }>
}

export default function SalesAnalytics() {
  const [filter, setFilter] = useState<'7days' | 'thisMonth' | 'thisYear' | 'custom'>('7days')
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date()
    date.setDate(date.getDate() - 6)
    return date.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date()
    return date.toISOString().split('T')[0]
  })
  const [data, setData] = useState<SalesAnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'revenue' | 'orderCount'>('revenue')

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getSalesAnalytics(filter, startDate, endDate)
      setData(result)
    } catch (error) {
      console.error('Failed to fetch sales analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }, [filter, startDate, endDate])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('revenue')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'revenue'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setViewMode('orderCount')}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              viewMode === 'orderCount'
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Orders
          </button>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as '7days' | 'thisMonth' | 'thisYear' | 'custom')}
          className="h-7 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
        >
          <option value="7days">Last 7 Days</option>
          <option value="thisMonth">This Month</option>
          <option value="thisYear">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {filter === 'custom' && (
        <div className="flex gap-2 mb-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-7 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-7 px-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      )}
      
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data.chartData} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end"
              height={60}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              interval={data.chartData.length > 10 ? Math.floor(data.chartData.length / 10) : 0}
              stroke="#94a3b8"
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              stroke="#94a3b8"
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white rounded-lg shadow-lg px-3 py-2 text-xs">
                      <p className="font-medium mb-1">{label}</p>
                      <p>
                        {viewMode === 'revenue' 
                          ? `Rs. ${Number(payload[0].value).toFixed(2)}` 
                          : `${Number(payload[0].value)} orders`
                        }
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke={viewMode === 'revenue' ? "#f59e0b" : "#8b5cf6"} 
              strokeWidth={2}
              fillOpacity={1}
              fill={viewMode === 'revenue' ? "url(#colorRevenue)" : "url(#colorOrders)"}
              dot={{ fill: viewMode === 'revenue' ? "#f59e0b" : "#8b5cf6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: viewMode === 'revenue' ? "#f59e0b" : "#8b5cf6" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
