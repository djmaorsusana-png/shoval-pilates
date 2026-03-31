"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AppShell from '@/components/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { format, startOfWeek, endOfWeek, addWeeks } from 'date-fns'
import { he } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface Appointment {
  id: string
  client_id: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  type: string
  status: string
  price: number | null
  notes: string | null
  clients: { id: string; name: string } | null
}

const typeLabels: Record<string, string> = {
  pilates: 'פילאטיס',
  nutrition: 'תזונה',
  followup: 'מעקב',
  other: 'אחר',
}

const statusLabels: Record<string, string> = {
  scheduled: 'מתוכנן',
  completed: 'הושלם',
  cancelled: 'בוטל',
  noshow: 'לא הגיע',
}

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  scheduled: 'default',
  completed: 'success',
  cancelled: 'destructive',
  noshow: 'warning',
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [weekOffset, setWeekOffset] = useState(0)
  const [filterStatus, setFilterStatus] = useState('all')
  const supabase = createClient()

  const baseDate = new Date()
  const currentWeekStart = startOfWeek(addWeeks(baseDate, weekOffset), { weekStartsOn: 0 })
  const currentWeekEnd = endOfWeek(addWeeks(baseDate, weekOffset), { weekStartsOn: 0 })

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true)
      const weekStart = format(currentWeekStart, 'yyyy-MM-dd')
      const weekEnd = format(currentWeekEnd, 'yyyy-MM-dd')

      let query = supabase
        .from('appointments')
        .select('*, clients(id, name)')
        .gte('appointment_date', weekStart)
        .lte('appointment_date', weekEnd)
        .order('appointment_date')
        .order('appointment_time')

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus)
      }

      const { data } = await query
      setAppointments((data as unknown as Appointment[]) ?? [])
      setLoading(false)
    }
    fetchAppointments()
  }, [weekOffset, filterStatus]) // eslint-disable-line react-hooks/exhaustive-deps

  const weekLabel = format(currentWeekStart, "d בMMMM", { locale: he }) +
    ' — ' + format(currentWeekEnd, "d בMMMM yyyy", { locale: he })

  const grouped = appointments.reduce<Record<string, Appointment[]>>((acc, apt) => {
    if (!acc[apt.appointment_date]) acc[apt.appointment_date] = []
    acc[apt.appointment_date].push(apt)
    return acc
  }, {})

  return (
    <AppShell>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-text">פגישות</h1>
            <p className="text-brand-accent text-sm mt-1">{weekLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הסטטוסים</SelectItem>
                <SelectItem value="scheduled">מתוכנן</SelectItem>
                <SelectItem value="completed">הושלם</SelectItem>
                <SelectItem value="cancelled">בוטל</SelectItem>
                <SelectItem value="noshow">לא הגיע</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Week navigation */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((p) => p - 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setWeekOffset(0)}>
            השבוע
          </Button>
          <Button variant="outline" size="icon" onClick={() => setWeekOffset((p) => p + 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Appointments list */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="text-center py-16 text-brand-accent">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>אין פגישות לשבוע זה.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([date, apts]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-brand-accent mb-2">
                  {format(new Date(date), "EEEE, d בMMMM", { locale: he })}
                </h3>
                <div className="space-y-2">
                  {apts.map((apt) => (
                    <Card key={apt.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-center min-w-[48px]">
                              <p className="text-sm font-bold text-brand-text">{apt.appointment_time?.slice(0, 5)}</p>
                              <p className="text-xs text-brand-accent">{apt.duration_minutes}׳</p>
                            </div>
                            <div>
                              {apt.clients ? (
                                <Link href={`/clients/${apt.clients.id}`} className="font-medium text-sm hover:text-brand-accent transition-colors">
                                  {apt.clients.name}
                                </Link>
                              ) : (
                                <p className="font-medium text-sm">לקוח לא ידוע</p>
                              )}
                              <p className="text-xs text-brand-accent">
                                {typeLabels[apt.type] ?? apt.type}
                                {apt.price ? ` · ₪${apt.price}` : ''}
                              </p>
                            </div>
                          </div>
                          <Badge variant={statusVariant[apt.status] ?? 'secondary'}>
                            {statusLabels[apt.status] ?? apt.status}
                          </Badge>
                        </div>
                        {apt.notes && (
                          <p className="text-xs text-brand-accent mt-2 mr-16">{apt.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
