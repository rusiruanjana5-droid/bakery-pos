'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string
  sales: number
}

interface SalesChartProps {
  data: ChartData[]
}

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Last 7 Days Sales</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end"
            height={60}
            tick={{ fontSize: 11 }}
            interval={data.length > 10 ? Math.floor(data.length / 10) : 0}
          />
          <YAxis />
          <Tooltip
            formatter={(value: any) => [`Rs. ${Number(value).toFixed(2)}`, 'Sales']}
          />
          <Bar dataKey="sales" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
