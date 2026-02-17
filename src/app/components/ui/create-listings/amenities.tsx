'use client';

import { useContext, useLayoutEffect } from 'react';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import Button from '@/shadcn/ui/Button';
import { useCustomeQuery } from '@/hooks/useCustomeQuery';

import { useListingStore } from './store';
import { AmenityApi } from '@/services/listing/getapis';
import ThreeDotLoader from '../../threedotLoader';
import PageContext from '../../contextprovider';
import { AmenityApiData } from './store/amenities';
import Image from 'next/image';

export default function Amenities() {
  const { SetListingData, ListingData } = useListingStore();
  const { setDisabled } = useListingContext();
  const { data: AmenityData, isLoading } = useCustomeQuery(['amenity'], () =>
    AmenityApi()
  );

  console.log('Amenity Data:', AmenityData);
  const { i18 } = useContext(PageContext);

  const amenities =
    typeof i18?.CREATELISTING?.AMENITIES === 'object'
      ? i18.CREATELISTING.AMENITIES
      : {};

  const handleClick = (items: AmenityApiData) => {
    console.log('Clicked Amenity:', items);
    const id = items._id;
    const existingAmenities = (ListingData?.amenities?.amenities ?? []) as (
      | string
      | AmenityApiData
    )[];
    const isAmenityObj = (a: unknown): a is AmenityApiData =>
      typeof a === 'object' &&
      a !== null &&
      '_id' in a &&
      typeof (a as { _id?: unknown })._id === 'string';
    const isSelected = existingAmenities.some(a =>
      typeof a === 'string' ? a === id : isAmenityObj(a) && a._id === id
    );
    const updatedSelected: (string | AmenityApiData)[] = isSelected
      ? existingAmenities.filter(a =>
          typeof a === 'string'
            ? a !== id
            : isAmenityObj(a)
              ? a._id !== id
              : false
        )
      : [...existingAmenities, id];

    const amenityIds = updatedSelected
      .map(a => (typeof a === 'string' ? a : isAmenityObj(a) ? a._id : null))
      .filter((a): a is string => typeof a === 'string');

    console.log('Updated Selected Amenity IDs:', amenityIds);

    SetListingData(prev => ({
      ...prev,
      amenities: {
        // ...prev.amenities,
        amenities: amenityIds,
      },
    }));

    // Prepare payload in required format
    // const payload = {
    //   amenities: amenityIds,
    //   progressPercentage: 15,
    // };
    // You can now send this payload to your API or use it as needed
  };

  useLayoutEffect(() => {
    if (
      ListingData?.amenities?.amenities &&
      ListingData?.amenities?.amenities.length > 0
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [ListingData?.amenities?.amenities, setDisabled]);

  return (
    <div className=" max-w-[630px] mx-auto flex flex-col">
      <div className="mb-4 text-start flex flex-col">
        <h1 className="text-[30px] md:text-[32px] font-bold ">
          {(typeof amenities.TITLE === 'string' && amenities.TITLE) ||
            ' Tell guests what your place has to offer'}
        </h1>
        <p className="text-[#6A6A6A]">
          {' '}
          {(typeof amenities.DESC === 'string' && amenities.DESC) ||
            'You can add more amenities after you publish your listing.'}
        </p>
      </div>
      <p className="my-4">
        {(typeof amenities.HEADING === 'string' && amenities.HEADING) ||
          'What about these guest favourites?'}
      </p>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <ThreeDotLoader />
        </div>
      ) : Array.isArray(AmenityData) && AmenityData.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full ">
          {Array.isArray(AmenityData) &&
            AmenityData.map(items => (
              <Button
                key={items?._id}
                onClick={() => handleClick(items)}
                className={`flex flex-col gap-3 items-start justify-center text-center border rounded-2xl 
  p-4 text-xl font-medium transition-all duration-150 w-full focus:outline-none ${
    ListingData?.amenities?.amenities?.includes(items?._id)
      ? 'border-black bg-gray-100 border-2'
      : 'border-gray-300 bg-white hover:border-black'
  }`}
              >
                <Image
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + items?.icon}
                  width={20}
                  height={20}
                  alt="img"
                />
                <span className="text-sm break-words whitespace-normal text-start">
                  {items?.name}
                </span>
              </Button>
            ))}
        </div>
      ) : (
        <div>
          <h2 className="text-[18px] md:text-[20px] font-semibold text-gray-500">
            {(typeof amenities.NOAMENITY === 'string' && amenities.NOAMENITY) ||
              'No Amenities'}
          </h2>
        </div>
      )}
    </div>
  );
}
