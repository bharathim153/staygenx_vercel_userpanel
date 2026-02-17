'use client';

import { ArrowLeft } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useListingStore } from '../../../create-listings/store';

import { useContext, useEffect, useMemo } from 'react';
import { SingleListing, SpaceApi } from '@/services/listing/getapis';
import PageContext from '@/app/components/contextprovider';
import { useSpaceStore } from '../../../create-listings/store/space';
import { useCustomeQuery } from '@/hooks/useCustomeQuery';
import Image from 'next/image';
export default function PhotoTourSidebar() {
  const Router = useRouter();
  const { space } = useSpaceStore();
  const { i18 } = useContext(PageContext);
  const { data } = useCustomeQuery(['Property-type'], () => SpaceApi(), {
    enabled: space.length === 0,
  });

  const sidebar = typeof i18?.EDITLISTING === 'object' ? i18.EDITLISTING : {};

  const pathname = usePathname();
  const parts = pathname.split('/');
  const { ListingData } = useListingStore();
  const additionalPhoto = ListingData.images?.[0]
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL + ListingData.images[0]}`
    : '';

  const updatedPhotoTour = useMemo(() => {
    const spaceArray = Array.isArray(data) ? data : [];
    const photoTourArray = Array.isArray(ListingData?.photoTour)
      ? ListingData.photoTour
      : [];

    if (!spaceArray.length || !photoTourArray.length) return photoTourArray;

    return photoTourArray.map(photo => {
      if (!photo.roomType) return photo;

      const match = spaceArray.find(sp => sp._id === photo.roomType);

      return match
        ? {
            ...photo,
            icon: match.icon, // merge icon from space
            // bannerImage: match.bannerImage, // uncomment if you add banner later
          }
        : photo;
    });
  }, [data, ListingData?.photoTour]);

  const extractedId: string = useMemo(() => {
    return parts[4] !== 'overview' ? parts[4] : '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const pathName: string = useMemo(() => {
    return parts[parts.length - 1];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const enable = extractedId !== '';

  useEffect(() => {
    if (enable) SingleListing({ listingId: extractedId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="h-full flex mt-10 justify-center">
      <div className="flex items-start gap-6">
        <div className="flex gap-4 my-8">
          <div
            onClick={() =>
              Router.push(
                `/hosting/listing/editor/${ListingData?.listingId}/details/photo-tour`
              )
            }
            className="flex items-center bg-gray-200 p-3 rounded-full cursor-pointer"
          >
            <ArrowLeft size={18} />
          </div>
        </div>
        <div>
          <div className="mt-6 flex flex-col gap-4">
            {updatedPhotoTour.map((room, index) => {
              const slug = room?.roomTypeName
                ? room.roomTypeName.toLowerCase().replace(/\s+/g, '')
                : '';

              return (
                <div
                  key={index}
                  onClick={() =>
                    slug &&
                    Router.push(
                      `/hosting/listing/editor/${ListingData?.listingId}/details/photo-tour/${slug}`
                    )
                  }
                >
                  <div
                    className={`w-[120px] h-[160px] relative rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer ${
                      pathName === slug ? ' border border-[#000] border-2' : ''
                    }`}
                  >
                    <Image
                      src={
                        room?.photos?.length > 0
                          ? `${process.env.NEXT_PUBLIC_IMAGE_URL + room.photos[0]}`
                          : `${process.env.NEXT_PUBLIC_IMAGE_URL + room?.icon}`
                      }
                      alt={room?.roomType || 'room'}
                      fill
                      className="object-cover rounded-2xl"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-medium capitalize">
                      {room?.roomTypeName ?? 'Unnamed room'}
                    </h3>
                  </div>
                </div>
              );
            })}

            <div
              onClick={() =>
                Router.push(
                  `/hosting/listing/editor/${ListingData?.listingId}/details/photo-tour/${'additional photos'.toLowerCase().replace(/\s+/g, '')}`
                )
              }
            >
              <div
                className={`w-[120px] h-[160px] relative rounded-2xl shadow-sm hover:shadow-md transition
                                 cursor-pointer ${pathName === 'additional photos'.toLowerCase().replace(/\s+/g, '') ? ' border border-[#000] border-2' : ''}`}
              >
                <Image
                  src={additionalPhoto}
                  alt={'additionalPhoto'}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-medium">
                  {(typeof sidebar.ROOM_ADDITIONAL === 'string' &&
                    sidebar.ROOM_ADDITIONAL) ||
                    'Additional photos'}
                </h3>
                <p className="text-sm text-gray-500">
                  {ListingData.images?.length ?? 0}{' '}
                  {(ListingData.images?.length ?? 0) === 1 ? 'photo' : 'photos'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
