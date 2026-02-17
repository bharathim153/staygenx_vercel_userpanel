'use client';
import { Minus, Plus } from 'lucide-react';
import { useListingStore } from '../../create-listings/store';
import Button from '@/shadcn/ui/Button';
import { useEffect, useState } from 'react';
// import { useCreateListingApi } from "../../create-listings/store/api";
// import { useCustomMutation } from "@/hooks/useCustomeMutation";

export default function NumberOfGuest() {
  const { ListingData } = useListingStore();
  const adults = ListingData?.floorplan?.adults ?? 0;
  const children = ListingData?.floorplan?.children ?? 0;
  const totalGuests = adults + children;
  const [count, setCount] = useState(totalGuests);
  // const { CreateListing } = useCreateListingApi();

  // const { trigger } = useCustomMutation(CreateListing, {
  //     onSuccessCallback: (data) => {
  //         if (data) {
  //             SetListingData({
  //                 ...ListingData,
  //                 amenities: {
  //                     amenities: data?.data?.amenities as string[],
  //                 },
  //             });
  //         }
  //     }
  // })
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (/^\d*$/.test(rawValue)) {
      const num = parseInt(rawValue, 10);

      if (rawValue === '') {
        setCount(1);
      } else if (num < 1) {
        setCount(1);
      } else if (num > 16) {
        setCount(16);
      } else {
        setCount(num);
      }
    }
  };
  useEffect(() => {
    setCount(totalGuests);
  }, [totalGuests]);

  // useEffect(() => {
  //     const data: Partial<{ listingId: string }> = {};
  //     if (ListingData?.listingId) {
  //         data.listingId = ListingData.listingId;
  //     }

  //     trigger({
  //         data,
  //         step: 7,
  //         isEdit: true,
  //         editdata: {

  //         }
  //     });
  // }, [])

  return (
    <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6 items-center justify-center h-[calc(100vh_-_80px)] ">
      <p className="text-[#202020DB]">
        How many guests can fit comfortably in your space?
      </p>
      <div className="flex gap-4 justify-center items-center">
        <Button
          disabled={count <= 1}
          onClick={() => setCount(Math.max(1, count - 1))}
          className="p-2 border rounded-full h-[50px] w-[50px] flex items-center justify-center"
        >
          <Minus size={14} />
        </Button>

        <input
          type="number"
          min={1}
          max={16}
          value={count}
          onChange={handleInputChange}
          className="border-none focus:outline-none text-[52px] w-[40%] text-center"
        />

        <Button
          disabled={count >= 16}
          onClick={() => setCount(Math.min(16, count + 1))}
          className="p-2 border rounded-full h-[50px] w-[50px] flex items-center justify-center"
        >
          <Plus size={14} />
        </Button>
      </div>
    </section>
  );
}
