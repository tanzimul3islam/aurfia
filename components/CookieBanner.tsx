'use client'
import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_ok')) {
      setOpen(true)
    }
  }, [])

  if (!open) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur">
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
        <p className="text-neutral-700 text-pretty">
          We use cookies to improve your experience. You can adjust settings at any time.
        </p>
        <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
          <button className="h-10 px-4 border border-black/10 rounded-none w-full sm:w-auto">
            Settings
          </button>
          <button
            className="h-10 px-4 bg-black text-white rounded-none w-full sm:w-auto"
            onClick={() => {
              localStorage.setItem('cookie_ok', '1')
              setOpen(false)
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
