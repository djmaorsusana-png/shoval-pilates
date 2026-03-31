"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import AppShell from '@/components/AppShell'
import { DEMO_CLIENTS } from '@/lib/demoData'

const SUPABASE_CONFIGURED = process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowRight, Loader2, Pencil, Save, X } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import MeasurementsTab from './MeasurementsTab'
import AppointmentsTab from './AppointmentsTab'
import PaymentsTab from './PaymentsTab'
import NutritionTab from './NutritionTab'

interface Client {
  id: string
  name: string
  phone: string | null
  email: string | null
  birth_date: string | null
  height_cm: number | null
  gender: string | null
  start_date: string | null
  status: string
  notes: string | null
  nutrition_calories_target: number | null
  nutrition_protein_target: number | null
  nutrition_carbs_target: number | null
  nutrition_fat_target: number | null
  created_at: string
}

export default function ClientProfilePage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientId = params.id as string
  const defaultTab = searchParams.get('tab') ?? 'details'
  const supabase = createClient()

  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<Client>>({})

  useEffect(() => {
    async function fetchClient() {
      if (!SUPABASE_CONFIGURED) {
        const demo = DEMO_CLIENTS.find(c => c.id === clientId) as unknown as Client | undefined
        if (!demo) { router.push('/clients'); return }
        setClient(demo)
        setForm(demo)
        setLoading(false)
        return
      }
      const { data } = await supabase.from('clients').select('*').eq('id', clientId).single()
      if (!data) {
        router.push('/clients')
        return
      }
      setClient(data)
      setForm(data)
      setLoading(false)
    }
    fetchClient()
  }, [clientId]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setSaving(true)
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: form.name,
        phone: form.phone || null,
        email: form.email || null,
        birth_date: form.birth_date || null,
        height_cm: form.height_cm ? Number(form.height_cm) : null,
        gender: form.gender || null,
        start_date: form.start_date || null,
        status: form.status,
        notes: form.notes || null,
      })
      .eq('id', clientId)
      .select()
      .single()

    if (!error && data) {
      setClient(data)
      setEditing(false)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <AppShell>
        <div className="p-6 md:p-8 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppShell>
    )
  }

  if (!client) return null

  return (
    <AppShell>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/clients">
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center">
                <span className="text-brand-accent text-lg font-bold">{client.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-brand-text">{client.name}</h1>
                {client.phone && (
                  <p className="text-brand-accent text-sm" dir="ltr">{client.phone}</p>
                )}
              </div>
            </div>
          </div>
          <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
            {client.status === 'active' ? 'פעיל' : 'לא פעיל'}
          </Badge>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">פרטים</TabsTrigger>
            <TabsTrigger value="measurements">מדידות</TabsTrigger>
            <TabsTrigger value="appointments">פגישות</TabsTrigger>
            <TabsTrigger value="payments">תשלומים</TabsTrigger>
            <TabsTrigger value="nutrition">תזונה</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">פרטים אישיים</CardTitle>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <Pencil className="ml-2 h-3 w-3" />
                    עריכה
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                      {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(false); setForm(client) }}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label>שם מלא</Label>
                    {editing ? (
                      <Input name="name" value={form.name ?? ''} onChange={handleChange} />
                    ) : (
                      <p className="text-sm font-medium">{client.name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>טלפון</Label>
                    {editing ? (
                      <Input name="phone" value={form.phone ?? ''} onChange={handleChange} dir="ltr" className="text-left" />
                    ) : (
                      <p className="text-sm font-medium" dir="ltr">{client.phone ?? '—'}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>אימייל</Label>
                    {editing ? (
                      <Input name="email" type="email" value={form.email ?? ''} onChange={handleChange} dir="ltr" className="text-left" />
                    ) : (
                      <p className="text-sm font-medium" dir="ltr">{client.email ?? '—'}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>תאריך לידה</Label>
                    {editing ? (
                      <Input name="birth_date" type="date" value={form.birth_date ?? ''} onChange={handleChange} />
                    ) : (
                      <p className="text-sm font-medium">
                        {client.birth_date ? format(new Date(client.birth_date), 'dd/MM/yyyy') : '—'}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>{'גובה (ס"מ)'}</Label>
                    {editing ? (
                      <Input name="height_cm" type="number" step="0.1" value={form.height_cm ?? ''} onChange={handleChange} />
                    ) : (
                      <p className="text-sm font-medium">{client.height_cm ? `${client.height_cm} ס"מ` : '—'}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>מגדר</Label>
                    {editing ? (
                      <Select value={form.gender ?? ''} onValueChange={(v) => setForm((p) => ({ ...p, gender: v }))}>
                        <SelectTrigger><SelectValue placeholder="בחר..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">אישה</SelectItem>
                          <SelectItem value="male">גבר</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm font-medium">
                        {client.gender === 'female' ? 'אישה' : client.gender === 'male' ? 'גבר' : '—'}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>תאריך התחלה</Label>
                    {editing ? (
                      <Input name="start_date" type="date" value={form.start_date ?? ''} onChange={handleChange} />
                    ) : (
                      <p className="text-sm font-medium">
                        {client.start_date ? format(new Date(client.start_date), 'dd/MM/yyyy') : '—'}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label>סטטוס</Label>
                    {editing ? (
                      <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">פעיל</SelectItem>
                          <SelectItem value="inactive">לא פעיל</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                        {client.status === 'active' ? 'פעיל' : 'לא פעיל'}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <Label>הערות</Label>
                  {editing ? (
                    <Textarea name="notes" value={form.notes ?? ''} onChange={handleChange} rows={3} />
                  ) : (
                    <p className="text-sm">{client.notes || '—'}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="measurements">
            <MeasurementsTab clientId={clientId} />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsTab clientId={clientId} />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsTab clientId={clientId} />
          </TabsContent>

          <TabsContent value="nutrition">
            <NutritionTab clientId={clientId} client={client} />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
