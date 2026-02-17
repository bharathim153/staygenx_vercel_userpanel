import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import PageContext from '@/app/components/contextprovider';
import { ListingData, useListingStore } from '../../../create-listings/store';
import Image from 'next/image';

export default function PhotoTourComp({
  data,
  extractedPathname,
}: {
  data: ListingData;
  extractedPathname: string;
}) {
  const Router = useRouter();
  const { i18 } = useContext(PageContext);
  const { ListingData } = useListingStore();
  const editlisting =
    typeof i18?.EDITLISTING === 'object' ? i18?.EDITLISTING : undefined;

  return (
    <div
      onClick={() =>
        Router.push(
          `/hosting/listing/editor/${ListingData?.listingId}/details/photo-tour`
        )
      }
      className={`cursor-pointer bg-white rounded-xl ${extractedPathname === 'photo-tour' ? 'border border-2 border-[#000]' : 'border'}  shadow-sm overflow-hidden flex flex-col gap-3 items-center justify-center`}
    >
      <div className="p-4 text-left">
        <h2 className="text-base font-semibold ">
          {(typeof editlisting?.PHOTO_TOUR_TITLE === 'string' &&
            editlisting?.PHOTO_TOUR_TITLE) ||
            'Photo tour'}
        </h2>
        <p className="text-sm text-gray-600">
          {data?.floorplan?.bedrooms ?? 0}{' '}
          {(typeof editlisting?.BEDROOM === 'string' && editlisting?.BEDROOM) ||
            'bedroom'}{' '}
          · {data?.floorplan?.beds ?? 0}{' '}
          {(typeof editlisting?.BED === 'string' && editlisting?.BED) || 'bed'}{' '}
          · {data?.floorplan?.bathrooms ?? 0}{' '}
          {(typeof editlisting?.BATH === 'string' && editlisting?.BATH) ||
            'bath'}
        </p>
      </div>

      <div className="relative w-[260px] h-[160px] flex items-center justify-center">
        {/* Previous Image (Left Tilted Inward) */}
        {data?.images?.[1] ? (
          <Image
            width={100}
            height={100}
            src={process.env.NEXT_PUBLIC_IMAGE_URL + data.images[1]}
            alt="Previous"
            className="absolute left-0 w-[110px] h-[130px] rounded-xl object-cover z-0 transform scale-[0.95] -translate-x-2 -rotate-[4deg]"
          />
        ) : (
          <div className="absolute left-0 w-[110px] h-[130px] rounded-xl bg-gray-200 z-0 transform scale-[0.95] -translate-x-2 -rotate-[4deg]" />
        )}

        {/* Main Image (Center) */}
        {data?.images?.[0] ? (
          <Image
            width={100}
            height={100}
            src={process.env.NEXT_PUBLIC_IMAGE_URL + data.images[0]}
            alt="Main"
            className="w-[150px] h-[140px] rounded-2xl object-cover z-10 shadow-md"
          />
        ) : (
          <div className="w-[150px] h-[140px] rounded-2xl bg-gray-200 z-10 shadow-md" />
        )}

        {/* Next Image (Right Tilted Inward) */}
        {data?.images?.[2] ? (
          <Image
            width={100}
            height={100}
            src={process.env.NEXT_PUBLIC_IMAGE_URL + data.images[2]}
            alt="Next"
            className="absolute right-0 w-[110px] h-[130px] rounded-xl object-cover z-0 transform scale-[0.95] translate-x-2 rotate-[4deg]"
          />
        ) : (
          <div className="absolute right-0 w-[110px] h-[130px] rounded-xl bg-gray-200 z-0 transform scale-[0.95] translate-x-2 rotate-[4deg]" />
        )}

        {/* Badge */}
        <div className="absolute top-5 bg-white px-3 py-1 rounded-full text-sm font-medium shadow z-20">
          {Array.isArray(data?.images) ? data.images.length : 0}{' '}
          {(typeof editlisting?.PHOTO === 'string' && editlisting?.PHOTO) ||
            'photos'}
        </div>
      </div>
    </div>
  );
}
