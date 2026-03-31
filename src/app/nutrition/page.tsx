"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AppShell from '@/components/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Apple } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface MenuWithClient {
  id: string
  name: string
  menu_date: string
  clients: { id: string; name: string } | null
  menu_items: { calories: number | null; protein_g: number | null }[]
}

export default function NutritionPage() {
  const [menus, setMenus] = useState<MenuWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMenus() {
      const { data } = await supabase
        .from('menus')
        .select('id, name, menu_date, clients(id, name), menu_items(calories, protein_g)')
        .order('menu_date', { ascending: false })
        .limit(20)
      setMenus((data as unknown as MenuWithClient[]) ?? [])
      setLoading(false)
    }
    fetchMenus()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppShell>
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">תזונה</h1>
          <p className="text-brand-accent text-sm mt-1">כל התפריטים של הלקוחות</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : menus.length === 0 ? (
          <div className="text-center py-16 text-brand-accent">
            <Apple className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>אין תפריטים עדיין.</p>
            <p className="text-sm mt-1">
              הוסיפי תפריטים מתוך{' '}
              <Link href="/clients" className="text-brand-accent underline">
                דף הלקוח
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {menus.map((menu) => {
              const totalCals = menu.menu_items?.reduce((s, i) => s + (i.calories || 0), 0) ?? 0
              const totalProtein = menu.menu_items?.reduce((s, i) => s + (i.protein_g || 0), 0) ?? 0
              return (
                <Link key={menu.id} href={`/clients/${menu.clients?.id}?tab=nutrition`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{menu.name}</CardTitle>
                      <p className="text-xs text-brand-accent">
                        {menu.clients?.name ?? 'לקוח לא ידוע'}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-brand-accent mb-2">
                        {format(new Date(menu.menu_date), 'dd/MM/yyyy')}
                      </p>
                      <div className="flex gap-3 text-xs">
                        {totalCals > 0 && (
                          <span className="bg-brand-light px-2 py-0.5 rounded-full">
                            {Math.round(totalCals)} קל׳
                          </span>
                        )}
                        {totalProtein > 0 && (
                          <span className="bg-brand-light px-2 py-0.5 rounded-full">
                            {Math.round(totalProtein)}ג׳ חלבון
                          </span>
                        )}
                        <span className="bg-brand-light px-2 py-0.5 rounded-full">
                          {menu.menu_items?.length ?? 0} פריטים
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}
