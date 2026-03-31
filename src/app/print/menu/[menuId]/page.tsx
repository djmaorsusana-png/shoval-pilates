"use client"

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

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

interface Menu {
  id: string
  client_id: string
  name: string
  menu_date: string
  notes: string | null
  menu_items: MenuItem[]
  client_name?: string
  client_phone?: string | null
}

const mealTypeLabels: Record<string, string> = {
  breakfast: 'ארוחת בוקר',
  morning_snack: 'נשנוש בוקר',
  lunch: 'ארוחת צהריים',
  afternoon_snack: 'נשנוש אחר צהריים',
  dinner: 'ארוחת ערב',
  evening_snack: 'נשנוש ערב',
}

const mealTypeOrder = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack']

export default function PrintMenuPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const menuId = params.menuId as string
  const isDemo = searchParams.get('demo') === '1'
  const supabase = createClient()

  const [menu, setMenu] = useState<Menu | null>(null)
  const [clientName, setClientName] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMenu() {
      if (isDemo) {
        const raw = sessionStorage.getItem(`demo_menu_${menuId}`)
        if (raw) {
          const parsed: Menu = JSON.parse(raw)
          setMenu(parsed)
          setClientName(parsed.client_name ?? '')
        }
        setLoading(false)
        return
      }

      const { data: menuData } = await supabase
        .from('menus')
        .select('*, menu_items(*)')
        .eq('id', menuId)
        .single()

      if (!menuData) {
        setLoading(false)
        return
      }

      setMenu(menuData as Menu)

      const { data: clientData } = await supabase
        .from('clients')
        .select('name, phone')
        .eq('id', menuData.client_id)
        .single()

      if (clientData) {
        setClientName(clientData.name)
      }

      setLoading(false)
    }

    loadMenu()
  }, [menuId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && menu) {
      setTimeout(() => window.print(), 500)
    }
  }, [loading, menu])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">טוען תפריט...</p>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">התפריט לא נמצא.</p>
      </div>
    )
  }

  const items = menu.menu_items ?? []

  const grouped = items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    if (!acc[item.meal_type]) acc[item.meal_type] = []
    acc[item.meal_type].push(item)
    return acc
  }, {})

  const orderedMealTypes = [
    ...mealTypeOrder.filter((k) => grouped[k]),
    ...Object.keys(grouped).filter((k) => !mealTypeOrder.includes(k)),
  ]

  const totalCals = items.reduce((s, i) => s + (i.calories || 0), 0)
  const totalProtein = items.reduce((s, i) => s + (i.protein_g || 0), 0)
  const totalCarbs = items.reduce((s, i) => s + (i.carbs_g || 0), 0)
  const totalFat = items.reduce((s, i) => s + (i.fat_g || 0), 0)

  return (
    <div className="min-h-screen bg-white p-8 max-w-2xl mx-auto print:p-4" dir="rtl">
      {/* כותרת */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pilates by Shoval</h1>
          <p className="text-gray-600 text-sm">תפריט תזונה מותאם אישית</p>
        </div>
        <div className="text-left">
          {clientName && <p className="font-semibold">{clientName}</p>}
          <p className="text-sm text-gray-500">
            {format(new Date(menu.menu_date), 'dd/MM/yyyy')}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">{menu.name}</h2>
      {menu.notes && (
        <p className="text-gray-600 text-sm mb-4 italic">{menu.notes}</p>
      )}

      {/* קבוצות ארוחות */}
      {orderedMealTypes.map((mealType) => {
        const mealItems = grouped[mealType]
        return (
          <div key={mealType} className="mb-5">
            <h3 className="font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-2">
              {mealTypeLabels[mealType] ?? mealType}
            </h3>
            <div className="space-y-1">
              {mealItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-1">
                  <span>
                    {item.food_name}
                    {item.quantity_grams ? ` — ${item.quantity_grams}ג'` : ''}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {item.calories ? `${Math.round(item.calories)} קל'` : ''}
                    {item.protein_g ? ` | חלבון: ${Math.round(item.protein_g)}ג'` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* סיכום */}
      <div className="border-t-2 border-gray-800 pt-4 mt-6">
        <div className="flex gap-6 text-sm font-semibold flex-wrap">
          <span>סה&quot;כ קלוריות: {Math.round(totalCals)}</span>
          <span>חלבון: {Math.round(totalProtein)}ג&apos;</span>
          <span>פחמימות: {Math.round(totalCarbs)}ג&apos;</span>
          <span>שומן: {Math.round(totalFat)}ג&apos;</span>
        </div>
      </div>

      {/* כותרת תחתונה */}
      <div className="mt-8 text-center text-xs text-gray-400 print:block">
        <p>Pilates by Shoval · תפריט אישי · אין להעביר לאחרים</p>
      </div>

      {/* כפתורים — מוסתרים בהדפסה */}
      <div className="mt-6 flex gap-3 print:hidden">
        <Button onClick={() => window.print()}>הדפס / שמור PDF</Button>
        <Button variant="outline" onClick={() => window.close()}>סגור</Button>
      </div>
    </div>
  )
}
