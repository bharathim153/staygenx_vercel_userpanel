'use client';

import { Controller, useForm } from 'react-hook-form';
import InputBox from '../../form';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useAuthStore } from '../../homepage/store/auth';
import { getCookie } from '@/utils/helper';
import ThreeDotLoader from '@/app/components/threedotLoader';
import { useEffect } from 'react';
import { ApiResponse } from '@/utils/apiresponse';
import Button from '@/shadcn/ui/Button';

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function UpdatePasswordForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>();

  const userId = getCookie('appUserId');
  const { ChangePassword, passwordError } = useAuthStore();
  const { trigger, isPending, isError } = useCustomMutation(ChangePassword, {
    onSuccessCallback: (data: ApiResponse) => {
      if (data) onSuccess();
    },
  });

  const onSubmit = (data: FormValues) => {
    trigger({
      userId,
      body: data,
    });
  };

  useEffect(() => {
    if (isError)
      setError('currentPassword', {
        type: 'manual',
        message: passwordError ?? '',
      });
  }, [passwordError, isError, setError]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
      <div className="flex flex-col gap-7 mt-4">
        <div>
          <Controller
            name="currentPassword"
            control={control}
            rules={{
              required: true,
            }}
            render={field => (
              <InputBox
                {...field}
                name="currentPassword"
                label="Current Password"
                type="password"
                control={control}
                error={errors.currentPassword}
              />
            )}
          />
          {errors?.currentPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors?.currentPassword?.message}
            </p>
          )}
        </div>

        {/* <div>
                <a href="#" className="text-sm text-teal-700 font-medium hover:underline">
                    Need a new password?
                </a>
            </div> */}

        <div>
          <Controller
            name="newPassword"
            control={control}
            rules={{
              required: true,
            }}
            render={field => (
              <InputBox
                {...field}
                name="newPassword"
                label="New Password"
                type="password"
                control={control}
                error={errors.newPassword}
              />
            )}
          />
          {errors?.newPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors?.newPassword?.message}
            </p>
          )}
        </div>

        <div>
          <Controller
            name="confirmNewPassword"
            control={control}
            rules={{
              required: true,
              validate: value =>
                value === watch('newPassword') || 'Passwords do not match',
            }}
            render={field => (
              <InputBox
                {...field}
                name="confirmNewPassword"
                label="Confirm NewPassword"
                type="password"
                control={control}
                error={errors.confirmNewPassword}
              />
            )}
          />
          {errors?.confirmNewPassword && (
            <p className="text-sm text-red-600 mt-1">
              {errors?.confirmNewPassword?.message}
            </p>
          )}
        </div>
        <div>
          <Button
            type="submit"
            variant="black"
            className="text-white font-semibold px-6 py-3 rounded-md hover:bg-gray-900 transition"
          >
            {isPending ? <ThreeDotLoader /> : 'Update password'}
          </Button>
        </div>
      </div>
    </form>
  );
}
