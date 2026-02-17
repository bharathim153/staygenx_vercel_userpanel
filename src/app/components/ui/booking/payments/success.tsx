'use client';
import ImageComponent from '@/app/components/image/imageComponent';
import React from 'react';
import Button from '@/shadcn/ui/Button';
import { useRouter } from 'next/navigation';

function Success() {
  const router = useRouter();
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <ImageComponent
        className="w-[200px] h-[200px]"
        src="/svg/pay.jpeg"
        alt="bookingSuccess"
        width={800}
        height={800}
      />
      <h4>{'Payment Successful!'}</h4>
      <b>{'Congratulations!'}</b>
      <p className=" max-w-[800px] text-center">
        {' '}
        Your booking has been successfully confirmed. We are thrilled to have
        you join us for an unforgettable experience. Below, you will find all
        the details for your upcoming visit.
      </p>
      <Button
        variant="gray"
        className="my-4"
        onClick={() => router.push('/user/trips')}
      >
        Booking Details
      </Button>
    </div>
  );
}

export default Success;
