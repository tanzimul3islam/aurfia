'use client'
import { useEffect, useState } from 'react'

export default function Toast({ text, open, onClose }: { text: string; open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const t = setTimeout(onClose, 1600)
    return () => clearTimeout(t)
  }, [open])

  if (!open) return null

  return (
    <div className="fixed top-4 right-4 z-50 bg-black text-white text-sm px-4 h-10 grid place-items-center rounded-none">
      {text}
    </div>
  )
}
