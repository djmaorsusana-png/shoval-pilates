"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AppShell from '@/components/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, CalendarDays, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { he } from 'date-fns/locale'
import { DEMO_CLIENTS, DEMO_APPOINTMENTS } from '@/lib/demoData'

const SUPABASE_CONFIGURED = process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'

interface Client {
  id: string
  name: string
  phone: string | null
  status: string
  start_date: string | null
}

interface Appointment {
  id: string
  client_id: string
  appointment_date: string
  appointment_time: string
  type: string
  status: string
  price: number | null
  clients: { name: string } | null
}

interface KPIs {
  activeClients: number
  weekAppointments: number
  monthRevenue: number
  todayAppointments: number
}

const appointmentTypeLabels: Record<string, string> = {
  pilates: 'פילאטיס',
  nutrition: 'תזונה',
  followup: 'מעקב',
  other: 'אחר',
}

const appointmentStatusLabels: Record<string, string> = {
  scheduled: 'מתוכנן',
  completed: 'הושלם',
  cancelled: 'בוטל',
  noshow: 'לא הגיע',
}

const statusBadgeVariant: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  scheduled: 'default',
  completed: 'success',
  cancelled: 'destructive',
  noshow: 'warning',
}

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPIs | null>(null)
  const [recentClients, setRecentClients] = useState<Client[]>([])
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      if (!SUPABASE_CONFIGURED) {
        // מצב דמו
        const todayStr = format(new Date(), 'yyyy-MM-dd')
        const todayApps = DEMO_APPOINTMENTS.filter(a => a.appointment_date === todayStr)
        const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 0 }), 'yyyy-MM-dd')
        const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 0 }), 'yyyy-MM-dd')
        const weekApps = DEMO_APPOINTMENTS.filter(a => a.appointment_date >= weekStart && a.appointment_date <= weekEnd)
        setKpis({ activeClients: 4, weekAppointments: weekApps.length, monthRevenue: 4850, todayAppointments: todayApps.length })
        setTodayAppointments(todayApps as unknown as Appointment[])
        setRecentClients(DEMO_CLIENTS.slice(0, 5) as unknown as Client[])
        setLoading(false)
        return
      }

      const today = new Date()
      const todayStr = format(today, 'yyyy-MM-dd')
      const weekStart = format(startOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd')
      const weekEnd = format(endOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd')
      const monthStart = format(startOfMonth(today), 'yyyy-MM-dd')
      const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd')

      const [
        { count: activeClients },
        { count: weekApps },
        { data: monthPayments },
        { data: todayApps },
        { data: clients },
      ] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('appointments').select('*', { count: 'exact', head: true })
          .gte('appointment_date', weekStart).lte('appointment_date', weekEnd),
        supabase.from('payments').select('amount').gte('payment_date', monthStart).lte('payment_date', monthEnd),
        supabase.from('appointments').select('*, clients(name)')
          .eq('appointment_date', todayStr).order('appointment_time'),
        supabase.from('clients').select('id, name, phone, status, start_date')
          .order('created_at', { ascending: false }).limit(5),
      ])

      const monthRevenue = monthPayments?.reduce((sum, p) => sum + (p.amount || 0), 0) ?? 0

      setKpis({
        activeClients: activeClients ?? 0,
        weekAppointments: weekApps ?? 0,
        monthRevenue,
        todayAppointments: todayApps?.length ?? 0,
      })
      setTodayAppointments((todayApps as unknown as Appointment[]) ?? [])
      setRecentClients(clients ?? [])
      setLoading(false)
    }

    fetchData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const todayFormatted = format(new Date(), "EEEE, d בMMMM yyyy", { locale: he })

  return (
    <AppShell>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-brand-text">לוח בקרה</h1>
          <p className="text-brand-accent text-sm mt-1 capitalize">{todayFormatted}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-brand-accent font-medium">לקוחות פעילים</span>
                    <div className="w-9 h-9 rounded-full bg-brand-accent/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-accent" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-brand-text">{kpis?.activeClients}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-brand-accent font-medium">פגישות השבוע</span>
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-brand-text">{kpis?.weekAppointments}</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-brand-accent font-medium">הכנסות החודש</span>
                    <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-brand-text">
                    ₪{kpis?.monthRevenue.toLocaleString('he-IL')}
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-brand-accent font-medium">פגישות היום</span>
                    <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-brand-text">{kpis?.todayAppointments}</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-accent" />
                פגישות היום
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : todayAppointments.length === 0 ? (
                <p className="text-brand-accent text-sm text-center py-6">אין פגישות להיום</p>
              ) : (
                <div className="space-y-3">
                  {todayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-brand-light border border-brand-border"
                    >
                      <div>
                        <p className="font-medium text-sm text-brand-text">
                          {apt.clients?.name ?? 'לקוח לא ידוע'}
                        </p>
                        <p className="text-xs text-brand-accent">
                          {appointmentTypeLabels[apt.type] ?? apt.type} · {apt.appointment_time?.slice(0, 5)}
                        </p>
                      </div>
                      <Badge variant={statusBadgeVariant[apt.status] ?? 'secondary'}>
                        {appointmentStatusLabels[apt.status] ?? apt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Clients */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-accent" />
                  לקוחות אחרונים
                </CardTitle>
                <Link href="/clients" className="text-xs text-brand-accent hover:underline">
                  הצג הכל
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : recentClients.length === 0 ? (
                <p className="text-brand-accent text-sm text-center py-6">אין לקוחות עדיין</p>
              ) : (
                <div className="space-y-2">
                  {recentClients.map((client) => (
                    <Link
                      key={client.id}
                      href={`/clients/${client.id}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-light transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center">
                          <span className="text-brand-accent text-sm font-semibold">
                            {client.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-brand-text">{client.name}</p>
                          {client.phone && (
                            <p className="text-xs text-brand-accent">{client.phone}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                        {client.status === 'active' ? 'פעיל' : 'לא פעיל'}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
