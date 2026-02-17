'use client';

import { useContext, useLayoutEffect } from 'react';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import PageContext from '../../contextprovider';

export default function AboutYourPlace() {
  const { i18 } = useContext(PageContext);

  const AboutYourPlaceData =
    typeof i18?.CREATELISTING?.ABOUTYOURPLACE === 'object'
      ? i18.CREATELISTING.ABOUTYOURPLACE
      : {};

  const { setDisabled } = useListingContext();
  useLayoutEffect(() => {
    setDisabled(false);
  }, [setDisabled]);
  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center w-full h-full">
      <div className="w-full md:w-[45%] mb-8 md:mb-0">
        <div className="text-left md:pl-12">
          <div className="text-xl font-semibold mb-2">
            {(typeof AboutYourPlaceData?.STEP_LABEL === 'string' &&
              AboutYourPlaceData?.STEP_LABEL) ||
              'Step 1'}
          </div>
          <h1 className="text-[48px] font-bold mb-6">
            {(typeof AboutYourPlaceData?.TITLE === 'string' &&
              AboutYourPlaceData?.TITLE) ||
              'Tell us about your place'}
          </h1>
          <p className="text-xl text-gray-700">
            {(typeof AboutYourPlaceData?.DESC === 'string' &&
              AboutYourPlaceData?.DESC) ||
              "In this step, we'll ask you which type of property you have and if guests will book the entire place or just a room. Then let us know the location and how many guests can stay."}
          </p>
        </div>
      </div>
      <div className="w-full md:w-[55%] flex justify-center">
        <video
          src="/images/step1.mp4"
          width={584}
          height={456}
          className="max-w-[80%] w-full rounded-lg"
          autoPlay
          muted
          playsInline
        />
      </div>
    </div>
  );
}
