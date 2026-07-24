'use client'

import { useState, useEffect } from 'react'

interface KitchenOrder {
  id: number
  productName: string
  status: 'preparing' | 'ready'
  orderType: 'Takeaway' | 'Delivery'
  deliveryPlatform?: 'UBER_EATS' | 'PICKME' | null
  createdAt: Date
}

export default function LiveKitchenQueue() {
  const [orders, setOrders] = useState<KitchenOrder[]>([
    { id: 102, productName: 'Cheese Kottu', status: 'preparing', orderType: 'Takeaway', createdAt: new Date(Date.now() - 5 * 60 * 1000) },
    { id: 103, productName: 'Chicken Fried Rice', status: 'preparing', orderType: 'Delivery', createdAt: new Date(Date.now() - 8 * 60 * 1000) },
    { id: 104, productName: 'Veggie Pizza', status: 'preparing', orderType: 'Takeaway', createdAt: new Date(Date.now() - 12 * 60 * 1000) },
    { id: 101, productName: 'Beef Burger', status: 'ready', orderType: 'Delivery', createdAt: new Date(Date.now() - 2 * 60 * 1000) },
    { id: 100, productName: 'Fish & Chips', status: 'ready', orderType: 'Takeaway', createdAt: new Date(Date.now() - 5 * 60 * 1000) },
  ])

  const [elapsedTimes, setElapsedTimes] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const newElapsedTimes: { [key: number]: number } = {}
      
      orders.forEach(order => {
        if (order.status === 'preparing') {
          const elapsed = Math.floor((now - order.createdAt.getTime()) / 1000 / 60) // in minutes
          newElapsedTimes[order.id] = elapsed
        }
      })
      
      setElapsedTimes(newElapsedTimes)
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [orders])

  const moveOrder = (orderId: number, newStatus: 'preparing' | 'ready') => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  const isDelayed = (orderId: number) => {
    const elapsed = elapsedTimes[orderId]
    return elapsed && elapsed > 15
  }

  const preparingOrders = orders.filter(o => o.status === 'preparing')
  const readyOrders = orders.filter(o => o.status === 'ready')

  return (
    <div className="bg-white rounded-xl shadow-md p-6" style={{ maxHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2 flex-shrink-0">
        <span className="text-orange-500">🍳</span>
        Live Kitchen Queue
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto" style={{ maxHeight: '320px' }}>
        {/* Preparing Column */}
        <div className="bg-amber-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-amber-800 flex items-center gap-2">
              <span className="w-3 h-3 bg-accent rounded-full animate-pulse"></span>
              Preparing
            </h3>
            <span className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium">
              {preparingOrders.length}
            </span>
          </div>
          <div className="space-y-3">
            {preparingOrders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No orders in preparation</p>
            ) : (
              preparingOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg p-4 shadow-sm border-l-4 hover:shadow-md transition-shadow ${
                    isDelayed(order.id) ? 'border-red-500 bg-red-50' : 'border-amber-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">Order #{order.id}</span>
                    <span className={`text-xs font-medium ${
                      isDelayed(order.id) ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {elapsedTimes[order.id] || 0} min
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">{order.productName}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.orderType === 'Takeaway' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {order.orderType}
                      </span>
                      {/* Delivery platform badge */}
                      {order.orderType === 'Delivery' && order.deliveryPlatform && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          order.deliveryPlatform === 'UBER_EATS'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.deliveryPlatform === 'UBER_EATS' ? 'Uber Eats' : 'PickMe'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => moveOrder(order.id, 'ready')}
                      className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                    >
                      Mark Ready
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ready for Pickup Column */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-green-800 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Ready for Pickup
            </h3>
            <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {readyOrders.length}
            </span>
          </div>
          <div className="space-y-3">
            {readyOrders.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No orders ready</p>
            ) : (
              readyOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">Order #{order.id}</span>
                    <span className="text-xs text-gray-500">
                      {Math.floor((Date.now() - order.createdAt.getTime()) / 1000 / 60)} min
                    </span>
                  </div>
                  <p className="text-gray-700 font-medium mb-2">{order.productName}</p>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.orderType === 'Takeaway' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {order.orderType}
                      </span>
                      {/* Delivery platform badge */}
                      {order.orderType === 'Delivery' && order.deliveryPlatform && (
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          order.deliveryPlatform === 'UBER_EATS'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.deliveryPlatform === 'UBER_EATS' ? 'Uber Eats' : 'PickMe'}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => moveOrder(order.id, 'preparing')}
                      className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                    >
                      Move Back
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
