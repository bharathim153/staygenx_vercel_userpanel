'use client';

import { useContext, useLayoutEffect } from 'react';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import PageContext from '../../contextprovider';

export default function FinishSetup() {
  const { i18 } = useContext(PageContext);

  const { setDisabled } = useListingContext();
  useLayoutEffect(() => {
    setDisabled(false);
  }, [setDisabled]);
  const finishsetup =
    typeof i18?.CREATELISTING?.FINISHSETUP === 'object'
      ? i18.CREATELISTING.FINISHSETUP
      : {};
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center w-full h-full">
      <div className="w-full md:w-[40%] mb-8 md:mb-0">
        <div className="text-left md:pl-12">
          <div className="text-xl font-semibold mb-2">
            {(typeof finishsetup?.STEP_LABEL === 'string' &&
              finishsetup?.STEP_LABEL) ||
              'Step 1'}
          </div>
          <h1 className="text-[43px] font-bold mb-6">
            {(typeof finishsetup?.TITLE === 'string' && finishsetup?.TITLE) ||
              'Tell us about your place'}
          </h1>
          <p className="text-xl text-gray-700">
            {(typeof finishsetup?.DESC === 'string' && finishsetup?.DESC) ||
              "In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay."}
          </p>
        </div>
      </div>
      <div className="w-full md:w-[60%] flex justify-center">
        {/* <Image
          src="/images/step1.jpg"
          alt="Step 1"
          width={384}
          height={256}
          className="max-w-md w-full"
        /> */}
        <video
          src="/images/step2.mp4"
          width={704}
          height={556}
          className="max-w-[85%] w-full rounded-lg"
          autoPlay
          muted
          playsInline
        />
      </div>
    </div>
  );
}
