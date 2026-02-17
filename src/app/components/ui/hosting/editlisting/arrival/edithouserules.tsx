'use client';

import { useHouseruleStore } from '../../../create-listings/store/houserules';

import Button from '@/shadcn/ui/Button';
import { useListingStore } from '../../../create-listings/store';
import { Check, Plus } from 'lucide-react';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useCreateListingApi } from '../../../create-listings/store/api';
import Image from 'next/image';
import ThreeDotLoader from '@/app/components/threedotLoader';

export default function EditHouseRules() {
  const { HouserulesData } = useHouseruleStore();
  const { ListingData, SetListingData } = useListingStore();
  const { CreateListing } = useCreateListingApi();
  const { trigger, isPending } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      if (data) {
        SetListingData({
          ...ListingData,
          houseRule: {
            houseRules: Array.isArray(data?.data?.houseRules)
              ? data.data.houseRules
              : [],
            hasFirstAidKit:
              typeof data?.data?.hasFirstAidKit === 'boolean'
                ? data.data.hasFirstAidKit
                : false,
            hasSmokeAlarm:
              typeof data?.data?.hasSmokeAlarm === 'boolean'
                ? data.data.hasSmokeAlarm
                : false,
            cancellationPolicy:
              typeof data?.data?.cancellationPolicy === 'string'
                ? data.data.cancellationPolicy
                : '',
          },
        });
      }
    },
  });

  const handleToggleAmenity = (id: string) => {
    const currentRules = ListingData?.houseRule?.houseRules ?? [];

    const updatedAmenities: string[] = currentRules.includes(id)
      ? currentRules.filter(a => a !== id) // remove
      : [...currentRules, id]; // add

    const data: Partial<{ listingId: string; houseRules: string[] }> = {};
    if (ListingData?.listingId) {
      data.listingId = ListingData?.listingId;
    }
    trigger({
      data,
      step: 16,
      isEdit: true,
      arraydata: {
        ...ListingData?.houseRule,
        houseRules: updatedAmenities as string[],
      },
    });
  };

  return (
    <div>
      <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6 h-[calc(100vh_-_160px)]">
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
        {Array.isArray(HouserulesData) &&
          HouserulesData.map(items => {
            const isSelected = (
              (ListingData?.houseRule?.houseRules || []) as string[]
            ).includes(items._id);
            return (
              <div
                key={items?._id}
                className="flex justify-between items-center"
              >
                <div className="flex gap-4 itmes-center">
                  <Image
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + items?.icon}
                    alt="img"
                    width={25}
                    height={25}
                  />
                  <p>{items?.name}</p>
                </div>
                <Button
                  variant={isSelected ? 'black' : 'gray'}
                  className="rounded-full p-1"
                  onClick={() => handleToggleAmenity(items._id)}
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
