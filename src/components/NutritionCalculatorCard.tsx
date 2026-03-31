"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  Calculator,
  Flame,
  Zap,
  Save,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react'
import {
  ACTIVITY_LEVELS,
  GOALS,
  calcBMR_MifflinStJeor,
  calcBMR_KatchMcArdle,
  calcTDEE,
  calcTargetCalories,
  calcMacros,
  calcAge,
} from '@/lib/nutrition'

interface Client {
  id: string
  height_cm: number | null
  birth_date: string | null
  gender: string | null
  nutrition_calories_target: number | null
  nutrition_protein_target: number | null
  nutrition_carbs_target: number | null
  nutrition_fat_target: number | null
}

interface Props {
  client: Client
  latestWeight?: number | null
  latestBodyFat?: number | null
  onSaved?: () => void
}

export default function NutritionCalculatorCard({ client, latestWeight, latestBodyFat, onSaved }: Props) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [weight, setWeight] = useState(latestWeight?.toString() ?? '')
  const [bodyFat, setBodyFat] = useState(latestBodyFat?.toString() ?? '')
  const [activity, setActivity] = useState('moderate')
  const [goal, setGoal] = useState('lose')
  const [gender, setGender] = useState<'male' | 'female'>(
    (client.gender as 'male' | 'female') ?? 'female'
  )

  const age = client.birth_date ? calcAge(client.birth_date) : null
  const activityFactor = ACTIVITY_LEVELS.find((a) => a.value === activity)?.factor ?? 1.55
  const goalDelta = GOALS.find((g) => g.value === goal)?.delta ?? -500

  const canCalc = weight && client.height_cm && age

  const weightNum = parseFloat(weight)
  const bodyFatNum = bodyFat ? parseFloat(bodyFat) : null
  const height = client.height_cm ?? 0

  // השתמש ב-Katch-McArdle אם יש אחוז שומן, אחרת Mifflin-St Jeor
  const bmr = canCalc
    ? bodyFatNum !== null
      ? calcBMR_KatchMcArdle(weightNum, bodyFatNum)
      : calcBMR_MifflinStJeor(weightNum, height, age!, gender)
    : null

  const tdee = bmr ? calcTDEE(bmr, activityFactor) : null
  const targetCalories = tdee ? calcTargetCalories(tdee, goalDelta) : null
  const macros = targetCalories ? calcMacros(targetCalories, weightNum) : null

  const formula = bodyFatNum !== null ? 'Katch-McArdle' : 'Mifflin-St Jeor'

  async function handleSave() {
    if (!targetCalories || !macros) return
    setSaving(true)
    await supabase
      .from('clients')
      .update({
        nutrition_calories_target: targetCalories,
        nutrition_protein_target: macros.protein_g,
        nutrition_carbs_target: macros.carbs_g,
        nutrition_fat_target: macros.fat_g,
        gender,
      })
      .eq('id', client.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    onSaved?.()
  }

  return (
    <Card className="border-brand-accent/30 bg-brand-light">
      <CardHeader className="pb-3 cursor-pointer select-none" onClick={() => setOpen((v) => !v)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2 text-brand-text">
            <Calculator className="w-4 h-4 text-brand-accent" />
            מחשבון BMR / TDEE / מאקרו
            <span className="text-xs text-brand-accent font-normal">(מבוסס מחקר)</span>
          </CardTitle>
          {open ? (
            <ChevronUp className="w-4 h-4 text-brand-accent" />
          ) : (
            <ChevronDown className="w-4 h-4 text-brand-accent" />
          )}
        </div>
        {!open && client.nutrition_calories_target && (
          <p className="text-xs text-brand-accent mt-1">
            יעד נוכחי: {client.nutrition_calories_target} קל׳ ·{' '}
            {client.nutrition_protein_target}ג׳ חלבון ·{' '}
            {client.nutrition_carbs_target}ג׳ פחמ׳ ·{' '}
            {client.nutrition_fat_target}ג׳ שומן
          </p>
        )}
      </CardHeader>

      {open && (
        <CardContent className="space-y-5 pt-0">
          {/* נתוני קלט */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">מגדר</Label>
              <Select value={gender} onValueChange={(v) => setGender(v as 'male' | 'female')}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">אישה</SelectItem>
                  <SelectItem value="male">גבר</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{'משקל (ק"ג)'}</Label>
              <Input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={latestWeight ? `${latestWeight}` : '65'}
                className="h-8 text-xs"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">{'גובה (ס"מ)'}</Label>
              <Input
                type="number"
                value={client.height_cm ?? ''}
                disabled
                className="h-8 text-xs bg-white/50"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">גיל</Label>
              <Input
                type="number"
                value={age ?? ''}
                disabled
                placeholder={!client.birth_date ? 'הכנס ת. לידה בפרטים' : ''}
                className="h-8 text-xs bg-white/50"
                dir="ltr"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">אחוז שומן (אופציונלי)</Label>
              <Input
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder={latestBodyFat ? `${latestBodyFat}` : 'לא חובה'}
                className="h-8 text-xs"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">רמת פעילות</Label>
              <Select value={activity} onValueChange={setActivity}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_LEVELS.map((a) => (
                    <SelectItem key={a.value} value={a.value} className="text-xs">
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">מטרה</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GOALS.map((g) => (
                    <SelectItem key={g.value} value={g.value} className="text-xs">
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* תוצאות */}
          {bmr && tdee && targetCalories && macros ? (
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-xs text-brand-accent">
                <Info className="w-3 h-3" />
                <span>נוסחה: {formula}</span>
              </div>

              {/* BMR + TDEE */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-brand-accent mb-1">BMR (חילוף חומרים בסיסי)</p>
                  <p className="text-2xl font-bold text-brand-text">{bmr}</p>
                  <p className="text-xs text-brand-accent">קל׳/יום במנוחה</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <p className="text-xs text-brand-accent">TDEE (שריפה יומית)</p>
                  </div>
                  <p className="text-2xl font-bold text-brand-text">{tdee}</p>
                  <p className="text-xs text-brand-accent">קל׳/יום עם פעילות</p>
                </div>
              </div>

              {/* יעד קלוריות */}
              <div className="bg-brand-accent/10 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Zap className="w-4 h-4 text-brand-accent" />
                  <p className="text-sm font-semibold text-brand-text">יעד קלוריות יומי</p>
                </div>
                <p className="text-3xl font-bold text-brand-text">{targetCalories}</p>
                <p className="text-xs text-brand-accent mt-1">
                  {goalDelta < 0 ? `גירעון של ${Math.abs(goalDelta)} קל׳` : goalDelta > 0 ? `עודף של ${goalDelta} קל׳` : 'ללא שינוי'}
                </p>
              </div>

              {/* מאקרו */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-blue-600 font-medium">חלבון</p>
                  <p className="text-xl font-bold text-blue-700">{macros.protein_g}ג׳</p>
                  <p className="text-xs text-blue-500">{Math.round(macros.protein_g * 4)} קל׳</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-amber-600 font-medium">פחמימות</p>
                  <p className="text-xl font-bold text-amber-700">{macros.carbs_g}ג׳</p>
                  <p className="text-xs text-amber-500">{Math.round(macros.carbs_g * 4)} קל׳</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 text-center">
                  <p className="text-xs text-green-600 font-medium">שומן</p>
                  <p className="text-xl font-bold text-green-700">{macros.fat_g}ג׳</p>
                  <p className="text-xs text-green-500">{Math.round(macros.fat_g * 9)} קל׳</p>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || saved}
                className="w-full"
                size="sm"
              >
                {saving ? (
                  'שומר...'
                ) : saved ? (
                  '✓ יעדים נשמרו בהצלחה'
                ) : (
                  <>
                    <Save className="ml-2 h-3 w-3" />
                    שמור יעדים ללקוח
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4 text-brand-accent text-sm">
              {!client.height_cm && <p>⚠️ הכנס גובה בפרטי הלקוח.</p>}
              {!client.birth_date && <p>⚠️ הכנס תאריך לידה בפרטי הלקוח.</p>}
              {!weight && client.height_cm && client.birth_date && (
                <p>הכנס משקל לחישוב.</p>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
