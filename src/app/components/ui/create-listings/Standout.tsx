'use client';

import { useContext, useLayoutEffect } from 'react';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import PageContext from '../../contextprovider';

export default function StandOut() {
  const { i18 } = useContext(PageContext);

  const Sandout =
    typeof i18?.CREATELISTING?.SANDOUT === 'object'
      ? i18.CREATELISTING.SANDOUT
      : {};
  const { setDisabled } = useListingContext();
  useLayoutEffect(() => {
    setDisabled(false);
  }, [setDisabled]);
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center w-full min-h-[400px]">
      <div className="w-full md:w-[38%] mb-8 md:mb-0">
        <div className="text-left md:pl-12">
          <div className="text-xl font-semibold mb-2">
            {(typeof Sandout?.STEP_LABEL === 'string' && Sandout?.STEP_LABEL) ||
              'Step 2'}
          </div>
          <h1 className="text-[48px] font-bold mb-6">
            {(typeof Sandout?.TITLE === 'string' && Sandout?.TITLE) ||
              'Make your place stand out'}
          </h1>
          <p className="text-xl text-gray-700">
            {(typeof Sandout?.DESC === 'string' && Sandout?.DESC) ||
              "In this step, you'll add some of the amenities your place offers, plus 5 or more photos. Then you’ll create a title and description."}
          </p>
        </div>
      </div>
      <div className="w-full md:w-[62%] flex justify-center">
        <video
          src="/images/step2.mp4"
          width={604}
          height={456}
          className="max-w-[85%] w-full rounded-lg"
          autoPlay
          muted
          playsInline
        />
        {/* <Image
          src="/images/step1.jpg"
          alt="Step 1"
          width={384}
          height={256}
          className="max-w-md w-full"
        /> */}
      </div>
    </div>
  );
}
