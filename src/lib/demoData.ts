/**
 * נתוני דמו — מוצגים כשאין Supabase מוגדר
 */

export const isDemoMode =
  typeof window !== 'undefined'
    ? false // ייקבע בצד הלקוח
    : false

export const DEMO_CLIENTS = [
  {
    id: 'demo-1',
    name: 'יעל כהן',
    phone: '052-1234567',
    email: 'yael@example.com',
    birth_date: '1992-06-15',
    height_cm: 164,
    gender: 'female',
    status: 'active',
    start_date: '2025-09-01',
    notes: 'מגיעה 3 פעמים בשבוע, מטרה: ירידה של 8 ק"ג',
    nutrition_calories_target: 1500,
    nutrition_protein_target: 112,
    nutrition_carbs_target: 140,
    nutrition_fat_target: 50,
    created_at: '2025-09-01T08:00:00Z',
  },
  {
    id: 'demo-2',
    name: 'מיכל לוי',
    phone: '054-9876543',
    email: 'michal@example.com',
    birth_date: '1988-03-22',
    height_cm: 168,
    gender: 'female',
    status: 'active',
    start_date: '2025-10-15',
    notes: 'חזרה אחרי לידה, כאבי גב תחתון',
    nutrition_calories_target: 1800,
    nutrition_protein_target: 130,
    nutrition_carbs_target: 190,
    nutrition_fat_target: 62,
    created_at: '2025-10-15T09:00:00Z',
  },
  {
    id: 'demo-3',
    name: 'נועה ברק',
    phone: '050-5551234',
    email: null,
    birth_date: '1995-11-08',
    height_cm: 162,
    gender: 'female',
    status: 'active',
    start_date: '2026-01-10',
    notes: 'סטודנטית, זמינה בשעות הערב בלבד',
    nutrition_calories_target: null,
    nutrition_protein_target: null,
    nutrition_carbs_target: null,
    nutrition_fat_target: null,
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'demo-4',
    name: 'רחל אברהם',
    phone: '053-7778899',
    email: 'rachel@example.com',
    birth_date: '1979-08-30',
    height_cm: 160,
    gender: 'female',
    status: 'active',
    start_date: '2025-07-01',
    notes: 'קיבלה המלצה מרופא אחרי ניתוח ברך',
    nutrition_calories_target: 1650,
    nutrition_protein_target: 120,
    nutrition_carbs_target: 165,
    nutrition_fat_target: 55,
    created_at: '2025-07-01T11:00:00Z',
  },
  {
    id: 'demo-5',
    name: 'שירה גולן',
    phone: '058-3334455',
    email: 'shira@example.com',
    birth_date: '2000-01-20',
    height_cm: 170,
    gender: 'female',
    status: 'inactive',
    start_date: '2025-05-01',
    notes: 'הפסיקה זמנית בגלל לוחות זמנים',
    nutrition_calories_target: null,
    nutrition_protein_target: null,
    nutrition_carbs_target: null,
    nutrition_fat_target: null,
    created_at: '2025-05-01T08:00:00Z',
  },
]

export const DEMO_APPOINTMENTS = [
  {
    id: 'apt-1',
    client_id: 'demo-1',
    appointment_date: '2026-03-28',
    appointment_time: '09:00',
    duration_minutes: 60,
    type: 'pilates',
    status: 'scheduled',
    price: 250,
    notes: null,
    clients: { id: 'demo-1', name: 'יעל כהן' },
  },
  {
    id: 'apt-2',
    client_id: 'demo-2',
    appointment_date: '2026-03-28',
    appointment_time: '10:00',
    duration_minutes: 60,
    type: 'pilates',
    status: 'scheduled',
    price: 250,
    notes: 'להתמקד בחיזוק ליבה',
    clients: { id: 'demo-2', name: 'מיכל לוי' },
  },
  {
    id: 'apt-3',
    client_id: 'demo-4',
    appointment_date: '2026-03-28',
    appointment_time: '11:30',
    duration_minutes: 60,
    type: 'pilates',
    status: 'completed',
    price: 250,
    notes: null,
    clients: { id: 'demo-4', name: 'רחל אברהם' },
  },
  {
    id: 'apt-4',
    client_id: 'demo-1',
    appointment_date: '2026-03-26',
    appointment_time: '09:00',
    duration_minutes: 60,
    type: 'nutrition',
    status: 'completed',
    price: 300,
    notes: 'פגישת תזונה — עדכון תפריט',
    clients: { id: 'demo-1', name: 'יעל כהן' },
  },
  {
    id: 'apt-5',
    client_id: 'demo-3',
    appointment_date: '2026-03-30',
    appointment_time: '18:00',
    duration_minutes: 60,
    type: 'pilates',
    status: 'scheduled',
    price: 250,
    notes: null,
    clients: { id: 'demo-3', name: 'נועה ברק' },
  },
  {
    id: 'apt-6',
    client_id: 'demo-2',
    appointment_date: '2026-03-25',
    appointment_time: '10:00',
    duration_minutes: 60,
    type: 'pilates',
    status: 'noshow',
    price: 250,
    notes: null,
    clients: { id: 'demo-2', name: 'מיכל לוי' },
  },
]

export const DEMO_MEASUREMENTS = {
  'demo-1': [
    { id: 'm1', client_id: 'demo-1', measured_at: '2025-09-01', weight_kg: 74.2, body_fat_pct: 31.5, waist_cm: 82, hips_cm: 100, chest_cm: 90, arms_cm: 31, thighs_cm: 57, notes: 'מדידה ראשונה' },
    { id: 'm2', client_id: 'demo-1', measured_at: '2025-10-01', weight_kg: 72.8, body_fat_pct: 30.2, waist_cm: 80, hips_cm: 98, chest_cm: 89, arms_cm: 30.5, thighs_cm: 56, notes: null },
    { id: 'm3', client_id: 'demo-1', measured_at: '2025-11-01', weight_kg: 71.5, body_fat_pct: 29.1, waist_cm: 79, hips_cm: 97, chest_cm: 88, arms_cm: 30, thighs_cm: 55, notes: null },
    { id: 'm4', client_id: 'demo-1', measured_at: '2025-12-01', weight_kg: 70.3, body_fat_pct: 28.0, waist_cm: 77, hips_cm: 96, chest_cm: 87, arms_cm: 29.5, thighs_cm: 54, notes: 'מצוינת! ירידה עקבית' },
    { id: 'm5', client_id: 'demo-1', measured_at: '2026-01-01', weight_kg: 69.8, body_fat_pct: 27.5, waist_cm: 76, hips_cm: 95, chest_cm: 87, arms_cm: 29, thighs_cm: 54, notes: null },
    { id: 'm6', client_id: 'demo-1', measured_at: '2026-02-01', weight_kg: 68.9, body_fat_pct: 26.8, waist_cm: 75, hips_cm: 94, chest_cm: 86, arms_cm: 29, thighs_cm: 53, notes: null },
    { id: 'm7', client_id: 'demo-1', measured_at: '2026-03-01', weight_kg: 68.2, body_fat_pct: 26.2, waist_cm: 74, hips_cm: 93, chest_cm: 86, arms_cm: 28.5, thighs_cm: 52, notes: 'ירדה 6 ק"ג מההתחלה!' },
  ],
  'demo-2': [
    { id: 'm8', client_id: 'demo-2', measured_at: '2025-10-15', weight_kg: 68.5, body_fat_pct: 29.0, waist_cm: 78, hips_cm: 96, chest_cm: 88, arms_cm: 30, thighs_cm: 55, notes: 'אחרי לידה' },
    { id: 'm9', client_id: 'demo-2', measured_at: '2025-12-15', weight_kg: 66.8, body_fat_pct: 27.5, waist_cm: 75, hips_cm: 94, chest_cm: 87, arms_cm: 29.5, thighs_cm: 54, notes: null },
    { id: 'm10', client_id: 'demo-2', measured_at: '2026-02-15', weight_kg: 65.2, body_fat_pct: 26.0, waist_cm: 73, hips_cm: 92, chest_cm: 86, arms_cm: 29, thighs_cm: 53, notes: null },
  ],
}

export const DEMO_MENUS: Record<string, {
  id: string
  client_id: string
  name: string
  menu_date: string
  notes: string | null
  menu_items: {
    id: string
    menu_id: string
    food_name: string
    quantity_grams: number | null
    meal_type: string
    calories: number | null
    protein_g: number | null
    carbs_g: number | null
    fat_g: number | null
  }[]
}[]> = {
  'demo-1': [
    {
      id: 'menu-demo-1',
      client_id: 'demo-1',
      name: 'תפריט ירידה במשקל — שבוע 1',
      menu_date: '2026-03-01',
      notes: 'תפריט 1500 קלוריות, עשיר בחלבון',
      menu_items: [
        { id: 'mi-1', menu_id: 'menu-demo-1', food_name: 'שיבולת שועל', quantity_grams: 50, meal_type: 'breakfast', calories: 180, protein_g: 6, carbs_g: 30, fat_g: 3 },
        { id: 'mi-2', menu_id: 'menu-demo-1', food_name: 'חלב 1% שומן', quantity_grams: 200, meal_type: 'breakfast', calories: 82, protein_g: 7, carbs_g: 9, fat_g: 2 },
        { id: 'mi-3', menu_id: 'menu-demo-1', food_name: 'תפוח עץ', quantity_grams: 150, meal_type: 'morning_snack', calories: 78, protein_g: 0, carbs_g: 20, fat_g: 0 },
        { id: 'mi-4', menu_id: 'menu-demo-1', food_name: 'חזה עוף צלוי', quantity_grams: 150, meal_type: 'lunch', calories: 248, protein_g: 46, carbs_g: 0, fat_g: 5 },
        { id: 'mi-5', menu_id: 'menu-demo-1', food_name: 'אורז מלא מבושל', quantity_grams: 150, meal_type: 'lunch', calories: 165, protein_g: 4, carbs_g: 34, fat_g: 1 },
        { id: 'mi-6', menu_id: 'menu-demo-1', food_name: 'סלט ירקות', quantity_grams: 200, meal_type: 'lunch', calories: 50, protein_g: 2, carbs_g: 8, fat_g: 1 },
        { id: 'mi-7', menu_id: 'menu-demo-1', food_name: "גבינת קוטג' 5%", quantity_grams: 150, meal_type: 'afternoon_snack', calories: 120, protein_g: 16, carbs_g: 5, fat_g: 4 },
        { id: 'mi-8', menu_id: 'menu-demo-1', food_name: 'סלמון אפוי', quantity_grams: 150, meal_type: 'dinner', calories: 280, protein_g: 39, carbs_g: 0, fat_g: 13 },
        { id: 'mi-9', menu_id: 'menu-demo-1', food_name: 'ברוקולי מאודה', quantity_grams: 200, meal_type: 'dinner', calories: 68, protein_g: 6, carbs_g: 10, fat_g: 1 },
      ],
    },
  ],
}

export const DEMO_PAYMENTS = {
  'demo-1': [
    { id: 'pay-1', client_id: 'demo-1', appointment_id: 'apt-4', amount: 300, payment_date: '2026-03-26', method: 'transfer', description: 'פגישת תזונה' },
    { id: 'pay-2', client_id: 'demo-1', appointment_id: null, amount: 1000, payment_date: '2026-03-01', method: 'credit', description: 'חבילת 4 שיעורים' },
    { id: 'pay-3', client_id: 'demo-1', appointment_id: null, amount: 1000, payment_date: '2026-02-01', method: 'credit', description: 'חבילת 4 שיעורים' },
  ],
}
