'use client';
import { ImageIcon, Plus } from 'lucide-react';

import { useListingStore } from '../../create-listings/store';
import { usePathname, useRouter } from 'next/navigation';
import Button from '@/shadcn/ui/Button';
import { useContext, useMemo } from 'react';
import PageContext from '../../../contextprovider';
import { useDrawerStore } from '@/lib/store/drawer-store';
import PopoverComponent from '@/shadcn/ui/popover';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useCustomeQuery } from '@/hooks/useCustomeQuery';
import { SpaceApi } from '@/services/listing/getapis';
import Image from 'next/image';

export default function PhotoTour() {
  const Router = useRouter();
  const { openDrawer } = useDrawerStore();
  const { openDialog } = useDialogStore();
  const { data } = useCustomeQuery(['Property-type'], () => SpaceApi());

  const { i18 } = useContext(PageContext);
  const sidebar = typeof i18?.EDITLISTING === 'object' ? i18.EDITLISTING : {};

  const pathname = usePathname();
  const { ListingData, loading } = useListingStore();

  const additionalPhoto = ListingData.images?.[0]
    ? `${process.env.NEXT_PUBLIC_IMAGE_URL + ListingData.images[0]}`
    : '/images/errorImage.webp';

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

  // const rooms = [
  //     {
  //         label: typeof sidebar.ROOM_BEDROOM === 'string' && sidebar.ROOM_BEDROOM || "Bedroom",
  //         description: typeof sidebar.ROOM_BEDROOM_ADD === 'string' && sidebar.ROOM_BEDROOM_ADD || "Add photos",
  //         image: "/images/bedroom.avif",
  //         path: "bedroom",
  //     },
  //     {
  //         label: typeof sidebar.ROOM_BATHROOM === 'string' && sidebar.ROOM_BATHROOM || "Full bathroom",
  //         description: typeof sidebar.ROOM_BATHROOM_ADD === 'string' && sidebar.ROOM_BATHROOM_ADD || "Add photos",
  //         image: "/images/bathroom.avif",
  //         path: "full bathroom",
  //     },
  //     {
  //         label: typeof sidebar.ROOM_ADDITIONAL === 'string' && sidebar.ROOM_ADDITIONAL || "Additional photos",
  //         description: `${ListingData.images?.length ?? 0} ${(ListingData.images?.length ?? 0) === 1 ? "photo" : "photos"
  //             }`,
  //         image: additionalPhoto,
  //         isAdditional: true,
  //         path: "additional photos",
  //     },
  // ];

  return (
    <section className="p-6 md:p-10 max-w-3xl mx-auto flex flex-col justify-center items-center gap-3">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-semibold">
          {(typeof sidebar.PHOTO_TOUR_TITLE === 'string' &&
            sidebar.PHOTO_TOUR_TITLE) ||
            'Photo tour'}
        </h2>
        <div className="flex gap-3">
          <Button
            onClick={() => openDrawer('listingphotos')}
            variant="gray"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <ImageIcon className="w-5 h-5" />
            <span>
              {(typeof sidebar.PHOTO_TOUR_ALL_PHOTOS === 'string' &&
                sidebar.PHOTO_TOUR_ALL_PHOTOS) ||
                'All photos'}
            </span>
          </Button>
          <PopoverComponent
            align="end"
            className="focus:outline-none"
            trigger={
              <div className="flex items-center bg-gray-100 p-3 rounded-full cursor-pointer">
                <Plus size={18} />
              </div>
            }
            content={
              <ul className="w-[240px] bg-white rounded-xl shadow-xl text-md ">
                <div className="p-4 flex flex-col gap-3 cursor-pointer">
                  <p onClick={() => openDialog('Uploadphotos')}>Add photos</p>
                  <p onClick={() => openDialog('space')}>Add room or space</p>
                </div>
              </ul>
            }
          />
        </div>
      </div>

      <p className="text-gray-600 mt-1">
        {(typeof sidebar.PHOTO_TOUR_ROOM_SUBTITLE === 'string' &&
          sidebar.PHOTO_TOUR_ROOM_SUBTITLE) ||
          'Manage photos and add details. Guests will only see your tour if every room has a photo.'}
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading && (
          <div>
            <div className="w-[190px] h-[210px] bg-gray-200 animate-pulse rounded-lg"></div>
          </div>
        )}
        {Array.isArray(updatedPhotoTour) &&
          updatedPhotoTour.length > 0 &&
          updatedPhotoTour.map((room, index) => (
            <div
              key={index}
              onClick={() =>
                Router.push(
                  `${pathname}/${room.roomTypeName.toLowerCase().replace(/\s+/g, '')}`
                )
              }
            >
              <div className="w-[190px] h-[210px] relative rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer">
                <Image
                  src={
                    room.photos.length > 0
                      ? `${process.env.NEXT_PUBLIC_IMAGE_URL + room.photos[0]}`
                      : `${process.env.NEXT_PUBLIC_IMAGE_URL + room.icon}`
                  }
                  alt={`img${index}`}
                  fill
                  className="object-cover rounded-2xl"
                />
              </div>
              <div className="mt-3">
                <h3 className="font-medium">{room.roomTypeName}</h3>
              </div>
            </div>
          ))}
        <div
          onClick={() =>
            Router.push(
              `${pathname}/${'additional photos'.toLowerCase().replace(/\s+/g, '')}`
            )
          }
        >
          <div className="w-[190px] h-[210px] relative rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer">
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
    </section>
  );
}
