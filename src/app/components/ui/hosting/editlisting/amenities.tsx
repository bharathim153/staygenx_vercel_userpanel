'use client';
import { useAmenityStore } from '../../create-listings/store/amenities';
import Button from '@/shadcn/ui/Button';
import { Plus } from 'lucide-react';
import { useListingStore } from '../../create-listings/store';

import EditAmenities from './editamenities';
import { useGlobalStore } from '@/lib/store/global-store';
import Image from 'next/image';

export default function Amenities() {
  const { AmenityData } = useAmenityStore();
  const { ListingData } = useListingStore();
  const { setListingEdit, ListingEdit } = useGlobalStore();
  const Amenities =
    Array.isArray(AmenityData) &&
    AmenityData.length > 0 &&
    AmenityData.filter(item =>
      ListingData?.amenities?.amenities.includes(item._id)
    ).map(item => item);
  return (
    <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <p className="capitalize text-[32px] font-semibold">{'Amenities'}</p>
        {!ListingEdit?.isEdit && (
          <div className="flex gap-3">
            {/* <Button variant="gray" className="rounded-full px-6 py-2">
              Edit
            </Button> */}
            <Button
              onClick={() =>
                setListingEdit({ isEdit: true, content: <EditAmenities /> })
              }
              variant="gray"
              className="rounded-full p-3"
            >
              <Plus />
            </Button>
          </div>
        )}
      </div>
      {Array.isArray(Amenities) && Amenities?.length > 0 && (
        <p className="text-[#202020DB]">
          You’ve added these to your listing so far.
        </p>
      )}
      <div className="flex flex-col gap-5">
        {Array.isArray(Amenities) && Amenities?.length > 0 ? (
          Array.isArray(Amenities) &&
          Amenities.map(items => {
            return (
              <div key={items?._id} className="flex gap-4 itmes-center">
                <Image
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + items?.icon}
                  alt="img"
                  width={15}
                  height={15}
                />
                <p>{items?.name}</p>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col gap-4 items-center justify-center">
            <Image
              src="/images/noamenity.avif"
              alt="img"
              width={250}
              height={250}
            />
            <p>You haven’t added any amenities yet</p>
            <p className="text-[#6A6A6A]">
              Add amenities to make your listing more attractive to potential
              guests
            </p>
            {!ListingEdit?.isEdit && (
              <Button
                onClick={() =>
                  setListingEdit({ isEdit: true, content: <EditAmenities /> })
                }
                className="border border-black p-4 rounded-md"
              >
                Add amenities
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
