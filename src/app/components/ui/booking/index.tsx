'use client';

import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import Button from '@/shadcn/ui/Button';
// import Image from 'next/image';
import { SingleListing } from '@/services/listing/getapis';
import { useListingStore } from '../create-listings/store';
import ImageComponent from '../../image/imageComponent';
import { EstimationApi } from '@/services/bookings';
import { useEstimationStore } from './store/estimation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { usePaymentStore } from './store/payments';
import ThreeDotLoader from '../../threedotLoader';

interface BookingFormProps {
  id: string;
}

const BookingForm = ({ id }: BookingFormProps) => {
  const Router = useRouter();
  const { ListingData } = useListingStore();
  const { estimationData } = useEstimationStore();
  const { PostInitiateBooking } = usePaymentStore();
  const searchParams = useSearchParams();

  const { trigger, isPending } = useCustomMutation(PostInitiateBooking, {
    onSuccessCallback: () => {
      Router.push(`/book/payments?id=${id}&${searchParams.toString()}`);
    },
  });

  const StartDateStr = searchParams.get('startDate') ?? '';
  const EndDateStr = searchParams.get('endDate') ?? '';
  const StartDate = StartDateStr ? new Date(StartDateStr) : null;
  const EndDate = EndDateStr ? new Date(EndDateStr) : null;
  const adult = searchParams.get('adults') ?? '1';
  const children = searchParams.get('children') ?? '0';
  // const infant = searchParams.get('infants') ?? "0";
  // const pet = searchParams.get('pets') ?? "0";

  const handleClick = () => {
    trigger({
      body: {
        amount: estimationData?.total,
        currency: 'usd',
      },
    });
  };

  useEffect(() => {
    SingleListing({ listingId: id });
  }, [id]);

  useEffect(() => {
    if (StartDateStr && EndDateStr) {
      EstimationApi({
        body: {
          listingId: id,
          checkInDate: StartDateStr || '',
          checkOutDate: EndDateStr || '',
          guestCount: parseInt(adult) + parseInt(children),
        },
      });
    }
  }, [StartDateStr, EndDateStr, id, adult, children]);
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-8">
        {/* Left Section */}
        <div className="w-full md:w-1/2 md:pr-12">
          <div className="flex items-center mb-8">
            <button
              onClick={() => Router?.back()}
              className="rounded-full bg-gray-100 p-2 mr-4 hover:bg-gray-200"
              aria-label="Back"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-2xl font-semibold">Confirm and pay</h2>
          </div>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-1">Proceed to payment</h3>
            <p className="text-sm text-gray-700 mb-2">
              You’ll be directed to Stripe to complete payment.
            </p>
            <hr className="my-4" />
            <p className="text-xs text-gray-500 mb-5">
              By selecting the button, I agree to the{' '}
              <a href="#" className="underline">
                booking terms
              </a>

            </p>
            <Button
              variant="black"
              className="bg-[#e41e28] w-full rounded-lg py-3 text-white text-lg font-semibold flex items-center justify-center mt-10"
              style={{
                backgroundColor: '#e41e28cc'
              }}
              onClick={handleClick}
              disabled={isPending}
            >
              {isPending ? (
                <ThreeDotLoader variant="white" />
              ) : (
                <>
                  Continue to Stripe
                  {/* <span className="ml-2 flex items-center">
                    <img src="/svg/Stripe.svg" alt="Stripe" className="h-5 w-auto" />
                  </span> */}
                </>
              )}
            </Button>
          </div>
        </div>
        {/* Right Section */}
        <div className="w-full md:w-2/5 md:ml-auto border rounded-xl p-6 space-y-4 shadow-sm bg-white md:sticky md:top-20 md:self-start">
          {/* Card */}
          <div className="flex gap-4 items-center mb-4">
            <ImageComponent
              src={
                ListingData?.images && ListingData.images.length > 0
                  ? ListingData.images[0]
                  : '/images/placeholder.png'
              }
              alt="Room"
              className="h-20 w-20 rounded-lg object-cover"
              width={80}
              height={80}
            />
            <div className="flex flex-col gap-1">
              <h4 className="font-semibold text-gray-800 text-base">
                {ListingData?.description?.title ||
                  'Cozy Penthouse-Style 1 BHK'}
              </h4>
              <div className="flex items-center text-xs text-gray-600 gap-1">
                <span>★ 4.96 (110)</span>
                <span className="mx-1">·</span>
                <span>Guest favourite</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-700 mb-2">
            <span className="font-semibold">Free cancellation</span>
            <br />
            Cancel before 29 January for a full refund.{' '}
            <a href="#" className="underline">
              Full policy
            </a>
          </div>
          <div className="flex justify-between items-center text-sm py-2 border-b">
            <div>
              <div className="font-semibold">Dates</div>
              <div>
                {StartDate && EndDate
                  ? `${format(StartDate, 'dd MMM')} – ${format(EndDate, 'dd MMM yyyy')}`
                  : 'Select dates'}
              </div>
            </div>
            <Button variant="gray" className="text-xs px-3 py-1">
              Change
            </Button>
          </div>
          <div className="flex justify-between items-center text-sm py-2 border-b">
            <div>
              <div className="font-semibold">Guests</div>
              <div>{parseInt(adult) + parseInt(children)} adult</div>
            </div>
            <Button variant="gray" className="text-xs px-3 py-1">
              Change
            </Button>
          </div>
          <div className="py-2">
            <div className="font-semibold text-sm mb-2">Price details</div>
            <div className="flex justify-between text-sm">
              <span>
                {estimationData?.nights} nights × ₹
                {estimationData?.perDayRates?.[0]?.rate}
              </span>
              <span>₹{estimationData?.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxes</span>
              <span>₹{estimationData?.guestServiceFee || '0'}</span>
            </div>
          </div>
          <div className="flex justify-between text-base font-semibold border-t pt-4">
            <span>Total INR</span>
            <span>₹{estimationData?.total}</span>
          </div>
          <Button
            variant="gray"
            className="text-xs underline w-full text-left px-0"
          >
            Price breakdown
          </Button>
        </div>
      </div>
      {/* Rare find banner */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-lg text-sm font-medium">
          <ImageComponent
            src="/svg/diamond.svg"
            alt="Rare"
            className="h-5 w-5"
            width={20}
            height={20}
          />
          Rare find! This place is usually booked
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
