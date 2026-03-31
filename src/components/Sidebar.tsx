"use client"

import Link from 'next/link'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Apple,
  LayoutTemplate,
  LogOut,
} from 'lucide-react'

const navItems: { href: string; label: string; icon: React.ElementType; indent?: boolean }[] = [
  { href: '/dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/clients', label: 'לקוחות', icon: Users },
  { href: '/appointments', label: 'פגישות', icon: CalendarDays },
  { href: '/nutrition', label: 'תזונה', icon: Apple },
  { href: '/nutrition/templates', label: 'תבניות תפריט', icon: LayoutTemplate, indent: true },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-brand-text flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Pilates by Shoval"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = '<span class="text-white text-xl font-bold">P</span>'
                }
              }}
            />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Pilates</p>
            <p className="text-white/70 text-xs">by Shoval</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/nutrition' && pathname.startsWith(item.href + '/'))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150",
                item.indent ? "px-3 py-2 mr-4 text-xs" : "px-4 py-3",
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className={cn("shrink-0", item.indent ? "w-4 h-4" : "w-5 h-5")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-150 w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>יציאה</span>
        </button>
      </div>
    </aside>
  )
}
