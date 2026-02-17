'use client';
import PopoverComponent from '@/shadcn/ui/popover';
import { ChevronLeft, Share } from 'lucide-react';
import Calendar from '../../header/searchbarcomponents/calendar';
import { useState } from 'react';
import { format } from 'date-fns';
import GuestSelector from '../../header/searchbarcomponents/guestselector';
import { useRouter } from 'next/navigation';
import Button from '@/shadcn/ui/Button';

type DateRange = [Date | null, Date | null];

export default function WishListFilter() {
  const Router = useRouter();
  const [date, setDate] = useState<DateRange>([null, null]);
  const [guestCounts, setGuestCounts] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const onChangeDate = (values: DateRange) => {
    if (values) {
      setDate(values);
    }
  };
  return (
    <div className="my-8 flex flex-col gap-5">
      <Button
        className="cursor-pointer"
        onClick={() => Router.push('/wishlist')}
      >
        <ChevronLeft size={22} />
      </Button>

      <h2 className="text-[32px] font-semibold">Fav</h2>
      <div className="flex gap-3">
        <PopoverComponent
          align="center"
          className="focus:border-black"
          trigger={
            <Button
              className={`px-3 py-2 border rounded-full cursor-pointer focus:border-black ${date[0] && date[1] ? 'border border-2 border-black' : ''}`}
            >
              {date[0] && date[1]
                ? `${format(date[0], 'dd')} - ${format(date[1], 'dd MMM')}`
                : 'Add dates'}
            </Button>
          }
          content={
            <div className="flex flex-col items-end justify-end bg-white p-4 rounded-2xl border shadow-md">
              <Calendar onChangeDate={onChangeDate} monthsShown={1} />
              <div className="border-t w-full flex justify-end mt-4">
                <Button
                  variant="black"
                  className=" py-3 rounded-lg text-white flex items-center justify-center w-[100px] cursor-pointer mt-3"
                >
                  Save
                </Button>
              </div>
            </div>
          }
        />

        <PopoverComponent
          align="center"
          className="focus:border-black"
          trigger={
            <Button
              className={`px-3 py-2 border rounded-full cursor-pointer focus:border-black ${date[0] && date[1] ? 'border border-2 border-black' : ''}`}
            >
              1 guest
            </Button>
          }
          content={
            <div className="flex flex-col items-end justify-end bg-white p-4 rounded-2xl border shadow-md">
              <GuestSelector counts={guestCounts} onChange={setGuestCounts} />
              <div className="border-t w-full flex justify-end mt-4">
                <Button
                  variant="black"
                  className=" py-3 rounded-lg text-white flex items-center justify-center w-[100px] cursor-pointer mt-3"
                >
                  Save
                </Button>
              </div>
            </div>
          }
        />
        <Button className="flex items-center gap-2 px-3 py-2 border rounded-full">
          Share <Share size={15} />
        </Button>
      </div>
    </div>
  );
}
