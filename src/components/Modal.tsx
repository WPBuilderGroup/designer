"use client"
import { ReactNode, useEffect } from 'react'

export function Modal({ open, onCloseAction, title, children }: { open: boolean; onCloseAction: () => void; title?: string; children: ReactNode }) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') onCloseAction() }
    if (open) document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onCloseAction])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCloseAction} />
      <div className="relative bg-white rounded shadow-lg w-full max-w-lg mx-3">
        {title && <div className="border-b p-4 font-medium">{title}</div>}
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
