"use client"

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!ref.current) return
        ref.current.style.transition = 'opacity 0.18s ease, transform 0.18s ease'
        ref.current.style.opacity = '1'
        ref.current.style.transform = 'translateY(0)'
      })
    })

    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return (
    <div
      ref={ref}
      style={{ opacity: 0, transform: 'translateY(6px)' }}
    >
      {children}
    </div>
  )
}
