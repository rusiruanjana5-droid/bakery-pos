import { getOrders } from '@/actions/order'
import { getProducts } from '@/actions/product'
import { getStoreSettings } from '@/actions/store'
import { getSession } from '@/lib/session'
import OrdersClient from './OrdersClient'

export default async function OrdersPage() {
  const session = await getSession()
  const orders = await getOrders()
  const products = await getProducts()
  const storeSettings = await getStoreSettings()

  return (
    <OrdersClient
      session={{
        userId: session.userId,
        username: session.username,
        role: session.role,
        isLoggedIn: session.isLoggedIn
      }}
      orders={orders}
      products={products}
      storeSettings={storeSettings}
    />
  )
}
