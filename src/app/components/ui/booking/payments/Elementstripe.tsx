'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './Checkoutform';

interface ElementstripeProps {
  data: { client_secret: string };
}

const Elementstripe = ({ data }: ElementstripeProps) => {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
  const stripePromise = loadStripe(stripeKey);
  const [options, setOptions] = useState<{ clientSecret?: string }>({});
  useEffect(() => {
    if (!data || !data?.client_secret) {
      throw new Error('Payment method not found.');
    }
    setOptions({
      clientSecret: data?.client_secret,
    });
  }, [data]);

  return (
    <>
      {options.clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm data={data} />
        </Elements>
      )}
    </>
  );
};

export default Elementstripe;
