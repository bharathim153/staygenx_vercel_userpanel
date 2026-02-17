import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import StepNavigation from '../../ui/create-listings/StepNavigation';
import { useListingContext } from './ListingContext';
import { useCreateListingApi } from '../../ui/create-listings/store/api';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { getCookie } from '@/utils/helper';

export const stepMap = [
  'overview',
  'about-your-place',
  'structure',
  'privacy-type',
  'location',
  'floor-plan',
  'stand-out',
  'amenities',
  'photos',
  'title',
  'description',
  'finish-setup',
  'instant-book',
  'price',
  'weekend-price',
  'legal-and-create',
  'house-Rules',
];

export default function Footer() {
  const UserId = getCookie('appUserId');
  const router = useRouter();
  const pathname = usePathname();

  const [listingId, setListingId] = useState<string | string>('');
  const { CreateListing } = useCreateListingApi();
  const { trigger, isPending } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      setListingId(data?.data?._id as string);
      if (currentStep < 15) {
        router.push(
          `/become-a-host/${data?.data?._id}/${stepMap[currentStep + 1]}`
        );
      } else {
        router.push('/hosting/listing');
      }
    },
  });
  const { disabled } = useListingContext();

  const currentStep = useMemo(() => {
    if (!pathname || !listingId) return 0;
    const idx = stepMap.findIndex(
      path => pathname === `/become-a-host/${listingId}/${path}`
    );
    return idx === -1 ? 0 : idx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, stepMap, listingId]);

  const extractedId = useMemo(() => {
    const parts = pathname.split('/');
    return parts[2] || '';
  }, [pathname]);

  const handleNext = () => {
    if (
      (currentStep === 0 && listingId) ||
      currentStep === 1 ||
      currentStep === 6 ||
      currentStep === 9 ||
      currentStep === 11 ||
      currentStep === 13
    ) {
      if (currentStep < stepMap.length - 1 && listingId) {
        router.push(`/become-a-host/${listingId}/${stepMap[currentStep + 1]}`);
      }
    } else {
      const data: Partial<{ listingId: string; userId: string }> = {};

      if (listingId) {
        data.listingId = listingId;
      } else {
        data.userId = UserId;
      }

      trigger({
        data,
        step: currentStep,
        isEdit: false,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      router.push(`/become-a-host/${listingId}/${stepMap[currentStep - 1]}`);
    }
  };

  const fillPercent = currentStep * 6.6;

  useEffect(() => {
    if (extractedId !== stepMap[0]) setListingId(extractedId ?? '');
  }, [extractedId]);

  return (
    <>
      <div
        className="w-full relative mb-2"
        style={{
          position: 'fixed',
          left: 0,
          bottom: 90,
          zIndex: 40,
          background: 'white',
          height: '6px',
          margin: '0 auto',
        }}
      >
        <div className="absolute left-0 top-0 w-full h-full bg-gray-200 rounded-full" />
        <div
          className="absolute left-0 top-0 h-full bg-black rounded-full transition-all duration-300"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      {/* Show only Get started button for step 0, Back/Next for step 1 and onward */}
      {currentStep === 0 ? (
        <StepNavigation
          onNext={handleNext}
          nextLabel="Get started"
          isBackHidden={true}
          isNextDisabled={false}
          currentStep={currentStep}
          loading={isPending}
        />
      ) : (
        <StepNavigation
          onBack={handleBack}
          onNext={handleNext}
          backLabel="Back"
          nextLabel={
            currentStep === stepMap.length - 1 ? 'Create Listing' : 'Next'
          }
          isBackHidden={false}
          isNextDisabled={disabled ?? false}
          currentStep={currentStep}
          loading={isPending}
        />
      )}
    </>
  );
}
