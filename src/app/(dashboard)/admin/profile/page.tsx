import { getStoreSettings } from '@/actions/store'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import StoreProfileClient from './StoreProfileClient'

export default async function StoreProfilePage() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/')
  }

  const settings = await getStoreSettings()

  return <StoreProfileClient initialSettings={settings} />
}
