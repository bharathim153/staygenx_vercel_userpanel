'use client';

import { useState, useEffect, useMemo } from 'react';
import { useListeStore } from './store';
import ThreeDotLoader from '../../threedotLoader';
import {
  ArrowLeft,
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  X,
  XIcon,
} from 'lucide-react';
import Button from '@/shadcn/ui/Button';
import Calendar from 'react-calendar';
import Image from 'next/image';
import 'react-calendar/dist/Calendar.css';
import { useSearchParams } from 'next/navigation';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { BlockedDateData } from '@/services/host';
import { useBlockdatesStore } from './store/blockdates';
import { isDateBlocked } from '@/lib/utils';

type CalendarTileArgs = {
  date: Date;
};
type SelectedDateWithBlock = {
  date: Date;
  isBlocked: boolean;
};

const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const getDatesBetween = (start: Date, end: Date): Date[] => {
  const dates: Date[] = [];
  const current = new Date(start);

  current.setHours(0, 0, 0, 0);
  end = new Date(end);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export default function CalendarComp() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const { BlockDates, unBlockDates, setBlockDatesData } = useBlockdatesStore();

  const { trigger, isPending } = useCustomMutation(BlockDates, {
    onSuccessCallback: data => {
      setToggle(!toggle);
      setBlockDatesData(Array.isArray(data?.data?.data) ? data.data.data : []);
    },
    onErrorCallback: error => {
      console.error('Block dates error:', error);
    },
  });
  const { trigger: unBlockDatesTrigger } = useCustomMutation(unBlockDates, {
    onSuccessCallback: data => {
      setToggle(!toggle);
      setBlockDatesData(Array.isArray(data?.data?.data) ? data.data.data : []);
    },
    onErrorCallback: error => {
      console.error('Block dates error:', error);
    },
  });
  const [selectedDates, setSelectedDates] = useState<SelectedDateWithBlock[]>(
    []
  );
  // const [firstClick, setFirstClick] = useState<Date | null>(null);
  const [toggle, setToggle] = useState(false);
  const [listingIndex, setListing] = useState<number>(0);
  const [showCustomSettings, setShowCustomSettings] = useState(false);
  const [showMinimumNights, setShowMinimumNights] = useState(false);
  const [minimumNights, setMinimumNights] = useState(1);
  const [showPriceSettings, setShowPriceSettings] = useState(false);
  const [showList, setShowList] = useState(false);
  const [nightprice, setNightyPrice] = useState('');
  // const [showBasePrice, setShowBasePrice] = useState(false);
  // const [price, setPrice] = useState('₹3,371');

  const { Lists, loading } = useListeStore();
  const { BlockDatesData } = useBlockdatesStore();
  const ListingItems = useMemo(
    () => (Array.isArray(Lists) && Lists.length > 0 ? Lists : []),
    [Lists]
  );

  const handleDateClick = (date: Date) => {
    console.log('Clicked date:', date);
    const clickedDateObj: SelectedDateWithBlock = {
      date,
      isBlocked: isDateBlocked(date, BlockDatesData),
    };

    // 1️⃣ Start range
    if (selectedDates.length === 0) {
      setSelectedDates([clickedDateObj]);
      return;
    }

    // 2️⃣ Complete range
    if (selectedDates.length === 1) {
      const startDate = selectedDates[0].date;

      const [rangeStart, rangeEnd] =
        date < startDate ? [date, startDate] : [startDate, date];

      const rangeDates = getDatesBetween(rangeStart, rangeEnd);

      const rangeWithBlockInfo: SelectedDateWithBlock[] = rangeDates.map(d => ({
        date: d,
        isBlocked: isDateBlocked(d, BlockDatesData),
      }));

      setSelectedDates(rangeWithBlockInfo);

      // const blockedInside = rangeWithBlockInfo.filter(d => d.isBlocked);

      // if (blockedInside.length) {
      //   handleBlockedRange(rangeWithBlockInfo, blockedInside);
      // }

      return;
    }

    // 3️⃣ Reset range
    setSelectedDates([clickedDateObj]);
  };

  const handleCheck = () => {
    console.log('SelectedDates on Save:', selectedDates);
    if (
      selectedDates[0]?.isBlocked &&
      selectedDates[selectedDates.length - 1]?.isBlocked
    ) {
      unBlockDatesTrigger({
        body: {
          listingId: ListingItems[listingIndex]?._id || '',
          startDate: selectedDates[0]?.date?.toISOString().split('T')[0] || '',
          endDate:
            selectedDates[selectedDates.length - 1]?.date
              ?.toISOString()
              .split('T')[0] || '',
        },
      });
    } else {
      trigger({
        body: {
          listingId: ListingItems[listingIndex]?._id || '',
          startDate: selectedDates[0]?.date?.toISOString().split('T')[0] || '',
          endDate:
            selectedDates[selectedDates.length - 1]?.date
              ?.toISOString()
              .split('T')[0] || '',
          title: 'Blocked Date',
          description: 'Blocked via Calendar',
        },
      });
    }
  };

  useEffect(() => {
    if (!id) return;

    const index = ListingItems.findIndex(item => item._id === id);

    if (index !== -1) {
      setListing(index);
    }
  }, [searchParams, ListingItems, id]);

  useEffect(() => {
    BlockedDateData(id || '');
  }, [id]);
  console.log('Selected Dates:', selectedDates);
  return (
    <div className="flex flex-col md:flex-row py-6 px-4  w-full h-[calc(100vh-90px)]">
      {/* Left Side */}
      <div
        className={`
        ${showList ? 'w-[15%] items-start' : 'w-[5%] items-center'}
       hidden md:flex flex-col  
        transition-all duration-300 ease-in-out
      `}
      >
        {/* Scrollable items */}
        <div className="flex-1 overflow-y-auto py-3">
          {loading ? (
            <ThreeDotLoader />
          ) : (
            ListingItems.map((item, index) => {
              const imageSrc = item?.images?.[0]
                ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.images[0]}`
                : '';

              return (
                <div
                  key={index}
                  className="flex flex-col gap-3 items-center mb-3"
                >
                  {imageSrc ? (
                    <div className="flex gap-2 justify-center items-center">
                      <Image
                        src={imageSrc}
                        alt={item.title || 'Listing'}
                        className="rounded-2xl object-cover h-[50px] w-[50px]"
                        width={50}
                        height={50}
                      />
                      {showList && (
                        <p className="text-black">
                          {item?.title === '' ? 'Unkown' : item?.title}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center items-center">
                      <div className="bg-gray-200 w-[50px] h-[50px] rounded-2xl" />
                      {showList && (
                        <p className="text-black">
                          {item?.title === '' ? 'Unkown' : item?.title}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Toggle Button */}
        <Button
          onClick={() => setShowList(!showList)}
          className="
          p-2 flex items-center justify-center h-[50px] w-[50px]
          rounded-full shadow-2xl bg-gray-100 mb-3
          transition-all duration-300
        "
        >
          {showList ? <ChevronLeft /> : <ChevronRight />}
        </Button>
      </div>

      {/* Center Side */}
      <div className="w-full md:w-[70%] h-full overflow-y-auto border-l border-r px-4">
        <Calendar
          locale="en-GB"
          minDate={new Date()}
          selectRange={false} // we handle range manually
          value={selectedDates.length ? selectedDates[0]?.date : null}
          onClickDay={(date: Date) => {
            if (!date) return;
            handleDateClick(date); // normal date click
          }}
          tileClassName={({ date }: CalendarTileArgs) => {
            const classes: string[] = [];

            const isBlocked = isDateBlocked(date, BlockDatesData);
            const isSelected = selectedDates.some(
              d => d.date.toDateString() === date.toDateString()
            );

            //Blocked + Selected → NEW CLASS
            if (isBlocked && isSelected) {
              classes.push('blocked-date-selected');
            }
            // Blocked only
            else if (isBlocked) {
              classes.push('blocked-date');
            }
            // Selected only
            else if (isSelected) {
              classes.push('react-calendar__tile--active');
            }

            return classes.length ? classes.join(' ') : undefined;
          }}
          tileContent={({
            date,
            view,
          }: {
            date: Date;
            view: 'month' | 'year' | 'decade' | 'century';
          }) => {
            if (view !== 'month') return null;
            const price = isWeekend(date)
              ? ListingItems[listingIndex]?.weekendBasePrice
              : ListingItems[listingIndex]?.weekdayBasePrice;
            return <div className="text-[16px]">₹{price ?? '-'}</div>;
          }}
        />
      </div>

      {/* Right Side Details */}
      <div
        className={
          'w-full md:w-[25%] h-[calc(100vh-100px)] pl-4 overflow-y-auto'
        }
      >
        {selectedDates.length > 0 ? (
          !showCustomSettings ? (
            <div className="flex flex-col gap-4   text-white">
              <div className="flex items-center justify-end gap-2">
                {nightprice === '' && (
                  <>
                    <div className="bg-[#222] rounded-full px-4 py-2 text-base font-semibold">
                      {selectedDates.length === 1 ? (
                        <>
                          {selectedDates.length > 0 && (
                            <>
                              {selectedDates[0].date?.getDate()}{' '}
                              {selectedDates[0].date?.toLocaleString(
                                'default',
                                { month: 'short' }
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        `${selectedDates.length} nights`
                      )}
                    </div>
                    <Button
                      variant="black"
                      className="bg-[#222] rounded-full w-8 h-8 flex items-center justify-center text-white text-lg"
                      onClick={() => setSelectedDates([])}
                    >
                      <X />
                    </Button>
                  </>
                )}
              </div>
              {nightprice === '' && (
                <div className="flex items-center justify-between bg-[#181818] rounded-2xl p-4 cursor-pointer">
                  <span className="text-sm font-medium">Available</span>
                  <div
                    className={`relative flex items-center rounded-full transition-colors duration-300 ease-in-out ${isPending ? 'bg-white' : 'bg-[#8b8b8b]'} `}
                  >
                    {/* Loader */}
                    <div
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${isPending ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    >
                      <div className="px-8 py-4">
                        <ThreeDotLoader />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div
                      className={`flex transition-all duration-300 ease-in-out ${isPending ? 'opacity-0  pointer-events-none' : 'opacity-100 '}`}
                    >
                      <Button
                        variant="transparent2"
                        className={`py-3 px-5 rounded-full transition-all duration-300 ${toggle ? 'bg-white' : 'bg-[#8b8b8b]'}`}
                        onClick={handleCheck}
                      >
                        <XIcon
                          size={18}
                          className="transition-colors duration-300"
                          color={toggle ? '#000' : '#fff'}
                        />
                      </Button>

                      <Button
                        variant="transparent2"
                        className={`py-3 px-5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${toggle ? 'bg-[#8b8b8b]' : 'bg-white'}`}
                        onClick={handleCheck}
                      >
                        <CheckIcon
                          size={18}
                          className="transition-colors duration-300"
                          color={!toggle ? '#000' : '#fff'}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {nightprice === 'nightprice' ? (
                <div className="bg-[#181818] rounded-2xl p-4 cursor-pointer">
                  <div className="flex flex-col gap-4 items-center justify-center">
                    <div className="py-2">
                      {/* Month name */}
                      {selectedDates.length > 0 &&
                        selectedDates[0].date?.toLocaleString('default', {
                          month: 'short',
                        })}{' '}
                      {/* Day or range */}
                      {selectedDates.length > 0 &&
                        (selectedDates.length === 1 ? (
                          <> {selectedDates[0].date?.getDate()} </>
                        ) : (
                          <>
                            {selectedDates[0].date?.getDate()} -{' '}
                            {selectedDates[
                              selectedDates.length - 1
                            ].date?.getDate()}
                          </>
                        ))}
                    </div>

                    <div className="w-full flex items-center justify-center">
                      <input
                        onChange={() => {}}
                        className="text-4xl font-bold py-20 w-[50%] text-center outline-none"
                        value={'3,371'}
                      />
                    </div>
                    <div className="flex justify-between w-full">
                      <Button
                        onClick={() => setNightyPrice('')}
                        variant="transparent2"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="gray"
                        className="px-6 py-2 bg-white text-black rounded-lg"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-[#181818] rounded-2xl p-4 cursor-pointer flex flex-col gap-3"
                  onClick={() => setNightyPrice('nightprice')}
                >
                  <h4 className="text-sm font-medium">Price per night</h4>
                  <p className="text-2xl font-bold">₹3,371</p>
                </div>
              )}
              {nightprice === '' &&
                (showMinimumNights ? (
                  <div className="bg-[#181818] rounded-lg p-4">
                    <h4 className="text-sm font-medium">Minimum nights</h4>
                    <p className="text-sm text-gray-400 mb-4">
                      This will override your global minimum of 1 night for this
                      date only.
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <Button
                        className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center text-xl font-bold"
                        onClick={() =>
                          setMinimumNights(prev => Math.max(1, prev - 1))
                        }
                      >
                        −
                      </Button>
                      <span className="text-2xl font-bold">
                        {minimumNights}
                      </span>
                      <Button
                        className="w-10 h-10 bg-[#333] rounded-full flex items-center justify-center text-xl font-bold"
                        onClick={() => setMinimumNights(prev => prev + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        className="px-4 py-2 bg-gray-600 rounded-lg text-white"
                        onClick={() => setShowMinimumNights(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="gray"
                        className="px-6 py-2 rounded-lg"
                        onClick={() => {
                          setShowMinimumNights(false);
                          setShowCustomSettings(false);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : showCustomSettings ? (
                  <div className="bg-[#181818] rounded-lg p-4">
                    <h4 className="text-sm font-medium">Custom settings</h4>
                    <div className="bg-[#333] rounded-lg p-4 flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">
                        Minimum nights
                      </span>
                      <span className="text-sm font-medium">
                        {minimumNights} nights
                      </span>
                    </div>
                    <Button
                      className="w-full py-3 rounded-lg bg-[#ededed] text-black font-semibold"
                      onClick={() => setShowCustomSettings(false)}
                    >
                      Done
                    </Button>
                  </div>
                ) : (
                  <div className="bg-[#181818] rounded-2xl p-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Custom settings</span>
                    <Button
                      className="text-white text-xl font-bold"
                      onClick={() => setShowMinimumNights(true)}
                    >
                      +
                    </Button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-black text-white rounded-xl p-8 min-w-[350px] max-w-[400px] shadow-lg relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="bg-[#222] rounded-full px-4 py-2 text-base font-semibold">
                  {selectedDates.length === 1 ? (
                    <>
                      {selectedDates[0].date?.getDate()}{' '}
                      {selectedDates[0].date?.toLocaleString('default', {
                        month: 'short',
                      })}{' '}
                      {selectedDates[0].date?.getFullYear()}
                    </>
                  ) : (
                    `${selectedDates.length} dates`
                  )}
                </div>
                <Button
                  className="bg-[#222] rounded-full w-8 h-8 flex items-center justify-center text-white text-lg"
                  onClick={() => setShowCustomSettings(false)}
                >
                  &times;
                </Button>
              </div>
              <div className="w-full mt-10">
                <h4 className="text-gray-400 mb-4">Custom settings</h4>
                <div className="bg-[#181818] rounded-lg border border-[#333] p-4 flex items-center justify-between mb-8">
                  <span>Minimum nights</span>
                  <Button className="text-white text-xl font-bold">+</Button>
                </div>
                <Button className="w-full py-3 rounded-lg bg-[#ededed] text-black font-semibold">
                  Done
                </Button>
              </div>
            </div>
          )
        ) : (
          <div className="p-4">
            {!showPriceSettings ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold">Price settings</h3>
                    <p className="text-sm">₹1,000 – ₹2,000 per night</p>
                    <p className="text-sm">10% weekly discount</p>
                    <p className="text-sm">25% monthly discount</p>
                  </div>
                  <Button
                    className="text-gray-400 text-lg cursor-pointer"
                    onClick={() => setShowPriceSettings(!showPriceSettings)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
                <hr className="my-4" />
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-semibold">
                      Availability settings
                    </h3>
                    <p className="text-sm">1–365 night stays</p>
                    <p className="text-sm">Same-day advance notice</p>
                  </div>
                  <Button className="text-gray-400 text-lg cursor-pointer">
                    <ChevronRight />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="">
                  <Button className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-100 cursor-pointer mb-5">
                    <ArrowLeft
                      size={18}
                      onClick={() => setShowPriceSettings(!showPriceSettings)}
                    />
                  </Button>
                  <div className="flex flex-col gap-4">
                    <div className="">
                      <h3 className="text-lg font-semibold">Price settings</h3>
                      <p className="text-sm text-gray-500">
                        These apply to all nights, unless you customise them by
                        date.
                      </p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between">
                        <h3 className="text-md font-semibold">Base price</h3>
                        <p className="underline text-sm">INR</p>
                      </div>
                      <div className="p-4 border rounded-2xl">
                        <p className="text-[13px]">Per night</p>
                        <h2 className="text-2xl font-bold">2,238</h2>
                      </div>
                      <div className="p-4 border rounded-2xl">
                        <div className="flex justify-between">
                          <p className="text-[13px]">Custom weekend price</p>
                          <p className="underline text-[14px]">Remove</p>
                        </div>
                        <h2 className="text-2xl font-bold">2,238</h2>
                      </div>
                      <div className="p-4 border rounded-2xl">
                        <p>Smart Pricing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
