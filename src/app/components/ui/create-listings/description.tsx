'use client';

import { useContext, useLayoutEffect } from 'react';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import { useListingStore } from './store';
import PageContext from '../../contextprovider';

export default function DescInput() {
  const { setDisabled } = useListingContext();

  const { SetListingData, ListingData } = useListingStore();

  const maxLength = 500;

  const { i18 } = useContext(PageContext);

  const description =
    typeof i18?.CREATELISTING?.DESCRIPTION === 'object'
      ? i18.CREATELISTING.DESCRIPTION
      : {};

  useLayoutEffect(() => {
    if (
      ListingData?.description?.description &&
      ListingData?.description?.description.length > 0
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [ListingData, setDisabled]);

  return (
    <div className="max-w-[630px] h-full mx-auto flex flex-col justify-center gap-6 items-start">
      <div>
        <h1 className="text-[30px] md:text-[32px] font-bold ">
          {(typeof description.TITLE === 'string' && description.TITLE) ||
            'Create your description'}
        </h1>
        <p className="text-[#6A6A6A]">
          {(typeof description.DESC === 'string' && description.DESC) ||
            ' Share what makes your place special.'}
        </p>
      </div>

      <div className="w-full">
        <textarea
          rows={8}
          maxLength={maxLength}
          value={ListingData?.description?.description}
          onChange={e =>
            SetListingData({
              description: {
                title: ListingData?.description?.title ?? '',
                description: e.target.value,
              },
            })
          }
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg resize-none"
          placeholder={
            (typeof description.PLACEHOLDER === 'string' &&
              description.PLACEHOLDER) ||
            'Type your title...'
          }
        />
        <p className="text-sm text-gray-500 mt-1 text-right">
          {ListingData?.description?.description.length}/{maxLength}
        </p>
      </div>
    </div>
  );
}
