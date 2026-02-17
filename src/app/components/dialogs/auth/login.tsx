'use client';

import { Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ProfileForm from './signup';
import InputBox from '../../ui/form';
import { useAuthStore } from '@/app/components/ui/homepage/store/auth';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { ApiResponse } from '@/utils/apiresponse';
import PhoneInputSection from '../../phoneInput';
import { generateGoogleOAuthUrl } from '@/utils/helper';
import { useRouter } from 'next/navigation';

import ForgotPassword from './forgotpassword';
import { useGlobalStore } from '@/lib/store/global-store';
import { useDialogStore } from '@/lib/store/dialog-store';
import Button from '@/shadcn/ui/Button';
import Verification from '../verification';
import Image from 'next/image';

type FormValues = {
  phoneCode?: string;
  phone?: string;
  password?: string;
  email?: string;
  resendEmail?: string;
};

export default function LoginForm() {
  const Router = useRouter();
  const { setTitle } = useGlobalStore();
  const [value, setValueComp] = useState('phone');
  const [form, setForm] = useState('login');
  const [formvalues, setFormValues] = useState({
    email: '',
    phoneCode: '',
    phone: '',
  });
  const { Exists, Login, passwordError, SendResetLink, SendOtpFn } =
    useAuthStore();
  const { trigger: sendotp } = useCustomMutation(SendOtpFn);
  const AuthUrl = generateGoogleOAuthUrl();
  const { setSuccessHeader } = useGlobalStore();
  const { closeDialog } = useDialogStore();
  const { trigger, isPending } = useCustomMutation(Exists, {
    onSuccessCallback: (data: ApiResponse) => {
      if (data?.data?.statusCode === 200) {
        if (data?.data?.status) {
          setForm('password');
          if (value === 'email') {
            setTitle('Paassword');
          } else {
            setTitle('confirm your number');
            sendotp({
              body: {
                phone: formvalues?.phone,
                phoneCode: formvalues?.phoneCode,
                verifyBy: 'phone',
              },
            });
          }
        } else {
          setForm('signup');
        }
      }
    },
  });

  const { trigger: LoginTrigger, isPending: LoginisPending } =
    useCustomMutation(Login);

  const { trigger: ResetlinkTrigger, isPending: ResetLinkPending } =
    useCustomMutation(SendResetLink, {
      onSuccessCallback: data => {
        if (data) {
          closeDialog();
          setSuccessHeader({
            header: true,
            content: 'A link to reset your password has been sent to ',
            email: getValues('resendEmail') ?? '',
          });
        }
      },
    });

  const isApi =
    form === 'login'
      ? isPending
      : form === 'forgot'
        ? ResetLinkPending
        : LoginisPending;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      phoneCode: 'India (+91)',
      phone: '',
      email: '',
    },
  });

  const handlePhoneChange = ({
    phoneCode,
    phone,
  }: {
    phoneCode: string;
    phone: string;
  }) => {
    setValue('phoneCode', phoneCode);
    setValue('phone', phone);
  };

  const onSubmit = async (data: { email?: string; password?: string }) => {
    if (form === 'login') {
      const body: FormValues = {};
      if (value === 'phone') {
        const phoneCode = getValues('phoneCode');
        const phone = getValues('phone');
        setFormValues({
          email: '',
          phoneCode: phoneCode ?? '',
          phone: phone ?? '',
        });
        body.phoneCode = phoneCode;
        body.phone = phone;
      } else {
        setFormValues({
          email: data?.email ?? '',
          phoneCode: '',
          phone: '',
        });
        body.email = data?.email;
      }
      trigger({ body });
    } else if (form === 'password') {
      const values: { phoneCode?: string; phone?: string; email?: string } = {};

      if (value === 'phone') {
        values.phoneCode = formvalues?.phoneCode;
        values.phone = formvalues?.phone;
      } else {
        values.email = formvalues?.email;
      }
      LoginTrigger({
        body: {
          ...values,
          password: data?.password,
        },
      });
    } else if (form === 'forgot') {
      const email = getValues('resendEmail') ?? '';
      ResetlinkTrigger({
        body: {
          email,
        },
      });
    }
  };

  useEffect(() => {
    if (form === 'password') {
      setError('password', {
        type: 'manual',
        message: passwordError ?? '',
      });
    }
  }, [form, passwordError, setError]);

  return (
    <>
      {
        <div className="w-full ">
          {form === 'login' && (
            <h2 className="text-2xl font-semibold mb-4">Welcome to StaygenX</h2>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="">
            {/* Login Form */}
            {form === 'login' &&
              (value === 'phone' ? (
                <PhoneInputSection
                  control={control}
                  errors={errors}
                  onPhoneChange={handlePhoneChange}
                />
              ) : (
                <div className="flex flex-col rounded-lg">
                  <div className="w-full mb-5">
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: 'Email is required',
                        pattern: {
                          value:
                            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                          message: 'Please enter a valid email address',
                        },
                      }}
                      render={field => (
                        <InputBox
                          {...field}
                          name="email"
                          label="Email"
                          type="email"
                          control={control}
                          error={errors.email}
                        />
                      )}
                    />
                  </div>
                </div>
              ))}

            {/* Disclaimer */}
            {form === 'login' && (
              <p className="text-xs text-gray-500 my-3">
                We&#39;ll call or text you to confirm your number. Standard
                message and data rates apply.{' '}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
              </p>
            )}

            {/* Password Form */}
            {form === 'password' &&
              (value === 'phone' ? (
                <Verification
                  props={{
                    values: {
                      phone: formvalues?.phone,
                      phoneCode: formvalues?.phoneCode,
                    },
                    isEmail: false,
                    isSignup: false,
                    login: true,
                  }}
                />
              ) : (
                <>
                  <div className="w-full mb-5">
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
                      <p className="text-red-600 text-sm mt-1">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>

                  <p
                    onClick={() => {
                      setForm('forgot');
                      setTitle('Forgetpassword');
                    }}
                    className="text-[13px] underline font-semibold mb-5 cursor-pointer"
                  >
                    Forgotten your password?
                  </p>
                </>
              ))}

            {form === 'forgot' && (
              <ForgotPassword control={control} errors={errors} />
            )}

            {/* Submit Button */}
            {(form === 'login' ||
              (form === 'password' && value !== 'phone') ||
              form === 'forgot') && (
              <Button
                variant="pink"
                loading={isApi}
                type="submit"
                className={`w-full rounded-lg  text-white font-semibold cursor-pointer  py-4 px-4 `}
              >
                <span>
                  {form === 'forgot' ? 'Send reset link' : 'Continue'}
                </span>
              </Button>
            )}
          </form>

          {form === 'login' && (
            <>
              <div className="flex items-center my-6">
                <div className="flex-grow border-t" />
                <span className="mx-4 text-sm text-gray-500">or</span>
                <div className="flex-grow border-t" />
              </div>

              <div className="space-y-3">
                <SocialButton
                  icon={value === 'phone' ? <Mail /> : <Phone />}
                  label={`Continue with ${value === 'email' ? 'phone' : 'email'}`}
                  value={value === 'phone' ? 'email' : 'phone'}
                  setValue={setValueComp}
                />
                <SocialButton
                  icon={<Mail />}
                  label={`Continue with Google`}
                  onClick={() => Router.push(AuthUrl)}
                  img={true}
                />
              </div>
            </>
          )}
        </div>
      }
      {/* {
                form === 'password' &&
                <div className="w-full p-5">
                    <Controller
                        name="password"
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="password"
                                placeholder="Password"
                                className={`${inputBaseClass} rounded-b-lg ${errors.password
                                    ? 'border-2 border-red-500 focus:outline-none'
                                    : 'focus:outline-none focus:ring-2 focus:ring-black'
                                    }`}
                            />
                        )}
                    />
                </div>
            } */}
      {form === 'signup' && (
        <ProfileForm formvalues={formvalues} value={value} />
      )}
    </>
  );
}

function SocialButton({
  icon,
  label,
  value,
  setValue,
  onClick,
  img = false,
}: {
  icon?: React.ReactNode;
  label?: string;
  value?: string;
  setValue?: (value: string) => void;
  onClick?: () => void; // ✅ Correct type
  img?: boolean;
}) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (setValue) {
      setValue(value ?? '');
    }
  };
  return (
    <Button
      onClick={handleClick}
      className="flex items-center justify-center w-full border rounded-lg py-4 px-4  transition relative "
      variant="gray"
    >
      {
        <span className="text-lg mr-3 absolute left-4">
          {img ? (
            <Image width={20} height={20} src="/svg/google.svg" alt="svg" />
          ) : (
            icon
          )}{' '}
        </span>
      }
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
