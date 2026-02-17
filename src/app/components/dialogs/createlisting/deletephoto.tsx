import { useListingStore } from '../../ui/create-listings/store';
import Button from '@/shadcn/ui/Button';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useCreateListingApi } from '../../ui/create-listings/store/api';
import Image from 'next/image';

export default function DeletePhoto({ index }: { index?: number[] }) {
  const { ListingData } = useListingStore();
  const { closeDialog } = useDialogStore();
  const { CreateListing } = useCreateListingApi();

  const imageId = Array.isArray(index) ? index[0] : undefined;

  const imageSrc =
    typeof imageId === 'number' && ListingData?.images?.[imageId]
      ? `${ListingData.images[imageId]}`
      : '/images/placeholder.png';

  const { trigger, isPending } = useCustomMutation(CreateListing, {
    // onSuccessCallback: (data) => {
    //     if (data) {
    //         SetListingData({
    //             ...ListingData,
    //             images: data?.data?.images || [],
    //         });
    //     }
    // }
  });

  const handleDelete = () => {
    const data: Partial<{ listingId: string }> = {};
    if (ListingData?.listingId) {
      data.listingId = ListingData.listingId;
    }
    let updatedImages: string[] = [];
    if (Array.isArray(ListingData.images) && Array.isArray(index)) {
      updatedImages = ListingData.images.filter((_, i) => !index.includes(i));
    }
    trigger({
      data,
      step: 8,
      isEdit: true,
      arraydata: {
        existingImages: updatedImages,
        // images: {}
      },
    });
  };
  console.log('index', index);
  return (
    <div className="flex flex-col gap-3 items-center justify-center my-5">
      <div className="relative">
        <Image
          src={imageSrc}
          alt="Listing"
          width={800}
          height={800}
          className="rounded-2xl object-cover w-[150px] h-[150px]"
        />
        {index && index.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-white rounded-full px-3 py-1 shadow-md">
            <p className="text-[12px]">{`+${index.length - 1}`}</p>
          </div>
        )}
      </div>
      <p>{`Permanently delete ${index?.length} photo from your listing?`}</p>
      <div className="flex justify-between items-center w-full p-4">
        <Button
          className="border border-black p-2 rounded-md"
          onClick={() => closeDialog()}
        >
          cancel
        </Button>
        <Button variant="black" onClick={handleDelete} loading={isPending}>
          Delete
        </Button>
      </div>
    </div>
  );
}
