'use client';

import {
  ListingData,
  useListingStore,
} from '@/app/components/ui/create-listings/store';
import { SingleListing } from '@/services/listing/getapis';
// import Button from '@/shadcn/ui/Button';
// import { Eye } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useContext, useEffect, useMemo } from 'react';
import PhotoTourComp from './phototour';
import ContainerComp from './box';
import PageContext from '@/app/components/contextprovider';
import Header from './header';

export default function ListEditingSidebar() {
  const { i18 } = useContext(PageContext);
  const sidebar =
    typeof i18?.EDITLISTING === 'object' ? i18?.EDITLISTING : undefined;
  const { ListingData } = useListingStore();
  const pathname = usePathname();
  const parts = pathname.split('/');
  const extractedId: string = useMemo(() => {
    return parts[4] !== 'overview' ? parts[4] : '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const extractedPathname: string = useMemo(() => {
    return parts[parts.length - 1];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const enable = extractedId !== '';

  useEffect(() => {
    if (enable) SingleListing({ listingId: extractedId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full m-[10px] sm:m-[20px]">
      <Header value="details" />
      <div className="flex flex-col items-center space-y-6 py-6">
        <div className="flex flex-col gap-6 max-w-full md:max-w-[320px]">
          <PhotoTourComp
            data={ListingData as ListingData}
            extractedPathname={extractedPathname}
          />
          <ContainerComp
            title={typeof sidebar?.TITLE === 'string' ? sidebar.TITLE : 'Title'}
            path="title"
            data={ListingData as ListingData}
            extractedPathname={extractedPathname}
          />

          <ContainerComp
            title={
              typeof sidebar?.PRICING === 'string' ? sidebar.PRICING : 'Pricing'
            }
            path="pricing"
            data={ListingData as ListingData}
            extractedPathname={extractedPathname}
          />

          <ContainerComp
            title={
              typeof sidebar?.NOOFGUEST === 'string'
                ? sidebar.NOOFGUEST
                : 'Number of guest'
            }
            path="number-of-guest"
            data={ListingData as ListingData}
            extractedPathname={extractedPathname}
          />
          <ContainerComp
            title={
              typeof sidebar?.AMENITIES === 'string'
                ? sidebar.AMENITIES
                : 'Amenities'
            }
            path="amenities"
            data={ListingData as ListingData}
            extractedPathname={extractedPathname}
          />
          <ContainerComp
            title={
              typeof sidebar?.DESC === 'string' ? sidebar.DESC : 'Description'
            }
            path="description"
            data={ListingData as ListingData}
            extractedPathname={extractedPathname}
          />

          <ContainerComp
            title={
              typeof sidebar?.LOCATION === 'string'
                ? sidebar.LOCATION
                : 'Location'
            }
            path="location"
            data={ListingData as ListingData}
            extractedPathname={extractedPathname}
          />

          <ContainerComp
            title={
              typeof sidebar?.ABOUTHOST === 'string'
                ? sidebar.ABOUTHOST
                : 'About the host'
            }
            path="host"
            data={ListingData as ListingData}
            extractedPathname={extractedPathname}
          />
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
