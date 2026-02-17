'use client';

import { useGlobalStore } from '@/lib/store/global-store';
import Button from '@/shadcn/ui/Button';
import { useListingStore } from '../../create-listings/store';
import { useForm, Controller } from 'react-hook-form';
import { useCreateListingApi } from '../../create-listings/store/api';
import { useCustomMutation } from '@/hooks/useCustomeMutation';

type FormValues = {
  description: string;
};

export default function EditDescription() {
  const { setListingEdit, ListingEdit } = useGlobalStore();
  const { ListingData, SetListingData } = useListingStore();

  const { control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      description: ListingData?.description?.description || '',
    },
  });
  const { CreateListing } = useCreateListingApi();
  const { trigger, isPending } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      if (data) {
        SetListingData({
          ...ListingData,
          description: {
            title: data?.data?.title as string,
            description: data?.data?.description as string,
          },
        });
      }
    },
  });
  const descValue = watch('description');

  const onSubmit = (desc: FormValues) => {
    const data: Partial<{ listingId: string }> = {};
    if (ListingData?.listingId) {
      data.listingId = ListingData?.listingId;
    }
    trigger({
      data,
      step: 10,
      isEdit: true,
      editdata: {
        title: ListingData?.description?.title as string,
        description: desc?.description as string,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6 h-[calc(100vh_-_160px)]">
        <p className="capitalize text-[32px] font-semibold">
          {ListingEdit?.title}
        </p>
        <p>{descValue.length} / 500</p>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              rows={5}
              className="outline-none w-full"
              maxLength={500}
            />
          )}
        />
      </section>

      <div className="flex justify-between p-4 border-t sticky bottom-0 bg-white">
        <Button
          type="button"
          onClick={() =>
            setListingEdit({ isEdit: false, content: null, title: '' })
          }
        >
          Cancel
        </Button>
        <Button
          variant="black"
          type="submit"
          loading={isPending}
          disabled={
            ListingData?.description?.description === descValue ||
            descValue.length === 0
          }
        >
          Save
        </Button>
      </div>
    </form>
  );
}
