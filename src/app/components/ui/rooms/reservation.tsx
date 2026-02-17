'use client';

import { cn } from '@/lib/utils';
import { useContext, useEffect, useState } from 'react';
import Calendar from '../../header/searchbarcomponents/calendar';
import { format } from 'date-fns';
import PageContext from '../../contextprovider';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import GuestSelector, {
  GuestType,
} from '../../header/searchbarcomponents/guestselector';
import Button from '@/shadcn/ui/Button';
import { useEstimationStore } from '../booking/store/estimation';
import { EstimationApi } from '@/services/bookings';

type ActiveKey = 'checkin' | 'checkout' | null;
export type DateRange = [Date | null, Date | null];

type fare = {
  weekdayBasePrice: number;
  listingId: string; // relative path from backend
  roomData?: Record<string, unknown>;
};
function toDateOnly(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function Reservation({
  weekdayBasePrice,
  listingId,
  roomData,
}: fare) {
  const Router = useRouter();
  const { i18 } = useContext(PageContext);
  const { estimationData, loading } = useEstimationStore();
  const searchParams = useSearchParams();

  const SearchBar =
    typeof i18?.HOMEPAGE?.HEADER?.SEARCHBAR === 'object'
      ? i18?.HOMEPAGE?.HEADER?.SEARCHBAR
      : undefined;

  const [active, setActive] = useState<ActiveKey | null>(null);
  const [guest, setGuest] = useState(false);
  const [date, setDate] = useState<DateRange>([null, null]);
  const [guestCounts, setGuestCounts] = useState<Record<GuestType, number>>({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const StartDate = searchParams.get('startDate');
  const EndDate = searchParams.get('endDate');
  const adult = searchParams.get('adults');
  const children = searchParams.get('children');
  const infant = searchParams.get('infants');
  const pet = searchParams.get('pets');

  const handleClick = () => {
    Router.push(`/book/${listingId}?${searchParams.toString()}`);
  };
  const handleClear = () => {
    setActive(null);
    setDate([null, null]);
    setGuestCounts({
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    });
    const url = new URL(window.location.href);
    url.searchParams.delete('startDate');
    url.searchParams.delete('endDate');
    url.searchParams.delete('adults');
    url.searchParams.delete('children');
    url.searchParams.delete('infants');
    url.searchParams.delete('pets');
    window.history.replaceState({}, '', url.toString());
  };
  const onChangeDate = (values: DateRange) => {
    debugger;
    if (values) {
      setDate(values);
    }
  };
  useEffect(() => {
    if (date[0] && date[1]) {
      setActive(null);

      const url = new URL(window.location.href);
      url.searchParams.set('startDate', toDateOnly(date[0]));
      url.searchParams.set('endDate', toDateOnly(date[1]));

      window.history.replaceState({}, '', url.toString());
    } else if (date[0]) {
      setActive('checkout');
    }
  }, [date]);

  useEffect(() => {
    if (StartDate && EndDate) {
      setDate([new Date(StartDate), new Date(EndDate)]);
    }
    if (adult || children) {
      const ad = adult ? parseInt(adult, 10) : 1;
      const ch = children ? parseInt(children, 10) : 0;
      const inf = infant ? parseInt(infant, 10) : 0;
      const petc = pet ? parseInt(pet, 10) : 0;
      setGuestCounts({
        adults: ad,
        children: ch,
        infants: inf,
        pets: petc,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!date[0] || !date[1]) return;

    EstimationApi({
      body: {
        listingId,
        checkInDate: date[0].toISOString(),
        checkOutDate: date[1].toISOString(),
        guestCount: guestCounts.adults + guestCounts.children,
      },
    });
  }, [date, guestCounts, listingId]);

  return (
    <>
      <div className="hidden md:block">
        <div
          className="w-full max-w-sm mx-auto border rounded-xl p-6"
          style={{
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 6px 16px',
            border: 'unset',
          }}
        >
          {/* Price and nights */}
          {loading ? (
            <div className="flex items-center gap-2 animate-pulse mb-4">
              {/* price skeleton */}
              <div className="h-7 w-24 bg-gray-200 rounded" />
              {/* text skeleton */}
              <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>
          ) : (
            <div className="text-lg font-medium text-gray-800 mb-4">
              {estimationData !== null && estimationData?.subtotal ? (
                <div>
                  <span className="text-2xl font-bold">
                    {' '}
                    ₹{estimationData?.subtotal}
                  </span>{' '}
                  for {estimationData?.nights}{' '}
                  {estimationData?.nights > 1 ? 'nights' : 'night'}
                </div>
              ) : (
                <p className="text-[15px] font-bold flex items-center gap-2">
                  ₹{weekdayBasePrice}{' '}
                  <span className="text-[15px]"> per day</span>
                </p>
              )}{' '}
              {/* <span className="text-base">for 2 nights</span> */}
            </div>
          )}

          {/* Date selector */}
          <div className="relative border rounded-lg text-sm text-gray-700">
            <div
              className={` flex border-b divide-x ${active === null ? '' : 'pr-5'}`}
            >
              <Button
                onClick={() => setActive('checkin')}
                className={cn(
                  'z-50 flex-1 px-4 py-2 cursor-pointer  focus:outline-none',
                  active === 'checkin'
                    ? 'ring-2 ring-black bg-gray-100 rounded-md'
                    : ''
                )}
              >
                <p className="font-semibold text-[13px] text-start">CHECK-IN</p>
                <p className="text-start text-[13px]">
                  {date[0]
                    ? format(date[0], 'dd MMM')
                    : typeof SearchBar?.ADDDATES === 'string'
                      ? SearchBar.ADDDATES
                      : 'Add dates'}
                </p>
              </Button>

              <Button
                onClick={() => setActive('checkout')}
                className={cn(
                  'z-50 flex-1 px-4 py-2 cursor-pointer  focus:outline-none',
                  active === 'checkout'
                    ? 'ring-2 ring-black bg-gray-100 rounded-md'
                    : ''
                )}
              >
                <p className="font-semibold text-[13px] text-start">CHECKOUT</p>
                <p className="text-start text-[13px]">
                  {' '}
                  {date[1]
                    ? format(date[1], 'dd MMM')
                    : typeof SearchBar?.ADDDATES === 'string'
                      ? SearchBar.ADDDATES
                      : 'Add dates'}
                </p>
              </Button>
            </div>{' '}
            {(active === 'checkin' || active === 'checkout') && (
              <div
                className={`
        absolute bg-white border shadow-md rounded-2xl p-3 z-10
        right-0 -top-5 min-w-[850px]
      `}
              >
                <div className="mt-[70px]">
                  <Calendar
                    onChangeDate={onChangeDate}
                    selectedDates={date}
                    roomData={roomData}
                  />
                  <div className="flex gap-3 justify-end">
                    <Button
                      onClick={handleClear}
                      className="text-[#000] underline cursor-pointer "
                    >
                      Clear dates
                    </Button>
                    <Button
                      onClick={() => setActive(null)}
                      className="px-5 py-2 bg-[#000] rounded-md text-[#fff] cursor-pointer"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div
              onClick={() => setGuest(!guest)}
              className="px-4 py-2 flex justify-between w-full cursor-pointer"
            >
              <div>
                <p className="font-semibold text-xs">GUESTS</p>
                <span>
                  {guestCounts.adults + guestCounts.children}{' '}
                  {guestCounts.adults + guestCounts.children === 1
                    ? 'guest'
                    : 'guests'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg">
                  <ChevronDown />
                </span>
              </div>
              {guest && (
                <div
                  onClick={e => e.stopPropagation()}
                  className={` z-50
        absolute bg-white border shadow-md rounded-2xl p-3
        right-0 top-27 min-w-[330px]
      `}
                >
                  <GuestSelector
                    counts={guestCounts}
                    onChange={setGuestCounts}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Reserve Button */}
          <Button
            variant="pink"
            id="reservation-Button"
            className="cursor-pointer w-full mt-4  text-white py-3 rounded-lg font-medium transition"
            onClick={handleClick}
            disabled={
              !date[0] ||
              !date[1] ||
              loading ||
              !estimationData ||
              guestCounts.adults + guestCounts.children === 0
            }
          >
            Reserve
          </Button>

          {/* Note */}
          <p className="text-sm text-center text-gray-500 mt-2">
            You won&apos;t be charged yet
          </p>

          {/* Report link */}
        </div>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="inline-flex items-center text-sm text-gray-600 underline hover:text-gray-800"
          >
            <span className="mr-1">🚩</span> Report this listing
          </a>
        </div>
      </div>
      <div className="flex items-center justify-between border-t shadow-lg p-4 w-full bg-[#fff] md:hidden">
        <div className="text-start text-sm">
          <p className="font-semibold text-lg">₹{weekdayBasePrice}</p>
          {/* <p className="text-gray-600">for 2 nights</p> */}
          <p className="text-sm">⭐ 5.0 · 6 reviews</p>
        </div>
        <Button
          disabled={
            !date[0] ||
            !date[1] ||
            loading ||
            !estimationData ||
            guestCounts.adults + guestCounts.children === 0
          }
          onClick={handleClick}
          className=" text-white font-semibold px-5 py-2 rounded-lg"
        >
          Reserve
        </Button>
      </div>
    </>
  );
}
