/**
 * מאגר מזון עברי — ~250 מזונות ישראליים עם ערכים תזונתיים לכל 100 גרם
 */

export interface HebrewFood {
  id: string
  name: string
  aliases: string[]
  per100g: {
    calories: number
    protein_g: number
    carbs_g: number
    fat_g: number
  }
  defaultUnit?: {
    label: string
    grams: number
  }
  category: 'protein' | 'carbs' | 'vegetables' | 'dairy' | 'fats' | 'fruits' | 'grains' | 'other'
}

export const HEBREW_UNITS: Record<string, number> = {
  'גרם': 1,
  'ג': 1,
  'גר': 1,
  'קילוגרם': 1000,
  'קג': 1000,
  'כוס': 240,
  'חצי כוס': 120,
  'רבע כוס': 60,
  'כף': 15,
  'כפית': 5,
  'פרוסה': 30,
  'יחידה': 100,
  'יח': 100,
  'מנה': 100,
}

export const HEBREW_FOODS: HebrewFood[] = [
  // --------- חלבונות ---------
  {
    id: 'chicken-breast',
    name: 'חזה עוף',
    aliases: ['חזה עוף מבושל', 'חזה עוף אפוי', 'חזה עוף צלוי', 'חזה עוף מטוגן', 'עוף חזה'],
    per100g: { calories: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6 },
    category: 'protein',
  },
  {
    id: 'chicken-thigh',
    name: 'ירך עוף ללא עור',
    aliases: ['ירך עוף', 'ירכיים עוף', 'ירך עוף צלוי', 'ירך עוף מבושל'],
    per100g: { calories: 177, protein_g: 25, carbs_g: 0, fat_g: 8 },
    category: 'protein',
  },
  {
    id: 'salmon',
    name: 'סלמון',
    aliases: ['דג סלמון', 'סלמון אפוי', 'סלמון צלוי', 'פילה סלמון', 'סלמון מעושן'],
    per100g: { calories: 208, protein_g: 20, carbs_g: 0, fat_g: 13 },
    category: 'protein',
  },
  {
    id: 'tuna-oil',
    name: 'טונה בשמן',
    aliases: ['טונה שמן', 'קופסת טונה בשמן'],
    per100g: { calories: 184, protein_g: 24, carbs_g: 0, fat_g: 9 },
    category: 'protein',
  },
  {
    id: 'tuna-water',
    name: 'טונה במים',
    aliases: ['טונה מים', 'קופסת טונה במים', 'טונה', 'טונה מסוננת'],
    per100g: { calories: 116, protein_g: 26, carbs_g: 0, fat_g: 1 },
    category: 'protein',
  },
  {
    id: 'beef-ground',
    name: 'בשר טחון רזה',
    aliases: ['בשר בקר טחון', 'בשר טחון 90%', 'בקר טחון', 'בשר מבושל'],
    per100g: { calories: 215, protein_g: 26, carbs_g: 0, fat_g: 12 },
    category: 'protein',
  },
  {
    id: 'steak',
    name: 'סטייק',
    aliases: ['בשר בקר', 'אנטריקוט', 'פילה בקר', 'בשר צלוי'],
    per100g: { calories: 250, protein_g: 26, carbs_g: 0, fat_g: 15 },
    category: 'protein',
  },
  {
    id: 'turkey-schnitzel',
    name: 'שיניצל הודו',
    aliases: ['הודו', 'חזה הודו', 'שיניצל', 'שניצל הודו', 'פילה הודו'],
    per100g: { calories: 185, protein_g: 22, carbs_g: 8, fat_g: 7 },
    category: 'protein',
  },
  {
    id: 'fish-amnon',
    name: 'דג אמנון',
    aliases: ['אמנון', 'פילה אמנון', 'דג אמנון אפוי'],
    per100g: { calories: 96, protein_g: 20, carbs_g: 0, fat_g: 1.5 },
    category: 'protein',
  },
  {
    id: 'fish-buri',
    name: 'דג בורי',
    aliases: ['בורי', 'פילה בורי'],
    per100g: { calories: 117, protein_g: 19, carbs_g: 0, fat_g: 4 },
    category: 'protein',
  },
  {
    id: 'egg-whole',
    name: 'ביצה שלמה',
    aliases: ['ביצה', 'ביצים', 'ביצה מבושלת', 'ביצה טרופה', 'ביצה עין'],
    per100g: { calories: 155, protein_g: 13, carbs_g: 1, fat_g: 11 },
    defaultUnit: { label: 'ביצה', grams: 55 },
    category: 'protein',
  },
  {
    id: 'egg-hard',
    name: 'ביצה קשה',
    aliases: ['ביצה מקושקשת', 'ביצה מבושלת קשה'],
    per100g: { calories: 155, protein_g: 13, carbs_g: 1, fat_g: 11 },
    defaultUnit: { label: 'ביצה', grams: 55 },
    category: 'protein',
  },
  {
    id: 'egg-white',
    name: 'חלבון ביצה',
    aliases: ['חלבוני ביצה', 'לבן ביצה'],
    per100g: { calories: 52, protein_g: 11, carbs_g: 1, fat_g: 0 },
    category: 'protein',
  },
  {
    id: 'cottage-5',
    name: 'קוטג׳ 5%',
    aliases: ['קוטג', 'קוטג׳', 'גבינת קוטג', 'קוטג׳ 3%', 'קוטג׳ 5 אחוז'],
    per100g: { calories: 98, protein_g: 11, carbs_g: 4, fat_g: 4 },
    category: 'protein',
  },
  {
    id: 'white-cheese-5',
    name: 'גבינה לבנה 5%',
    aliases: ['גבינה לבנה', 'גבינה לבנה 5 אחוז', 'גבינת שמנת 5%'],
    per100g: { calories: 107, protein_g: 7, carbs_g: 3, fat_g: 8 },
    category: 'protein',
  },
  {
    id: 'yellow-cheese',
    name: 'גבינה צהובה',
    aliases: ['גבינה קשה', 'גבינה צהובה 30%', 'גבינת צ׳דר', 'גבינת אמנטל'],
    per100g: { calories: 380, protein_g: 25, carbs_g: 1, fat_g: 31 },
    category: 'protein',
  },
  {
    id: 'cream-cheese',
    name: 'גבינת שמנת',
    aliases: ['שמנת גבינה', 'גבינת שמנת 30%', 'קרם גבינה'],
    per100g: { calories: 350, protein_g: 6, carbs_g: 4, fat_g: 34 },
    category: 'protein',
  },
  {
    id: 'halibut',
    name: 'פילה הליבוט',
    aliases: ['הליבוט', 'דג הליבוט'],
    per100g: { calories: 91, protein_g: 18, carbs_g: 0, fat_g: 1.5 },
    category: 'protein',
  },
  {
    id: 'shrimp',
    name: 'שרימפס',
    aliases: ['שריפס', 'שרימפ', 'צדפים'],
    per100g: { calories: 99, protein_g: 24, carbs_g: 0, fat_g: 0.3 },
    category: 'protein',
  },

  // --------- חלב ומוצריו ---------
  {
    id: 'milk-1',
    name: 'חלב 1%',
    aliases: ['חלב דל שומן', 'חלב 1 אחוז'],
    per100g: { calories: 42, protein_g: 3.4, carbs_g: 5, fat_g: 1 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'dairy',
  },
  {
    id: 'milk-3',
    name: 'חלב 3%',
    aliases: ['חלב', 'חלב מלא', 'חלב 3 אחוז'],
    per100g: { calories: 60, protein_g: 3.2, carbs_g: 4.7, fat_g: 3.5 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'dairy',
  },
  {
    id: 'yogurt-0',
    name: 'יוגורט 0%',
    aliases: ['יוגורט גריק', 'יוגורט יווני', 'יוגורט דל שומן', 'יוגורט 0 אחוז'],
    per100g: { calories: 56, protein_g: 10, carbs_g: 5, fat_g: 0 },
    category: 'dairy',
  },
  {
    id: 'yogurt-3',
    name: 'יוגורט 3%',
    aliases: ['יוגורט', 'יוגורט רגיל', 'יוגורט טבעי'],
    per100g: { calories: 70, protein_g: 4, carbs_g: 5, fat_g: 3.5 },
    category: 'dairy',
  },
  {
    id: 'sour-cream-15',
    name: 'שמנת חמוצה 15%',
    aliases: ['שמנת חמוצה', 'שמנת 15%', 'שמנת'],
    per100g: { calories: 181, protein_g: 2.5, carbs_g: 3.5, fat_g: 17 },
    category: 'dairy',
  },

  // --------- דגנים ופחמימות ---------
  {
    id: 'white-rice',
    name: 'אורז לבן מבושל',
    aliases: ['אורז', 'אורז לבן', 'אורז מבושל'],
    per100g: { calories: 130, protein_g: 2.7, carbs_g: 28, fat_g: 0.3 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },
  {
    id: 'brown-rice',
    name: 'אורז מלא מבושל',
    aliases: ['אורז חום', 'אורז מלא', 'אורז חום מבושל'],
    per100g: { calories: 112, protein_g: 2.6, carbs_g: 23, fat_g: 0.9 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },
  {
    id: 'pasta-cooked',
    name: 'פסטה מבושלת',
    aliases: ['פסטה', 'ספגטי', 'פנה', 'פסטה מחיטה מלאה', 'מקרוני'],
    per100g: { calories: 158, protein_g: 5.8, carbs_g: 31, fat_g: 0.9 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },
  {
    id: 'couscous',
    name: 'קוסקוס מבושל',
    aliases: ['קוסקוס', 'כוסכוס', 'קוסקוס מוכן'],
    per100g: { calories: 112, protein_g: 3.8, carbs_g: 23, fat_g: 0.2 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },
  {
    id: 'quinoa',
    name: 'קינואה מבושלת',
    aliases: ['קינואה', 'קינואה מוכנה'],
    per100g: { calories: 120, protein_g: 4.1, carbs_g: 21, fat_g: 1.9 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },
  {
    id: 'white-bread',
    name: 'לחם לבן',
    aliases: ['לחם', 'לחם רגיל', 'חלה'],
    per100g: { calories: 265, protein_g: 9, carbs_g: 49, fat_g: 3.2 },
    defaultUnit: { label: 'פרוסה', grams: 30 },
    category: 'grains',
  },
  {
    id: 'whole-bread',
    name: 'לחם מלא',
    aliases: ['לחם מחיטה מלאה', 'לחם שיפון', 'לחם מחיטה'],
    per100g: { calories: 247, protein_g: 13, carbs_g: 41, fat_g: 4.2 },
    defaultUnit: { label: 'פרוסה', grams: 30 },
    category: 'grains',
  },
  {
    id: 'pita',
    name: 'פיתה',
    aliases: ['פיתה לבנה', 'פיתה מלאה', 'ערבי פיתה'],
    per100g: { calories: 275, protein_g: 9, carbs_g: 55, fat_g: 1.5 },
    defaultUnit: { label: 'פיתה', grams: 65 },
    category: 'grains',
  },
  {
    id: 'oats',
    name: 'שיבולת שועל',
    aliases: ['אבקת שיבולת שועל', 'גרנולה', 'בקוואט'],
    per100g: { calories: 389, protein_g: 17, carbs_g: 66, fat_g: 7 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },
  {
    id: 'corn-cooked',
    name: 'תירס מבושל',
    aliases: ['תירס', 'תירס קלוי', 'קלח תירס'],
    per100g: { calories: 96, protein_g: 3.4, carbs_g: 21, fat_g: 1.5 },
    category: 'grains',
  },
  {
    id: 'potato-cooked',
    name: 'תפוח אדמה מבושל',
    aliases: ['תפוח אדמה', 'תפו"א', 'קרטופל', 'תפוחי אדמה'],
    per100g: { calories: 87, protein_g: 1.9, carbs_g: 20, fat_g: 0.1 },
    defaultUnit: { label: 'יחידה', grams: 150 },
    category: 'carbs',
  },
  {
    id: 'sweet-potato',
    name: 'בטטה מבושלת',
    aliases: ['בטטה', 'בטטה אפויה', 'בטטה צלויה'],
    per100g: { calories: 90, protein_g: 2, carbs_g: 21, fat_g: 0.1 },
    defaultUnit: { label: 'יחידה', grams: 150 },
    category: 'carbs',
  },
  {
    id: 'lentils',
    name: 'עדשים מבושלות',
    aliases: ['עדשים', 'עדשים כתומות', 'עדשים ירוקות', 'עדשים שחורות'],
    per100g: { calories: 116, protein_g: 9, carbs_g: 20, fat_g: 0.4 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },
  {
    id: 'chickpeas-cooked',
    name: 'חומוס מבושל',
    aliases: ['גרגרי חומוס', 'גרגרי חומוס מבושלים', 'פול חומוס'],
    per100g: { calories: 164, protein_g: 9, carbs_g: 27, fat_g: 2.6 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },

  // --------- ירקות ---------
  {
    id: 'tomato',
    name: 'עגבנייה',
    aliases: ['עגבניה', 'עגבניות', 'עגבנייה טרייה', 'עגבנייה שרי'],
    per100g: { calories: 18, protein_g: 0.9, carbs_g: 3.9, fat_g: 0.2 },
    defaultUnit: { label: 'עגבנייה', grams: 120 },
    category: 'vegetables',
  },
  {
    id: 'cucumber',
    name: 'מלפפון',
    aliases: ['מלפפונים', 'מלפפון טרי', 'מלפפון קצוץ'],
    per100g: { calories: 15, protein_g: 0.65, carbs_g: 3.6, fat_g: 0.1 },
    defaultUnit: { label: 'מלפפון', grams: 100 },
    category: 'vegetables',
  },
  {
    id: 'carrot',
    name: 'גזר',
    aliases: ['גזרים', 'גזר טרי', 'גזר מגורר'],
    per100g: { calories: 41, protein_g: 0.9, carbs_g: 10, fat_g: 0.2 },
    defaultUnit: { label: 'גזר', grams: 80 },
    category: 'vegetables',
  },
  {
    id: 'broccoli',
    name: 'ברוקולי',
    aliases: ['ברוקולי מאודה', 'ברוקולי מבושל', 'ברוקולי קפוא'],
    per100g: { calories: 34, protein_g: 2.8, carbs_g: 7, fat_g: 0.4 },
    category: 'vegetables',
  },
  {
    id: 'cauliflower',
    name: 'כרובית',
    aliases: ['כרובית מבושלת', 'כרובית מאודה'],
    per100g: { calories: 25, protein_g: 1.9, carbs_g: 5, fat_g: 0.3 },
    category: 'vegetables',
  },
  {
    id: 'spinach',
    name: 'תרד',
    aliases: ['עלי תרד', 'תרד טרי', 'תרד מבושל'],
    per100g: { calories: 23, protein_g: 2.9, carbs_g: 3.6, fat_g: 0.4 },
    category: 'vegetables',
  },
  {
    id: 'lettuce',
    name: 'חסה',
    aliases: ['עלי חסה', 'חסה ירוקה', 'חסה אייסברג', 'רוקט'],
    per100g: { calories: 15, protein_g: 1.4, carbs_g: 2.9, fat_g: 0.2 },
    category: 'vegetables',
  },
  {
    id: 'pepper',
    name: 'פלפל',
    aliases: ['פלפל אדום', 'פלפל ירוק', 'פלפל צהוב', 'פלפלים'],
    per100g: { calories: 31, protein_g: 1, carbs_g: 6, fat_g: 0.3 },
    defaultUnit: { label: 'פלפל', grams: 120 },
    category: 'vegetables',
  },
  {
    id: 'onion',
    name: 'בצל',
    aliases: ['בצלים', 'בצל טרי', 'בצל מטוגן', 'בצל ירוק'],
    per100g: { calories: 40, protein_g: 1.1, carbs_g: 9.3, fat_g: 0.1 },
    defaultUnit: { label: 'בצל', grams: 100 },
    category: 'vegetables',
  },
  {
    id: 'garlic',
    name: 'שום',
    aliases: ['שן שום', 'שיני שום'],
    per100g: { calories: 149, protein_g: 6.4, carbs_g: 33, fat_g: 0.5 },
    defaultUnit: { label: 'שן', grams: 3 },
    category: 'vegetables',
  },
  {
    id: 'zucchini',
    name: 'זוקיני',
    aliases: ['קישוא', 'קישואים', 'זוקיני מבושל'],
    per100g: { calories: 17, protein_g: 1.2, carbs_g: 3.1, fat_g: 0.3 },
    category: 'vegetables',
  },
  {
    id: 'eggplant',
    name: 'חציל',
    aliases: ['חצילים', 'חציל אפוי', 'חציל צלוי', 'חציל מטוגן'],
    per100g: { calories: 25, protein_g: 1, carbs_g: 6, fat_g: 0.2 },
    category: 'vegetables',
  },
  {
    id: 'cabbage',
    name: 'כרוב',
    aliases: ['כרוב לבן', 'כרוב אדום', 'כרוב סגול'],
    per100g: { calories: 25, protein_g: 1.3, carbs_g: 6, fat_g: 0.1 },
    category: 'vegetables',
  },
  {
    id: 'mushrooms',
    name: 'פטריות',
    aliases: ['פטריות שמפיניון', 'פטריות פורטובלו', 'פטריות יער'],
    per100g: { calories: 22, protein_g: 3.1, carbs_g: 3.3, fat_g: 0.3 },
    category: 'vegetables',
  },

  // --------- פירות ---------
  {
    id: 'apple',
    name: 'תפוח עץ',
    aliases: ['תפוח', 'תפוחים', 'תפוח ירוק', 'תפוח אדום'],
    per100g: { calories: 52, protein_g: 0.3, carbs_g: 14, fat_g: 0.2 },
    defaultUnit: { label: 'תפוח', grams: 150 },
    category: 'fruits',
  },
  {
    id: 'banana',
    name: 'בננה',
    aliases: ['בננות', 'בנאנה'],
    per100g: { calories: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3 },
    defaultUnit: { label: 'בננה', grams: 120 },
    category: 'fruits',
  },
  {
    id: 'orange',
    name: 'תפוז',
    aliases: ['תפוזים', 'תפוז טרי', 'מנדרינה', 'קלמנטינה'],
    per100g: { calories: 47, protein_g: 0.9, carbs_g: 12, fat_g: 0.1 },
    defaultUnit: { label: 'תפוז', grams: 130 },
    category: 'fruits',
  },
  {
    id: 'avocado',
    name: 'אבוקדו',
    aliases: ['אבקדו', 'אבוקדו בשל'],
    per100g: { calories: 160, protein_g: 2, carbs_g: 9, fat_g: 15 },
    defaultUnit: { label: 'אבוקדו', grams: 200 },
    category: 'fruits',
  },
  {
    id: 'grapes',
    name: 'ענבים',
    aliases: ['ענב', 'ענבים ירוקים', 'ענבים אדומים'],
    per100g: { calories: 69, protein_g: 0.7, carbs_g: 18, fat_g: 0.2 },
    category: 'fruits',
  },
  {
    id: 'strawberry',
    name: 'תות שדה',
    aliases: ['תות', 'תותים', 'תות שדה טרי'],
    per100g: { calories: 33, protein_g: 0.7, carbs_g: 8, fat_g: 0.3 },
    category: 'fruits',
  },
  {
    id: 'mango',
    name: 'מנגו',
    aliases: ['מנגו טרי', 'מנגו בשל'],
    per100g: { calories: 60, protein_g: 0.8, carbs_g: 15, fat_g: 0.4 },
    defaultUnit: { label: 'מנגו', grams: 200 },
    category: 'fruits',
  },
  {
    id: 'watermelon',
    name: 'אבטיח',
    aliases: ['אבטיח טרי', 'פלח אבטיח'],
    per100g: { calories: 30, protein_g: 0.6, carbs_g: 8, fat_g: 0.2 },
    category: 'fruits',
  },
  {
    id: 'cherry',
    name: 'דובדבן',
    aliases: ['דובדבנים', 'אוכמניות'],
    per100g: { calories: 50, protein_g: 1, carbs_g: 12, fat_g: 0.3 },
    category: 'fruits',
  },

  // --------- שומנים ---------
  {
    id: 'olive-oil',
    name: 'שמן זית',
    aliases: ['שמן זית כתית', 'שמן', 'שמן קנולה', 'שמן חמניות'],
    per100g: { calories: 884, protein_g: 0, carbs_g: 0, fat_g: 100 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'fats',
  },
  {
    id: 'tahini-raw',
    name: 'טחינה גולמית',
    aliases: ['טחינה', 'טחינה גולמית', 'מחית שומשום'],
    per100g: { calories: 595, protein_g: 17, carbs_g: 21, fat_g: 54 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'fats',
  },
  {
    id: 'peanut-butter',
    name: 'חמאת בוטנים',
    aliases: ['חמאת בוטנים טבעית', 'פינדי', 'חמאת אגוזים'],
    per100g: { calories: 588, protein_g: 25, carbs_g: 20, fat_g: 50 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'fats',
  },
  {
    id: 'walnuts',
    name: 'אגוזי מלך',
    aliases: ['אגוזים', 'אגוז', 'אגוזי מלך שלמים'],
    per100g: { calories: 654, protein_g: 15, carbs_g: 14, fat_g: 65 },
    defaultUnit: { label: 'יחידה', grams: 5 },
    category: 'fats',
  },
  {
    id: 'almonds',
    name: 'שקדים',
    aliases: ['שקד', 'שקדים שלמים', 'שקדים קלויים'],
    per100g: { calories: 579, protein_g: 21, carbs_g: 22, fat_g: 50 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'fats',
  },
  {
    id: 'chia',
    name: 'זרעי צ׳יה',
    aliases: ['צ׳יה', 'זרעי צ׳יה', 'זרעי ציה'],
    per100g: { calories: 486, protein_g: 17, carbs_g: 42, fat_g: 31 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'fats',
  },

  // --------- אחר ---------
  {
    id: 'hummus-spread',
    name: 'חומוס (ממרח)',
    aliases: ['ממרח חומוס', 'חומוס מוכן'],
    per100g: { calories: 177, protein_g: 8, carbs_g: 14, fat_g: 10 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'other',
  },
  {
    id: 'dark-chocolate',
    name: 'שוקולד מריר',
    aliases: ['שוקולד', 'שוקולד 70%', 'שוקולד 85%', 'שוקולד כהה'],
    per100g: { calories: 546, protein_g: 5, carbs_g: 60, fat_g: 31 },
    defaultUnit: { label: 'קוביה', grams: 5 },
    category: 'other',
  },
  {
    id: 'honey',
    name: 'דבש',
    aliases: ['דבש טבעי', 'דבש ביתי'],
    per100g: { calories: 304, protein_g: 0.3, carbs_g: 82, fat_g: 0 },
    defaultUnit: { label: 'כפית', grams: 5 },
    category: 'other',
  },

  // --------- מזונות נוספים ---------
  {
    id: 'corn-tortilla',
    name: 'טורטייה תירס',
    aliases: ['טורטייה', 'לחם טורטייה'],
    per100g: { calories: 218, protein_g: 5.7, carbs_g: 45, fat_g: 3 },
    defaultUnit: { label: 'יחידה', grams: 40 },
    category: 'grains',
  },
  {
    id: 'bulgur',
    name: 'בורגול מבושל',
    aliases: ['בורגול', 'כוסמת'],
    per100g: { calories: 83, protein_g: 3.1, carbs_g: 18, fat_g: 0.2 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },
  {
    id: 'chickpea-raw',
    name: 'גרגרי חומוס',
    aliases: ['גרגרי חומוס נא'],
    per100g: { calories: 164, protein_g: 9, carbs_g: 27, fat_g: 2.6 },
    category: 'grains',
  },
  {
    id: 'feta',
    name: 'גבינת פטה',
    aliases: ['גבינה בולגרית', 'פטה'],
    per100g: { calories: 264, protein_g: 14, carbs_g: 4, fat_g: 21 },
    category: 'dairy',
  },
  {
    id: 'labneh',
    name: 'לבנה',
    aliases: ['לבנה', 'גבינת לבנה'],
    per100g: { calories: 120, protein_g: 7, carbs_g: 2, fat_g: 9 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'dairy',
  },
  {
    id: 'ricotta',
    name: 'ריקוטה',
    aliases: ['גבינת ריקוטה'],
    per100g: { calories: 174, protein_g: 11, carbs_g: 3, fat_g: 13 },
    category: 'dairy',
  },
  {
    id: 'tempeh',
    name: 'טמפה',
    aliases: ['טופו', 'טמפה מבושל'],
    per100g: { calories: 195, protein_g: 19, carbs_g: 9, fat_g: 11 },
    category: 'protein',
  },
  {
    id: 'tofu',
    name: 'טופו',
    aliases: ['גבינת סויה', 'טופו קשה'],
    per100g: { calories: 76, protein_g: 8, carbs_g: 2, fat_g: 4 },
    category: 'protein',
  },
  {
    id: 'fish-tilapia',
    name: 'פילה טילפיה',
    aliases: ['טילפיה', 'דג טילפיה'],
    per100g: { calories: 96, protein_g: 20, carbs_g: 0, fat_g: 1.5 },
    category: 'protein',
  },
  {
    id: 'canned-sardines',
    name: 'סרדינים בשמן',
    aliases: ['סרדינים', 'קופסת סרדינים'],
    per100g: { calories: 208, protein_g: 25, carbs_g: 0, fat_g: 11 },
    category: 'protein',
  },
  {
    id: 'peas',
    name: 'אפונה',
    aliases: ['אפונה ירוקה', 'אפונה קפואה', 'אפונה מבושלת'],
    per100g: { calories: 81, protein_g: 5.4, carbs_g: 14, fat_g: 0.4 },
    category: 'vegetables',
  },
  {
    id: 'corn-canned',
    name: 'תירס שימורים',
    aliases: ['תירס מקופסה', 'תירס פתוח'],
    per100g: { calories: 86, protein_g: 3.2, carbs_g: 18, fat_g: 1.2 },
    category: 'vegetables',
  },
  {
    id: 'cucumber-pickled',
    name: 'חמוצים',
    aliases: ['מלפפון חמוץ', 'כבוש'],
    per100g: { calories: 11, protein_g: 0.7, carbs_g: 2.3, fat_g: 0.1 },
    category: 'vegetables',
  },
  {
    id: 'beet',
    name: 'סלק',
    aliases: ['סלק מבושל', 'סלק שרוי'],
    per100g: { calories: 43, protein_g: 1.6, carbs_g: 9.6, fat_g: 0.2 },
    category: 'vegetables',
  },
  {
    id: 'kale',
    name: 'קייל',
    aliases: ['כרוב עלים', 'קיל'],
    per100g: { calories: 49, protein_g: 4.3, carbs_g: 9, fat_g: 0.9 },
    category: 'vegetables',
  },
  {
    id: 'celery',
    name: 'סלרי',
    aliases: ['עלי סלרי', 'גבעול סלרי'],
    per100g: { calories: 16, protein_g: 0.7, carbs_g: 3, fat_g: 0.2 },
    category: 'vegetables',
  },
  {
    id: 'pumpkin',
    name: 'דלעת',
    aliases: ['קישוא בטן', 'דלורית'],
    per100g: { calories: 26, protein_g: 1, carbs_g: 6.5, fat_g: 0.1 },
    category: 'vegetables',
  },
  {
    id: 'leek',
    name: 'כרישה',
    aliases: ['כרישה מבושלת'],
    per100g: { calories: 61, protein_g: 1.5, carbs_g: 14, fat_g: 0.3 },
    category: 'vegetables',
  },
  {
    id: 'pomelo',
    name: 'פומלה',
    aliases: ['אשכולית', 'גרייפ פרוט'],
    per100g: { calories: 38, protein_g: 0.8, carbs_g: 9.7, fat_g: 0.1 },
    category: 'fruits',
  },
  {
    id: 'dates',
    name: 'תמרים',
    aliases: ['תמר', 'דבלה'],
    per100g: { calories: 277, protein_g: 1.8, carbs_g: 75, fat_g: 0.2 },
    defaultUnit: { label: 'תמר', grams: 8 },
    category: 'fruits',
  },
  {
    id: 'fig',
    name: 'תאנה',
    aliases: ['תאנה טרייה', 'תאנה מיובשת'],
    per100g: { calories: 74, protein_g: 0.8, carbs_g: 19, fat_g: 0.3 },
    defaultUnit: { label: 'תאנה', grams: 50 },
    category: 'fruits',
  },
  {
    id: 'pomegranate',
    name: 'רימון',
    aliases: ['גרגירי רימון', 'מיץ רימון'],
    per100g: { calories: 83, protein_g: 1.7, carbs_g: 19, fat_g: 1.2 },
    defaultUnit: { label: 'רימון', grams: 200 },
    category: 'fruits',
  },
  {
    id: 'kiwi',
    name: 'קיווי',
    aliases: ['פרי קיווי'],
    per100g: { calories: 61, protein_g: 1.1, carbs_g: 15, fat_g: 0.5 },
    defaultUnit: { label: 'קיווי', grams: 70 },
    category: 'fruits',
  },
  {
    id: 'coconut-oil',
    name: 'שמן קוקוס',
    aliases: ['שמן קוקוס מזוקק'],
    per100g: { calories: 862, protein_g: 0, carbs_g: 0, fat_g: 100 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'fats',
  },
  {
    id: 'sunflower-seeds',
    name: 'גרעינים',
    aliases: ['גרעיני חמנייה', 'גרעיני דלעת'],
    per100g: { calories: 584, protein_g: 21, carbs_g: 20, fat_g: 51 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'fats',
  },
  {
    id: 'flax-seeds',
    name: 'זרעי פשתן',
    aliases: ['פשתן', 'זרעים'],
    per100g: { calories: 534, protein_g: 18, carbs_g: 29, fat_g: 42 },
    defaultUnit: { label: 'כף', grams: 10 },
    category: 'fats',
  },
  {
    id: 'protein-powder',
    name: 'אבקת חלבון',
    aliases: ['פרוטאין', 'שייק חלבון', 'whey'],
    per100g: { calories: 380, protein_g: 75, carbs_g: 8, fat_g: 5 },
    defaultUnit: { label: 'כף', grams: 30 },
    category: 'other',
  },
  {
    id: 'tahini-prepared',
    name: 'טחינה מוכנה',
    aliases: ['סלסת טחינה', 'טחינה עם לימון'],
    per100g: { calories: 305, protein_g: 9, carbs_g: 12, fat_g: 27 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'other',
  },
  {
    id: 'cream-15',
    name: 'שמנת 15%',
    aliases: ['שמנת בישול', 'שמנת מתוקה 15%'],
    per100g: { calories: 150, protein_g: 3, carbs_g: 4, fat_g: 15 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'dairy',
  },
  {
    id: 'eggs-scrambled',
    name: 'ביצים מקושקשות',
    aliases: ['ביצה מטורפת', 'חביתה'],
    per100g: { calories: 155, protein_g: 13, carbs_g: 1, fat_g: 11 },
    defaultUnit: { label: 'ביצה', grams: 55 },
    category: 'protein',
  },
  {
    id: 'butter',
    name: 'חמאה',
    aliases: ['חמאה מלוחה', 'חמאה ללא מלח'],
    per100g: { calories: 717, protein_g: 0.9, carbs_g: 0.1, fat_g: 81 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'fats',
  },
  {
    id: 'margarine',
    name: 'מרגרינה',
    aliases: ['מרגרין'],
    per100g: { calories: 717, protein_g: 0.1, carbs_g: 0.1, fat_g: 80 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'fats',
  },
  {
    id: 'ketchup',
    name: 'קטשופ',
    aliases: ['רסק עגבניות'],
    per100g: { calories: 101, protein_g: 1.7, carbs_g: 27, fat_g: 0.5 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'other',
  },
  {
    id: 'soy-sauce',
    name: 'רוטב סויה',
    aliases: ['סויה'],
    per100g: { calories: 53, protein_g: 8, carbs_g: 5, fat_g: 0.1 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'other',
  },
  {
    id: 'jam',
    name: 'ריבה',
    aliases: ['מרמלדה', 'ריבת תות'],
    per100g: { calories: 278, protein_g: 0.4, carbs_g: 70, fat_g: 0.1 },
    defaultUnit: { label: 'כף', grams: 15 },
    category: 'other',
  },
  {
    id: 'cracker',
    name: 'קרקר',
    aliases: ['ביסלי', 'חטיף'],
    per100g: { calories: 428, protein_g: 9, carbs_g: 68, fat_g: 14 },
    defaultUnit: { label: 'יחידה', grams: 10 },
    category: 'other',
  },
  {
    id: 'rice-cake',
    name: 'עוגת אורז',
    aliases: ['לחמנית אורז', 'קרקר אורז'],
    per100g: { calories: 387, protein_g: 8, carbs_g: 80, fat_g: 3 },
    defaultUnit: { label: 'יחידה', grams: 9 },
    category: 'grains',
  },
  {
    id: 'granola',
    name: 'גרנולה',
    aliases: ['גרנולה מוזלי', 'מוזלי'],
    per100g: { calories: 471, protein_g: 8, carbs_g: 64, fat_g: 20 },
    defaultUnit: { label: 'כוס', grams: 120 },
    category: 'grains',
  },
  {
    id: 'orange-juice',
    name: 'מיץ תפוזים',
    aliases: ['מיץ טבעי', 'מיץ סחוט'],
    per100g: { calories: 45, protein_g: 0.7, carbs_g: 10, fat_g: 0.2 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'fruits',
  },
  {
    id: 'canned-beans',
    name: 'שעועית שימורים',
    aliases: ['שעועית לבנה', 'שעועית אדומה', 'שעועית שחורה'],
    per100g: { calories: 127, protein_g: 8.7, carbs_g: 23, fat_g: 0.5 },
    defaultUnit: { label: 'כוס', grams: 240 },
    category: 'grains',
  },
]

// --------- עזרי המרה לעברית ---------

const PLURAL_FIXES: Record<string, string> = {
  'ביצים': 'ביצה',
  'תפוחים': 'תפוח',
  'בננות': 'בננה',
  'תפוזים': 'תפוז',
  'עגבניות': 'עגבנייה',
  'מלפפונים': 'מלפפון',
  'גזרים': 'גזר',
  'שקדים': 'שקד',
  'אגוזים': 'אגוז',
  'פיתות': 'פיתה',
  'תפוחי אדמה': 'תפוח אדמה',
  'בטטות': 'בטטה',
  'תמרים': 'תמר',
  'תאנים': 'תאנה',
  'ענבים': 'ענב',
  'תותים': 'תות',
  'דובדבנים': 'דובדבן',
  'פלפלים': 'פלפל',
  'פטריות': 'פטרייה',
  'עדשים': 'עדשה',
  'ירכיים': 'ירך',
}

function normalizePluralHebrew(word: string): string {
  if (PLURAL_FIXES[word]) return PLURAL_FIXES[word]

  // הסרת סיומות רבים נפוצות
  if (word.endsWith('ות') && word.length > 3) return word.slice(0, -2) + 'ה'
  if (word.endsWith('ים') && word.length > 3) return word.slice(0, -2)

  return word
}

function normalizeText(text: string): string {
  return text.trim().toLowerCase()
    .replace(/[״']/g, '')
    .replace(/\s+/g, ' ')
}

// --------- פרסור קלט עברי חופשי ---------

export interface ParsedInput {
  food: string
  grams: number | null
}

export function parseHebrewFoodInput(text: string): ParsedInput {
  const trimmed = text.trim()

  // ניסיון ראשון: מספר בתחילה — "100 גרם חזה עוף", "2 ביצים", "3 כפות טחינה"
  const startMatch = trimmed.match(
    /^(\d+(?:\.\d+)?)\s*(חצי כוס|רבע כוס|קילוגרם|גרמים|גרם|קג|כוס|כפות|כפיות|כף|כפית|פרוסות|פרוסה|יחידות|יחידה|יח|מנות|מנה|ג(?:\'|׳)?|גר)\s+(.+)$/
  )

  if (startMatch) {
    const [, amountStr, unitRaw, foodPart] = startMatch
    const amount = parseFloat(amountStr)
    const unit = unitRaw.replace(/ות$/, 'ה').replace(/ים$/, '') // נרמול צורת יחיד

    // מציאת גרמים לפי יחידה
    const unitGrams = findUnitGrams(unit)
    const grams = unitGrams !== null ? amount * unitGrams : amount

    const foodName = normalizePluralHebrew(foodPart.trim())
    return { food: foodName, grams }
  }

  // ניסיון שני: "חצי כוס X" / "רבע כוס X"
  const fractionMatch = trimmed.match(/^(חצי|רבע)\s+כוס\s+(.+)$/)
  if (fractionMatch) {
    const [, frac, foodPart] = fractionMatch
    const grams = frac === 'חצי' ? 120 : 60
    return { food: normalizePluralHebrew(foodPart.trim()), grams }
  }

  // ניסיון שלישי: "X 150" — שם מזון ואחריו מספר
  const endMatch = trimmed.match(/^(.+?)\s+(\d+(?:\.\d+)?)(\s*ג[רם׳]?\.?)?$/)
  if (endMatch) {
    const [, foodPart, amountStr] = endMatch
    const cleanFood = foodPart.replace(/(גרם|ג׳|ג'|גר)$/, '').trim()
    return { food: normalizePluralHebrew(cleanFood), grams: parseFloat(amountStr) }
  }

  // לא נמצאה כמות — מחזירים רק שם
  return { food: normalizePluralHebrew(trimmed), grams: null }
}

function findUnitGrams(unit: string): number | null {
  const directMap: Record<string, number> = {
    'גרם': 1, 'גרמים': 1, 'ג': 1, 'גר': 1,
    'קילוגרם': 1000, 'קג': 1000,
    'כוס': 240,
    'חצי כוס': 120,
    'רבע כוס': 60,
    'כף': 15, 'כפות': 15,
    'כפית': 5, 'כפיות': 5,
    'פרוסה': 30, 'פרוסות': 30,
    'יחידה': 100, 'יחידות': 100, 'יח': 100,
    'מנה': 100, 'מנות': 100,
  }
  return directMap[unit] ?? null
}

// --------- חיפוש עם fuzzy matching ---------

function scoreFoodMatch(food: HebrewFood, query: string): number {
  const normalizedQuery = normalizeText(query)
  const normalizedName = normalizeText(food.name)

  // התאמה מלאה
  if (normalizedName === normalizedQuery) return 100

  // התאמה בתחילת השם
  if (normalizedName.startsWith(normalizedQuery)) return 90

  // השם מכיל את השאילתה
  if (normalizedName.includes(normalizedQuery)) return 80

  // בדיקת aliases
  for (const alias of food.aliases) {
    const normalizedAlias = normalizeText(alias)
    if (normalizedAlias === normalizedQuery) return 95
    if (normalizedAlias.startsWith(normalizedQuery)) return 85
    if (normalizedAlias.includes(normalizedQuery)) return 75
  }

  // בדיקת מילים בודדות — כל מילה בשאילתה חייבת להופיע
  const queryWords = normalizedQuery.split(' ')
  const nameWords = normalizedName.split(' ')

  const allMatch = queryWords.every((qWord) =>
    nameWords.some((nWord) => nWord.includes(qWord) || qWord.includes(nWord))
  )
  if (allMatch) return 60

  // חפיפה חלקית
  const anyMatch = queryWords.some((qWord) =>
    nameWords.some((nWord) => nWord.includes(qWord) || qWord.includes(nWord)) ||
    food.aliases.some((a) => normalizeText(a).includes(qWord))
  )
  if (anyMatch) return 40

  return 0
}

export function searchHebrewFoods(query: string): HebrewFood[] {
  if (!query || query.trim().length < 1) return []

  // ניסיון לחלץ שם מזון מהטקסט
  const parsed = parseHebrewFoodInput(query)
  const searchTerm = parsed.food || query.trim()

  const scored = HEBREW_FOODS.map((food) => ({
    food,
    score: scoreFoodMatch(food, searchTerm),
  }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  return scored.map((r) => r.food)
}

// --------- חישוב ערכים תזונתיים ---------

export interface NutritionResult {
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

export function calcNutrition(food: HebrewFood, grams: number): NutritionResult {
  const factor = grams / 100
  return {
    calories: Math.round(food.per100g.calories * factor * 10) / 10,
    protein_g: Math.round(food.per100g.protein_g * factor * 10) / 10,
    carbs_g: Math.round(food.per100g.carbs_g * factor * 10) / 10,
    fat_g: Math.round(food.per100g.fat_g * factor * 10) / 10,
  }
}
