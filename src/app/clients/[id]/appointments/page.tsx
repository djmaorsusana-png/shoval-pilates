import { redirect } from 'next/navigation'

export default function ClientAppointmentsPage({ params }: { params: { id: string } }) {
  redirect(`/clients/${params.id}?tab=appointments`)
}
