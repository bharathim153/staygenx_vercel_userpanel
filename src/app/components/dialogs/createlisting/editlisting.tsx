import Button from '@/shadcn/ui/Button';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

import { useListeStore } from '../../ui/hosting/store';
import { useContext } from 'react';
import PageContext from '../../contextprovider';
import { useRouter } from 'next/navigation';
import { stepMap } from '../../layouts/createlistingLayout/footer';
import { useDialogStore } from '@/lib/store/dialog-store';
import Image from 'next/image';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { DeleteListing } from '@/services/listing';
import { Listings } from '@/services/listing/getapis';

type EditListingProps = {
  index: number;
};

export default function EditListing({ index }: EditListingProps) {
  const { Lists } = useListeStore();
  const { i18 } = useContext(PageContext);
  const { closeDialog } = useDialogStore();
  const { trigger } = useCustomMutation(DeleteListing, {
    onSuccessCallback: data => {
      if (data) {
        closeDialog();
        Listings();
      }
    },
  });

  const editlisting =
    typeof i18?.LISTINGPAGE === 'object' ? i18.LISTINGPAGE : undefined;
  const router = useRouter();
  // ✅ Extract and guard early
  const listing = Array.isArray(Lists) && Lists[index] ? Lists[index] : null;

  if (!listing) {
    return (
      <div className="text-gray-500 text-center">
        {typeof editlisting?.NOTFOUND === 'string'
          ? editlisting?.NOTFOUND
          : 'Listing not found'}
      </div>
    );
  }

  let imageSrc = null;
  if (listing.images?.[0]) {
    imageSrc = listing.images[0].startsWith('http')
      ? listing.images[0]
      : `${process.env.NEXT_PUBLIC_IMAGE_URL || ''}${listing.images[0]}`;
  }

  console.log('Listing in EditListing:', listing);

  const handleRoute = () => {
    router.push(
      `/become-a-host/${Lists[index]?._id}/${stepMap[Lists[index].progressPercentage + 1]}`
    );
    closeDialog();
  };
  const handleDelete = () => {
    trigger(Lists[index]?._id);
  };
  return (
    <div className="flex flex-col gap-3 items-center justify-center">
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt="Listing"
          width={800}
          height={800}
          className="rounded-2xl object-cover w-[150px] h-[150px]"
        />
      ) : (
        <div className="bg-gray-200 w-[150px] h-[150px] rounded-2xl" />
      )}

      <h3 className="text-sm truncate">
        {listing.title ||
          `Your listing started on ${format(
            new Date(listing.createdAt),
            'dd MMMM yyyy'
          )}`}
      </h3>

      <div className="flex justify-between w-full pt-4 border-t">
        <Button onClick={handleRoute} variant="black">
          {typeof editlisting?.EDITLISTING === 'string'
            ? editlisting.EDITLISTING
            : 'Edit listing'}
        </Button>
        <Button
          variant="black"
          className="flex gap-2 items-center px-3 rounded-md"
          onClick={handleDelete}
        >
          <Trash2 size={14} />
          {typeof editlisting?.REMOVE === 'string'
            ? editlisting.REMOVE
            : 'Remove listing'}
        </Button>
      </div>
    </div>
  );
}
