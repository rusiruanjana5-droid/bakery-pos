'use client'

import { useState } from 'react'
import Image from 'next/image'

interface StoreLogoProps {
  logoUrl?: string | null
  storeName: string
}

export default function StoreLogo({ logoUrl, storeName }: StoreLogoProps) {
  const [imageError, setImageError] = useState(false)

  if (!logoUrl || imageError) {
    // Fallback icon
    return (
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg mb-4">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl overflow-hidden shadow-lg bg-white">
      <Image
        src={logoUrl}
        alt={`${storeName} logo`}
        width={80}
        height={80}
        className="object-contain"
        priority
        onError={() => setImageError(true)}
      />
    </div>
  )
}
