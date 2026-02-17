'use client';

import { useForm, Controller } from 'react-hook-form';
import InputBox from '../form';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useAuthStore } from '../homepage/store/auth';
import { useRouter } from 'next/navigation';
import Button from '@/shadcn/ui/Button';

type FormValues = {
  password: string;
  confirmPassword: string;
};

export default function UpdatePasswordForm() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const Router = useRouter();
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const token = searchParams?.get('token') ?? '';
  const { ResetPassword } = useAuthStore();
  const { trigger, isPending } = useCustomMutation(ResetPassword, {
    onSuccessCallback: data => {
      if (data) {
        Router.push('/');
      }
    },
  });

  const onSubmit = (data: FormValues) => {
    trigger({
      body: {
        token,
        newPassword: data.password,
        confirmNewPassword: data.confirmPassword,
      },
    });
  };

  return (
    <div className=" h-[calc(100vh_-_90px)] flex items-center justify-center p-5">
      <div className="min-w-full sm:min-w-xl p-8 border rounded-xl shadow-sm bg-white">
        <h2 className="text-lg font-semibold text-center mb-4">
          Update password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Password */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'Password is required',
            }}
            render={({}) => (
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={field => (
                    <InputBox
                      {...field}
                      name="password"
                      label="Password"
                      type="password"
                      control={control}
                      error={errors.password}
                    />
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Confirm Password */}
          <Controller
            control={control}
            name="confirmPassword"
            rules={{
              required: 'Please confirm your password',
              validate: value =>
                value === watch('password') || 'Passwords do not match',
            }}
            render={({}) => (
              <div className="relative">
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={field => (
                    <InputBox
                      {...field}
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      control={control}
                      error={errors.password}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Submit Button */}
          <Button
            variant="black"
            loading={isPending}
            type="submit"
            className="w-full py-3 text-white font-medium rounded-md hover:bg-gray-800 transition"
          >
            Update
          </Button>
        </form>
      </div>
    </div>
  );
}
