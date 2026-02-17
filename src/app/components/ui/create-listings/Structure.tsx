'use client';

import { useContext, useLayoutEffect } from 'react';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import Button from '@/shadcn/ui/Button';
import { useCustomeQuery } from '@/hooks/useCustomeQuery';

import { useListingStore } from './store';
import { CategoryApi } from '@/services/listing/getapis';
import ThreeDotLoader from '../../threedotLoader';
import PageContext from '../../contextprovider';
import Image from 'next/image';

export default function Structure() {
  const { i18 } = useContext(PageContext);

  const structure =
    typeof i18?.CREATELISTING?.STRUCTURE === 'object'
      ? i18.CREATELISTING.STRUCTURE.HEADER
      : {};

  const { SetListingData, ListingData } = useListingStore();
  const { setDisabled } = useListingContext();
  const { data: categoryData, isLoading } = useCustomeQuery(['category'], () =>
    CategoryApi()
  );

  useLayoutEffect(() => {
    if (ListingData?.categories && ListingData?.categories?.category) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [ListingData, setDisabled]);

  return (
    <div className=" max-w-[680px] mx-auto flex flex-col ">
      <h1 className="text-[30px] md:text-[30px] font-bold mb-8 text-start">
        {(typeof structure === 'string' && structure) ||
          'Which of these best describes your place?'}
      </h1>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <ThreeDotLoader />
        </div>
      ) : Array.isArray(categoryData) && categoryData.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full ">
          {Array.isArray(categoryData) &&
            categoryData.map(type => (
              <Button
                key={type._id}
                onClick={() =>
                  SetListingData({ categories: { category: type._id } })
                }
                className={`flex flex-col items-start justify-center text-center border 
              rounded-2xl p-4 text-xl font-medium transition-all duration-150 w-full
               focus:outline-none ${
                 ListingData?.categories?.category === type._id
                   ? 'border-black bg-gray-100 border-2'
                   : 'border-gray-300 bg-white hover:border-black'
               }`}
              >
                <span className="text-4xl mb-2">
                  <Image
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + type.icon}
                    alt="img"
                    width={40}
                    height={40}
                  />
                </span>
                <span className="text-sm break-words whitespace-normal">
                  {type.name}
                </span>
              </Button>
            ))}
        </div>
      ) : (
        <div>
          <h2 className="text-[18px] md:text-[20px] font-semibold text-gray-500">
            No Category
          </h2>
        </div>
      )}
    </div>
  );
}
