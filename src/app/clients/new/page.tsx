"use client"

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import AppShell from '@/components/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewClientPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    birth_date: '',
    height_cm: '',
    gender: '',
    start_date: new Date().toISOString().split('T')[0],
    status: 'active',
    notes: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('שם הלקוח הוא שדה חובה.')
      return
    }
    setLoading(true)
    setError('')

    const payload = {
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      birth_date: form.birth_date || null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      gender: form.gender || null,
      start_date: form.start_date || null,
      status: form.status,
      notes: form.notes || null,
    }

    const { data, error: err } = await supabase.from('clients').insert(payload).select().single()

    if (err) {
      setError('שגיאה בשמירת הלקוח. נסי שוב.')
      setLoading(false)
      return
    }

    router.push(`/clients/${data.id}`)
  }

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/clients">
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-brand-text">הוספת לקוח חדש</h1>
            <p className="text-brand-accent text-sm mt-1">מלאי את פרטי הלקוח</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">פרטים אישיים</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">שם מלא *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="שם הלקוח"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="050-0000000"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">אימייל</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    dir="ltr"
                    className="text-left"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birth_date">תאריך לידה</Label>
                  <Input
                    id="birth_date"
                    name="birth_date"
                    type="date"
                    value={form.birth_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height_cm">{'גובה (ס"מ)'}</Label>
                  <Input
                    id="height_cm"
                    name="height_cm"
                    type="number"
                    step="0.1"
                    value={form.height_cm}
                    onChange={handleChange}
                    placeholder="165"
                  />
                </div>
                <div className="space-y-2">
                  <Label>מגדר</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(val) => setForm((p) => ({ ...p, gender: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">אישה</SelectItem>
                      <SelectItem value="male">גבר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">תאריך התחלה</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={form.start_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>סטטוס</Label>
                  <Select
                    value={form.status}
                    onValueChange={(val) => setForm((p) => ({ ...p, status: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">פעיל</SelectItem>
                      <SelectItem value="inactive">לא פעיל</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">הערות</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="הערות נוספות על הלקוח..."
                  rows={3}
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      שומר...
                    </>
                  ) : (
                    'שמור לקוח'
                  )}
                </Button>
                <Link href="/clients">
                  <Button type="button" variant="outline">ביטול</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
