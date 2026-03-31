"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus } from 'lucide-react'
import {
  searchHebrewFoods,
  parseHebrewFoodInput,
  calcNutrition,
  type HebrewFood,
} from '@/lib/hebrewFoods'
import { cn } from '@/lib/utils'

export interface SmartFoodItem {
  food_name: string
  quantity_grams: number
  meal_type: string
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
}

interface SmartFoodInputProps {
  mealType: string
  onAdd: (item: SmartFoodItem) => void
  placeholder?: string
}

export default function SmartFoodInput({ mealType, onAdd, placeholder }: SmartFoodInputProps) {
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState<HebrewFood[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [previewCals, setPreviewCals] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback((value: string) => {
    setText(value)
    setActiveIndex(-1)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      if (!value.trim()) {
        setSuggestions([])
        setPreviewCals(null)
        setOpen(false)
        return
      }

      const results = searchHebrewFoods(value)
      setSuggestions(results)
      setOpen(results.length > 0)

      // חישוב תצוגה מקדימה של קלוריות
      if (results.length > 0) {
        const parsed = parseHebrewFoodInput(value)
        const food = results[0]
        const grams = parsed.grams ?? food.defaultUnit?.grams ?? 100
        const nutrition = calcNutrition(food, grams)
        setPreviewCals(nutrition.calories)
      } else {
        setPreviewCals(null)
      }
    }, 200)
  }, [])

  function resolveAndAdd(food: HebrewFood, inputText: string) {
    const parsed = parseHebrewFoodInput(inputText)
    const grams = parsed.grams ?? food.defaultUnit?.grams ?? 100
    const nutrition = calcNutrition(food, grams)

    onAdd({
      food_name: food.name,
      quantity_grams: Math.round(grams),
      meal_type: mealType,
      calories: nutrition.calories,
      protein_g: nutrition.protein_g,
      carbs_g: nutrition.carbs_g,
      fat_g: nutrition.fat_g,
    })

    setText('')
    setSuggestions([])
    setPreviewCals(null)
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const idx = activeIndex >= 0 ? activeIndex : 0
      if (suggestions[idx]) {
        resolveAndAdd(suggestions[idx], text)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  // סגירה בלחיצה מחוץ לקומפוננט
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const defaultPlaceholder = placeholder ?? 'הוסיפי מזון... למשל: 100ג חזה עוף, 2 ביצים, כוס אורז'

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          'flex items-center gap-2 border rounded-lg px-3 py-2 bg-white transition-all',
          open
            ? 'border-brand-accent ring-2 ring-brand-accent/20'
            : 'border-brand-border focus-within:border-brand-accent focus-within:ring-2 focus-within:ring-brand-accent/20'
        )}
      >
        <Plus className="w-4 h-4 text-brand-accent shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={text}
          dir="rtl"
          placeholder={defaultPlaceholder}
          className="flex-1 outline-none text-sm bg-transparent text-right placeholder:text-brand-accent/50"
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true)
          }}
          autoComplete="off"
        />
        {previewCals !== null && (
          <span className="text-xs text-brand-accent/70 shrink-0 font-medium">
            ≈{Math.round(previewCals)} קל׳
          </span>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 right-0 left-0 mt-1 bg-white border border-brand-border rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((food, index) => {
            const isActive = index === activeIndex
            const parsed = parseHebrewFoodInput(text)
            const grams = parsed.grams ?? food.defaultUnit?.grams ?? 100
            const nutrition = calcNutrition(food, grams)

            return (
              <button
                key={food.id}
                type="button"
                dir="rtl"
                onClick={() => resolveAndAdd(food, text)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 text-right transition-colors border-b border-brand-border/50 last:border-0',
                  isActive ? 'bg-brand-light' : 'hover:bg-brand-light/70'
                )}
              >
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-medium text-brand-text">{food.name}</span>
                  {food.defaultUnit && (
                    <span className="text-xs text-brand-accent/60">
                      {food.defaultUnit.label} = {food.defaultUnit.grams}ג׳
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end gap-0.5 mr-2">
                  <span className="text-xs font-semibold text-brand-accent">
                    {Math.round(nutrition.calories)} קל׳
                  </span>
                  <span className="text-xs text-brand-accent/60">
                    ח׳ {nutrition.protein_g}ג׳ · פח׳ {nutrition.carbs_g}ג׳ · ש׳ {nutrition.fat_g}ג׳
                  </span>
                </div>
              </button>
            )
          })}
          <div className="px-3 py-1.5 bg-brand-light/50 border-t border-brand-border/50">
            <p className="text-xs text-brand-accent/50 text-right">
              לחצי Enter להוספה מהירה · ↑↓ לניווט
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
