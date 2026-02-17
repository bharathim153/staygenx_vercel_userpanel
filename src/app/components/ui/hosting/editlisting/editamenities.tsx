'use client';
import Button from '@/shadcn/ui/Button';
import { useAmenityStore } from '../../create-listings/store/amenities';

import { Check, Plus } from 'lucide-react';
import { useListingStore } from '../../create-listings/store';
import { useCreateListingApi } from '../../create-listings/store/api';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import ThreeDotLoader from '@/app/components/threedotLoader';

export default function EditAmenities() {
  const { AmenityData } = useAmenityStore();
  const { ListingData, SetListingData } = useListingStore();
  const { CreateListing } = useCreateListingApi();
  const [currentAmenities, setCurrentAmenities] = useState<string[]>([]);

  const { trigger, isPending } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      if (data) {
        SetListingData({
          ...ListingData,
          amenities: {
            amenities: data?.data?.amenities as string[],
          },
        });
      }
    },
  });

  const handleToggleAmenity = (id: string) => {
    const updatedAmenities = currentAmenities.includes(id)
      ? currentAmenities.filter(a => a !== id) // remove
      : [...currentAmenities, id]; // add

    // Optionally update local state if needed
    setCurrentAmenities(updatedAmenities);

    const data: Partial<{ listingId: string }> = {};
    if (ListingData?.listingId) {
      data.listingId = ListingData.listingId;
    }

    trigger({
      data,
      step: 7,
      isEdit: true,
      arraydata: {
        amenities: updatedAmenities,
      },
    });
  };

  useEffect(() => {
    setCurrentAmenities(ListingData?.amenities?.amenities ?? []);
  }, [ListingData]);

  return (
    <div>
      <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6 h-[calc(100vh_-_160px)] ">
        <div className="w-full flex justify-between items-center">
          <p className="capitalize text-[32px] font-semibold">
            {'Add amenities'}
          </p>
        </div>
        {isPending && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <ThreeDotLoader />
          </div>
        )}

        {Array.isArray(AmenityData) &&
          AmenityData.map(items => {
            const isSelected = ((currentAmenities || []) as string[]).includes(
              items._id
            );
            return (
              <div
                key={items?._id}
                className="flex justify-between items-center"
              >
                <div className="flex gap-4 itmes-center">
                  <Image src={items?.icon} alt="img" width={15} height={15} />
                  <p>{items?.name}</p>
                </div>
                <Button
                  variant={isSelected ? 'black' : 'gray'}
                  className="rounded-full p-1"
                  onClick={() => handleToggleAmenity(items._id)}
                  disabled={isPending}
                >
                  {isSelected ? <Check size={18} /> : <Plus size={18} />}
                </Button>
              </div>
            );
          })}
      </section>
    </div>
  );
}
