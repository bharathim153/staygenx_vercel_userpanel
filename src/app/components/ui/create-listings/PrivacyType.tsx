'use client';
import { useContext, useLayoutEffect } from 'react';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import Button from '@/shadcn/ui/Button';
import { useCustomeQuery } from '@/hooks/useCustomeQuery';
import { useListingStore } from './store';
import { PropertyTypeApi } from '@/services/listing/getapis';
import ThreeDotLoader from '../../threedotLoader';
import PageContext from '../../contextprovider';
import Image from 'next/image';

export default function PrivacyType() {
  const { i18 } = useContext(PageContext);

  const privacytype =
    typeof i18?.CREATELISTING?.PRIVACYTYPE === 'object'
      ? i18.CREATELISTING.PRIVACYTYPE.HEADER
      : {};

  const { setDisabled } = useListingContext();
  const { SetListingData, ListingData } = useListingStore();

  const { data: PropertyType, isLoading } = useCustomeQuery(
    ['Property-type'],
    () => PropertyTypeApi()
  );

  console.log('PropertyType:', PropertyType);

  useLayoutEffect(() => {
    if (ListingData?.propertytype?.propertyType) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [ListingData, setDisabled]);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  return (
    <div className="max-w-[630px] mx-auto flex flex-col w-full min-h-[400px]">
      <h1 className="text-[30px] md:text-[32px]  font-bold mb-8 text-start">
        {(typeof privacytype === 'string' && privacytype) ||
          'What type of place will guests have?'}
      </h1>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <ThreeDotLoader />
        </div>
      ) : Array.isArray(PropertyType) && PropertyType.length > 0 ? (
        <div className="flex flex-col gap-6 w-full max-w-3xl">
          {Array.isArray(PropertyType) &&
            PropertyType.map(type => (
              <Button
                key={type._id}
                onClick={() =>
                  SetListingData({ propertytype: { propertyType: type._id } })
                }
                className={`flex items-center justify-between border rounded-2xl px-8 py-6
               text-left w-full transition-all duration-150 focus:outline-none ${
                 ListingData?.propertytype?.propertyType === type._id
                   ? 'border-black bg-gray-100 border-2'
                   : 'border-gray-300 bg-white hover:border-black'
               }`}
              >
                <div>
                  <div className="text-[18px] font-bold mb-1">{type.name}</div>
                  <div className="text-[14px] text-gray-600">
                    {type.description}
                  </div>
                </div>
                <div className="ml-8 text-gray-800">
                  {typeof type.icon === 'string' ? (
                    <Image
                      src={baseUrl + type.icon}
                      alt={type.name}
                      className="w-8 h-8 object-contain"
                      width={32}
                      height={32}
                    />
                  ) : (
                    type.icon
                  )}
                </div>
              </Button>
            ))}
        </div>
      ) : (
        <div>
          <h2 className="text-[18px] md:text-[20px] font-semibold text-gray-500">
            No Property
          </h2>
        </div>
      )}
    </div>
  );
}
