'use client';

import { useContext, useEffect, useLayoutEffect } from 'react';
import LocationMap from './locationMap';
import { loadGoogleMapsScript } from '@/hooks/loadMapScript';
import { useGlobalStore } from '@/lib/store/global-store';
import PageContext from '../../contextprovider';
import { useListingStore } from './store';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import Button from '@/shadcn/ui/Button';
import { ChevronLeft } from 'lucide-react';

export default function Location() {
  const { GooglemapLoader } = useGlobalStore();
  const { i18 } = useContext(PageContext);
  const { ListingData, SetListingData } = useListingStore();
  const { setDisabled } = useListingContext();

  const location =
    typeof i18?.CREATELISTING?.LOCATION === 'object'
      ? i18.CREATELISTING.LOCATION
      : {};

  useEffect(() => {
    if (!GooglemapLoader) loadGoogleMapsScript();
  }, [GooglemapLoader]);

  useLayoutEffect(() => {
    if (
      ListingData?.location?.lat !== 0 &&
      ListingData?.location?.lng !== 0 &&
      ListingData?.location?.address !== '' &&
      ListingData?.location?.city !== '' &&
      ListingData?.location?.country !== '' &&
      ListingData?.location?.district !== '' &&
      ListingData?.location?.state !== '' &&
      ListingData?.location?.pincode !== ''
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [ListingData, setDisabled]);

  const handleBack = () => {
    SetListingData({
      location: {
        lat: 0,
        lng: 0,
        address: '',
        country: '',
        landmark: '',
        district: '',
        city: '',
        state: '',
        pincode: '',
        street: '',
      },
    });
  };
  return (
    <div className=" max-w-[650px] mx-auto flex flex-col  items-start">
      <div className="relative">
        {ListingData?.location?.lat !== 0 &&
          ListingData?.location?.lng !== 0 &&
          ListingData?.location?.address !== '' && (
            <Button
              onClick={handleBack}
              variant="gray"
              className="rounded-full p-2 absolute left-[-55px] top-[20px]"
            >
              <ChevronLeft />
            </Button>
          )}
        <h1 className="text-[30px] md:text-[32px]  font-bold mt-4 mb-4 text-start">
          {(typeof location?.HEADER === 'string' && location?.HEADER) ||
            "Where's your place located?"}
        </h1>
      </div>
      <div className="text-[18px] text-gray-500 mb-8 text-start">
        {(typeof location?.DESC === 'string' && location?.DESC) ||
          " Your address is only shared with guests after they've made a reservation."}
      </div>
      {GooglemapLoader ? (
        <div className="w-full h-96">
          <LocationMap />
        </div>
      ) : (
        <p>
          {(typeof location?.LOADING === 'string' && location?.LOADING) ||
            'Loading map...'}
        </p>
      )}
    </div>
  );
}
