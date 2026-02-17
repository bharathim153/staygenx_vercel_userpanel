'use client';

import { useContext } from 'react';
import { CalendarCheck, Zap } from 'lucide-react';
import { useListingStore } from './store';
import PageContext from '../../contextprovider';

export default function InstantBooking() {
  const { SetListingData, ListingData } = useListingStore();
  const { i18 } = useContext(PageContext);

  const instantbooking =
    typeof i18?.CREATELISTING?.INSTANTBOOK === 'object'
      ? i18.CREATELISTING.INSTANTBOOK
      : {};

  return (
    <div className="max-w-[630px] mx-auto flex flex-col gap-6 px-4 py-8">
      {/* Heading */}
      <div>
        <h1 className="text-[30px] md:text-[32px] font-bold leading-snug">
          {(typeof instantbooking.TITLE === 'string' && instantbooking.TITLE) ||
            'Pick your booking settings'}
        </h1>
        <p className="text-[#6A6A6A] mt-2 text-sm">
          {(typeof instantbooking.DESC === 'string' && instantbooking.DESC) ||
            'You can change this at any time.'}{' '}
          <a href="#" className="underline hover:text-black">
            {(typeof instantbooking.LEARNMORE === 'string' &&
              instantbooking.LEARNMORE) ||
              ' Learn more'}
          </a>
        </p>
      </div>

      {/* Option Cards */}
      <div className="flex flex-col gap-4">
        {/* Option 1 */}
        <div
          onClick={() =>
            SetListingData({ bookingmode: { bookingMode: 'manual_first_5' } })
          }
          className={`cursor-pointer w-full flex justify-between items-start p-5 rounded-xl border transition ${
            ListingData?.bookingmode?.bookingMode === 'manual_first_5'
              ? 'border-black bg-gray-50'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div>
            <p className="font-semibold text-lg">
              {' '}
              {(typeof instantbooking.HEADING1 === 'string' &&
                instantbooking.HEADING1) ||
                'Approve your first 5 bookings'}
            </p>
            <p className="text-green-600 text-sm font-medium mt-1">
              {(typeof instantbooking.RECOMMENDED === 'string' &&
                instantbooking.RECOMMENDED) ||
                'Recommended'}
            </p>
            <p className="text-gray-500 text-sm mt-1 max-w-md">
              {(typeof instantbooking.PARA === 'string' &&
                instantbooking.PARA) ||
                'Start by reviewing reservation requests, then switch to Instant Book so guests can book automatically.'}
            </p>
          </div>
          <CalendarCheck className="w-6 h-6 mt-1 shrink-0" />
        </div>

        {/* Option 2 */}
        <div
          onClick={() =>
            SetListingData({ bookingmode: { bookingMode: 'instant_booking' } })
          }
          className={`cursor-pointer w-full flex justify-between items-start p-5 rounded-xl border transition ${
            ListingData?.bookingmode?.bookingMode === 'instant_booking'
              ? 'border-black bg-gray-50'
              : 'border-gray-200 bg-white hover:border-gray-400'
          }`}
        >
          <div>
            <p className="font-semibold text-lg">
              {(typeof instantbooking.HEADING2 === 'string' &&
                instantbooking.HEADING2) ||
                'Use Instant Book'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {(typeof instantbooking.PARA2 === 'string' &&
                instantbooking.PARA2) ||
                'Let guests book automatically.'}
            </p>
          </div>
          <Zap className="w-6 h-6 mt-1 shrink-0" />
        </div>
      </div>
    </div>
  );
}
