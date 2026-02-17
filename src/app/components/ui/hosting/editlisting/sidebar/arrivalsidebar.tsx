'use client';

import { useListingStore } from '@/app/components/ui/create-listings/store';
import { HouseRulesApi, SingleListing } from '@/services/listing/getapis';
// import Button from '@/shadcn/ui/Button';
// import { Eye } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

// import PageContext from '@/app/components/contextprovider';
import Header from './header';
import { useHouseruleStore } from '../../../create-listings/store/houserules';

import Image from 'next/image';

export default function ArrivalSideBar() {
  const { ListingData } = useListingStore();
  const { HouserulesData } = useHouseruleStore();
  const Houserules =
    Array.isArray(HouserulesData) &&
    HouserulesData.length > 0 &&
    HouserulesData.filter(item =>
      ListingData?.houseRule?.houseRules.includes(item._id)
    ).map(item => item);

  const sidebarDetails = [
    {
      heading: 'Check-in method',
      value: ListingData?.arrivalguide?.checkInMethod,
    },
    {
      heading: 'Wifi details',
      value: ListingData?.arrivalguide?.wifiDetails?.networkName,
    },
    {
      heading: 'Checkout instructions',
      value: ListingData?.arrivalguide?.checkoutInstructions,
    },
    {
      heading: 'House rules',
      value: Houserules,
    },
    // {
    //     heading: 'Checkout instructions',
    //     value: ListingData?.arrivalguide?.checkoutInstructions
    // },
    // {
    //     heading: 'Guidebooks',
    //     value: 'Create a guidebook to easily share local tips with guests'
    // },
    // {
    //     heading: 'interaction preferences',
    //     value: 'Add details'
    // },
  ];
  const Router = useRouter();
  // const { i18 } = useContext(PageContext);
  // const sidebar =
  //   typeof i18?.EDITLISTING === 'object' ? i18?.EDITLISTING : undefined;

  const pathname = usePathname();
  const parts = pathname.split('/');
  const extractedId: string = useMemo(() => {
    return parts[4] !== 'overview' ? parts[4] : '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, parts]);
  const extractedPathname: string = useMemo(() => {
    return parts[parts.length - 1];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const enable = extractedId !== '';

  useEffect(() => {
    if (enable) SingleListing({ listingId: extractedId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (enable) HouseRulesApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="h-full m-[10px] sm:m-[20px]">
      <Header value="arrival" />
      <div className="flex flex-col items-center space-y-6 py-6">
        <div className="flex flex-col gap-6 w-full md:w-[320px]">
          <div
            onClick={() =>
              Router.push(
                `/hosting/listing/editor/${extractedId}/arrival/check-in-out`
              )
            }
            className={`cursor-pointer bg-white rounded-xl ${extractedPathname === 'check-in-out' ? 'border border-2 border-[#000]' : 'border'}  shadow-lg overflow-hidden flex flex-col hover:bg-gray-100 gap-2 p-4`}
          >
            <div className="flex justify-between">
              <div className="flex flex-col gap-2">
                <h3 className="text-[#000] font-[600]">Check-in</h3>
                <p className="text-[#202020DB]">
                  {ListingData?.arrivalguide?.checkInTime !== ''
                    ? ListingData?.arrivalguide?.checkInTime
                    : 'Add details'}
                </p>
              </div>
              <div className="border-r" />
              <div className="flex flex-col gap-2">
                <h3 className="text-[#000] font-[600]">Check-out</h3>
                <p className="text-[#202020DB]">
                  {ListingData?.arrivalguide?.checkOutTime !== ''
                    ? ListingData?.arrivalguide?.checkOutTime
                    : 'Add details'}
                </p>
              </div>
            </div>
          </div>
          {sidebarDetails.map((items, index) => {
            const slug = items?.heading?.toLowerCase().replace(/\s+/g, '-');
            const isActive = extractedPathname === slug;

            return (
              <div
                key={index}
                onClick={() =>
                  Router.push(
                    `/hosting/listing/editor/${extractedId}/arrival/${slug}`
                  )
                }
                className={`cursor-pointer w-full md:w-[320px] bg-white rounded-xl ${
                  isActive ? 'border-2 border-[#000]' : 'border'
                } shadow-lg overflow-hidden flex flex-col hover:bg-gray-100 gap-2 p-4`}
              >
                <h3 className="text-[#000] font-[600]">{items?.heading}</h3>

                {Array.isArray(items?.value) && items.value.length > 0 ? (
                  items.value.slice(0, 2).map((rule, idx: number, arr) => {
                    const isObjectWithIcon =
                      typeof rule === 'object' &&
                      rule !== null &&
                      'icon' in rule;

                    return (
                      <div
                        key={idx}
                        className="flex justify-between items-center w-full"
                      >
                        <div className="flex gap-4 items-center">
                          {isObjectWithIcon ? (
                            <>
                              <Image
                                src={
                                  process.env.NEXT_PUBLIC_IMAGE_URL + rule.icon
                                }
                                alt="icon"
                                width={25}
                                height={25}
                              />
                              <p className="text-[#202020DB]">{rule.name}</p>
                            </>
                          ) : (
                            <p className="text-[#202020DB]">{rule}</p>
                          )}
                          {Array.isArray(arr) && arr.length > 2 && (
                            <p>{`+ ${arr.length - 2} more`} </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : typeof items?.value === 'string' &&
                  items.value.trim() !== '' ? (
                  <p className="text-[#202020DB]">{items.value}</p>
                ) : (
                  <p className="text-[#202020DB]">Add details</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* <div className="z-50 sticky bottom-10 flex items-center justify-center">
        <Button
          variant="black"
          className=" text-white px-[32px] py-[18px] rounded-full flex items-center gap-2 text-sm"
        >
          <Eye className="w-4 h-4" />
          {typeof sidebar?.PHOTO_TOUR_VIEW_BUTTON === 'string'
            ? sidebar.PHOTO_TOUR_VIEW_BUTTON
            : 'View'}
        </Button>
      </div> */}
    </div>
  );
}
