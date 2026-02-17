'use client';
import { useGlobalStore } from '@/lib/store/global-store';
import Button from '@/shadcn/ui/Button';
import { Plus } from 'lucide-react';
import EditHouseManual from './edithousemanual';
import { useListingStore } from '../../../create-listings/store';

export default function HouseManual() {
  const { ListingEdit, setListingEdit } = useGlobalStore();
  const { ListingData } = useListingStore();
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-8">
      <h2 className="text-2xl font-semibold ">Checkout instructions</h2>
      {Array.isArray(ListingData?.arrivalguide?.checkoutInstructions) &&
      ListingData?.arrivalguide?.checkoutInstructions.length > 0 ? (
        ListingData?.arrivalguide?.checkoutInstructions.map(items => {
          return (
            <div key={items}>
              <p>{items}</p>
            </div>
          );
        })
      ) : (
        <p>
          Explain what’s essential for guests to do before they leave. Anyone
          can read these before they book. Learn more
        </p>
      )}
      {!ListingEdit?.isEdit && (
        <Button
          onClick={() =>
            setListingEdit({ isEdit: true, content: <EditHouseManual /> })
          }
          className="p-3 w-full flex items-center justify-center border border-[#000] rounded-md"
        >
          <Plus /> Add instructions
        </Button>
      )}
    </div>
  );
}
