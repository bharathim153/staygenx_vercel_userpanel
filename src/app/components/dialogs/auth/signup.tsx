'use client';

import {
  useForm,
  SubmitHandler,
  Control,
  FieldValues,
  Controller,
} from 'react-hook-form';
import InputBox, { TextInput } from '../../ui/form';
import PhoneInputSection from '../../phoneInput';
import { useEffect, useState } from 'react';
import { useDialogStore } from '@/lib/store/dialog-store';
import Button from '@/shadcn/ui/Button';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useAuthStore } from '../../ui/homepage/store/auth';

interface SignUpFormInputs {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dob: string;
  phoneCode: string;
}

export default function ProfileForm({
  formvalues,
  value,
}: {
  formvalues: { email: string; phoneCode: string; phone: string };
  value: string;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormInputs>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: formvalues?.email ?? '',
      phone: formvalues?.phone ?? '',
      phoneCode: formvalues?.phoneCode ?? '',
      password: '',
      confirmPassword: '',
      dob: '',
    },
  });

  const [signupvalues, setSignupvalues] = useState({});

  const { openDialogNested } = useDialogStore();
  const { SendOtpFn } = useAuthStore();
  const { trigger, isPending } = useCustomMutation(SendOtpFn, {
    onSuccessCallback: data => {
      if (data)
        openDialogNested('EmailVerify', {
          values: signupvalues,
          isEmail: value === 'email',
        });
    },
  });
  const onSubmit: SubmitHandler<SignUpFormInputs> = data => {
    const combined = {
      ...data,
      ...(formvalues?.email
        ? { email: formvalues.email }
        : formvalues?.phone
          ? { phone: formvalues.phone, phoneCode: formvalues?.phoneCode }
          : {}),
    };

    const values = Object.fromEntries(
      Object.entries(combined).filter(
        ([key, value]) =>
          !(key === 'email' && !value) && !(key === 'phone' && !value)
      )
    );
    const body =
      values?.email !== '' && values?.email !== undefined
        ? { email: values.email, verifyBy: 'email' }
        : {
            phone: values.phone,
            phoneCode: values.phoneCode,
            verifyBy: 'phone',
          };

    trigger({ body });
    setSignupvalues(values);
    // trigger({ body: values });
  };

  useEffect(() => {
    reset({
      email: formvalues?.email,
      phone: formvalues?.phone,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formvalues]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-h-full md:max-h-[600px] overflow-auto space-y-6 scrollbar-hide"
    >
      {/* Legal Name */}
      <div>
        <h2 className="text-lg font-medium mb-2">Legal name</h2>
        <div
          className={`border ${errors.firstName || errors.lastName ? 'border-[#FF0000]' : 'border-[#000]'} rounded-lg`}
        >
          <InputBox
            name="firstName"
            label="First Name"
            control={control}
            error={errors.firstName}
            className=" rounded-t-md"
            borderClass="border-none"
          />
          <hr
            className={`${errors.firstName || errors.lastName ? 'border-t-[#FF0000]' : 'border-t-[#000]'}`}
          />
          <InputBox
            name="lastName"
            label="Last Name"
            control={control}
            error={errors.lastName}
            className=" rounded-b-md"
            borderClass="border-none"
          />
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Make sure this matches the name on your government ID. If you go by
          another name, you can add a{' '}
          <a href="#" className="underline">
            preferred first name
          </a>
          .
        </p>
      </div>

      {/* Date of Birth */}
      <div>
        <h2 className="text-lg font-medium mb-2">Date of birth</h2>
        <Controller
          name="dob"
          control={control}
          rules={{
            required: 'Date of birth is required',
            validate: value => {
              if (!value) return true; // already covered by `required`
              const dob = new Date(value);
              const today = new Date();

              const age = today.getFullYear() - dob.getFullYear();
              const hasBirthdayPassedThisYear =
                today.getMonth() > dob.getMonth() ||
                (today.getMonth() === dob.getMonth() &&
                  today.getDate() >= dob.getDate());

              const actualAge = hasBirthdayPassedThisYear ? age : age - 1;

              return actualAge >= 18 || 'You must be at least 18 years old';
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <>
              <input
                {...field}
                type="date"
                max={new Date().toISOString().split('T')[0]}
                className={`w-full p-4 border rounded-lg focus:outline-none ${
                  error ? 'border-red-500' : 'border-[#000]'
                }`}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
              )}
            </>
          )}
        />

        <p className="text-sm text-gray-600 mt-2">
          To sign up, you need to be at least 18. Your birthday won’t be shared
          with other people who use StaygenX.
        </p>
      </div>

      {/* Contact Info */}
      <div>
        <h2 className="text-lg font-medium mb-2">Contact info</h2>
        {formvalues?.email !== '' ? (
          <TextInput
            type="emai"
            label="Email"
            value={formvalues?.email ?? ''}
            readOnly={true}
          />
        ) : (
          <PhoneInputSection
            control={control as unknown as Control<FieldValues>}
            code={formvalues?.phoneCode ?? ''}
            phoneno={formvalues?.phone ?? ''}
            readonly={true}
            errors={errors}
          />
        )}

        <p className="text-sm text-gray-600 mt-2">
          {` We’ll ${formvalues?.email === '' ? 'sms' : 'email'}  you trip confirmations and receipts.`}
        </p>
      </div>

      {/* Password */}
      {value !== 'phone' && (
        <div>
          <h2 className="text-lg font-medium mb-2">Password</h2>
          <InputBox
            name="password"
            label="Password"
            type="password"
            control={control}
            error={errors.password}
          />
        </div>
      )}

      <Button
        loading={isPending}
        variant="pink"
        type="submit"
        className={`w-full rounded-lg  text-white font-semibold cursor-pointer  py-4 px-4 `}
      >
        {'Continue'}
      </Button>
    </form>
  );
}
