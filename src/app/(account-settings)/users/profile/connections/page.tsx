import NoPastTrips from '@/app/components/ui/account-settings/profile/notrips';

export default function Connects() {
  return (
    <NoPastTrips
      heading="Connections"
      desc="When you join an experience or invite someone on a trip, you’ll find the profiles of other guests here. Learn more"
      image="/images/connect.avif"
      onclick="/"
    />
  );
}
