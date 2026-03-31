"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { DEMO_PAYMENTS } from '@/lib/demoData'

const SUPABASE_CONFIGURED = process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'

interface Payment {
  id: string
  amount: number
  payment_date: string
  method: string
  description: string | null
}

const methodLabels: Record<string, string> = {
  cash: 'מזומן',
  transfer: 'העברה בנקאית',
  credit: 'כרטיס אשראי',
  other: 'אחר',
}

const methodVariant: Record<string, 'default' | 'success' | 'secondary'> = {
  cash: 'success',
  transfer: 'default',
  credit: 'secondary',
  other: 'secondary',
}

export default function PaymentsTab({ clientId }: { clientId: string }) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const [form, setForm] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    method: 'cash',
    description: '',
  })

  async function fetchPayments() {
    if (!SUPABASE_CONFIGURED) {
      const demo = ((DEMO_PAYMENTS as Record<string, Payment[]>)[clientId]) ?? []
      setPayments(demo)
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('payments')
      .select('*')
      .eq('client_id', clientId)
      .order('payment_date', { ascending: false })
    setPayments(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchPayments() }, [clientId]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    if (!form.amount) return
    setSaving(true)
    await supabase.from('payments').insert({
      client_id: clientId,
      amount: parseFloat(form.amount),
      payment_date: form.payment_date,
      method: form.method,
      description: form.description || null,
    })
    await fetchPayments()
    setOpen(false)
    setSaving(false)
    setForm({
      amount: '',
      payment_date: new Date().toISOString().split('T')[0],
      method: 'cash',
      description: '',
    })
  }

  const total = payments.reduce((sum, p) => sum + (p.amount || 0), 0)

  if (loading) return <Skeleton className="h-48 w-full" />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-brand-text flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-accent" />
            תשלומים
          </h3>
          {payments.length > 0 && (
            <span className="text-sm text-brand-accent font-medium">
              {`סה"כ: ₪${total.toLocaleString('he-IL')}`}
            </span>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="ml-2 h-4 w-4" />
              תשלום חדש
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>תשלום חדש</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>סכום (₪) *</Label>
                  <Input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} placeholder="200" required />
                </div>
                <div className="space-y-2">
                  <Label>תאריך</Label>
                  <Input name="payment_date" type="date" value={form.payment_date} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>אמצעי תשלום</Label>
                <Select value={form.method} onValueChange={(v) => setForm((p) => ({ ...p, method: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">מזומן</SelectItem>
                    <SelectItem value="transfer">העברה בנקאית</SelectItem>
                    <SelectItem value="credit">כרטיס אשראי</SelectItem>
                    <SelectItem value="other">אחר</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>תיאור</Label>
                <Input name="description" value={form.description} onChange={handleChange} placeholder="פגישת פילאטיס..." />
              </div>
              <Button onClick={handleSave} disabled={saving || !form.amount} className="w-full">
                {saving ? 'שומר...' : 'שמור תשלום'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {payments.length === 0 ? (
        <p className="text-brand-accent text-sm text-center py-8">אין תשלומים עדיין.</p>
      ) : (
        <div className="space-y-2">
          {payments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-brand-text">₪{Number(payment.amount).toLocaleString('he-IL')}</p>
                    <p className="text-xs text-brand-accent mt-0.5">
                      {format(new Date(payment.payment_date), 'dd/MM/yyyy')}
                      {payment.description ? ` · ${payment.description}` : ''}
                    </p>
                  </div>
                  <Badge variant={methodVariant[payment.method] ?? 'secondary'}>
                    {methodLabels[payment.method] ?? payment.method}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
