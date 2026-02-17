'use client';

import { Controller, FieldError, useForm } from 'react-hook-form';
import InputBox from '../ui/form';
import Button from '@/shadcn/ui/Button';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { ProfileInfoApi } from '@/services/user';
import { getCookie } from '@/utils/helper';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useEffect } from 'react';
import { useProfileStore, UserProfileType } from '../ui/homepage/store/user';

type ItemData = {
  title?: string;
  desc?: string;
  name: string;
  label: string;
  type?: string;
};

type EditProfileModalProps = {
  data?: {
    item?: ItemData;
  };
};

type FormValues = {
  [key: string]: string;
};

export default function EditProfileModal({ data }: EditProfileModalProps) {
  const item = data?.item;
  const { profileData, setProfileData } = useProfileStore();
  const { closeDialog } = useDialogStore();
  const userId = getCookie('appUserId');
  const { trigger, isPending } = useCustomMutation(ProfileInfoApi, {
    onSuccessCallback: data => {
      if (data) {
        closeDialog();
        setProfileData(data?.data as unknown as UserProfileType);
      }
    },
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: item?.name ? { [item.name]: '' } : {},
  });

  const onSubmit = (values: FormValues) => {
    trigger({
      userId,
      body: values,
    });
  };
  useEffect(() => {
    reset({
      ...profileData?.userinfo,
    });
  }, [profileData, reset]);
  if (!item?.name) return null; // Guard clause if no field name is provided

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-5 flex flex-col gap-4">
        <h1 className="text-[26px] font-semibold">{item.title ?? ''}</h1>
        <p className="text-[#6A6A6A]">{item.desc ?? ''}</p>

        <Controller
          name={item.name}
          control={control}
          rules={{ required: 'This field is required' }}
          render={({ field }) =>
            item?.name === 'intro' ? (
              <div className="flex flex-col gap-1">
                <textarea
                  id={item.name}
                  {...field}
                  className="border border-[#000] rounded p-2 rounded-md"
                  rows={4}
                />
                {errors[item.name]?.message && (
                  <p className="text-red-500 text-sm">
                    {errors[item.name]?.message as string}
                  </p>
                )}
              </div>
            ) : (
              <InputBox
                {...field}
                control={control}
                label={item.label ?? ''}
                type={item?.type === 'alphanumeric' ? 'alphanumeric' : 'text'}
                error={errors[item.name]?.message as FieldError | undefined}
              />
            )
          }
        />
      </div>

      <div className="p-5 flex justify-end">
        <Button type="submit" variant="black" loading={isPending}>
          Save
        </Button>
      </div>
    </form>
  );
}
