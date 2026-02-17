'use client';

import { useCustomeQuery } from '@/hooks/useCustomeQuery';
import { SingleListing } from '@/services/listing/getapis';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ThreeDotLoader from '../../threedotLoader';
import { useProfileStore } from '../homepage/store/user';
import { useListingStore } from '../create-listings/store';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useAuthStore } from '../homepage/store/auth';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import Image from 'next/image';
import { useEffect } from 'react';
import { getCookie } from '@/utils/helper';

export interface DocumentVerificationData {
  status?: string;
  [key: string]: unknown;
}

export interface DocumentVerificationResponse {
  data?: DocumentVerificationData;
  [key: string]: unknown;
}

export default function VerifyListing() {
  const { ListingData } = useListingStore();
  const params = useParams();
  const id = params?.id ?? '';
  const [value, setValue] = useState('');
  const [documentVerification, setDocumentVerification] =
    useState<DocumentVerificationResponse | null>(null);
  // const { ListingData, SetListingData } = useListingStore();
  // console.log('ListingData', ListingData);
  const { profileData } = useProfileStore();
  const { openDialogNested } = useDialogStore();
  const { SendOtpFn } = useAuthStore();
  const { isPending: otpPending, trigger } = useCustomMutation(SendOtpFn, {
    onSuccessCallback: data => {
      if (data)
        openDialogNested('EmailVerify', {
          values: {
            email: profileData?.email ?? '',
            phone: profileData?.phone ?? '',
            phoneCode: profileData?.phoneCode ?? '',
          },
          isEmail: value === 'email',
          isSignup: false,
        });
    },
  });

  // Fetch document verification status on mount or when id changes
  const token = getCookie('appToken');
  console.log('token', token);
  useEffect(() => {
    if (!id) return;
    const fetchVerificationStatus = async () => {
      try {
        // Get token from auth store

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const url = `${baseUrl}document-verification/${id}/status`;
        const res = await fetch(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        if (res.status === 401) {
          console.error('401 Unauthorized: Token missing or invalid');
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch verification status');
        const data = await res.json();
        console.log('Document Verification Status:', data);
        // Store documentVerification data in its own state
        setDocumentVerification(data);
      } catch (error) {
        console.error('Error fetching verification status:', error);
      }
    };
    fetchVerificationStatus();
  }, [token, id]);

  const steps = [
    {
      title: 'Verify your identity',
      description: 'We’ll gather some information to help confirm you’re you.',
      path: `/account-fov?listingid=${id}`,
      status: documentVerification?.data?.status ?? '',
    },
    {
      title: 'Let us know it’s really you',
      description:
        'To continue, you’ll need to confirm your account through one of the following options.',
      status: profileData?.emailVerified ? 'Verified' : 'Pending',
      value: 'email',
    },
    {
      title: 'Confirm your phone number',
      description:
        "We'll call or text you to confirm your number. Standard messaging rates apply.",
      status: profileData?.phoneVerified ? 'Verified' : 'Pending',
      value: 'phone',
    },
  ];

  const Router = useRouter();
  const getImageUrl = () => {
    const firstImage = ListingData?.images?.[0];
    return firstImage
      ? process.env.NEXT_PUBLIC_IMAGE_URL + firstImage
      : '/placeholder.jpg';
  };

  const enable = id !== '';

  const { isPending } = useCustomeQuery(
    ['singlelisting'],
    () => SingleListing({ listingId: id as string }),
    {
      enabled: enable,
    }
  );

  const handleVerify = (value: string) => {
    setValue(value);
    const body =
      value === 'email'
        ? {
            email: profileData?.email ?? '',
            verifyBy: 'email',
          }
        : { phone: profileData?.phone, phoneCode: '91', verifyBy: 'phone' };

    trigger({ body });
  };

  return (
    <div className="max-w-7xl mx-auto  gap-8 flex items-center justify-center h-full overflow-auto w-full">
      {otpPending && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <ThreeDotLoader />
        </div>
      )}

      <div className="w-full p-4">
        <h2 className="text-2xl font-semibold mb-4">
          Key details to take care of
        </h2>
        <div className="flex md:hidden border gap-2 p-2 rounded-lg ">
          {isPending ? (
            <ThreeDotLoader />
          ) : (
            <>
              <Image
                src={getImageUrl()}
                alt="images"
                className="object-cover rounded-lg"
                width={70}
                height={50}
              />
              <div className="p-4">
                <p className="font-semibold">
                  {ListingData?.description?.title ?? ''}
                </p>
                <p className="text-sm text-gray-600 w-[200px] sm:w-full truncate">
                  {ListingData?.location?.address ?? ''}
                </p>
              </div>
            </>
          )}
        </div>
        <div className="mt-4">
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() =>
                step?.path
                  ? Router.push(step?.path)
                  : handleVerify(step?.value ?? '')
              }
              className="border-b pb-6 cursor-pointer group hover:bg-gray-50 p-2 rounded-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-gray-600 mt-1  w-[200px] sm:w-full truncate">
                    {step.description}
                  </p>
                  <p className="text-xs text-black font-semibold mt-2">
                    {step?.status}
                  </p>
                </div>
                <div className="">
                  <ChevronRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:block  flex justify-center items-center">
        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm w-[340px]">
          {isPending ? (
            <div className="h-[250px] flex items-center justify-center">
              <ThreeDotLoader />
            </div>
          ) : (
            <>
              <Image
                src={getImageUrl()}
                alt="image"
                className="w-full h-48 object-cover"
                width={800}
                height={800}
              />
              <div className="p-4">
                <p className="font-semibold">
                  {ListingData?.description?.title ?? ''}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {ListingData?.location?.address ?? ''}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
