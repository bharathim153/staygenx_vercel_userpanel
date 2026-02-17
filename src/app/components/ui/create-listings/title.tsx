'use client';

import { useContext, useLayoutEffect } from 'react';
import { useListingStore } from './store';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import PageContext from '../../contextprovider';

export default function TitleInput() {
  const { setDisabled } = useListingContext();

  const { SetListingData, ListingData } = useListingStore();

  const maxLength = 32;

  const { i18 } = useContext(PageContext);

  const title =
    typeof i18?.CREATELISTING?.TITLE === 'object'
      ? i18.CREATELISTING.TITLE
      : {};

  useLayoutEffect(() => {
    if (
      ListingData?.description?.title &&
      ListingData?.description?.title.length > 0
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
          {(typeof title.TITLE === 'string' && title.TITLE) ||
            " Now, let's give your container a title"}
        </h1>
        <p className="text-[#6A6A6A]">
          {(typeof title.DESC === 'string' && title.DESC) ||
            ' Short titles work best. Have fun with it – you can always change it later.'}
        </p>
      </div>

      <div className="w-full">
        <textarea
          rows={5}
          maxLength={maxLength}
          value={ListingData?.description?.title}
          onChange={e =>
            SetListingData({
              description: {
                title: e.target.value,
                description: ListingData?.description?.description ?? '',
              },
            })
          }
          className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg resize-none"
          placeholder={
            (typeof title.PLACEHOLDER === 'string' && title.PLACEHOLDER) ||
            'Type your title...'
          }
        />
        <p className="text-sm text-gray-500 mt-1 text-right">
          {ListingData?.description?.title.length}/{maxLength}
        </p>
      </div>
    </div>
  );
}
