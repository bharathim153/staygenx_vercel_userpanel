import RoomsPage from '@/app/components/ui/rooms';
import APICONSTANT from '@/utils/apiconstant';

export default async function Rooms({
  params,
}: {
  params: Promise<{ propId: string }>;
}) {
  const { propId } = await params;
  const api =
    process.env.NEXT_PUBLIC_BASE_URL + APICONSTANT.listings + `/${propId}`;
  const res = await fetch(api, { cache: 'no-store' });
  const data = await res.json();
  console.log('Prop ID:', propId);
  console.log('Room Data:', data);
  return (
    <div>
      <RoomsPage data={data.data} />
    </div>
  );
}
