'use client'
import { Roller } from 'react-css-spinners'

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="flex flex-col items-center space-y-4">
        <Roller color="#fff" size={80} />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-1">Loading...</h1>
          <p className="text-white/70 text-sm">Please wait while we prepare your experience</p>
        </div>
      </div>
    </div>
  )
}
