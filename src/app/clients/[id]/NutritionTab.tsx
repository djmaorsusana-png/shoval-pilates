"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Apple, Search, Loader2, LayoutTemplate, FileDown, MessageCircle, X } from 'lucide-react'
import { format } from 'date-fns'
import NutritionCalculatorCard from '@/components/NutritionCalculatorCard'
import { MENU_TEMPLATES, MEAL_TYPE_LABELS, MealTemplate } from '@/lib/nutrition'
import { DEMO_MEASUREMENTS, DEMO_MENUS } from '@/lib/demoData'
import SmartFoodInput, { type SmartFoodItem } from '@/components/SmartFoodInput'
import { cn } from '@/lib/utils'

const SUPABASE_CONFIGURED = process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'

interface Client {
  id: string
  name: string
  phone: string | null
  height_cm: number | null
  birth_date: string | null
  gender: string | null
  nutrition_calories_target: number | null
  nutrition_protein_target: number | null
  nutrition_carbs_target: number | null
  nutrition_fat_target: number | null
}

interface Menu {
  id: string
  name: string
  menu_date: string
  notes: string | null
  menu_items: MenuItem[]
}

interface MenuItem {
  id: string
  food_name: string
  quantity_grams: number | null
  meal_type: string
  calories: number | null
  protein_g: number | null
  carbs_g: number | null
  fat_g: number | null
}

const mealTypeLabels: Record<string, string> = {
  breakfast: 'ארוחת בוקר',
  morning_snack: 'נשנוש בוקר',
  lunch: 'ארוחת צהריים',
  afternoon_snack: 'נשנוש אחר צהריים',
  dinner: 'ארוחת ערב',
  evening_snack: 'נשנוש ערב',
}

// סדר קבוע לסוגי ארוחות
const MEAL_ORDER = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack']

interface USDAFood {
  fdcId: number
  description: string
  foodNutrients: { nutrientId: number; value: number }[]
}

export default function NutritionTab({ clientId, client }: { clientId: string; client: Client }) {
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [menuItemOpen, setMenuItemOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [templateOpen, setTemplateOpen] = useState(false)
  const [applyingTemplate, setApplyingTemplate] = useState(false)
  const [latestWeight, setLatestWeight] = useState<number | null>(null)
  const [latestBodyFat, setLatestBodyFat] = useState<number | null>(null)
  const [usdaSearch, setUsdaSearch] = useState('')
  const [usdaResults, setUsdaResults] = useState<USDAFood[]>([])
  const [usdaLoading, setUsdaLoading] = useState(false)
  const supabase = createClient()

  const [menuForm, setMenuForm] = useState({
    name: '',
    menu_date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const [itemForm, setItemForm] = useState({
    food_name: '',
    quantity_grams: '',
    meal_type: 'breakfast',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
  })

  async function fetchMenus() {
    if (!SUPABASE_CONFIGURED) {
      const demo = (DEMO_MENUS as Record<string, Menu[]>)[clientId] ?? []
      setMenus(demo)
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('menus')
      .select('*, menu_items(*)')
      .eq('client_id', clientId)
      .order('menu_date', { ascending: false })
    setMenus((data ?? []) as Menu[])
    setLoading(false)
  }

  useEffect(() => {
    fetchMenus()
    if (!SUPABASE_CONFIGURED) {
      // שליפת מדידה אחרונה ממצב דמו
      const demoMeasurements = (DEMO_MEASUREMENTS as Record<string, { weight_kg: number; body_fat_pct: number }[]>)[clientId]
      if (demoMeasurements && demoMeasurements.length > 0) {
        const last = demoMeasurements[demoMeasurements.length - 1]
        setLatestWeight(last.weight_kg)
        setLatestBodyFat(last.body_fat_pct)
      }
      return
    }
    // שליפת מדידה אחרונה עבור המחשבון
    supabase
      .from('measurements')
      .select('weight_kg, body_fat_pct')
      .eq('client_id', clientId)
      .order('measured_at', { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setLatestWeight(data.weight_kg)
          setLatestBodyFat(data.body_fat_pct)
        }
      })
  }, [clientId]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePrintMenu(menu: Menu) {
    if (!SUPABASE_CONFIGURED) {
      sessionStorage.setItem(`demo_menu_${menu.id}`, JSON.stringify({
        ...menu,
        client_name: client.name,
        client_phone: client.phone,
      }))
      window.open(`/print/menu/${menu.id}?demo=1`, '_blank')
    } else {
      window.open(`/print/menu/${menu.id}`, '_blank')
    }
  }

  function handleWhatsApp(menu: Menu) {
    if (!client.phone) return
    const phone = client.phone.replace(/[^0-9]/g, '')
    const internationalPhone = phone.startsWith('0') ? '972' + phone.slice(1) : phone
    const totalCals = menu.menu_items?.reduce((s, i) => s + (i.calories || 0), 0) ?? 0
    const text = `שלום ${client.name}! 😊\n\nהנה התפריט שלך: "${menu.name}"\nסה"כ: ${Math.round(totalCals)} קלוריות ליום.\n\nבהצלחה! 💪`
    window.open(`https://wa.me/${internationalPhone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  async function handleApplyTemplate(template: MealTemplate) {
    setApplyingTemplate(true)
    const { data: menu } = await supabase
      .from('menus')
      .insert({
        client_id: clientId,
        name: template.name,
        menu_date: new Date().toISOString().split('T')[0],
        notes: template.description,
      })
      .select()
      .single()

    if (menu) {
      await supabase.from('menu_items').insert(
        template.items.map((item) => ({
          menu_id: menu.id,
          food_name: item.food_name,
          quantity_grams: item.quantity_grams,
          meal_type: item.meal_type,
          calories: item.calories,
          protein_g: item.protein_g,
          carbs_g: item.carbs_g,
          fat_g: item.fat_g,
        }))
      )
      await fetchMenus()
    }
    setTemplateOpen(false)
    setApplyingTemplate(false)
  }

  async function handleCreateMenu() {
    setSaving(true)
    const { data } = await supabase
      .from('menus')
      .insert({ client_id: clientId, name: menuForm.name, menu_date: menuForm.menu_date, notes: menuForm.notes || null })
      .select('*, menu_items(*)')
      .single()
    if (data) {
      setMenus((prev) => [data as Menu, ...prev])
    }
    setMenuOpen(false)
    setSaving(false)
    setMenuForm({ name: '', menu_date: new Date().toISOString().split('T')[0], notes: '' })
  }

  async function searchUSDA(query: string) {
    if (!query.trim()) return
    setUsdaLoading(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_USDA_API_KEY || 'DEMO_KEY'
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&pageSize=5&api_key=${apiKey}`
      )
      const json = await res.json()
      setUsdaResults(json.foods ?? [])
    } catch {
      setUsdaResults([])
    }
    setUsdaLoading(false)
  }

  function selectUSDAFood(food: USDAFood) {
    const getNutrient = (id: number) =>
      food.foodNutrients.find((n) => n.nutrientId === id)?.value ?? 0

    const calories = getNutrient(1008)
    const protein = getNutrient(1003)
    const carbs = getNutrient(1005)
    const fat = getNutrient(1004)

    setItemForm((p) => ({
      ...p,
      food_name: food.description,
      calories: calories ? (calories * (parseFloat(p.quantity_grams) || 100) / 100).toFixed(1) : '',
      protein_g: protein ? (protein * (parseFloat(p.quantity_grams) || 100) / 100).toFixed(1) : '',
      carbs_g: carbs ? (carbs * (parseFloat(p.quantity_grams) || 100) / 100).toFixed(1) : '',
      fat_g: fat ? (fat * (parseFloat(p.quantity_grams) || 100) / 100).toFixed(1) : '',
    }))
    setUsdaResults([])
    setUsdaSearch('')
  }

  async function handleAddItem() {
    if (!selectedMenu || !itemForm.food_name) return
    setSaving(true)
    await supabase.from('menu_items').insert({
      menu_id: selectedMenu.id,
      food_name: itemForm.food_name,
      quantity_grams: itemForm.quantity_grams ? parseFloat(itemForm.quantity_grams) : null,
      meal_type: itemForm.meal_type,
      calories: itemForm.calories ? parseFloat(itemForm.calories) : null,
      protein_g: itemForm.protein_g ? parseFloat(itemForm.protein_g) : null,
      carbs_g: itemForm.carbs_g ? parseFloat(itemForm.carbs_g) : null,
      fat_g: itemForm.fat_g ? parseFloat(itemForm.fat_g) : null,
    })
    await fetchMenus()
    setMenuItemOpen(false)
    setSaving(false)
    setItemForm({
      food_name: '', quantity_grams: '', meal_type: 'breakfast',
      calories: '', protein_g: '', carbs_g: '', fat_g: '',
    })
  }

  // הוספת פריט ישירה דרך SmartFoodInput
  async function handleAddItemDirect(item: SmartFoodItem, menuId: string) {
    if (!SUPABASE_CONFIGURED) {
      // מצב דמו — עדכון state מקומי בלבד
      const newItem: MenuItem = {
        id: `local-${Date.now()}-${Math.random()}`,
        food_name: item.food_name,
        quantity_grams: item.quantity_grams,
        meal_type: item.meal_type,
        calories: item.calories,
        protein_g: item.protein_g,
        carbs_g: item.carbs_g,
        fat_g: item.fat_g,
      }
      setMenus((prev) =>
        prev.map((m) =>
          m.id === menuId
            ? { ...m, menu_items: [...(m.menu_items || []), newItem] }
            : m
        )
      )
      return
    }

    // מצב production — שמירה ב-Supabase
    const { data } = await supabase
      .from('menu_items')
      .insert({
        menu_id: menuId,
        food_name: item.food_name,
        quantity_grams: item.quantity_grams,
        meal_type: item.meal_type,
        calories: item.calories,
        protein_g: item.protein_g,
        carbs_g: item.carbs_g,
        fat_g: item.fat_g,
      })
      .select()
      .single()

    if (data) {
      setMenus((prev) =>
        prev.map((m) =>
          m.id === menuId
            ? { ...m, menu_items: [...(m.menu_items || []), data as MenuItem] }
            : m
        )
      )
    }
  }

  // מחיקת פריט מזון
  async function handleDeleteItem(itemId: string, menuId: string) {
    if (!SUPABASE_CONFIGURED) {
      // מצב דמו — עדכון state מקומי
      setMenus((prev) =>
        prev.map((m) =>
          m.id === menuId
            ? { ...m, menu_items: (m.menu_items || []).filter((i) => i.id !== itemId) }
            : m
        )
      )
      return
    }

    // מצב production — מחיקה מ-Supabase
    await supabase.from('menu_items').delete().eq('id', itemId)
    setMenus((prev) =>
      prev.map((m) =>
        m.id === menuId
          ? { ...m, menu_items: (m.menu_items || []).filter((i) => i.id !== itemId) }
          : m
      )
    )
  }

  if (loading) return <Skeleton className="h-48 w-full" />

  return (
    <div className="space-y-4">

      {/* מחשבון BMR/TDEE */}
      <NutritionCalculatorCard
        client={client}
        latestWeight={latestWeight}
        latestBodyFat={latestBodyFat}
        onSaved={() => {}}
      />

      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-brand-text flex items-center gap-2">
          <Apple className="w-4 h-4 text-brand-accent" />
          תפריטי תזונה
        </h3>
        <div className="flex gap-2">
          {/* כפתור תבניות */}
          <Dialog open={templateOpen} onOpenChange={setTemplateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <LayoutTemplate className="ml-2 h-3 w-3" />
                תבנית מוכנה
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>בחר תבנית תפריט</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                {MENU_TEMPLATES.map((template) => (
                  <div key={template.id} className="border border-brand-border rounded-lg p-4 hover:bg-brand-light transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-brand-text">{template.name}</p>
                        <p className="text-xs text-brand-accent mt-0.5">{template.description}</p>
                        <p className="text-xs text-brand-accent/70 mt-0.5">{template.target_person}</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span className="bg-brand-light px-2 py-0.5 rounded-full">{template.calories} קל׳</span>
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{template.protein_g}ג׳ חלבון</span>
                          <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{template.carbs_g}ג׳ פחמ׳</span>
                          <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{template.fat_g}ג׳ שומן</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApplyTemplate(template)}
                        disabled={applyingTemplate}
                      >
                        {applyingTemplate ? 'מייצר...' : 'הצמד ללקוח'}
                      </Button>
                    </div>
                    {/* תצוגת ארוחות */}
                    <div className="mt-3 grid grid-cols-2 gap-1">
                      {Object.entries(
                        template.items.reduce<Record<string, typeof template.items>>((acc, item) => {
                          if (!acc[item.meal_type]) acc[item.meal_type] = []
                          acc[item.meal_type].push(item)
                          return acc
                        }, {})
                      ).map(([mealType, items]) => (
                        <div key={mealType} className="text-xs">
                          <span className="font-medium text-brand-accent">{MEAL_TYPE_LABELS[mealType] ?? mealType}: </span>
                          <span className="text-brand-text/70">{items.map(i => i.food_name).join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="ml-2 h-4 w-4" />
                תפריט חדש
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>תפריט חדש</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>שם התפריט</Label>
                  <Input value={menuForm.name} onChange={(e) => setMenuForm((p) => ({ ...p, name: e.target.value }))} placeholder="תפריט שבועי..." />
                </div>
                <div className="space-y-2">
                  <Label>תאריך</Label>
                  <Input type="date" value={menuForm.menu_date} onChange={(e) => setMenuForm((p) => ({ ...p, menu_date: e.target.value }))} />
                </div>
                <Button onClick={handleCreateMenu} disabled={saving || !menuForm.name} className="w-full">
                  {saving ? 'שומר...' : 'צור תפריט'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* יעדי תזונה */}
      {(client.nutrition_calories_target || client.nutrition_protein_target) && (
        <Card className="bg-brand-light">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-brand-text mb-2">יעדי תזונה:</p>
            <div className="flex gap-4 text-sm text-brand-accent">
              {client.nutrition_calories_target && <span>קלוריות: {client.nutrition_calories_target}</span>}
              {client.nutrition_protein_target && <span>חלבון: {client.nutrition_protein_target}ג׳</span>}
              {client.nutrition_carbs_target && <span>פחמימות: {client.nutrition_carbs_target}ג׳</span>}
              {client.nutrition_fat_target && <span>שומן: {client.nutrition_fat_target}ג׳</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {menus.length === 0 ? (
        <p className="text-brand-accent text-sm text-center py-8">אין תפריטים עדיין.</p>
      ) : (
        <div className="space-y-4">
          {menus.map((menu) => {
            const totalCals = menu.menu_items?.reduce((s, i) => s + (i.calories || 0), 0) ?? 0
            const totalProtein = menu.menu_items?.reduce((s, i) => s + (i.protein_g || 0), 0) ?? 0
            const totalCarbs = menu.menu_items?.reduce((s, i) => s + (i.carbs_g || 0), 0) ?? 0
            const totalFat = menu.menu_items?.reduce((s, i) => s + (i.fat_g || 0), 0) ?? 0

            const pct = client.nutrition_calories_target
              ? Math.round((totalCals / client.nutrition_calories_target) * 100)
              : 0

            const grouped = (menu.menu_items ?? []).reduce<Record<string, MenuItem[]>>((acc, item) => {
              if (!acc[item.meal_type]) acc[item.meal_type] = []
              acc[item.meal_type].push(item)
              return acc
            }, {})

            // סדר ארוחות לפי הסדר הקבוע
            const sortedMealTypes = MEAL_ORDER.filter((mt) => grouped[mt])
              .concat(Object.keys(grouped).filter((mt) => !MEAL_ORDER.includes(mt)))

            return (
              <Card key={menu.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {menu.name}
                      <span className="text-brand-accent font-normal text-xs mr-2">
                        {format(new Date(menu.menu_date), 'dd/MM/yyyy')}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handlePrintMenu(menu)} title="הורד PDF">
                        <FileDown className="h-3 w-3" />
                      </Button>
                      {client.phone && (
                        <Button size="sm" variant="outline" onClick={() => handleWhatsApp(menu)} title="שלח בוואטסאפ">
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                      )}
                      {/* דיאלוג הוספת מזון ידני / USDA */}
                      <Dialog open={menuItemOpen && selectedMenu?.id === menu.id} onOpenChange={(v) => {
                        setMenuItemOpen(v)
                        if (v) setSelectedMenu(menu)
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedMenu(menu)} title="הוספה ידנית">
                            <Search className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>הוספת מזון לתפריט</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-2">
                            {/* USDA search */}
                            <div className="space-y-2">
                              <Label>חיפוש מזון (USDA)</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={usdaSearch}
                                  onChange={(e) => setUsdaSearch(e.target.value)}
                                  placeholder="חפש מזון באנגלית..."
                                  dir="ltr"
                                  className="text-left"
                                  onKeyDown={(e) => e.key === 'Enter' && searchUSDA(usdaSearch)}
                                />
                                <Button type="button" variant="outline" size="icon" onClick={() => searchUSDA(usdaSearch)} disabled={usdaLoading}>
                                  {usdaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                </Button>
                              </div>
                              {usdaResults.length > 0 && (
                                <div className="border border-brand-border rounded-md overflow-hidden">
                                  {usdaResults.map((food) => (
                                    <button
                                      key={food.fdcId}
                                      onClick={() => selectUSDAFood(food)}
                                      className="w-full text-right px-3 py-2 text-xs hover:bg-brand-light border-b border-brand-border last:border-0"
                                    >
                                      {food.description}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label>שם המזון</Label>
                              <Input value={itemForm.food_name} onChange={(e) => setItemForm((p) => ({ ...p, food_name: e.target.value }))} placeholder="סלמון אפוי..." />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label>כמות (גרם)</Label>
                                <Input type="number" value={itemForm.quantity_grams} onChange={(e) => setItemForm((p) => ({ ...p, quantity_grams: e.target.value }))} placeholder="100" />
                              </div>
                              <div className="space-y-2">
                                <Label>ארוחה</Label>
                                <Select value={itemForm.meal_type} onValueChange={(v) => setItemForm((p) => ({ ...p, meal_type: v }))}>
                                  <SelectTrigger><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(mealTypeLabels).map(([k, v]) => (
                                      <SelectItem key={k} value={k}>{v}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs">קל׳</Label>
                                <Input type="number" value={itemForm.calories} onChange={(e) => setItemForm((p) => ({ ...p, calories: e.target.value }))} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">חלבון(ג׳)</Label>
                                <Input type="number" value={itemForm.protein_g} onChange={(e) => setItemForm((p) => ({ ...p, protein_g: e.target.value }))} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">פחמ׳(ג׳)</Label>
                                <Input type="number" value={itemForm.carbs_g} onChange={(e) => setItemForm((p) => ({ ...p, carbs_g: e.target.value }))} />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">שומן(ג׳)</Label>
                                <Input type="number" value={itemForm.fat_g} onChange={(e) => setItemForm((p) => ({ ...p, fat_g: e.target.value }))} />
                              </div>
                            </div>
                            <Button onClick={handleAddItem} disabled={saving || !itemForm.food_name} className="w-full">
                              {saving ? 'שומר...' : 'הוסף מזון'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* סרגל סיכום קלוריות בזמן אמת */}
                  <div className="bg-brand-light rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-brand-accent">
                        {Math.round(totalCals)} / {client.nutrition_calories_target ?? '—'} קל׳
                      </span>
                      <span className="text-xs font-medium text-brand-text">
                        חלבון {Math.round(totalProtein)}ג׳ · פחמ׳ {Math.round(totalCarbs)}ג׳ · שומן {Math.round(totalFat)}ג׳
                      </span>
                    </div>
                    {client.nutrition_calories_target && (
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            pct > 110 ? 'bg-red-400' : pct > 95 ? 'bg-amber-400' : 'bg-green-400'
                          )}
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* ארוחות */}
                  {sortedMealTypes.length === 0 ? (
                    <p className="text-brand-accent text-xs mb-3">אין פריטי מזון עדיין.</p>
                  ) : (
                    sortedMealTypes.map((mealType) => {
                      const items = grouped[mealType]
                      return (
                        <div key={mealType} className="mb-4">
                          <p className="text-xs font-semibold text-brand-accent mb-1.5">
                            {mealTypeLabels[mealType] ?? mealType}
                          </p>
                          <div className="space-y-1">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-brand-border/50 last:border-0 group">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => handleDeleteItem(item.id, menu.id)}
                                    className="text-brand-accent/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    title="הסר פריט"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                  <span className="font-medium">
                                    {item.food_name}{item.quantity_grams ? ` (${item.quantity_grams}ג׳)` : ''}
                                  </span>
                                </div>
                                <span className="text-brand-accent">
                                  {item.calories ? `${Math.round(item.calories)} קל׳` : ''}
                                  {item.protein_g ? ` · ${Math.round(item.protein_g)}ג׳ ח׳` : ''}
                                </span>
                              </div>
                            ))}
                          </div>
                          {/* SmartFoodInput לכל ארוחה */}
                          <div className="mt-2">
                            <SmartFoodInput
                              mealType={mealType}
                              onAdd={(item) => handleAddItemDirect(item, menu.id)}
                            />
                          </div>
                        </div>
                      )
                    })
                  )}

                  {/* SmartFoodInput לסוגי ארוחות שעדיין אין להם פריטים */}
                  <div className="mt-3 space-y-2">
                    {MEAL_ORDER.filter((mt) => !grouped[mt]).map((mealType) => (
                      <div key={mealType}>
                        <p className="text-xs text-brand-accent/60 mb-1">
                          {mealTypeLabels[mealType]}
                        </p>
                        <SmartFoodInput
                          mealType={mealType}
                          onAdd={(item) => handleAddItemDirect(item, menu.id)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
