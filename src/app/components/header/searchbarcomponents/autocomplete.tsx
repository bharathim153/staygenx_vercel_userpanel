'use client';
import Button from '@/shadcn/ui/Button';
import { fetchAddress } from '@/utils/helper';
import { MapPin } from 'lucide-react';

import { memo, useContext, useMemo, useState } from 'react';
import PageContext from '../../contextprovider';
import Image from 'next/image';
import ThreeDotLoader from '../../threedotLoader';

interface AutocompleteProps {
  currentLocation?: boolean;
  active: string;
  showSuggestions: boolean;
  query: string;
  suggestions: google.maps.places.AutocompletePrediction[];
  onClickSuggestion?: (address: AddressFields) => void;
}

export interface AddressFields {
  lat: number;
  lng: number;
  address?: string;
  country?: string;
  landmark?: string;
  district?: string;
  city?: string;
  state?: string;
  pincode?: string;
  street?: string;
}

function Autocomplete({
  currentLocation = false,
  active,
  showSuggestions,
  query,
  suggestions,
  onClickSuggestion,
}: AutocompleteProps) {
  const handleSelect = async (suggestion: string): Promise<void> => {
    const address: AddressFields = await fetchAddress(suggestion);
    if (onClickSuggestion){ 
      onClickSuggestion(address)

    };
  };
  const [Loading, setLoading] = useState(false);
  const { i18 } = useContext(PageContext);
  const SearchBar =
    typeof i18?.HOMEPAGE?.HEADER?.SEARCHBAR === 'object'
      ? i18?.HOMEPAGE?.HEADER?.SEARCHBAR
      : undefined;
  const value = useMemo<google.maps.places.AutocompletePrediction[]>(() => {
    return suggestions;
  }, [suggestions]);

  return (
    <div>
      {showSuggestions && active === 'where' && (
        <div className="">
          {Array.isArray(value) && value.length > 0 && query !== '' ? (
            Array.isArray(value) &&
            value.map(
              (suggestion: google.maps.places.AutocompletePrediction) => (
                <div
                  onClick={() => handleSelect(suggestion?.place_id)}
                  key={suggestion.place_id}
                  className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg"
                >
                  <div>
                    <MapPin className="w-[25px] h-[25px]" />
                  </div>
                  <Button
                    onClick={() => handleSelect(suggestion?.place_id)}
                    className="py-3 cursor-pointer  truncate"
                  >
                    {suggestion.description}
                  </Button>
                </div>
              )
            )
          ) : (
            <div className="">
              {/* <p className="text-[12px] mb-3">Suggested destinations</p> */}
              <div className={`w-full ${currentLocation ? 'p-4' : 'p-0'}`}>
                {currentLocation ? (
                  Loading ? (
                    <ThreeDotLoader />
                  ) : (
                    <Button
                      onClick={async () => {
                        if (!navigator.geolocation) {
                          alert(
                            'Geolocation is not supported by your browser.'
                          );
                          return;
                        }
                        setLoading(true);
                        navigator.geolocation.getCurrentPosition(
                          async position => {
                            const coords = {
                              lat: position.coords.latitude,
                              lng: position.coords.longitude,
                            };

                            const geocoder = new window.google.maps.Geocoder();
                            geocoder.geocode(
                              { location: coords },
                              (results, status) => {
                                if (
                                  status === 'OK' &&
                                  results &&
                                  results.length > 0
                                ) {
                                  setLoading(false);
                                  const placeId: string = results[0].place_id;
                                  handleSelect(placeId);
                                }
                              }
                            );
                          }
                        );
                      }}
                      className="flex gap-4 cursor-pointer p-3 rounded-lg hover:bg-gray-200 w-full"
                    >
                      <Image
                        src="/images/location.webp"
                        alt="img"
                        width={100}
                        height={100}
                        className="w-[50px] h-[50px]"
                      />
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-[14px]">
                          {typeof SearchBar?.CURRENTLOCATION === 'string'
                            ? SearchBar?.CURRENTLOCATION
                            : 'Use my current location'}
                        </p>
                      </div>
                    </Button>
                  )
                ) : (
                  <div className="flex gap-4 cursor-pointer p-3 rounded-lg hover:bg-gray-200 w-full">
                    <Image
                      src="/images/location.webp"
                      alt="img"
                      width={100}
                      height={100}
                      className="w-[50px] h-[50px]"
                    />
                    <div className="flex flex-col items-baseline ">
                      <p className="font-medium text-[14px]">
                        {typeof SearchBar?.NEARBY === 'string'
                          ? SearchBar?.NEARBY
                          : 'Nearby'}
                      </p>
                      <p className="text-[14px]">
                        {typeof SearchBar?.DESC === 'string'
                          ? SearchBar?.DESC
                          : 'Find what’s around you'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default memo(Autocomplete);
