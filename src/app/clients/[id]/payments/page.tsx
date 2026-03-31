import { redirect } from 'next/navigation'

export default function ClientPaymentsPage({ params }: { params: { id: string } }) {
  redirect(`/clients/${params.id}?tab=payments`)
}
