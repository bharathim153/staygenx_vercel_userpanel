import NoPastTrips from '@/app/components/ui/account-settings/profile/notrips';

export default function PastTrips() {
  return (
    <NoPastTrips
      heading="Past trips"
      desc="You’ll find your past reservations here after you’ve taken your first trip on Staygenx."
      image="/images/trip.avif"
      onclick="/"
    />
  );
}
