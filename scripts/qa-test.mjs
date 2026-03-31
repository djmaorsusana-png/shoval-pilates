#!/usr/bin/env node
/**
 * QA TEST RUNNER — Shoval Pilates
 * ================================
 * Verifies every feature area end-to-end against a live Supabase instance.
 *
 * Prerequisites:
 *   1. Copy .env.example → .env.local and fill in NEXT_PUBLIC_SUPABASE_URL
 *      and NEXT_PUBLIC_SUPABASE_ANON_KEY (service_role key for seed operations).
 *   2. Run supabase/seed.sql in the Supabase SQL editor first.
 *   3. node scripts/qa-test.mjs
 *
 * The script reads env from .env.local automatically.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// ---------------------------------------------------------------------------
// 0. CONFIG — load env from .env.local
// ---------------------------------------------------------------------------
const envPath = resolve(process.cwd(), '.env.local')
if (existsSync(envPath)) {
  const raw = readFileSync(envPath, 'utf8')
  for (const line of raw.split('\n')) {
    const [k, ...rest] = line.split('=')
    if (k && rest.length) process.env[k.trim()] = rest.join('=').trim()
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??   // prefer service-role for full access
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  // fallback: anon key (RLS applies)

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('\n❌  Missing Supabase credentials.')
  console.error('   Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local\n')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ---------------------------------------------------------------------------
// 1. TEST HARNESS
// ---------------------------------------------------------------------------
const PASS = '✅'
const FAIL = '❌'
const SKIP = '⏭ '
let passed = 0, failed = 0
const failures = []

function section(title) {
  console.log(`\n${'─'.repeat(60)}`)
  console.log(`  ${title}`)
  console.log('─'.repeat(60))
}

function ok(label, detail = '') {
  passed++
  console.log(`  ${PASS}  ${label}${detail ? '  →  ' + detail : ''}`)
}

function fail(label, err) {
  failed++
  const msg = err?.message ?? String(err)
  failures.push(`${label}: ${msg}`)
  console.log(`  ${FAIL}  ${label}  →  ${msg}`)
}

async function check(label, fn) {
  try {
    await fn()
    ok(label)
  } catch (e) {
    fail(label, e)
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

// ---------------------------------------------------------------------------
// 2. SEED IDs (must match supabase/seed.sql)
// ---------------------------------------------------------------------------
const ID = {
  clients: {
    yael:   'a0000000-0000-0000-0000-000000000001',
    michal: 'a0000000-0000-0000-0000-000000000002',
    dan:    'a0000000-0000-0000-0000-000000000003',
    noa:    'a0000000-0000-0000-0000-000000000004',
    rachel: 'a0000000-0000-0000-0000-000000000005',
    shira:  'a0000000-0000-0000-0000-000000000006',
  },
  appointments: {
    yael_comp1:  'b0000000-0000-0000-0000-000000000001',
    yael_sched:  'b0000000-0000-0000-0000-000000000005',
    dan_cancel:  'b0000000-0000-0000-0000-000000000014',
    michal_show: 'b0000000-0000-0000-0000-000000000011',
  },
  payments: {
    yael_p1:     'c0000000-0000-0000-0000-000000000001',
    yael_pkg:    'c0000000-0000-0000-0000-000000000003',
  },
  menus: {
    yael_w1:     'e0000000-0000-0000-0000-000000000001',
    yael_w2:     'e0000000-0000-0000-0000-000000000002',
    dan_muscle:  'e0000000-0000-0000-0000-000000000003',
  },
  templates: {
    loss:        'd0000000-0000-0000-0000-000000000001',
    maintain:    'd0000000-0000-0000-0000-000000000002',
    muscle:      'd0000000-0000-0000-0000-000000000003',
    lowcarb:     'd0000000-0000-0000-0000-000000000004',
  },
}

// ---------------------------------------------------------------------------
// 3. TESTS
// ---------------------------------------------------------------------------

// ── 3.1  CLIENTS ────────────────────────────────────────────────────────────
section('CLIENTS')

await check('List all clients (expect 6)', async () => {
  const { data, error } = await supabase.from('clients').select('*')
  if (error) throw error
  assert(data.length === 6, `Expected 6 clients, got ${data.length}`)
})

await check('Fetch single client — יעל כהן', async () => {
  const { data, error } = await supabase.from('clients').select('*').eq('id', ID.clients.yael).single()
  if (error) throw error
  assert(data.name === 'יעל כהן', 'Wrong name')
  assert(data.status === 'active', 'Should be active')
  assert(data.nutrition_calories_target === 1500, 'Wrong calorie target')
})

await check('Filter active clients (expect 5)', async () => {
  const { data, error } = await supabase.from('clients').select('id').eq('status', 'active')
  if (error) throw error
  assert(data.length === 5, `Expected 5 active, got ${data.length}`)
})

await check('Filter inactive clients (expect 1 — שירה)', async () => {
  const { data, error } = await supabase.from('clients').select('id').eq('status', 'inactive')
  if (error) throw error
  assert(data.length === 1, `Expected 1 inactive, got ${data.length}`)
})

await check('Search clients by name (partial, client-side)', async () => {
  const { data, error } = await supabase.from('clients').select('id,name')
  if (error) throw error
  const results = data.filter(c => c.name.includes('לוי'))
  assert(results.length === 1, 'Expected 1 result for "לוי"')
})

await check('Update client notes', async () => {
  const newNote = `QA-updated-${Date.now()}`
  const { error } = await supabase.from('clients')
    .update({ notes: newNote })
    .eq('id', ID.clients.noa)
  if (error) throw error
  const { data } = await supabase.from('clients').select('notes').eq('id', ID.clients.noa).single()
  assert(data.notes === newNote, 'Note was not updated')
})

await check('Create and delete a temporary client', async () => {
  const { data, error } = await supabase.from('clients')
    .insert({ name: 'בדיקה זמנית QA', status: 'inactive' })
    .select('id')
    .single()
  if (error) throw error
  const { error: delErr } = await supabase.from('clients').delete().eq('id', data.id)
  if (delErr) throw delErr
})

await check('Male client filter (דן אברהם)', async () => {
  const { data, error } = await supabase.from('clients').select('id').eq('gender', 'male')
  if (error) throw error
  assert(data.length >= 1, 'Expected at least 1 male client')
})

// ── 3.2  MEASUREMENTS ───────────────────────────────────────────────────────
section('MEASUREMENTS')

await check('Total measurements (expect 15)', async () => {
  const { count, error } = await supabase.from('measurements').select('*', { count: 'exact', head: true })
  if (error) throw error
  assert(count === 15, `Expected 15, got ${count}`)
})

await check('יעל — 6 measurements in ascending date order', async () => {
  const { data, error } = await supabase.from('measurements')
    .select('measured_at,weight_kg')
    .eq('client_id', ID.clients.yael)
    .order('measured_at', { ascending: true })
  if (error) throw error
  assert(data.length === 6, `Expected 6, got ${data.length}`)
  assert(parseFloat(data[0].weight_kg) > parseFloat(data[5].weight_kg), 'Weight should decrease over time')
})

await check('דן — 3 measurements with decreasing body fat', async () => {
  const { data, error } = await supabase.from('measurements')
    .select('body_fat_pct')
    .eq('client_id', ID.clients.dan)
    .order('measured_at', { ascending: true })
  if (error) throw error
  assert(data.length === 3, `Expected 3, got ${data.length}`)
  assert(parseFloat(data[0].body_fat_pct) > parseFloat(data[2].body_fat_pct), 'Body fat should decrease')
})

await check('Insert + delete a measurement', async () => {
  const { data, error } = await supabase.from('measurements')
    .insert({ client_id: ID.clients.rachel, measured_at: '2026-04-01', weight_kg: 62.5, notes: 'QA test' })
    .select('id').single()
  if (error) throw error
  await supabase.from('measurements').delete().eq('id', data.id)
})

await check('Latest measurement query (max measured_at per client)', async () => {
  const { data, error } = await supabase.from('measurements')
    .select('weight_kg, body_fat_pct')
    .eq('client_id', ID.clients.yael)
    .order('measured_at', { ascending: false })
    .limit(1)
  if (error) throw error
  assert(data.length === 1, 'Should have latest measurement')
  assert(parseFloat(data[0].weight_kg) === 68.2, 'Latest weight should be 68.2')
})

// ── 3.3  APPOINTMENTS ────────────────────────────────────────────────────────
section('APPOINTMENTS')

await check('Total appointments (expect 21)', async () => {
  const { count, error } = await supabase.from('appointments').select('*', { count: 'exact', head: true })
  if (error) throw error
  assert(count === 21, `Expected 21, got ${count}`)
})

await check('Appointments with client join (יעל)', async () => {
  const { data, error } = await supabase.from('appointments')
    .select('id, type, status, clients(name)')
    .eq('client_id', ID.clients.yael)
    .order('appointment_date', { ascending: false })
  if (error) throw error
  assert(data.length === 6, `Expected 6 for יעל, got ${data.length}`)
  assert(data[0].clients?.name === 'יעל כהן', 'Client name join failed')
})

await check('Filter by status=completed', async () => {
  const { data, error } = await supabase.from('appointments').select('id').eq('status', 'completed')
  if (error) throw error
  assert(data.length > 0, 'Should have completed appointments')
})

await check('Filter by status=scheduled', async () => {
  const { data, error } = await supabase.from('appointments').select('id').eq('status', 'scheduled')
  if (error) throw error
  assert(data.length > 0, 'Should have scheduled appointments')
})

await check('Filter by status=noshow (מיכל — 1)', async () => {
  const { data, error } = await supabase.from('appointments').select('id').eq('status', 'noshow')
  if (error) throw error
  assert(data.length === 1, `Expected 1 noshow, got ${data.length}`)
})

await check('Filter by type=nutrition', async () => {
  const { data, error } = await supabase.from('appointments').select('id').eq('type', 'nutrition')
  if (error) throw error
  assert(data.length === 2, `Expected 2 nutrition appointments, got ${data.length}`)
})

await check('Weekly view — date range filter', async () => {
  const { data, error } = await supabase.from('appointments')
    .select('id, appointment_date, clients(name)')
    .gte('appointment_date', '2026-03-03')
    .lte('appointment_date', '2026-03-09')
  if (error) throw error
  assert(data.length >= 3, `Expected ≥3 this week, got ${data.length}`)
})

await check('Update appointment status (scheduled → completed)', async () => {
  await supabase.from('appointments').update({ status: 'completed' }).eq('id', ID.appointments.yael_sched)
  const { data } = await supabase.from('appointments').select('status').eq('id', ID.appointments.yael_sched).single()
  assert(data.status === 'completed', 'Status not updated')
  // revert
  await supabase.from('appointments').update({ status: 'scheduled' }).eq('id', ID.appointments.yael_sched)
})

await check('Dashboard: count appointments in current week', async () => {
  const today = new Date('2026-04-01')
  const day = today.getDay()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - day)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  const fmt = d => d.toISOString().split('T')[0]
  const { count, error } = await supabase.from('appointments')
    .select('*', { count: 'exact', head: true })
    .gte('appointment_date', fmt(weekStart))
    .lte('appointment_date', fmt(weekEnd))
  if (error) throw error
  // Just verify the query runs; count depends on seed dates vs current date
  ok('weekly count query returned without error', `count=${count}`)
})

// ── 3.4  PAYMENTS ────────────────────────────────────────────────────────────
section('PAYMENTS')

await check('Total payments (expect 13)', async () => {
  const { count, error } = await supabase.from('payments').select('*', { count: 'exact', head: true })
  if (error) throw error
  assert(count === 13, `Expected 13, got ${count}`)
})

await check('יעל — 4 payments, verify total is 1550 ₪', async () => {
  const { data, error } = await supabase.from('payments').select('amount').eq('client_id', ID.clients.yael)
  if (error) throw error
  assert(data.length === 4, `Expected 4 payments for יעל, got ${data.length}`)
  const total = data.reduce((s, p) => s + parseFloat(p.amount), 0)
  assert(total === 1550, `Expected total 1550, got ${total}`)
})

await check('Payment method filter — cash', async () => {
  const { data, error } = await supabase.from('payments').select('id').eq('method', 'cash')
  if (error) throw error
  assert(data.length >= 4, `Expected ≥4 cash payments, got ${data.length}`)
})

await check('Payment method filter — transfer', async () => {
  const { data, error } = await supabase.from('payments').select('id').eq('method', 'transfer')
  if (error) throw error
  assert(data.length >= 3, `Expected ≥3 transfer payments, got ${data.length}`)
})

await check('Payments joined with appointment_id check', async () => {
  const { data, error } = await supabase.from('payments')
    .select('id, amount, appointment_id')
    .eq('client_id', ID.clients.yael)
  if (error) throw error
  const linked = data.filter(p => p.appointment_id !== null)
  assert(linked.length >= 2, `Expected ≥2 payments linked to appointments`)
})

await check('Monthly revenue aggregation (march 2026)', async () => {
  const { data, error } = await supabase.from('payments')
    .select('amount')
    .gte('payment_date', '2026-03-01')
    .lte('payment_date', '2026-03-31')
  if (error) throw error
  const total = data.reduce((s, p) => s + parseFloat(p.amount), 0)
  assert(total > 0, `March revenue should be > 0, got ${total}`)
  ok('March revenue', `${total} ₪`)
})

await check('Insert + delete payment', async () => {
  const { data, error } = await supabase.from('payments')
    .insert({ client_id: ID.clients.noa, amount: 250, payment_date: '2026-04-01', method: 'cash', description: 'QA test' })
    .select('id').single()
  if (error) throw error
  await supabase.from('payments').delete().eq('id', data.id)
})

// ── 3.5  MENU TEMPLATES ──────────────────────────────────────────────────────
section('MENU TEMPLATES')

await check('4 templates seeded', async () => {
  const { data, error } = await supabase.from('menu_templates').select('*')
  if (error) throw error
  assert(data.length === 4, `Expected 4, got ${data.length}`)
})

await check('Weight-loss template has 1500 cal target', async () => {
  const { data, error } = await supabase.from('menu_templates').select('*').eq('id', ID.templates.loss).single()
  if (error) throw error
  assert(data.calories_target === 1500, `Expected 1500, got ${data.calories_target}`)
})

await check('Muscle-gain template has 2200 cal target', async () => {
  const { data, error } = await supabase.from('menu_templates').select('*').eq('id', ID.templates.muscle).single()
  if (error) throw error
  assert(data.calories_target === 2200, `Expected 2200, got ${data.calories_target}`)
})

// ── 3.6  MENUS + ITEMS ────────────────────────────────────────────────────────
section('MENUS + MENU ITEMS')

await check('3 menus seeded', async () => {
  const { count, error } = await supabase.from('menus').select('*', { count: 'exact', head: true })
  if (error) throw error
  assert(count === 3, `Expected 3, got ${count}`)
})

await check('יעל — 2 menus', async () => {
  const { data, error } = await supabase.from('menus').select('id').eq('client_id', ID.clients.yael)
  if (error) throw error
  assert(data.length === 2, `Expected 2, got ${data.length}`)
})

await check('Menu with nested items (יעל שבוע 1 — expect 13 items)', async () => {
  const { data, error } = await supabase.from('menus')
    .select('id, name, menu_items(*)')
    .eq('id', ID.menus.yael_w1)
    .single()
  if (error) throw error
  assert(data.menu_items.length === 13, `Expected 13 items, got ${data.menu_items.length}`)
})

await check('All 6 meal types present in יעל שבוע 1', async () => {
  const { data, error } = await supabase.from('menu_items')
    .select('meal_type')
    .eq('menu_id', ID.menus.yael_w1)
  if (error) throw error
  const types = new Set(data.map(i => i.meal_type))
  const expected = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack']
  for (const t of expected) {
    assert(types.has(t), `Missing meal type: ${t}`)
  }
})

await check('יעל שבוע 1 — total calories ≈ 1419 (within ±50)', async () => {
  const { data, error } = await supabase.from('menu_items')
    .select('calories')
    .eq('menu_id', ID.menus.yael_w1)
  if (error) throw error
  const total = data.reduce((s, i) => s + parseFloat(i.calories ?? 0), 0)
  assert(Math.abs(total - 1419) <= 50, `Total calories ${total} not within ±50 of 1419`)
  ok('total calories', `${total.toFixed(0)} קל`)
})

await check('דן — muscle menu has items across multiple meal types', async () => {
  const { data, error } = await supabase.from('menu_items')
    .select('meal_type')
    .eq('menu_id', ID.menus.dan_muscle)
  if (error) throw error
  const types = new Set(data.map(i => i.meal_type))
  assert(types.size >= 4, `Expected ≥4 meal types for דן, got ${types.size}`)
})

await check('Nutrition page: all menus with client join', async () => {
  const { data, error } = await supabase.from('menus')
    .select('id, name, menu_date, clients(name), menu_items(calories, protein_g)')
    .order('menu_date', { ascending: false })
  if (error) throw error
  assert(data.length === 3, `Expected 3 menus on nutrition page, got ${data.length}`)
  assert(data[0].clients !== null, 'Client join missing on menus')
})

await check('Insert + delete a menu with items', async () => {
  const { data: menu, error: mErr } = await supabase.from('menus')
    .insert({ client_id: ID.clients.rachel, name: 'QA Test Menu', menu_date: '2026-04-01' })
    .select('id').single()
  if (mErr) throw mErr

  const { error: iErr } = await supabase.from('menu_items').insert([
    { menu_id: menu.id, food_name: 'ביצה', quantity_grams: 60, meal_type: 'breakfast', calories: 90, protein_g: 8, carbs_g: 0.5, fat_g: 7 },
    { menu_id: menu.id, food_name: 'עגבנייה', quantity_grams: 100, meal_type: 'breakfast', calories: 18, protein_g: 0.9, carbs_g: 3.9, fat_g: 0.2 },
  ])
  if (iErr) throw iErr

  // Cascade delete should remove items too
  const { error: dErr } = await supabase.from('menus').delete().eq('id', menu.id)
  if (dErr) throw dErr

  const { data: orphans } = await supabase.from('menu_items').select('id').eq('menu_id', menu.id)
  assert(!orphans || orphans.length === 0, 'Cascade delete did not remove menu_items')
})

// ── 3.7  DASHBOARD AGGREGATIONS ─────────────────────────────────────────────
section('DASHBOARD AGGREGATIONS')

await check('Active client count', async () => {
  const { count, error } = await supabase.from('clients')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')
  if (error) throw error
  assert(count === 5, `Expected 5, got ${count}`)
  ok('active clients', count)
})

await check('Recent 5 clients (dashboard widget)', async () => {
  const { data, error } = await supabase.from('clients')
    .select('id,name,status,created_at')
    .order('created_at', { ascending: false })
    .limit(5)
  if (error) throw error
  assert(data.length === 5, `Expected 5, got ${data.length}`)
})

await check("Today's appointments with client name (2026-04-01)", async () => {
  const { data, error } = await supabase.from('appointments')
    .select('id, appointment_time, type, clients(name)')
    .eq('appointment_date', '2026-04-01')
  if (error) throw error
  // דן has appointment on 2026-04-01
  ok("today's appointments", `count=${data.length}`)
})

await check('All-time revenue sum', async () => {
  const { data, error } = await supabase.from('payments').select('amount')
  if (error) throw error
  const total = data.reduce((s, p) => s + parseFloat(p.amount), 0)
  assert(total > 0, 'Revenue should be positive')
  ok('total revenue', `${total.toFixed(0)} ₪`)
})

// ── 3.8  CASCADE DELETES ─────────────────────────────────────────────────────
section('REFERENTIAL INTEGRITY')

await check('Creating client with full cascade then deleting removes all related rows', async () => {
  // Create temporary client
  const { data: cl } = await supabase.from('clients')
    .insert({ name: 'QA Cascade Test', status: 'inactive' })
    .select('id').single()

  // Add measurement, appointment, payment, menu+items
  await supabase.from('measurements').insert({ client_id: cl.id, measured_at: '2026-04-01', weight_kg: 65 })

  const { data: appt } = await supabase.from('appointments')
    .insert({ client_id: cl.id, appointment_date: '2026-04-01', appointment_time: '10:00', type: 'pilates', status: 'scheduled' })
    .select('id').single()

  await supabase.from('payments')
    .insert({ client_id: cl.id, appointment_id: appt.id, amount: 250, payment_date: '2026-04-01', method: 'cash' })

  const { data: menu } = await supabase.from('menus')
    .insert({ client_id: cl.id, name: 'QA Menu', menu_date: '2026-04-01' })
    .select('id').single()

  await supabase.from('menu_items')
    .insert({ menu_id: menu.id, food_name: 'ביצה', meal_type: 'breakfast', calories: 90 })

  // Delete client — should cascade everything
  await supabase.from('clients').delete().eq('id', cl.id)

  // Verify all child rows gone
  const checks = await Promise.all([
    supabase.from('measurements').select('id').eq('client_id', cl.id),
    supabase.from('appointments').select('id').eq('client_id', cl.id),
    supabase.from('payments').select('id').eq('client_id', cl.id),
    supabase.from('menus').select('id').eq('client_id', cl.id),
  ])

  for (const { data } of checks) {
    assert(!data || data.length === 0, 'Cascade delete left orphaned rows')
  }
})

await check('Deleting appointment sets payment.appointment_id to null (set null)', async () => {
  // Create a temp appointment + payment
  const { data: appt } = await supabase.from('appointments')
    .insert({ client_id: ID.clients.noa, appointment_date: '2026-04-10', appointment_time: '15:00', type: 'pilates', status: 'scheduled' })
    .select('id').single()

  const { data: pay } = await supabase.from('payments')
    .insert({ client_id: ID.clients.noa, appointment_id: appt.id, amount: 250, payment_date: '2026-04-10', method: 'cash' })
    .select('id').single()

  await supabase.from('appointments').delete().eq('id', appt.id)

  const { data: updatedPay } = await supabase.from('payments').select('appointment_id').eq('id', pay.id).single()
  assert(updatedPay.appointment_id === null, 'appointment_id should be null after appointment delete')

  // cleanup
  await supabase.from('payments').delete().eq('id', pay.id)
})

// ── 3.9  DATA VALIDATION (CHECK CONSTRAINTS) ─────────────────────────────────
section('DATA VALIDATION')

await check('Invalid client gender is rejected', async () => {
  const { error } = await supabase.from('clients')
    .insert({ name: 'Invalid', gender: 'other' })
  assert(error !== null, 'Should have rejected invalid gender')
  assert(error.message.includes('check') || error.code === '23514', `Expected constraint error, got: ${error.message}`)
})

await check('Invalid appointment status is rejected', async () => {
  const { error } = await supabase.from('appointments')
    .insert({ client_id: ID.clients.yael, appointment_date: '2026-04-20', appointment_time: '10:00', status: 'maybe' })
  assert(error !== null, 'Should have rejected invalid status')
})

await check('Invalid payment method is rejected', async () => {
  const { error } = await supabase.from('payments')
    .insert({ client_id: ID.clients.yael, amount: 100, payment_date: '2026-04-01', method: 'bitcoin' })
  assert(error !== null, 'Should have rejected invalid payment method')
})

await check('Invalid meal_type is rejected', async () => {
  const { data: menu } = await supabase.from('menus')
    .insert({ client_id: ID.clients.yael, name: 'Temp', menu_date: '2026-04-01' })
    .select('id').single()

  const { error } = await supabase.from('menu_items')
    .insert({ menu_id: menu.id, food_name: 'test', meal_type: 'snack' })
  assert(error !== null, 'Should reject invalid meal_type "snack"')

  await supabase.from('menus').delete().eq('id', menu.id)
})

// ---------------------------------------------------------------------------
// 4. SUMMARY
// ---------------------------------------------------------------------------
console.log(`\n${'═'.repeat(60)}`)
console.log(`  QA RESULTS`)
console.log('═'.repeat(60))
console.log(`  ${PASS}  Passed: ${passed}`)
console.log(`  ${FAIL}  Failed: ${failed}`)

if (failures.length > 0) {
  console.log(`\n  Failures:`)
  failures.forEach((f, i) => console.log(`   ${i + 1}. ${f}`))
}

console.log(`\n  Coverage:`)
console.log('   • Clients:          CRUD, filters, search, status')
console.log('   • Measurements:     CRUD, progression, latest-query')
console.log('   • Appointments:     CRUD, status-update, filters, weekly-view, joins')
console.log('   • Payments:         CRUD, totals, method-filter, FK-link')
console.log('   • Menu Templates:   read, field validation')
console.log('   • Menus + Items:    CRUD, nested-select, macro-aggregation, cascade')
console.log('   • Dashboard:        active-count, recent-clients, revenue, today-appts')
console.log('   • Referential:      cascade-delete, set-null-on-delete')
console.log('   • Validation:       check-constraint violations (gender, status, method, meal_type)')

console.log()
process.exit(failed > 0 ? 1 : 0)
