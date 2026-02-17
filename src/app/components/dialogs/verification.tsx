'use client';

import { useEffect, useState } from 'react';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useAuthStore } from '../ui/homepage/store/auth';
import OtpInput from '../otpinput';
import { useDialogStore } from '@/lib/store/dialog-store';
import Button from '@/shadcn/ui/Button';
import ThreeDotLoader from '../threedotLoader';
import { useProfileStore } from '../ui/homepage/store/user';
import { getCookie, setCookie } from '@/utils/helper';
import { useGlobalStore } from '@/lib/store/global-store';
import { AuthResponse } from '../ui/homepage/store/type';

export interface SignUpFormInputs {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  dob?: string;
  phoneCode?: string;
}

interface VerificationProps {
  props: {
    values: SignUpFormInputs;
    isEmail: boolean;
    isSignup?: boolean;
    login?: boolean;
  };
}

interface OtpRequestBody {
  email?: string;
  phone?: string;
  phoneCode?: string;
  verifyBy: 'email' | 'phone';
  otp?: string;
}

export default function Verification({ props }: VerificationProps) {
  const userId = getCookie('userId') || '';
  const { values, isEmail, isSignup = true, login = false } = props;

  const [otp, setOtp] = useState('');
  const { SendOtpFn, VerifyOtp, Signup } = useAuthStore();
  const { closeDialogNested } = useDialogStore();

  const { trigger, isPending } = useCustomMutation(SendOtpFn);
  const { trigger: SignupTrigger } = useCustomMutation(Signup);

  const { trigger: verifyotp, isPending: verifyPending } = useCustomMutation(
    VerifyOtp,
    {
      onSuccessCallback: data => {
        if (data) {
          closeDialogNested();
          if (isSignup) {
            SignupTrigger({
              body: {
                ...values,
                password:
                  values.password && values.password.trim() !== ''
                    ? values.password
                    : '12345678',
              },
            });
          } else if (login) {
            if (data?.data?.statusCode === 200) {
              const res = data?.data as unknown as AuthResponse;
              setCookie('appToken', res.data.token, 1);
              setCookie('appUserId', res.data.user._id, 1);

              useGlobalStore.getState().setIsLoggedIn(true);

              useProfileStore.getState().setProfileData({
                ...res.data.user,
                userinfo: res.data.user.userinfo
                  ? Object.fromEntries(
                      Object.entries(res.data.user.userinfo).map(([k, v]) => [
                        k,
                        v == null ? '' : String(v),
                      ])
                    )
                  : null,
              });

              useDialogStore.getState().closeDialog();
            }
          } else {
            if (data?.data?.statusCode === 200)
              useProfileStore.getState().fetchProfile({ body: { userId } });
          }
        }
      },
    }
  );

  const ResendOtp = () => {
    if (!values && isPending) return;

    const body: OtpRequestBody = isEmail
      ? { email: values.email, verifyBy: 'email' }
      : { phone: values.phone, phoneCode: values.phoneCode, verifyBy: 'phone' };

    trigger({ body });
  };

  const isOtpValid = otp.length === 6;

  useEffect(() => {
    if (isOtpValid) {
      const body: OtpRequestBody = isEmail
        ? {
            email: values.email,
            verifyBy: 'email',
            otp,
          }
        : {
            phone: values.phone,
            phoneCode: values.phoneCode,
            verifyBy: 'phone',
            otp,
          };

      verifyotp({ body });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOtpValid]);
  console.log('props', props);
  if (!props?.values || typeof props.isEmail !== 'boolean') return null;

  return (
    <div className="text-start space-y-4">
      {!login && (
        <h2 className="text-2xl font-semibold">Enter your verification code</h2>
      )}

      <p className="text-gray-600">
        {isEmail ? (
          <>
            Enter the code we&apos;ve emailed to{' '}
            <span className="font-medium">{values.email}</span>.
          </>
        ) : (
          <>
            Enter the code we&apos;ve sent to phone number{' '}
            <span className="font-medium">
              {values.phoneCode ?? ''}&nbsp;{values.phone}
            </span>
            .
          </>
        )}
      </p>
      {isPending || verifyPending ? (
        <ThreeDotLoader />
      ) : (
        <OtpInput otp={(value: string) => setOtp(prev => prev + value)} />
      )}

      <div className="text-sm text-gray-600 my-4">
        Haven&apos;t received an {`${isEmail ? 'email?' : 'Sms?'}`}{' '}
        <Button
          onClick={() => ResendOtp()}
          className="font-medium text-black hover:underline"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
