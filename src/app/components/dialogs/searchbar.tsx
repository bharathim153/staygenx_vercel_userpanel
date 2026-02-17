import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Input from '../header/searchbarcomponents/input';
import Autocomplete from '../header/searchbarcomponents/autocomplete';
import Button from '@/shadcn/ui/Button';
import Calendar from '../header/searchbarcomponents/calendar';
import GuestSelector from '../header/searchbarcomponents/guestselector';
import { format } from 'date-fns';

type ActiveKey = 'where' | 'dates' | 'who';
type DateRange = [Date | null, Date | null];

export default function SearchDrawer() {
  const [active, setActive] = useState<ActiveKey | null>('where');
  const [query, setQuery] = useState('');
  const [date, setDate] = useState<DateRange>([null, null]);
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
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
    <div className="flex flex-col gap-5  mx-auto">
      <div className=" bg-white rounded-3xl shadow-lg p-6 space-y-6 border">
        {active === 'where' ? (
          <>
            <h2 className="text-2xl font-semibold">Where?</h2>

            {/* Search Box */}
            <div className="flex items-center border rounded-xl px-4 py-3 gap-3">
              <Search className="text-gray-400" size={20} />
              <Input
                autocomplete={false}
                onChangeInput={(
                  suggestion: google.maps.places.AutocompletePrediction[]
                ) => {
                  setSuggestions(suggestion);
                }}
                Query={(query: string) => {
                  setQuery(query);
                }}
              />
            </div>

            {/* Suggested destinations */}
            <Autocomplete
              active={active ?? ''}
              showSuggestions={true}
              query={query}
              suggestions={suggestions}
              // onClickSuggestion={(coords) => {
              //   console.log('coords', coords)
              // }}
            />
          </>
        ) : (
          <div className="flex justify-between">
            <p className="text-[14px] text-[#6a6a6a] font-semibold">Where</p>
            <Button
              onClick={() => setActive('where')}
              className="text-[14px] font-semibold cursor-pointer"
            >
              {"I'm flexible"}
            </Button>
          </div>
        )}
      </div>

      <div className=" bg-white rounded-3xl shadow-lg p-6 space-y-6 border">
        {active === 'dates' ? (
          <>
            <h2 className="text-2xl font-semibold">When?</h2>
            <div className="flex items-center justify-center w-full">
              <Calendar onChangeDate={onChangeDate} monthsShown={1} />
            </div>
          </>
        ) : (
          <div className="flex justify-between">
            <p className="text-[14px] text-[#6a6a6a] font-semibold">When</p>
            <Button
              onClick={() => setActive('dates')}
              className="text-[14px] font-semibold cursor-pointer"
            >
              {date[0] && date[1]
                ? `${format(date[0], 'dd MMM')} - ${format(date[1], 'dd MMM')}`
                : date[0]
                  ? format(date[0], 'dd MMM')
                  : date[1]
                    ? format(date[1], 'dd MMM')
                    : 'Add dates'}
            </Button>
          </div>
        )}
      </div>

      <div className=" bg-white rounded-3xl shadow-lg p-6 space-y-6 border">
        {active === 'who' ? (
          <>
            <h2 className="text-2xl font-semibold">Who?</h2>
            <GuestSelector counts={guestCounts} onChange={setGuestCounts} />
          </>
        ) : (
          <div className="flex justify-between">
            <p className="text-[14px] text-[#6a6a6a] font-semibold">Who</p>
            <Button
              onClick={() => setActive('who')}
              className="text-[14px] font-semibold cursor-pointer"
            >
              Add guest
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
