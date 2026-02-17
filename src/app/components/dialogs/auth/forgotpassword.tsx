import { Controller, FieldError } from 'react-hook-form';
import InputBox from '../../ui/form';

import { Control, FieldErrors } from 'react-hook-form';

type ForgotPasswordForm = {
  resendEmail: string;
};

type ForgotPasswordProps = {
  control: Control;
  errors: FieldErrors<ForgotPasswordForm>;
};

export default function ForgotPassword({
  control,
  errors,
}: ForgotPasswordProps) {
  return (
    <>
      <p className="text-[16px] mb-5">
        Enter the email address associated with your account, and we’ll email
        you a link to reset your password.
      </p>
      <div className="w-full mb-5">
        <Controller
          name="resendEmail"
          control={control}
          rules={{
            required: true,
          }}
          render={field => (
            <InputBox
              {...field}
              name="resendEmail"
              label="Email"
              type="email"
              control={control}
              error={errors.resendEmail as FieldError | undefined}
            />
          )}
        />
      </div>
    </>
  );
}
