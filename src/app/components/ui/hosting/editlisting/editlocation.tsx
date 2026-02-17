import { useGlobalStore } from '@/lib/store/global-store';
import Button from '@/shadcn/ui/Button';
import { Controller, useForm } from 'react-hook-form';
import InputBox from '../../form';
import { AddressFields } from '@/app/components/header/searchbarcomponents/autocomplete';
import { useListingStore } from '../../create-listings/store';
import { useEffect } from 'react';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useCreateListingApi } from '../../create-listings/store/api';

export default function EditLocation() {
  const { setListingEdit } = useGlobalStore();
  const { ListingData, SetListingData } = useListingStore();
  const { control, reset, handleSubmit } = useForm<AddressFields>();
  const { CreateListing } = useCreateListingApi();
  const { trigger, isPending } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      if (data) {
        SetListingData({
          ...ListingData,
          location: {
            lat: data?.data?.lat as number,
            lng: data?.data?.lng as number,
            address: data?.data?.address as string,
            country: data?.data?.country as string,
            landmark: data?.data?.landmark as string,
            district: data?.data?.district as string,
            city: data?.data?.city as string,
            state: data?.data?.state as string,
            pincode: data?.data?.pincode as string,
            street: data?.data?.street as string,
          },
        });
      }
    },
  });
  const inputFields = [
    { name: 'street', placeholder: 'Street address (if applicable)' },
    { name: 'landmark', placeholder: 'Nearby landmark (if applicable)' },
    { name: 'city', placeholder: 'City/town' },
    { name: 'state', placeholder: 'State/union territory' },
    { name: 'pincode', placeholder: 'PIN code' },
  ] as const;

  useEffect(() => {
    if (ListingData) {
      reset({
        landmark: ListingData?.location?.landmark || '',
        district: ListingData?.location?.district || '',
        city: ListingData?.location?.city || '',
        state: ListingData?.location?.state || '',
        pincode: ListingData?.location?.pincode || '',
        country: ListingData?.location?.country || '',
        street: ListingData?.location?.street || '',
      });
    }
  }, [ListingData, reset]);

  const onSubmit = (value: AddressFields) => {
    const data: Partial<{ listingId: string }> = {};
    if (ListingData?.listingId) {
      data.listingId = ListingData?.listingId;
    }
    const apidata = {
      ...value,
      address: ListingData?.location?.address as string,
      lat: ListingData?.location?.lat as number,
      lng: ListingData?.location?.lng as number,
    };
    trigger({
      data,
      step: 4,
      isEdit: true,
      editdata: {
        ...apidata,
      },
    });
  };

  return (
    <div>
      <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col gap-6 h-[calc(100vh_-_160px)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border rounded-lg my-6">
            {inputFields.map((field, index) => (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                defaultValue=""
                render={({ field: controllerField }) => (
                  <div
                    className={`${index === inputFields.length - 1 ? '' : 'border-b'}`}
                  >
                    <InputBox
                      {...controllerField}
                      control={control}
                      name={field.name}
                      label={field.placeholder}
                      borderClass="none focus:border-black focus:ring-2 focus:ring-black"
                    />
                  </div>
                )}
              />
            ))}
          </div>

          {/* Save/Cancel buttons inside the form */}
          <div className="flex justify-between p-4 bg-white">
            <Button
              type="button"
              onClick={() => setListingEdit({ isEdit: false, content: null })}
            >
              Cancel
            </Button>
            <Button variant="black" type="submit" loading={isPending}>
              Save
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
