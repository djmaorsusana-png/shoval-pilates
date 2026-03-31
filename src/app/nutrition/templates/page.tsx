"use client"

import AppShell from '@/components/AppShell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MENU_TEMPLATES, MEAL_TYPE_LABELS } from '@/lib/nutrition'
import { LayoutTemplate, Flame, Beef, Wheat, Droplets } from 'lucide-react'

export default function TemplatesPage() {
  return (
    <AppShell>
      <div className="p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-text flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-brand-accent" />
            תבניות תפריט מוכנות
          </h1>
          <p className="text-brand-accent text-sm mt-1">
            תבניות מבוססות על עקרונות תזונה מוכחים. להצמדה ללקוח — עבור לדף הלקוח → תזונה → תבנית מוכנה.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MENU_TEMPLATES.map((template) => {
            const grouped = template.items.reduce<Record<string, typeof template.items>>((acc, item) => {
              if (!acc[item.meal_type]) acc[item.meal_type] = []
              acc[item.meal_type].push(item)
              return acc
            }, {})

            const mealOrder = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner', 'evening_snack']

            return (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <p className="text-xs text-brand-accent">{template.description}</p>
                  <Badge variant="secondary" className="w-fit text-xs mt-1">
                    {template.target_person}
                  </Badge>

                  {/* מאקרו סיכום */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-xs font-medium">
                      <Flame className="w-3 h-3" />
                      {template.calories} קל׳
                    </div>
                    <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded-lg text-xs font-medium">
                      <Beef className="w-3 h-3" />
                      {template.protein_g}ג׳ חלבון
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg text-xs font-medium">
                      <Wheat className="w-3 h-3" />
                      {template.carbs_g}ג׳ פחמ׳
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-lg text-xs font-medium">
                      <Droplets className="w-3 h-3" />
                      {template.fat_g}ג׳ שומן
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {mealOrder
                    .filter((mealType) => grouped[mealType])
                    .map((mealType) => {
                      const items = grouped[mealType]
                      const mealCals = items.reduce((s, i) => s + i.calories, 0)
                      const mealProtein = items.reduce((s, i) => s + i.protein_g, 0)

                      return (
                        <div key={mealType} className="border border-brand-border rounded-lg overflow-hidden">
                          <div className="bg-brand-light px-3 py-1.5 flex items-center justify-between">
                            <span className="text-xs font-semibold text-brand-text">
                              {MEAL_TYPE_LABELS[mealType] ?? mealType}
                            </span>
                            <span className="text-xs text-brand-accent">
                              {Math.round(mealCals)} קל׳ · {Math.round(mealProtein)}ג׳ חלבון
                            </span>
                          </div>
                          <div className="divide-y divide-brand-border/50">
                            {items.map((item, idx) => (
                              <div key={idx} className="px-3 py-1.5 flex items-center justify-between text-xs">
                                <span className="font-medium text-brand-text">
                                  {item.food_name}
                                  <span className="text-brand-accent font-normal mr-1">
                                    ({item.quantity_grams}ג׳)
                                  </span>
                                </span>
                                <span className="text-brand-accent shrink-0">
                                  {item.calories} קל׳
                                  {item.protein_g > 0 && ` · ${item.protein_g}ג׳ חלבון`}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </AppShell>
  )
}
