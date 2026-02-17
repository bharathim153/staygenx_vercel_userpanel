'use client';

import { useGlobalStore } from '@/lib/store/global-store';
import Button from '@/shadcn/ui/Button';
import { Plus } from 'lucide-react';
import EditHouseRules from './edithouserules';

import { useListingStore } from '../../../create-listings/store';
import { useHouseruleStore } from '../../../create-listings/store/houserules';
import Image from 'next/image';

export default function HouseRules() {
  const { setListingEdit, ListingEdit } = useGlobalStore();
  const { ListingData } = useListingStore();
  const { HouserulesData } = useHouseruleStore();
  const Houserules =
    Array.isArray(HouserulesData) &&
    HouserulesData.length > 0 &&
    HouserulesData.filter(item =>
      ListingData?.houseRule?.houseRules.includes(item._id)
    ).map(item => item);

  return (
    <div>
      <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col  gap-6 h-[calc(100vh_-_160px)] overflow-auto scrollbar-hide">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold mb-6">Add House Rules</h2>
          {!ListingEdit?.isEdit && (
            <div className="flex gap-3">
              {/* <Button variant="gray" className="rounded-full px-6 py-2">
                                Edit
                            </Button> */}
              <Button
                onClick={() =>
                  setListingEdit({ isEdit: true, content: <EditHouseRules /> })
                }
                variant="gray"
                className="rounded-full p-3"
              >
                <Plus />
              </Button>
            </div>
          )}
        </div>
        {Array.isArray(Houserules) && Houserules?.length > 0 ? (
          Array.isArray(Houserules) &&
          Houserules.map(items => {
            return (
              <div key={items?._id} className="flex gap-4 itmes-center">
                <Image
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + items?.icon}
                  alt="img"
                  width={25}
                  height={25}
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
            <p>You haven’t added any rules yet</p>
            <p className="text-[#6A6A6A]">
              Add rules to make your listing more attractive to potential guests
            </p>
            {!ListingEdit?.isEdit && (
              <Button
                onClick={() =>
                  setListingEdit({ isEdit: true, content: <EditHouseRules /> })
                }
                className="flex gap-2 border border-[#000] rounded-md p-4"
              >
                <Plus /> Add Rules
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
