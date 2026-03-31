"use client"

import Sidebar from './Sidebar'
import PageTransition from './PageTransition'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
    </div>
  )
}
