'use client';

import { useForm } from 'react-hook-form';
import { Clock } from 'lucide-react';
import Button from '@/shadcn/ui/Button';
import InputBox from '../../../form';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { ArrivalGuide } from '@/services/listing/arrival-guide';
import { useListingStore } from '../../../create-listings/store';
import { useEffect } from 'react';

type WifiFormData = {
  networkName: string;
  password: string;
};

export default function Wifidetails() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<WifiFormData>();
  const { trigger, isPending } = useCustomMutation(ArrivalGuide);
  const { ListingData } = useListingStore();
  const onSubmit = (data: WifiFormData) => {
    const value = {
      ...ListingData?.arrivalguide,
      wifiDetails: {
        networkName: data?.networkName,
        password: data?.password,
      },
    };
    trigger({ listingId: ListingData?.listingId ?? '', body: value });
  };
  useEffect(() => {
    reset({
      networkName: ListingData?.arrivalguide?.wifiDetails?.networkName ?? '',
      password: ListingData?.arrivalguide?.wifiDetails?.password ?? '',
    });
  }, [ListingData, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="">
      <div className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col  gap-6 h-[calc(100vh_-_160px)] overflow-auto scrollbar-hide">
        <h2 className="text-2xl font-semibold">Wifi details</h2>

        <InputBox
          name="networkName"
          type="text"
          control={control}
          label="Wifi network name"
          error={errors.networkName}
        />

        <InputBox
          name="password"
          type="password"
          control={control}
          label="Wifi password"
          error={errors.password}
        />

        <div className="flex items-center text-gray-600 text-sm ">
          <Clock size={16} className="mr-2" />
          Shared 24–48 hours before check-in
        </div>
      </div>

      <div className="flex justify-end p-4 border-t sticky bottom-0 bg-[#fff]">
        <Button
          variant="black"
          // onClick={handleSave}
          loading={isPending}
          // disabled={ListingData?.baseprice?.weekday === value || value === 0}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
