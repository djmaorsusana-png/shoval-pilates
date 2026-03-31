"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, TrendingDown } from 'lucide-react'
import { format } from 'date-fns'
import { DEMO_MEASUREMENTS } from '@/lib/demoData'

const SUPABASE_CONFIGURED = process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

interface Measurement {
  id: string
  measured_at: string
  weight_kg: number | null
  body_fat_pct: number | null
  waist_cm: number | null
  hips_cm: number | null
  chest_cm: number | null
  arms_cm: number | null
  thighs_cm: number | null
  notes: string | null
}

export default function MeasurementsTab({ clientId }: { clientId: string }) {
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const [form, setForm] = useState({
    measured_at: new Date().toISOString().split('T')[0],
    weight_kg: '',
    body_fat_pct: '',
    waist_cm: '',
    hips_cm: '',
    chest_cm: '',
    arms_cm: '',
    thighs_cm: '',
    notes: '',
  })

  async function fetchMeasurements() {
    if (!SUPABASE_CONFIGURED) {
      const demo = (DEMO_MEASUREMENTS as Record<string, Measurement[]>)[clientId] ?? []
      setMeasurements(demo)
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('measurements')
      .select('*')
      .eq('client_id', clientId)
      .order('measured_at', { ascending: true })
    setMeasurements(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchMeasurements() }, [clientId]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('measurements').insert({
      client_id: clientId,
      measured_at: form.measured_at,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      body_fat_pct: form.body_fat_pct ? parseFloat(form.body_fat_pct) : null,
      waist_cm: form.waist_cm ? parseFloat(form.waist_cm) : null,
      hips_cm: form.hips_cm ? parseFloat(form.hips_cm) : null,
      chest_cm: form.chest_cm ? parseFloat(form.chest_cm) : null,
      arms_cm: form.arms_cm ? parseFloat(form.arms_cm) : null,
      thighs_cm: form.thighs_cm ? parseFloat(form.thighs_cm) : null,
      notes: form.notes || null,
    })
    await fetchMeasurements()
    setOpen(false)
    setSaving(false)
    setForm({
      measured_at: new Date().toISOString().split('T')[0],
      weight_kg: '', body_fat_pct: '', waist_cm: '', hips_cm: '',
      chest_cm: '', arms_cm: '', thighs_cm: '', notes: '',
    })
  }

  const chartData = measurements.map((m) => ({
    date: format(new Date(m.measured_at), 'dd/MM'),
    'משקל': m.weight_kg,
    'אחוז שומן': m.body_fat_pct,
  }))

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-brand-text flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-brand-accent" />
          מדידות
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="ml-2 h-4 w-4" />
              הוספת מדידה
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>מדידה חדשה</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>תאריך מדידה</Label>
                <Input name="measured_at" type="date" value={form.measured_at} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>{'משקל (ק"ג)'}</Label>
                  <Input name="weight_kg" type="number" step="0.1" value={form.weight_kg} onChange={handleChange} placeholder="65.5" />
                </div>
                <div className="space-y-2">
                  <Label>אחוז שומן (%)</Label>
                  <Input name="body_fat_pct" type="number" step="0.1" value={form.body_fat_pct} onChange={handleChange} placeholder="22.5" />
                </div>
                <div className="space-y-2">
                  <Label>{'מותן (ס"מ)'}</Label>
                  <Input name="waist_cm" type="number" step="0.1" value={form.waist_cm} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>{'ירכיים (ס"מ)'}</Label>
                  <Input name="hips_cm" type="number" step="0.1" value={form.hips_cm} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>{'חזה (ס"מ)'}</Label>
                  <Input name="chest_cm" type="number" step="0.1" value={form.chest_cm} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>{'ידיים (ס"מ)'}</Label>
                  <Input name="arms_cm" type="number" step="0.1" value={form.arms_cm} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label>{'ירכיים עגולות (ס"מ)'}</Label>
                  <Input name="thighs_cm" type="number" step="0.1" value={form.thighs_cm} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>הערות</Label>
                <Textarea name="notes" value={form.notes} onChange={handleChange} rows={2} />
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? 'שומר...' : 'שמור מדידה'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {measurements.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">גרף משקל ואחוז שומן</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E0DA" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="משקל" stroke="#8C7B6B" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="אחוז שומן" stroke="#2D2926" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {measurements.length === 0 ? (
        <p className="text-brand-accent text-sm text-center py-8">אין מדידות עדיין.</p>
      ) : (
        <div className="space-y-2">
          {[...measurements].reverse().map((m) => (
            <Card key={m.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{format(new Date(m.measured_at), 'dd/MM/yyyy')}</span>
                  {m.weight_kg && (
                    <span className="text-brand-accent text-sm font-medium">{`${m.weight_kg} ק"ג`}</span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-xs text-brand-accent">
                  {m.body_fat_pct && <span>שומן: {m.body_fat_pct}%</span>}
                  {m.waist_cm && <span>מותן: {m.waist_cm}</span>}
                  {m.hips_cm && <span>ירכיים: {m.hips_cm}</span>}
                  {m.chest_cm && <span>חזה: {m.chest_cm}</span>}
                  {m.arms_cm && <span>ידיים: {m.arms_cm}</span>}
                  {m.thighs_cm && <span>ירכיים: {m.thighs_cm}</span>}
                </div>
                {m.notes && <p className="text-xs text-brand-accent mt-2">{m.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
