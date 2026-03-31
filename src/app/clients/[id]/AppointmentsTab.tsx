"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'
import { DEMO_APPOINTMENTS } from '@/lib/demoData'

const SUPABASE_CONFIGURED = process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'

interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  type: string
  status: string
  price: number | null
  notes: string | null
}

const typeLabels: Record<string, string> = {
  pilates: 'פילאטיס',
  nutrition: 'תזונה',
  followup: 'מעקב',
  other: 'אחר',
}

export default function AppointmentsTab({ clientId }: { clientId: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const [form, setForm] = useState({
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '09:00',
    duration_minutes: '60',
    type: 'pilates',
    status: 'scheduled',
    price: '',
    notes: '',
  })

  async function fetchAppointments() {
    if (!SUPABASE_CONFIGURED) {
      const demo = DEMO_APPOINTMENTS.filter(a => a.client_id === clientId) as unknown as Appointment[]
      setAppointments(demo.sort((a, b) => b.appointment_date.localeCompare(a.appointment_date)))
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('appointments')
      .select('*')
      .eq('client_id', clientId)
      .order('appointment_date', { ascending: false })
    setAppointments(data ?? [])
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchAppointments() }, [clientId])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('appointments').insert({
      client_id: clientId,
      appointment_date: form.appointment_date,
      appointment_time: form.appointment_time,
      duration_minutes: parseInt(form.duration_minutes) || 60,
      type: form.type,
      status: form.status,
      price: form.price ? parseFloat(form.price) : null,
      notes: form.notes || null,
    })
    await fetchAppointments()
    setOpen(false)
    setSaving(false)
    setForm({
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '09:00',
      duration_minutes: '60',
      type: 'pilates',
      status: 'scheduled',
      price: '',
      notes: '',
    })
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('appointments').update({ status }).eq('id', id)
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
  }

  if (loading) return <Skeleton className="h-48 w-full" />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-brand-text flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-brand-accent" />
          פגישות
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="ml-2 h-4 w-4" />
              פגישה חדשה
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>פגישה חדשה</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>תאריך</Label>
                  <Input name="appointment_date" type="date" value={form.appointment_date} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>שעה</Label>
                  <Input name="appointment_time" type="time" value={form.appointment_time} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>סוג פגישה</Label>
                  <Select value={form.type} onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pilates">פילאטיס</SelectItem>
                      <SelectItem value="nutrition">תזונה</SelectItem>
                      <SelectItem value="followup">מעקב</SelectItem>
                      <SelectItem value="other">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>משך (דקות)</Label>
                  <Input name="duration_minutes" type="number" value={form.duration_minutes} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>סטטוס</Label>
                  <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">מתוכנן</SelectItem>
                      <SelectItem value="completed">הושלם</SelectItem>
                      <SelectItem value="cancelled">בוטל</SelectItem>
                      <SelectItem value="noshow">לא הגיע</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>מחיר (₪)</Label>
                  <Input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="200" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>הערות</Label>
                <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'שומר...' : 'שמור פגישה'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {appointments.length === 0 ? (
        <p className="text-brand-accent text-sm text-center py-8">אין פגישות עדיין.</p>
      ) : (
        <div className="space-y-2">
          {appointments.map((apt) => (
            <Card key={apt.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">
                      {format(new Date(apt.appointment_date), 'dd/MM/yyyy')} · {apt.appointment_time?.slice(0, 5)}
                    </p>
                    <p className="text-xs text-brand-accent mt-0.5">
                      {typeLabels[apt.type] ?? apt.type} · {apt.duration_minutes} דק׳
                      {apt.price ? ` · ₪${apt.price}` : ''}
                    </p>
                    {apt.notes && <p className="text-xs text-brand-accent mt-1">{apt.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={apt.status} onValueChange={(v) => updateStatus(apt.id, v)}>
                      <SelectTrigger className="h-7 text-xs w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">מתוכנן</SelectItem>
                        <SelectItem value="completed">הושלם</SelectItem>
                        <SelectItem value="cancelled">בוטל</SelectItem>
                        <SelectItem value="noshow">לא הגיע</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
