'use client';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { ArrivalGuide } from '@/services/listing/arrival-guide';
import Button from '@/shadcn/ui/Button';
import { useForm, Controller } from 'react-hook-form';
import { useListingStore } from '../../../create-listings/store';
import { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Timing() {
  const { ListingData } = useListingStore();
  const { trigger, isPending } = useCustomMutation(ArrivalGuide);
  const timeOptions = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 8;
    const displayHour = hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'pm' : 'am';
    return {
      value: `${hour}:00${ampm}`,
      label: `${displayHour}:00${ampm}`,
    };
  });

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      checkInTime: '',
      checkOutTime: '',
    },
  });

  const onSubmit = (data: Record<string, string>) => {
    const value = {
      ...ListingData?.arrivalguide,
      checkInTime: data?.checkInTime,
      checkOutTime: data?.checkOutTime,
    };
    trigger({ listingId: ListingData?.listingId ?? '', body: value });
  };
  useEffect(() => {
    reset({
      checkInTime: ListingData?.arrivalguide?.checkInTime,
      checkOutTime: ListingData?.arrivalguide?.checkOutTime,
    });
  }, [ListingData, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col  gap-6 h-[calc(100vh_-_160px)] mt-20">
        <div className="border border-gray-400  w-full rounded-lg ">
          <div>
            <Controller
              name="checkInTime"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <select
                    {...field}
                    className="appearance-none w-full p-5 border-b border-gray-400 focus:ring-2 focus:ring-black-500 focus:rounded-lg"
                  >
                    <option value="">Checkin time</option>
                    {timeOptions.map(time => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} />
                  </span>
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name="checkOutTime"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <select
                    {...field}
                    className="appearance-none w-full p-5 focus:ring-2 focus:ring-black-500 focus:rounded-lg"
                  >
                    <option value="">Checkout time</option>
                    {timeOptions.map(time => (
                      <option key={time.value} value={time.value}>
                        {time.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} />
                  </span>
                </div>
              )}
            />
          </div>
        </div>
      </section>
      <div className="flex justify-end p-4 border-t sticky bottom-0">
        <Button
          variant="black"
          loading={isPending}
          // disabled={ListingData?.baseprice?.weekday === value || value === 0}
        >
          Save
        </Button>
      </div>
    </form>
  );
}
