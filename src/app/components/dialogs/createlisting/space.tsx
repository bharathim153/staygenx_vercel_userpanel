import { useState } from 'react';
import { SingleListing } from '@/services/listing/getapis';

import Button from '@/shadcn/ui/Button';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useCreateListingApi } from '../../ui/create-listings/store/api';
import { useListingStore } from '../../ui/create-listings/store';
import { useSpaceStore } from '../../ui/create-listings/store/space';
import { useDialogStore } from '@/lib/store/dialog-store';
import Image from 'next/image';

export default function Space() {
  const { ListingData } = useListingStore();

  const { closeDialog } = useDialogStore();
  const { space } = useSpaceStore();
  const [selectedId, setSelectedId] = useState<string>('');
  const { CreateListing } = useCreateListingApi();
  const { trigger, isPending } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      if (data) {
        setSelectedId('');
        closeDialog();
        SingleListing({ listingId: ListingData?.listingId ?? '' });
      }
    },
  });

  const handleSave = () => {
    const data: Partial<{ listingId: string }> = {};
    if (ListingData?.listingId) {
      data.listingId = ListingData.listingId;
    }

    trigger({
      data,
      step: 17,
      isEdit: true,
      editdata: {
        roomType: selectedId,
      },
    });
  };
  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5 ">
        {Array.isArray(space) &&
          space.map(space => {
            const isSelected = selectedId === space._id;

            return (
              <div
                key={space?._id}
                onClick={() => setSelectedId(space._id)}
                className={`cursor-pointer transition `}
              >
                <div
                  className={`w-[150px] h-[170px] relative rounded-2xl shadow-sm hover:shadow-md
                                ${isSelected ? 'border-2 border-black rounded-2xl' : ''}
                                    `}
                >
                  <Image
                    src={process.env.NEXT_PUBLIC_IMAGE_URL + space.icon}
                    alt={space.name}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-medium">{space.name}</h3>
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex justify-between p-4 border-t sticky bottom-0 bg-white">
        <Button>Cancel</Button>
        <Button
          variant="black"
          disabled={!selectedId}
          loading={isPending}
          onClick={handleSave}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
