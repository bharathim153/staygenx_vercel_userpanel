'use client';

import { useForm, Controller } from 'react-hook-form';
import { useContext, useEffect } from 'react';
import { useListingStore } from './store';
import PageContext from '../../contextprovider';

type WeekendPriceForm = {
  premium: number;
};

export default function WeekendPrice() {
  const { SetListingData, ListingData } = useListingStore();
  const baseWeekdayPrice = ListingData?.baseprice?.weekday;
  const { i18 } = useContext(PageContext);

  const weekenprice =
    typeof i18?.CREATELISTING?.PRICE === 'object'
      ? i18.CREATELISTING.PRICE
      : {};

  const { control, watch } = useForm<WeekendPriceForm>({
    defaultValues: {
      premium: 0,
    },
  });

  const premium = watch('premium');
  const weekendPrice = Math.round(baseWeekdayPrice * (1 + premium / 100));
  const guestPrice = Math.round(weekendPrice * 1.14); // 14% tax

  useEffect(() => {
    SetListingData({
      baseprice: {
        weekday: ListingData?.baseprice?.weekday,
        weekend: weekendPrice,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premium, SetListingData]);
  return (
    <div className="max-w-[700px] mx-auto flex flex-col justify-between h-full">
      <div className="flex flex-col gap-10 justify-center items-center">
        {/* Heading */}
        <div className="w-full">
          <h1 className="text-3xl font-bold">
            {(typeof weekenprice.TITLE === 'string' && weekenprice.TITLE) ||
              'Set a weekend price'}
          </h1>
          <p className="text-gray-500">
            {(typeof weekenprice.DESC1 === 'string' && weekenprice.DESC1) ||
              'Add a premium for Fridays and Saturdays.'}
          </p>
        </div>

        {/* Price Display */}
        <div className="flex flex-col items-center">
          <div className="relative flex items-center">
            <span className="text-6xl md:text-8xl font-bold">
              ₹{weekendPrice.toLocaleString()}
            </span>
          </div>

          <p className="text-gray-600 mt-2">
            {(typeof weekenprice.DESC2 === 'string' && weekenprice.DESC2) ||
              ' Guest price before taxes'}{' '}
            ₹{guestPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Slider */}
      <div className="w-full flex flex-col gap-2">
        <div>
          <p className="font-semibold">
            {' '}
            {(typeof weekenprice.PREMIUM === 'string' && weekenprice.PREMIUM) ||
              'Weekend premium'}
          </p>
          <p className="text-sm text-gray-500">
            {(typeof weekenprice.TIP === 'string' && weekenprice.TIP) || 'Tip'}:{' '}
            {(typeof weekenprice.TRY === 'string' && weekenprice.TRY) || 'Try'}{' '}
            0%
          </p>
        </div>

        <div className="relative w-full mt-4">
          <Controller
            name="premium"
            control={control}
            render={({ field }) => (
              <input
                type="range"
                min={0}
                max={99}
                {...field}
                className="w-full accent-black cursor-pointer"
              />
            )}
          />

          {/* Custom percentage label */}
          <div className="absolute top-[-60px] right-0 bg-white border rounded-xl px-4 py-2 text-lg font-semibold shadow-sm">
            {premium}%
          </div>

          <div className="flex justify-between text-sm mt-2 text-gray-500">
            <span>0%</span>
            <span>99%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
