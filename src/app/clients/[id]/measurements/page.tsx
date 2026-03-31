import { redirect } from 'next/navigation'

export default function MeasurementsPage({ params }: { params: { id: string } }) {
  redirect(`/clients/${params.id}?tab=measurements`)
}
