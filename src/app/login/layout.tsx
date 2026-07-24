import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Login - Bakery POS',
  description: 'Sign in to Bakery POS',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  )
}