'use client';
import { useContext, useEffect, useState } from 'react';
import Button from '@/shadcn/ui/Button';
import { useListingStore } from '../../create-listings/store';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useCreateListingApi } from '../../create-listings/store/api';
import PageContext from '@/app/components/contextprovider';

export default function Title() {
  const { i18 } = useContext(PageContext);
  const common =
    typeof i18?.COMMON?.TEXT === 'object' ? i18?.COMMON?.TEXT : undefined;

  const { ListingData, SetListingData } = useListingStore();
  const [value, setValue] = useState(ListingData?.description?.title ?? '');
  const maxLength = 50;
  const { CreateListing } = useCreateListingApi();

  const { trigger, isPending } = useCustomMutation(CreateListing);

  const handleSave = () => {
    SetListingData({
      description: {
        title: value,
        description: ListingData?.description?.description ?? '',
      },
    });
    const data: Partial<{ listingId: string }> = {};
    if (ListingData?.listingId) {
      data.listingId = ListingData?.listingId;
    }
    trigger({
      data,
      step: 10,
    });
  };
  useEffect(() => {
    setValue(ListingData?.description?.title ?? '');
  }, [ListingData?.description?.title]);
  return (
    <>
      <div className=" h-full">
        {/* Top content */}
        <div className="flex flex-col items-center justify-center gap-4 p-6  overflow-hidden h-[calc(100vh_-_160px)]">
          {/* Character count */}
          <div className="text-sm text-gray-500">
            <span className="font-semibold text-black">{value.length}</span>/
            {maxLength}{' '}
            <span className="text-gray-400">
              {(typeof common?.AVAILABLE === 'string' && common?.AVAILABLE) ||
                'available'}
            </span>
          </div>

          {/* Input */}
          <input
            type="text"
            value={value}
            maxLength={maxLength}
            onChange={e => setValue(e.target.value)}
            className="text-5xl font-semibold text-center border-none outline-none bg-transparent"
          />
        </div>

        {/* Save button - sticky */}
      </div>
      <div className="sticky bottom-0 w-full border-t bg-white p-5">
        <div className="flex justify-end">
          <Button
            className="px-6 py-2 rounded-md h-[50px]"
            variant="black"
            disabled={
              ListingData?.description?.title === '' ||
              value === ListingData?.description?.title
            }
            loading={isPending}
            onClick={handleSave}
          >
            {(typeof common?.SAVE === 'string' && common?.SAVE) || 'Save'}
          </Button>
        </div>
      </div>
    </>
  );
}
