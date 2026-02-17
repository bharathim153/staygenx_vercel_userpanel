'use client';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Search } from 'lucide-react';
import GuestSelector from '../../header/searchbarcomponents/guestselector';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import Autocomplete from '../../header/searchbarcomponents/autocomplete';
import Input from '../../header/searchbarcomponents/input';
import PageContext from '../../contextprovider';
import Button from '@/shadcn/ui/Button';
import { useRouter } from 'next/navigation';
import { useSearchParamsStore } from './store/searchbar';

type ActiveKey = 'where' | 'checkin' | 'checkout' | 'who';
type DateRange = [Date | null, Date | null];
const Calendar = dynamic(
  () => import('../../header/searchbarcomponents/calendar'),
  { ssr: false }
);

export default function SearchBar() {
  const { i18 } = useContext(PageContext);
  const { setSearchParams, searchParams } = useSearchParamsStore();
  console.log('searchParams', searchParams);
  const router = useRouter();
  const SearchBar =
    typeof i18?.HOMEPAGE?.HEADER?.SEARCHBAR === 'object'
      ? i18?.HOMEPAGE?.HEADER?.SEARCHBAR
      : undefined;
  const [active, setActive] = useState<ActiveKey | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [date, setDate] = useState<DateRange>([null, null]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [popupStyle, setPopupStyle] = useState({ left: 0, top: 0 });
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    description: string;
  } | null>(null);
  const [guestCount, setGuestCount] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });
  console.log('selectedLocation:', selectedLocation);
  const whereRef = useRef<HTMLDivElement>(null);
  const checkinRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const whoRef = useRef<HTMLDivElement>(null);

  const refs: Record<ActiveKey, React.RefObject<HTMLDivElement | null>> = {
    where: whereRef,
    checkin: checkinRef,
    checkout: checkoutRef,
    who: whoRef,
  };

  useEffect(() => {
    if (active && refs[active as keyof typeof refs]?.current) {
      const rect =
        refs[active as keyof typeof refs]!.current!.getBoundingClientRect();
      const containerRect =
        refs.where.current!.parentElement!.getBoundingClientRect();
      setIndicatorStyle({
        left: rect.left - containerRect.left,
        width: rect.width,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    if (active && refs[active]?.current && refs.where.current?.parentElement) {
      const tabRect = refs[active].current!.getBoundingClientRect();
      const containerRect =
        refs.where.current!.parentElement.getBoundingClientRect();

      const centerX = tabRect.left - containerRect.left + tabRect.width / 2;
      const fullWidth = containerRect.width;
      const halfWidth = fullWidth / 2;
      let left = centerX - halfWidth / 2;

      // For "who", align to the right of the tab
      if (active === 'who') {
        left = tabRect.right - containerRect.left - halfWidth;
      }

      setPopupStyle({
        top: tabRect.bottom - containerRect.top + 70,
        left,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const commonTabClasses =
    'flex flex-col cursor-pointer rounded-full flex-grow transition-all duration-300 relative z-10';

  const renderDivider = (key: string) => (
    <div
      className={`hidden sm:block border-l h-8 mx-2 transition-all duration-300 ${active === key ? 'opacity-0' : 'opacity-100'
        }`}
    />
  );

  const onChangeDate = (values: DateRange) => {
    if (values) {
      setDate(values);
    }
  };
  useEffect(() => {
    if (date[0]) {
      setActive('checkout');
    }
  }, [date]);

  const handleSearch = () => {
    // Construct search URL with parameters for local search page
    const params = new URLSearchParams();
    debugger;
    // Location parameters
    if (selectedLocation) {
      params.append('location', selectedLocation.description);
      // params.append('center_lat', selectedLocation.lat.toString());
      // params.append('center_lng', selectedLocation.lng.toString());
    } else {
      // Default location (if no location selected)
      params.append('location', 'India');
      params.append('center_lat', '9.93');
      params.append('center_lng', '78.12');
    }

    // Date parameters
    if (date[0]) {
      params.append('checkin', format(date[0], 'yyyy-MM-dd'));
    }

    if (date[1]) {
      params.append('checkout', format(date[1], 'yyyy-MM-dd'));
    }

    // Guest parameters
    params.append('adults', guestCount.adults.toString());
    if (guestCount.children > 0) {
      params.append('children', guestCount.children.toString());
    }
    if (guestCount.infants > 0) {
      params.append('infants', guestCount.infants.toString());
    }
    if (guestCount.pets > 0) {
      params.append('pets', guestCount.pets.toString());
    }

    if (selectedLocation) {
      // Call API or set params only if location is selected
      setSearchParams({
        city: selectedLocation.description,
        checkIn: date[0],
        checkOut: date[1],
        adults: guestCount.adults,
        children: guestCount.children,
        infants: guestCount.infants,
        pets: guestCount.pets,
      });
      // Place API call here if needed
    }
    // Navigate to local search page
    const searchUrl = `/search?${params.toString()}`;
    router.push(searchUrl);

    // Close any active popups

    setActive(null);
  };

  return (
    <>
      <div
        className={`relative mx-auto border rounded-full shadow flex items-center ${active ? 'bg-gray-100' : 'bg-[#fff]'} transition-colors duration-300`}
      >
        <div
          className="absolute top-0 left-0 h-full bg-white rounded-full shadow-lg transition-all duration-300 ease-in-out"
          style={{
            width: `${indicatorStyle.width}px`,
            transform: `translateX(${indicatorStyle.left}px)`,
          }}
        />

        <div
          ref={refs.where}
          className={`${commonTabClasses} px-4 py-1 ${active === 'where' ? 'text-black' : 'hover:bg-gray-200'
            }`}
          onClick={() => {
            setActive('where');
          }}
        >
          <span className="text-[13px] font-semibold">
            {typeof SearchBar?.WHERE === 'string' ? SearchBar.WHERE : 'Where'}
          </span>
          {selectedLocation ? (
            <span className="text-[13px] text-gray-800 truncate">
              {selectedLocation.description}
            </span>
          ) : (
            <Input
              className="text-[12px]"
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
          )}
        </div>

        {renderDivider('where')}

        <div
          ref={refs.checkin}
          className={`${commonTabClasses} px-8 py-3 ${active === 'checkin' ? 'text-black' : 'hover:bg-gray-200'
            }`}
          onClick={() => setActive('checkin')}
        >
          <span className="text-[13px] font-semibold whitespace-nowrap">
            {typeof SearchBar?.CHECKIN === 'string'
              ? SearchBar.CHECKIN
              : 'Check in'}
          </span>
          <span className="text-[13px] text-gray-500 whitespace-nowrap">
            {date[0]
              ? format(date[0], 'dd MMM')
              : typeof SearchBar?.ADDDATES === 'string'
                ? SearchBar.ADDDATES
                : 'Add dates'}
          </span>
        </div>

        {renderDivider('checkin')}

        <div
          ref={refs.checkout}
          className={`${commonTabClasses} px-8 py-3 ${active === 'checkout' ? 'text-black' : 'hover:bg-gray-200'
            }`}
          onClick={() => setActive('checkout')}
        >
          <span className="text-[13px] font-semibold whitespace-nowrap">
            {typeof SearchBar?.CHECKOUT === 'string'
              ? SearchBar.CHECKOUT
              : 'Check out'}
          </span>
          <span className="text-[13px] text-gray-500 whitespace-nowrap min-w-[60px]">
            {date[1]
              ? format(date[1], 'dd MMM')
              : typeof SearchBar?.ADDDATES === 'string'
                ? SearchBar.ADDDATES
                : 'Add dates'}
          </span>
        </div>

        {renderDivider('checkout')}

        <div
          ref={refs.who}
          className={`relative flex flex-col cursor-pointer rounded-full w-[280px] ${commonTabClasses} px-8 py-3 transition-all duration-300 z-10 ${active === 'who' ? 'text-black' : 'hover:bg-gray-200'
            }`}
          onClick={() => setActive('who')}
        >
          <span className="text-[13px] font-semibold">
            {typeof SearchBar?.WHO === 'string' ? SearchBar.WHO : 'Who'}
          </span>
          <span className="text-[13px] text-gray-500 whitespace-nowrap">
            {typeof SearchBar?.ADDGUEST === 'string'
              ? SearchBar.ADDGUEST
              : 'Add guests'}
          </span>
          <Button
            variant="pink"
            onClick={handleSearch}
            className={`p-2 cursor-pointer absolute right-2 top-[7px] ml-2   ${active ? 'gap-1 w-[110px] h-[50px] rounded-full ' : 'w-[50px] h-[50px] rounded-full'} flex items-center justify-center text-white  transition-all duration-300 overflow-hidden`}
          >
            <Search size={16} />
            <span
              className={`whitespace-nowrap transition-all duration-300 ease-in-out transform ${active
                ? 'opacity-100 translate-x-0 ml-1'
                : 'opacity-0 -translate-x-2 w-0 overflow-hidden'
                }`}
            >
              {typeof SearchBar?.SEARCH2 === 'string'
                ? SearchBar.SEARCH2
                : 'Search'}
            </span>
          </Button>
        </div>
      </div>
      {active && (
        <div
          className={`
          absolute z-20 bg-white border shadow-md rounded-2xl p-5
          transition-all duration-300 ease-in-out transform
          ${active === 'checkin' || active === 'checkout' ? 'w-full left-0' : 'w-1/2'}
          animate-zoomIn ${active === 'checkin' || active === 'checkout' ? ' flex items-center justify-center ' : ''}
        `}
          style={{
            top: popupStyle.top,
            left:
              active === 'checkin' ||
                active === 'checkout' ||
                active === 'where'
                ? 0
                : popupStyle.left,
          }}
        >
          {active === 'where' && (
            <Autocomplete
              active={active}
              showSuggestions={active === 'where'}
              query={query}
              suggestions={suggestions}
              onClickSuggestion={coords => {
                setSelectedLocation({
                  lat: coords.lat,
                  lng: coords.lng,
                  description: coords?.city || 'Selected location',
                });
                console.log('coords:', coords);
                setActive('checkin'); // Close the popup after selection
              }}
            />
          )}

          {(active === 'checkin' || active === 'checkout') && (
            <Calendar onChangeDate={onChangeDate} />
          )}

          {active === 'who' && (
            <GuestSelector counts={guestCount} onChange={setGuestCount} isSearchBar={true} />
          )}
        </div>
      )}
    </>
  );
}
