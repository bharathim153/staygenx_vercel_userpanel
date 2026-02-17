'use client';

import TabsComponent from '@/shadcn/ui/tabs';
import { useContext } from 'react';
import PageContext from '../../contextprovider';
import { cn } from '@/lib/utils';

import Image from 'next/image';

export default function ReservationsEmptyState() {
  const { i18 } = useContext(PageContext);
  const today = typeof i18?.TODAYPAGE === 'object' ? i18?.TODAYPAGE : undefined;
  const tabData = [
    {
      label: typeof today?.TODAY === 'string' ? today.TODAY : 'Today',
      value: 'today',
      content: (
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center mt-10">
            <Image
              src="/images/book.avif"
              alt="No reservations"
              width={300}
              height={300}
              className="w-[300px] h-[300px] mb-6"
            />
            <p className="text-xl font-semibold text-gray-800">
              {typeof today?.NORESERVATION_TODAY === 'string'
                ? today.NORESERVATION_TODAY
                : 'You don’t have any reservations'}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: typeof today?.UPCOMING === 'string' ? today.UPCOMING : 'Upcoming',
      value: 'upcoming',
      content: (
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center justify-center mt-10">
            <Image
              src="/images/book.avif"
              alt="No reservations"
              width={300}
              height={300}
              className="w-[300px] h-[300px] mb-6"
            />
            <p className="text-xl text-center font-semibold text-gray-800 max-w-[320px]">
              {typeof today?.NORESERVATION_UPCOMING === 'string'
                ? today.NORESERVATION_UPCOMING
                : 'You don’t have any upcoming reservations'}
            </p>
          </div>
        </div>
      ),
    },
  ];
  // const alerts = [
  //     { name: "goku's villa", message: "Confirm a few key details", subtext: "Required to publish" },
  //     { name: "fukfhu", message: "Confirm a few key details", subtext: "Required to publish" },
  // ];

  return (
    <div className=" py-10 px-4">
      {/* Alert Cards */}
      {/* <div className="flex flex-wrap justify-center gap-4 mb-10">
                {alerts.map((alert, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-4 bg-white rounded-2xl shadow-md px-5 py-4 w-[320px]"
                    >
                        <div className="w-10 h-10 flex-shrink-0">
                            <img src="/images/alert-icon.png" alt="Check icon" className="w-full h-full" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{alert.name}</p>
                            <p className="text-md font-semibold">{alert.message}</p>
                            <p className="text-sm text-gray-400">{alert.subtext}</p>
                        </div>
                    </div>
                ))}
            </div> */}

      {/* Tabs */}
      <TabsComponent
        tabs={tabData}
        defaultValue="today"
        className="w-full "
        tabClassname={cn(
          'data-[state=active]:bg-[#202020DB] data-[state=active]:text-[#fff] py-3 px-6 rounded-full bg-gray-200 gap-4 shadow-sm cursor-pointer'
        )}
      />

      {/* Empty State */}
    </div>
  );
}
