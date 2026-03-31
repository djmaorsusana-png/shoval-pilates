/**
 * נוסחאות תזונה מבוססות מחקר
 * BMR: Mifflin-St Jeor (1990) — הנוסחה המדויקת ביותר לאוכלוסייה כללית
 * מקור: Mifflin MD et al., J Am Diet Assoc. 1990;90(3):386-390
 */

// --------- נוסחאות BMR ---------

/**
 * Mifflin-St Jeor — הנוסחה המומלצת ע"י American Dietetic Association
 * מדויקת בתוך 10% ל-82% מהאנשים (לעומת Harris-Benedict — 55%)
 */
export function calcBMR_MifflinStJeor(
  weight_kg: number,
  height_cm: number,
  age_years: number,
  gender: 'male' | 'female'
): number {
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age_years
  return Math.round(gender === 'male' ? base + 5 : base - 161)
}

/**
 * Katch-McArdle — יותר מדויק כשיש אחוז שומן ידוע
 * מבוסס על מסת שריר נטו במקום משקל כולל
 */
export function calcBMR_KatchMcArdle(weight_kg: number, body_fat_pct: number): number {
  const leanMass = weight_kg * (1 - body_fat_pct / 100)
  return Math.round(370 + 21.6 * leanMass)
}

// --------- מכפילי פעילות (Katch-McArdle Activity Multipliers) ---------

export const ACTIVITY_LEVELS = [
  {
    value: 'sedentary',
    label: 'ישיבה — עבודת משרד, כמעט ללא פעילות',
    factor: 1.2,
  },
  {
    value: 'light',
    label: 'פעילות קלה — 1-3 אימונים בשבוע',
    factor: 1.375,
  },
  {
    value: 'moderate',
    label: 'פעילות בינונית — 3-5 אימונים בשבוע',
    factor: 1.55,
  },
  {
    value: 'active',
    label: 'פעילות גבוהה — 6-7 אימונים בשבוע',
    factor: 1.725,
  },
  {
    value: 'very_active',
    label: 'פעילות אינטנסיבית — ספורטאי / עבודה פיזית',
    factor: 1.9,
  },
]

// --------- מטרות קלוריות ---------

export const GOALS = [
  { value: 'lose_slow', label: 'ירידה עדינה — 0.3 ק"ג/שבוע', delta: -300 },
  { value: 'lose', label: 'ירידה — 0.5 ק"ג/שבוע (מומלץ)', delta: -500 },
  { value: 'lose_fast', label: 'ירידה מהירה — 0.75 ק"ג/שבוע', delta: -750 },
  { value: 'maintain', label: 'שמירה על משקל', delta: 0 },
  { value: 'gain', label: 'עלייה בשרירים — עודף 250 קל׳', delta: 250 },
]

// --------- חישוב TDEE ---------

export function calcTDEE(bmr: number, activityFactor: number): number {
  return Math.round(bmr * activityFactor)
}

export function calcTargetCalories(tdee: number, goalDelta: number): number {
  return Math.round(tdee + goalDelta)
}

// --------- חלוקת מאקרו (מבוסס ACSM + evidence-based guidelines) ---------
/**
 * חלבון: 1.8 ג׳/ק"ג — מומלץ ע"י American College of Sports Medicine
 * שומן: 27.5% מהקלוריות (טווח בריא 20-35%)
 * פחמימות: השאר
 */
export function calcMacros(targetCalories: number, weight_kg: number) {
  const protein_g = Math.round(weight_kg * 1.8)
  const protein_cal = protein_g * 4

  const fat_cal = Math.round(targetCalories * 0.275)
  const fat_g = Math.round(fat_cal / 9)

  const carbs_cal = Math.max(0, targetCalories - protein_cal - fat_cal)
  const carbs_g = Math.round(carbs_cal / 4)

  return { protein_g, fat_g, carbs_g }
}

export function calcAge(birth_date: string): number {
  const today = new Date()
  const birth = new Date(birth_date)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// --------- תבניות תפריט מוכנות ---------

export interface TemplateItem {
  food_name: string
  quantity_grams: number
  meal_type: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export interface MealTemplate {
  id: string
  name: string
  description: string
  target_person: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  items: TemplateItem[]
}

export const MENU_TEMPLATES: MealTemplate[] = [
  {
    id: 'weight-loss-1500',
    name: 'ירידה במשקל — 1500 קל׳',
    description: 'תפריט מאוזן ועשיר בחלבון לירידה עדינה תוך שמירה על שריר.',
    target_person: 'מתאים לאישה ~60-70 ק"ג עם פעילות קלה',
    calories: 1500,
    protein_g: 115,
    carbs_g: 135,
    fat_g: 50,
    items: [
      { food_name: 'ביצה שלמה', quantity_grams: 55, meal_type: 'breakfast', calories: 78, protein_g: 6, carbs_g: 0.5, fat_g: 5 },
      { food_name: 'לחם מחיטה מלאה', quantity_grams: 40, meal_type: 'breakfast', calories: 95, protein_g: 4, carbs_g: 18, fat_g: 1 },
      { food_name: 'גבינה לבנה 5%', quantity_grams: 60, meal_type: 'breakfast', calories: 54, protein_g: 9, carbs_g: 1, fat_g: 2 },
      { food_name: 'עגבנייה + מלפפון', quantity_grams: 100, meal_type: 'breakfast', calories: 18, protein_g: 1, carbs_g: 4, fat_g: 0 },

      { food_name: 'יוגורט גריק 0%', quantity_grams: 150, meal_type: 'morning_snack', calories: 90, protein_g: 15, carbs_g: 6, fat_g: 0 },
      { food_name: 'תפוח עץ', quantity_grams: 120, meal_type: 'morning_snack', calories: 62, protein_g: 0.3, carbs_g: 16, fat_g: 0 },

      { food_name: 'חזה עוף אפוי', quantity_grams: 130, meal_type: 'lunch', calories: 195, protein_g: 37, carbs_g: 0, fat_g: 4 },
      { food_name: 'אורז מלא מבושל', quantity_grams: 100, meal_type: 'lunch', calories: 111, protein_g: 3, carbs_g: 23, fat_g: 1 },
      { food_name: 'ברוקולי מאודה', quantity_grams: 150, meal_type: 'lunch', calories: 38, protein_g: 3, carbs_g: 7, fat_g: 0 },

      { food_name: 'שקדים', quantity_grams: 20, meal_type: 'afternoon_snack', calories: 120, protein_g: 4, carbs_g: 3, fat_g: 10 },
      { food_name: 'גזר + מלפפון', quantity_grams: 100, meal_type: 'afternoon_snack', calories: 22, protein_g: 1, carbs_g: 5, fat_g: 0 },

      { food_name: 'סלמון אפוי', quantity_grams: 120, meal_type: 'dinner', calories: 200, protein_g: 26, carbs_g: 0, fat_g: 11 },
      { food_name: 'תפוח אדמה מבושל', quantity_grams: 100, meal_type: 'dinner', calories: 77, protein_g: 2, carbs_g: 17, fat_g: 0 },
      { food_name: 'סלט ירקות + כפית שמן זית', quantity_grams: 130, meal_type: 'dinner', calories: 60, protein_g: 1, carbs_g: 5, fat_g: 5 },

      { food_name: 'קוטג׳ 3%', quantity_grams: 100, meal_type: 'evening_snack', calories: 80, protein_g: 9, carbs_g: 3, fat_g: 3 },
    ],
  },
  {
    id: 'maintenance-1800',
    name: 'שמירה על משקל — 1800 קל׳',
    description: 'תפריט מאוזן לשמירת משקל עם מגוון מזונות ישראליים.',
    target_person: 'מתאים לאישה ~65-75 ק"ג עם פעילות בינונית',
    calories: 1800,
    protein_g: 130,
    carbs_g: 195,
    fat_g: 62,
    items: [
      { food_name: '2 ביצים קשות', quantity_grams: 110, meal_type: 'breakfast', calories: 156, protein_g: 12, carbs_g: 1, fat_g: 11 },
      { food_name: 'לחם מחיטה מלאה', quantity_grams: 60, meal_type: 'breakfast', calories: 143, protein_g: 6, carbs_g: 27, fat_g: 1.5 },
      { food_name: 'אבוקדו (רבע)', quantity_grams: 50, meal_type: 'breakfast', calories: 80, protein_g: 1, carbs_g: 4, fat_g: 7 },
      { food_name: 'עגבנייה + ירוק', quantity_grams: 80, meal_type: 'breakfast', calories: 14, protein_g: 0.5, carbs_g: 3, fat_g: 0 },

      { food_name: 'קוטג׳ 3%', quantity_grams: 150, meal_type: 'morning_snack', calories: 120, protein_g: 12, carbs_g: 4, fat_g: 4 },
      { food_name: 'בננה', quantity_grams: 100, meal_type: 'morning_snack', calories: 89, protein_g: 1, carbs_g: 23, fat_g: 0 },

      { food_name: 'ירך עוף צלוי', quantity_grams: 150, meal_type: 'lunch', calories: 240, protein_g: 35, carbs_g: 0, fat_g: 11 },
      { food_name: 'קינואה מבושלת', quantity_grams: 120, meal_type: 'lunch', calories: 144, protein_g: 5, carbs_g: 25, fat_g: 2 },
      { food_name: 'סלט + כפות טחינה', quantity_grams: 120, meal_type: 'lunch', calories: 90, protein_g: 3, carbs_g: 5, fat_g: 7 },

      { food_name: 'חומוס', quantity_grams: 80, meal_type: 'afternoon_snack', calories: 120, protein_g: 6, carbs_g: 13, fat_g: 5 },
      { food_name: 'פיתה מלאה (חצי)', quantity_grams: 40, meal_type: 'afternoon_snack', calories: 105, protein_g: 3, carbs_g: 21, fat_g: 1 },

      { food_name: 'טונה (מסוננת)', quantity_grams: 100, meal_type: 'dinner', calories: 130, protein_g: 25, carbs_g: 0, fat_g: 3 },
      { food_name: 'פסטה מחיטה מלאה', quantity_grams: 120, meal_type: 'dinner', calories: 165, protein_g: 6, carbs_g: 33, fat_g: 1 },
      { food_name: 'רוטב עגבניות ביתי', quantity_grams: 100, meal_type: 'dinner', calories: 40, protein_g: 1, carbs_g: 8, fat_g: 0.5 },

      { food_name: 'חלב 3% (כוס)', quantity_grams: 200, meal_type: 'evening_snack', calories: 120, protein_g: 7, carbs_g: 10, fat_g: 6 },
    ],
  },
  {
    id: 'muscle-gain-2200',
    name: 'עלייה בשרירים — 2200 קל׳',
    description: 'תפריט עשיר בחלבון ופחמימות מורכבות לבניית שריר.',
    target_person: 'מתאים לאדם ~70-80 ק"ג עם 4-5 אימוני כוח בשבוע',
    calories: 2200,
    protein_g: 155,
    carbs_g: 245,
    fat_g: 72,
    items: [
      { food_name: '3 ביצים שלמות', quantity_grams: 165, meal_type: 'breakfast', calories: 234, protein_g: 18, carbs_g: 1, fat_g: 16 },
      { food_name: 'שיבולת שועל', quantity_grams: 80, meal_type: 'breakfast', calories: 280, protein_g: 10, carbs_g: 48, fat_g: 5 },
      { food_name: 'בננה', quantity_grams: 100, meal_type: 'breakfast', calories: 89, protein_g: 1, carbs_g: 23, fat_g: 0 },
      { food_name: 'חלב 3% (כוס)', quantity_grams: 200, meal_type: 'breakfast', calories: 120, protein_g: 7, carbs_g: 10, fat_g: 6 },

      { food_name: 'יוגורט גריק 2%', quantity_grams: 200, meal_type: 'morning_snack', calories: 140, protein_g: 20, carbs_g: 7, fat_g: 3 },
      { food_name: 'תפוח + אגוזי מלך', quantity_grams: 140, meal_type: 'morning_snack', calories: 175, protein_g: 3, carbs_g: 22, fat_g: 9 },

      { food_name: 'חזה עוף/הודו אפוי', quantity_grams: 200, meal_type: 'lunch', calories: 300, protein_g: 56, carbs_g: 0, fat_g: 7 },
      { food_name: 'אורז לבן מבושל', quantity_grams: 170, meal_type: 'lunch', calories: 200, protein_g: 4, carbs_g: 44, fat_g: 0.5 },
      { food_name: 'שמן זית לתיבול', quantity_grams: 10, meal_type: 'lunch', calories: 88, protein_g: 0, carbs_g: 0, fat_g: 10 },
      { food_name: 'ירקות מוקפצים', quantity_grams: 150, meal_type: 'lunch', calories: 40, protein_g: 2, carbs_g: 7, fat_g: 0 },

      { food_name: 'לחם מחיטה מלאה + גבינה + ביצה', quantity_grams: 130, meal_type: 'afternoon_snack', calories: 280, protein_g: 15, carbs_g: 25, fat_g: 12 },

      { food_name: 'בשר בקר טחון רזה 90%', quantity_grams: 150, meal_type: 'dinner', calories: 250, protein_g: 35, carbs_g: 0, fat_g: 12 },
      { food_name: 'בטטה אפויה', quantity_grams: 200, meal_type: 'dinner', calories: 172, protein_g: 3, carbs_g: 40, fat_g: 0 },
      { food_name: 'סלט + שמן זית', quantity_grams: 150, meal_type: 'dinner', calories: 70, protein_g: 1, carbs_g: 6, fat_g: 5 },

      { food_name: 'קזאין / קוטג׳ + שקדים', quantity_grams: 150, meal_type: 'evening_snack', calories: 200, protein_g: 18, carbs_g: 6, fat_g: 12 },
    ],
  },
  {
    id: 'low-carb-1600',
    name: 'דל פחמימות — 1600 קל׳',
    description: 'תפריט עם פחמימות מופחתות ושומן בריא גבוה. מתאים לבעלי עמידות לאינסולין.',
    target_person: 'מתאים לאישה ~65 ק"ג המחפשת ירידה מהירה',
    calories: 1600,
    protein_g: 120,
    carbs_g: 80,
    fat_g: 100,
    items: [
      { food_name: '3 ביצים עם ירקות', quantity_grams: 200, meal_type: 'breakfast', calories: 210, protein_g: 18, carbs_g: 4, fat_g: 14 },
      { food_name: 'אבוקדו (חצי)', quantity_grams: 100, meal_type: 'breakfast', calories: 160, protein_g: 2, carbs_g: 9, fat_g: 15 },

      { food_name: 'גבינה צהובה 30%', quantity_grams: 30, meal_type: 'morning_snack', calories: 110, protein_g: 7, carbs_g: 0.5, fat_g: 9 },
      { food_name: 'אגוזי מלך', quantity_grams: 20, meal_type: 'morning_snack', calories: 130, protein_g: 3, carbs_g: 3, fat_g: 13 },

      { food_name: 'סלמון אפוי', quantity_grams: 150, meal_type: 'lunch', calories: 250, protein_g: 33, carbs_g: 0, fat_g: 13 },
      { food_name: 'ירקות צלויים בתנור', quantity_grams: 200, meal_type: 'lunch', calories: 80, protein_g: 3, carbs_g: 16, fat_g: 2 },
      { food_name: 'שמן זית', quantity_grams: 15, meal_type: 'lunch', calories: 130, protein_g: 0, carbs_g: 0, fat_g: 15 },

      { food_name: 'קוטג׳ 5% + שקדים', quantity_grams: 130, meal_type: 'afternoon_snack', calories: 160, protein_g: 12, carbs_g: 4, fat_g: 10 },

      { food_name: 'חזה עוף / הודו', quantity_grams: 160, meal_type: 'dinner', calories: 230, protein_g: 46, carbs_g: 0, fat_g: 5 },
      { food_name: 'כרובית / זוקיני מוקפץ', quantity_grams: 200, meal_type: 'dinner', calories: 50, protein_g: 3, carbs_g: 8, fat_g: 1 },
      { food_name: 'שמן קוקוס / זית', quantity_grams: 10, meal_type: 'dinner', calories: 88, protein_g: 0, carbs_g: 0, fat_g: 10 },
    ],
  },
]

export const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: 'ארוחת בוקר',
  morning_snack: 'נשנוש בוקר',
  lunch: 'ארוחת צהריים',
  afternoon_snack: 'נשנוש אחה"צ',
  dinner: 'ארוחת ערב',
  evening_snack: 'נשנוש ערב',
}
