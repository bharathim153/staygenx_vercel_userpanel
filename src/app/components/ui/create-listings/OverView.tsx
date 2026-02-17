'use client';

import { useContext } from 'react';
import PageContext from '../../contextprovider';
import Image from 'next/image';

export default function OverView() {
  const { i18 } = useContext(PageContext);
  const Overview =
    typeof i18?.CREATELISTING?.OVERVIEW === 'object'
      ? i18?.CREATELISTING?.OVERVIEW
      : {};

  const StepsList =
    typeof i18?.CREATELISTING?.STEPLIST === 'object'
      ? i18.CREATELISTING.STEPLIST
      : {};

  const stepList = [
    {
      number: 1,
      title: StepsList?.STEP1?.TITLE || 'Tell us about your place',
      desc:
        StepsList?.STEP1?.DESC ||
        'Share some basic info, such as where it is and how many guests can stay.',
      img: '/images/tellus.png',
    },
    {
      number: 2,
      title: StepsList?.STEP2?.TITLE || 'Make it stand out',
      desc:
        StepsList?.STEP2?.DESC ||
        'Add 5 or more photos plus a title and description – we’ll help you out.',
      img: '/images/makeit.png',
    },
    {
      number: 3,
      title: StepsList?.STEP3?.TITLE || 'Finish up and publish',
      desc:
        StepsList?.STEP3?.DESC ||
        'Choose a starting price, verify a few details, then publish your listing.',
      img: '/images/finishup.png',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center w-full h-full">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-start mb-12 md:mb-0">
        <h1 className="text-[50px] font-semibold mb-6">
          {(typeof Overview.HEADER1 === 'string' && Overview.HEADER1) ||
            'It’s easy to get'}
          <br />
          {(typeof Overview.HEADER2 === 'string' && Overview.HEADER2) ||
            'started on Staygenx'}
        </h1>
      </div>
      <div className="w-full md:w-1/2 flex flex-col gap-8">
        {stepList.map(step => (
          <div
            key={step.number}
            className="flex items-center gap-6 border-b pb-8 last:border-b-0"
          >
            <div className="text-3xl font-semibold text-gray-900 min-w-[32px]">
              {step.number}
            </div>
            <div className="flex-1">
              <div className="text-xl font-bold mb-1">{step.title}</div>
              <div className="text-lg text-gray-600">{step.desc}</div>
            </div>
            <Image
              src={step.img}
              alt={step.title}
              width={120}
              height={120}
              className="w-28 h-28 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
