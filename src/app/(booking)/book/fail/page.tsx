import React from 'react';
import Image from 'next/image';

const BookingFail = () => {
  return (
    <div className="container mx-auto max-w-[1440px] p-4 h-[calc(100vh-145px)] flex justify-center items-center">
      <div className="w-full xl:max-xl flex flex-col justify-center items-center">
        <Image
          src="/images/fail.webp"
          alt="Payment illustration"
          width={260}
          height={260}
          className=" h-auto mx-auto"
        />
        <h4 className="text-xl sm:text-2xl font-bold mt-4">Payment failed!</h4>

        {/* <Button variant="pink">
                    Booking Details
                </Button> */}
      </div>
    </div>
  );
};

export default BookingFail;
