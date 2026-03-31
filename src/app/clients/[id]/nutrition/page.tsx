import { redirect } from 'next/navigation'

export default function ClientNutritionPage({ params }: { params: { id: string } }) {
  redirect(`/clients/${params.id}?tab=nutrition`)
}
