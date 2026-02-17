'use client';

import { Controller, useForm } from 'react-hook-form';
import InputBox from '../form';
import { useEffect } from 'react';
import { AddressFields } from '../../header/searchbarcomponents/autocomplete';
import { useListingStore } from './store';
import { deepEqual } from '@/utils/helper';

const inputFields = [
  { name: 'street', placeholder: 'Street address (if applicable)' },
  { name: 'landmark', placeholder: 'Nearby landmark (if applicable)' },
  { name: 'district', placeholder: 'District/locality ' },
  { name: 'city', placeholder: 'City/town' },
  { name: 'state', placeholder: 'State/union territory' },
  { name: 'pincode', placeholder: 'PIN code' },
] as const;

export default function AddressForm({
  suggestion,
}: {
  suggestion: AddressFields;
}) {
  const { SetListingData } = useListingStore();

  const { control, reset, watch } = useForm<AddressFields>();
  const watchedFields = watch();
  console.log('suggestion', suggestion);
  useEffect(() => {
    if (suggestion) {
      reset({
        landmark: suggestion.landmark || '',
        district: suggestion.district || '',
        city: suggestion.city || '',
        state: suggestion.state || '',
        pincode: suggestion.pincode || '',
        country: suggestion.country || '',
        street: suggestion.street || '',
      });
    }
  }, [suggestion, reset]);

  useEffect(() => {
    const newLocation = { ...suggestion, ...watchedFields };
    const prevLocation = suggestion;

    if (!deepEqual(prevLocation, newLocation)) {
      SetListingData(prev => ({
        ...prev,
        location: {
          ...prev?.location,
          ...newLocation,
        },
      }));
    }
  }, [watchedFields, suggestion, SetListingData]);
  return (
    <form className="mx-auto ">
      <Controller
        name={'country'}
        control={control}
        defaultValue=""
        render={({ field: controllerField }) => (
          <div>
            <InputBox
              {...controllerField}
              control={control}
              name={'country'}
              label={'Country'}
              borderClass="border focus:border-black focus:ring-2 focus:ring-black"
              className="text-[19px]"
            />
          </div>
        )}
      />
      <div className=" border rounded-lg my-6">
        {inputFields.map((field, index) => (
          <Controller
            key={field.name}
            name={field.name}
            control={control}
            defaultValue=""
            render={({ field: controllerField }) => (
              <div
                className={`${index === inputFields.length - 1 ? '' : 'border-b'} `}
              >
                <InputBox
                  {...controllerField}
                  type={field.name === 'pincode' ? 'number' : 'text'}
                  control={control}
                  name={field.name}
                  label={field.placeholder}
                  borderClass="none focus:border-black focus:ring-2 focus:ring-black"
                  className="text-[19px] placeholder:text-[14px]"
                />
              </div>
            )}
          />
        ))}
      </div>
    </form>
  );
}
