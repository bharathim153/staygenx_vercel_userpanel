'use client';

import React, { Suspense, useEffect } from 'react';
import Elementstripe from './Elementstripe';
import { usePaymentStore } from '../store/payments';
import { useRouter } from 'next/navigation';

function FallbackComponent() {
  return <div>Loading payment...</div>;
}

type StripeBookingData = { client_secret: string };

function hasClientSecret(data: unknown): data is StripeBookingData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'client_secret' in data &&
    typeof (data as { client_secret?: unknown }).client_secret === 'string'
  );
}

const StripPayment = () => {
  const router = useRouter();
  const { initiateBooking } = usePaymentStore();

  useEffect(() => {
    if (!hasClientSecret(initiateBooking)) {
      router.replace('/book/fail');
    }
  }, [initiateBooking, router]);

  if (!hasClientSecret(initiateBooking)) {
    return null;
  }

  return (
    <Suspense fallback={<FallbackComponent />}>
      <div>
        <Elementstripe data={initiateBooking} />
      </div>
    </Suspense>
  );
};

export default StripPayment;
