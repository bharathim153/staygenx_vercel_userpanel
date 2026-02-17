'use client';
import { useEffect, useRef, useState } from 'react';
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
  IListing
} from '../homepage/store/type';
import { useSearchParamsStore } from '../searchbar/store/searchbar';
import { SearchApi } from '@/services/listing/search';


// const popularHomes: IListing[] = popularHomesRaw.map((home, idx) => ({
//   ...
// })); // Removed unused variable

export default function PropertyPage({
  wishlist = false,
}: {
  wishlist?: boolean;
}) {
  const { GooglemapLoader } = useGlobalStore();
  const { searchParams, setSearchParams } = useSearchParamsStore();
  // Only access window in client
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setParams(new URLSearchParams(window.location.search));
    }
  }, []);
  const apiCalledRef = useRef(false);
  const [show, setShow] = useState<'map' | 'list'>('list');
  const { width } = useScreenWidth();
  const [searchResults, setSearchResults] = useState<IListing[] | null>(null);

  useEffect(() => {
    if (!GooglemapLoader) loadGoogleMapsScript();
  }, [GooglemapLoader]);

  console.log('Search Params in PropertyPage:', searchParams);
  useEffect(() => {
    if (!params) return;
    if (searchParams.city === "") {
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
  }, [params, searchParams.city, setSearchParams]);

  useEffect(() => {
    if (!params) return;
    if (apiCalledRef.current) return;
    apiCalledRef.current = true;
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
      SearchApi({ body: searchParamsObj })
        .then((res) => {
          const listings = Array.isArray(res?.data) ? res.data : [];
          setSearchResults(listings);
          console.log('Search API response:', res);
        })
        .catch(() => setSearchResults([]));
    }
  }, [params, searchParams.city, setSearchParams]);

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
