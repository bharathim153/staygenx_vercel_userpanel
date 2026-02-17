'use client';
import React from 'react';
import Image from 'next/image';
import Button from '@/shadcn/ui/Button';
import { useRouter } from 'next/navigation';

const BookingSuccess = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto max-w-[1440px] p-8 mb-32">
      <div className="w-full xl:max-xl flex flex-col justify-center items-center">
        <Image
          src="/images/image.jpeg"
          alt="Payment illustration"
          width={260}
          height={260}
          className=" h-auto mx-auto"
        />
        <h4 className="text-xl sm:text-2xl font-bold mt-4">
          Payment Successful!
        </h4>
        <p
          className="mt-2 text-black text-base sm:text-lg max-w-sm sm:max-w-[1100px] mx-auto px-2 
leading-relaxed sm:leading-loose"
        >
          <strong>Congratulations!</strong> Your booking has been successfully
          confirmed. We are thrilled to have you join us for an unforgettable
          aquatic experience. Below, you will find all the essential details for
          your upcoming adventure:
        </p>

        <Button
          variant="pink"
          onClick={() => router.push('/book')}
          className="mt-5 p-3"
        >
          Booking Details
        </Button>
      </div>
    </div>
  );
};

export default BookingSuccess;
