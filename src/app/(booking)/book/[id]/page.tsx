import BookingForm from '@/app/components/ui/booking';

export default async function Bookings({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookingForm id={id} />;
}
