"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import AppShell from '@/components/AppShell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Phone } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { DEMO_CLIENTS } from '@/lib/demoData'

const SUPABASE_CONFIGURED = process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'

interface Client {
  id: string
  name: string
  phone: string | null
  email: string | null
  status: string
  start_date: string | null
  created_at: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filtered, setFiltered] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchClients() {
      if (!SUPABASE_CONFIGURED) {
        const data = DEMO_CLIENTS as unknown as Client[]
        setClients(data)
        setFiltered(data)
        setLoading(false)
        return
      }
      const { data } = await supabase
        .from('clients')
        .select('id, name, phone, email, status, start_date, created_at')
        .order('created_at', { ascending: false })

      setClients(data ?? [])
      setFiltered(data ?? [])
      setLoading(false)
    }
    fetchClients()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.phone ?? '').includes(q) ||
          (c.email ?? '').toLowerCase().includes(q)
      )
    )
  }, [search, clients])

  return (
    <AppShell>
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-text">לקוחות</h1>
            <p className="text-brand-accent text-sm mt-1">
              {!loading && `${clients.length} לקוחות סה"כ`}
            </p>
          </div>
          <Link href="/clients/new">
            <Button>
              <Plus className="ml-2 h-4 w-4" />
              הוספת לקוח
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-accent" />
          <Input
            placeholder="חיפוש לפי שם, טלפון או אימייל..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-brand-accent">
                {search ? 'לא נמצאו לקוחות תואמים' : 'אין לקוחות עדיין'}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>טלפון</TableHead>
                    <TableHead>אימייל</TableHead>
                    <TableHead>תאריך התחלה</TableHead>
                    <TableHead>סטטוס</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((client) => (
                    <TableRow key={client.id} className="cursor-pointer">
                      <TableCell>
                        <Link
                          href={`/clients/${client.id}`}
                          className="flex items-center gap-3 hover:text-brand-accent transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center shrink-0">
                            <span className="text-brand-accent text-sm font-semibold">
                              {client.name.charAt(0)}
                            </span>
                          </div>
                          <span className="font-medium">{client.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {client.phone ? (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3 text-brand-accent" />
                            <span dir="ltr">{client.phone}</span>
                          </div>
                        ) : (
                          <span className="text-brand-accent text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm" dir="ltr">
                        {client.email ?? <span className="text-brand-accent">—</span>}
                      </TableCell>
                      <TableCell className="text-sm">
                        {client.start_date
                          ? format(new Date(client.start_date), 'dd/MM/yyyy')
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.status === 'active' ? 'success' : 'secondary'}>
                          {client.status === 'active' ? 'פעיל' : 'לא פעיל'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
