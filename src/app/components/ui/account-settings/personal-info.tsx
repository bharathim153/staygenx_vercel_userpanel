'use client';

import { useForm, Controller, Control, FieldValues } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { TextInput } from '../form';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useProfileStore } from '../homepage/store/user';
import PhoneInputSection from '../../phoneInput';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { getCookie } from '@/utils/helper';
import { PersonalInfoFormData } from '../homepage/store/type';
import PageContext from '../../contextprovider';
import Button from '@/shadcn/ui/Button';

export default function PersonalInfoForm() {
  const { profileData, UpdateProfile } = useProfileStore();
  const [isEditing, setIsEditing] = useState('');
  const Router = useRouter();
  const PhoneCode = profileData?.phone ? profileData?.phone : '';
  const PhoneNumber = profileData?.phone ? profileData?.phone : '';

  const defaultValues: PersonalInfoFormData = {
    firstName: profileData?.firstName ?? '',
    lastName: profileData?.lastName ?? '',
    preferredName: '',
    email: profileData?.email ?? '',
    phone: PhoneNumber ?? '',
    phoneCode: PhoneCode ?? '',
    address: '',
    emergencyContact: '',
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<PersonalInfoFormData>({
    defaultValues,
  });
  const userId = getCookie('appUserId');
  const { i18 } = useContext(PageContext);
  const PersonalInfo =
    typeof i18?.ACCOUNTSETTINGS?.PERSONALINFO?.LABEL === 'object'
      ? i18?.ACCOUNTSETTINGS?.PERSONALINFO
      : undefined;
  const PersonalInfoHelp =
    typeof i18?.ACCOUNTSETTINGS?.PersonalInfoHelp?.LABEL === 'object'
      ? i18?.ACCOUNTSETTINGS?.PersonalInfoHelp
      : undefined;
  const Comman = typeof i18?.COMMON ? i18?.COMMON?.LABEL : undefined;
  const { trigger, isPending } = useCustomMutation(UpdateProfile, {
    onSuccessCallback: data => {
      if (data) setIsEditing('');
      reset({
        firstName: data?.data?.firstName ?? '',
        lastName: data?.data?.lastName ?? '',
        preferredName: '',
        email: data?.data?.email ?? '',
        phone: data?.data?.phone ?? '',
        phoneCode: data?.data?.phone ?? '+91',
        address: '',
        emergencyContact: '',
      });
    },
    onErrorCallback: error => {
      console.log(error);
      setError('phone', {
        type: 'manual',
        message: typeof error === 'string' ? error : 'Something went wrong',
      });
    },
  });

  const fieldConfigs = [
    {
      label: PersonalInfo?.LEGELNAME ?? 'Legel Name',
      form: [
        {
          name: 'firstName',
          placeholder: 'First name on ID',
        },
        {
          name: 'lastName',
          placeholder: 'Last name on ID',
        },
      ],
      Value: `${profileData?.firstName ?? ''} ${profileData?.lastName ?? ''}`,
    },
    // {
    //   label: PersonalInfo?.PREFERREDFIRSTNAME ?? 'Preferred first name',
    //   form: [
    //     {
    //       name: 'preferredName',
    //       placeholder: 'Preferred name',
    //     }
    //   ],
    //   Value: ''
    // },
    {
      label: PersonalInfo?.EMAILADDRESS ?? 'Email address',
      form: [
        {
          name: 'email',
          placeholder: 'Email',
        },
      ],
      Value: profileData?.email ?? '',
    },
    {
      label: PersonalInfo?.PHONENUMBER ?? 'Phone number',
      form: [
        {
          name: 'phone',
          placeholder: 'Phone number',
        },
      ],
      Value: `${profileData?.phoneCode} ${profileData?.phone ?? ''}`,
    },
    // {
    //   label: 'Address',
    //   form: [
    //     {
    //       name: PersonalInfo?.ADDRESS ?? 'address',
    //       placeholder: 'Address',
    //     }
    //   ],
    //   Value: ''
    // },
    // {
    //   label: PersonalInfo?.EMERGENCYCONTACT ?? 'Emergency contact',
    //   form: [
    //     {
    //       name: 'emergencyContact',
    //       placeholder: 'Emergency contact',
    //     }
    //   ],
    //   Value: ''
    // },
  ];
  const onSubmit = async (data: PersonalInfoFormData) => {
    if (!data) return;

    const modifiedFields: Partial<PersonalInfoFormData> = {};

    Object.entries(data).forEach(([key, value]) => {
      const original = defaultValues[key as keyof PersonalInfoFormData];
      if (value !== original) {
        modifiedFields[key as keyof PersonalInfoFormData] = value;
        if (key === 'phone') {
          modifiedFields.phoneCode =
            data.phoneCode === '' ? '+91' : data.phoneCode;
        }
      }
    });

    if (Object.keys(modifiedFields).length > 0) {
      trigger({
        userId,
        body: modifiedFields as PersonalInfoFormData,
      });
    }
  };

  const handleClick = (label: string) => {
    setIsEditing(prev =>
      prev === (typeof label === 'string' ? label : '')
        ? ''
        : typeof label === 'string'
          ? label
          : ''
    );
  };

  useEffect(() => {
    reset({
      firstName: profileData?.firstName ?? '',
      lastName: profileData?.lastName ?? '',
      preferredName: '',
      email: profileData?.email ?? '',
      phone: PhoneNumber ?? '',
      phoneCode: PhoneCode ?? '+91',
      address: '',
      emergencyContact: '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto flex gap-6 p-6 space-y-8"
    >
      <Button
        variant="gray"
        onClick={() => Router.push('/account-settings')}
        className="w-9 h-9 p-2 flex md:hidden items-center justify-center rounded-full  shadow-sm"
      >
        <ArrowLeft size={18} />
      </Button>
      <div className="flex flex-col gap-6">
        <div className="flex  items-center">
          <h1 className="text-2xl font-semibold">Personal information</h1>
        </div>
        {Array.isArray(fieldConfigs) &&
          fieldConfigs.map((items, index) => {
            return (
              <div key={index} className="w-full border-b pb-5">
                <div className="flex justify-between">
                  <p className="text-[16px] font-semibold">
                    {typeof items?.label === 'string' ? items.label : ''}
                  </p>
                  <div
                    role="Button"
                    tabIndex={0}
                    onClick={() => handleClick(items?.label as string)}
                    className="text-[14px] font-medium underline cursor-pointer"
                  >
                    {isEditing === items?.label ? 'Cancel' : 'Edit'}
                  </div>
                </div>
                {isEditing === items?.label ? (
                  <div>
                    <div className="w-full mt-3 flex gap-3">
                      {Array.isArray(items?.form) &&
                        items.form.map(form =>
                          form?.name !== 'phone' ? (
                            <Controller
                              key={String(form?.name)}
                              name={form.name as keyof PersonalInfoFormData}
                              control={control}
                              render={({ field, fieldState }) => (
                                <TextInput
                                  {...field}
                                  label={form?.placeholder}
                                  type={
                                    form?.name === 'email' ? 'email' : 'text'
                                  }
                                  error={fieldState.error}
                                />
                              )}
                            />
                          ) : (
                            <PhoneInputSection
                              errors={errors}
                              key={String(form?.name)}
                              code={profileData?.phoneCode ?? '+91'}
                              control={
                                control as unknown as Control<FieldValues>
                              }
                            />
                          )
                        )}
                    </div>

                    <Button
                      loading={isPending}
                      variant="black"
                      className="mt-5 text-[16px] rounded-md px-4 py-2 text-[#fff]"
                    >
                      {typeof Comman?.SAVE === 'string' ? Comman.SAVE : 'Save'}
                    </Button>
                  </div>
                ) : (
                  <p className="text-[14px] text-[#6A6A6A]">
                    {items?.Value !== '' ? items?.Value : 'Not provided'}
                  </p>
                )}
              </div>
            );
          })}

        <div className="mt-10 space-y-4 border rounded-xl p-5 ">
          {[
            {
              title:
                PersonalInfoHelp?.WHY_INFO_HIDDEN_TITLE ??
                'Why isn’t my info shown here?',
              desc:
                PersonalInfoHelp?.WHY_INFO_HIDDEN_DESC ??
                'We’re hiding some account details to protect your identity.',
            },
            {
              title:
                PersonalInfoHelp?.EDITABLE_DETAILS_TITLE ??
                'Which details can be edited?',
              desc:
                PersonalInfoHelp?.EDITABLE_DETAILS_DESC ??
                'Contact info and personal details can be edited. If this info was used to verify your identity, you’ll need to get verified again the next time you book – or to continue hosting.',
            },
            {
              title:
                PersonalInfoHelp?.SHARED_INFO_TITLE ??
                'What info is shared with others?',
              desc:
                PersonalInfoHelp?.SHARED_INFO_DESC ??
                'Staygenx only releases contact information for Hosts and guests after a reservation is confirmed.',
            },
          ].map((item, index, arr) => (
            <div
              key={String(item.title)}
              className={`py-3 ${index === arr.length - 1 ? '' : 'border-b'} `}
            >
              <div className="font-bold text-gray-900 mb-1">
                {typeof item.title === 'string' ? item.title : ''}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {typeof item.desc === 'string' ? item.desc : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
