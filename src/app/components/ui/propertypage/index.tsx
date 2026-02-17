'use client';
import { use, useEffect, useRef, useState } from 'react';
import PropertySection from '../../propertycard';
import { loadGoogleMapsScript } from '@/hooks/loadMapScript';
import { useGlobalStore } from '@/lib/store/global-store';
import MapComponent from './mapcomponent';
import { Map } from 'lucide-react';
import useScreenWidth from '@/hooks/useScreenWidth';
import { getGridCols } from '@/utils/helper';
import WishListFilter from '../wishlist/wishlistfilters';
import Button from '@/shadcn/ui/Button';

import {
  IListing,
  IUser,
  ICategory,
  IPropertyType,
} from '../homepage/store/type';
import { useSearchParamsStore } from '../searchbar/store/searchbar';
import { SearchApi } from '@/services/listing/search';

const demoUser: IUser = {
  _id: 'demo-user',
  firstName: 'Demo',
  lastName: 'User',
  phoneCode: '+91',
  userinfo: null,
};
const demoCategory: ICategory = { _id: 'cat1', name: 'Apartment' };
const demoPropertyType: IPropertyType = { _id: 'ptype1', name: 'Apartment' };

const popularHomesRaw = [
  {
    title: 'Apartment in Bengaluru',
    imageUrl:
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1270314768198309910/original/c389f712-5665-4b38-b83b-29f9b8fd73d0.jpeg?im_w=1200',
    location: 'Bengaluru',
    price: '₹3,264 for 2 nights',
    rating: '5.0',
  },
  // ...other homes (keep the rest as before)
  {
    title: 'Apartment in Koramangala',
    imageUrl:
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1413858431883771385/original/1b106e35-1218-4e67-9f83-7d55e739c9ab.jpeg?im_w=1200',
    location: 'Koramangala',
    price: '₹6,504 for 2 nights',
    rating: '4.93',
  },
  {
    title: 'Apartment in Bengaluru',
    imageUrl:
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1118422882348724135/original/a40a9fc3-9bee-46fc-bc33-61dd649cd6a8.jpeg?im_w=1200',
    location: 'Bengaluru',
    price: '₹3,264 for 2 nights',
    rating: '5.0',
  },
  {
    title: 'Apartment in Koramangala',
    imageUrl:
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1131789927021539466/original/52a6957f-d4e1-4255-9b5f-f9ef5fc35785.jpeg?im_w=1200',
    location: 'Koramangala',
    price: '₹6,504 for 2 nights',
    rating: '4.93',
  },
  {
    title: 'Apartment in Bengaluru',
    imageUrl:
      'https://a0.muscache.com/im/pictures/c55b710e-6ecb-4e9e-a010-0893e7062d91.jpg?im_w=1200',
    location: 'Bengaluru',
    price: '₹3,264 for 2 nights',
    rating: '5.0',
  },
  {
    title: 'Apartment in Koramangala',
    imageUrl:
      'https://a0.muscache.com/im/pictures/miso/Hosting-1146950113191217557/original/0f674d67-0cbb-4ed1-9ccf-ae6e5b5188de.jpeg?im_w=1200',
    location: 'Koramangala',
    price: '₹6,504 for 2 nights',
    rating: '4.93',
  },
  {
    title: 'Apartment in Bengaluru',
    imageUrl:
      'https://a0.muscache.com/im/pictures/miso/Hosting-1378778715717335892/original/2a2a3c0f-7ece-4210-b826-6dfd08d65323.jpeg?im_w=1200',
    location: 'Bengaluru',
    price: '₹3,264 for 2 nights',
    rating: '5.0',
  },
  {
    title: 'Apartment in Koramangala',
    imageUrl:
      'https://a0.muscache.com/im/pictures/a26f152a-e1ef-4917-a138-c3fc1ea33ce2.jpg?im_w=1200',
    location: 'Koramangala',
    price: '₹6,504 for 2 nights',
    rating: '4.93',
  },
  {
    title: 'Apartment in Bengaluru',
    imageUrl:
      'https://a0.muscache.com/im/pictures/c55b710e-6ecb-4e9e-a010-0893e7062d91.jpg?im_w=1200',
    location: 'Bengaluru',
    price: '₹3,264 for 2 nights',
    rating: '5.0',
  },
];

const popularHomes: IListing[] = popularHomesRaw.map((home, idx) => ({
  _id: `demo-${idx}`,
  userId: demoUser,
  category: demoCategory,
  propertyType: demoPropertyType,
  documentVerification: null,
  adults: 2,
  pets: false,
  amenities: [],
  images: [home.imageUrl],
  title: home.title,
  description: home.location,
  bookingMode: 'manual_first_5',
  firstGuestPolicy: 'any_guest',
  houseRules: [],
  hasSmokeAlarm: false,
  hasCarbonMonoxideAlarm: false,
  hasFirstAidKit: false,
  hasFireExtinguisher: false,
  cancellationPolicy: 'flexible',
  status: 'Active',
  softdel: false,
  progressPercentage: 100,
  photoTour: [],
  blockedDates: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  weekdayBasePrice: 3000,
  weekendBasePrice: 3500,
  cleaningFee: 200,
  serviceFee: 100,
  securityDeposit: 500,
}));

export default function PropertyPage({
  wishlist = false,
}: {
  wishlist?: boolean;
}) {
  const { GooglemapLoader } = useGlobalStore();
  const { searchParams, setSearchParams } = useSearchParamsStore();
  const params = new URLSearchParams(window.location.search);
  const apiCalledRef = useRef(false);
  const [show, setShow] = useState<'map' | 'list'>('list');
  const { width } = useScreenWidth();
  const [searchResults, setSearchResults] = useState<IListing[] | null>(null);

  useEffect(() => {
    if (!GooglemapLoader) loadGoogleMapsScript();
  }, [GooglemapLoader]);

  console.log('Search Params in PropertyPage:', searchParams);
  useEffect(() => {
    if (searchParams.city === "") {
      debugger
      setSearchParams({
        city: params.get("location") || "",
        checkIn: params?.get('checkin') ? params.get('checkin') : null,
        checkOut: params?.get('checkout') ? params.get('checkout') : null,
        adults: Number(params.get("adults") || 1),
        children: Number(params.get("children") || 0),
        infants: Number(params.get("infants") || 0),
        pets: Number(params.get("pets") || 0),
      });
    }
  }, []);

  useEffect(() => {
    if (apiCalledRef.current) return;
    apiCalledRef.current = true;
    debugger
    const searchParamsObj = {
      city: params.get("location") || "",
      checkIn: params?.get('checkin') ? params.get('checkin') : null,
      checkOut: params?.get('checkout') ? params.get('checkout') : null,
      adults: Number(params.get("adults") || 1),
      children: Number(params.get("children") || 0),
      infants: Number(params.get("infants") || 0),
      pets: Number(params.get("pets") || 0),
    };
    if (searchParamsObj.city) {
      debugger
      // setSearchParams(searchParamsObj);
      SearchApi({ body: searchParamsObj })
        // debugger
        .then((res) => {
          const listings = Array.isArray(res?.data) ? res.data : [];
          setSearchResults(listings);
          console.log('Search API response:', res);
        })
        .catch(() => setSearchResults([]));
    }
  }, [params]);

  return (
    <>
      <div className="flex w-full">
        {show !== 'map' && (
          <div
            className={` ${width !== null && width > 940 ? 'w-[60%]' : 'w-full'} space-y-4 px-4`}
          >
            {!wishlist ? (
              <p className="font-semibold my-4">
                {/* Over 1,000 places in Bengaluru Urban */}
              </p>
            ) : (
              <>
                <WishListFilter />
              </>
            )}

            <PropertySection
              scroll={false}
              properties={searchResults !== null ? searchResults : []}
              width={`${width !== null && width > 940 ? 'aspect-[4/4] w-full' : 'aspect-[4/4] w-full'}`}
              height={`${width !== null && width > 940 ? 'aspect-[4/4] h-full' : 'aspect-[4/4] h-full'}`}
              gridClass={`grid gap-4 ${width !== null ? getGridCols(width) : 'grid-cols-6'}`}
            />
          </div>
        )}

        {((width !== null && width > 940) ||
          (width !== null && width < 940 && show === 'map')) && (
            <div className={`${show === 'map' ? 'w-[100%]' : 'w-[40%]'}`}>
              <div className="sticky top-[100px] px-4">
                <div className=" h-[calc(100vh-125px)] ">
                  {GooglemapLoader ? (
                    <MapComponent />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Loading map...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      </div>
      {!wishlist && width !== null && width < 940 && (
        <div className="sticky bottom-5 left-1/2  flex items-center justify-center ">
          <Button
            variant="black"
            onClick={() => setShow(show === 'list' ? 'map' : 'list')}
            className="text-white px-4 py-2 rounded-full flex items-center gap-2 cursor-pointer hover:bg-[#111] transition-all duration-200"
          >
            Show map
            <Map />
          </Button>
        </div>
      )}
    </>
  );
}
