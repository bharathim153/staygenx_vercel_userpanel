'use client';

import Button from '@/shadcn/ui/Button';
import { Plus } from 'lucide-react';

import { useContext } from 'react';
import PageContext from '../../../contextprovider';
import { useSpaceStore } from '../../create-listings/store/space';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useListingStore } from '../../create-listings/store';
import Image from 'next/image';

export default function TourComp({ tour }: { tour: string }) {
  const { i18 } = useContext(PageContext);
  const { ListingData, loading } = useListingStore();
  const { openDialog } = useDialogStore();
  const sidebar = typeof i18?.EDITLISTING === 'object' ? i18.EDITLISTING : {};
  const { space } = useSpaceStore();
  const RoomType = space.find(
    sp => sp?.name?.toLowerCase().replace(/\s+/g, '') === tour
  );

  const photoTour = Array.isArray(ListingData?.photoTour)
    ? ListingData.photoTour.find(
        sp => sp?.roomTypeName?.toLowerCase().replace(/\s+/g, '') === tour
      )
    : undefined;

  const mapValue =
    tour === 'additionalphotos' ? ListingData?.images : photoTour?.photos;
  // const items = [
  //     {
  //         label: typeof sidebar.ROOM_FEATURE_SLEEPING === "string" && sidebar.ROOM_FEATURE_SLEEPING || "Sleeping arrangements",
  //     },
  //     {
  //         label: typeof sidebar.ROOM_FEATURE_PRIVACY === "string" && sidebar.ROOM_FEATURE_PRIVACY || "Privacy info",
  //         active: true,
  //     },
  //     {
  //         label: typeof sidebar.ROOM_FEATURE_AMENITIES === "string" && sidebar.ROOM_FEATURE_AMENITIES || "Amenities",
  //     },
  //     {
  //         label: typeof sidebar.ROOM_FEATURE_ACCESSIBILITY === "string" && sidebar.ROOM_FEATURE_ACCESSIBILITY || "Accessibility features",
  //     },
  // ];
  const handleClick = () => {
    if (tour === 'additionalphotos') {
      openDialog('Uploadphotos');
    } else {
      openDialog('RoomUploadphotos', { id: photoTour?._id });
    }
  };
  return (
    <section className="p-6 md:p-10 max-w-2xl mx-auto flex flex-col justify-center items-center gap-6">
      <div className="w-full flex justify-between items-center">
        <p className="capitalize text-[32px] font-semibold">{tour}</p>
        <Button
          onClick={handleClick}
          variant="gray"
          className="flex items-center justify-center gap-2 w-10 h-10 rounded-full hover:bg-gray-300"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>
      {Array.isArray(mapValue) && mapValue.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {mapValue.map((photo, index) => {
            return (
              <div key={index} className="w-[180px] h-[180px]">
                <Image
                  src={
                    photo ? `${process.env.NEXT_PUBLIC_IMAGE_URL + photo}` : ''
                  }
                  alt={`Photo ${index + 1}`}
                  width={150}
                  height={150}
                  className="w-[180px] h-[180px] rounded-lg mb-4 object-cover"
                />
              </div>
            );
          })}
          {loading && (
            <div>
              <div className="w-[180px] h-[180px] bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[300px] border border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center bg-gray-50">
          <Image
            src={
              RoomType?.icon
                ? process.env.NEXT_PUBLIC_IMAGE_URL + RoomType?.icon
                : ''
            }
            alt="img"
            width={100}
            height={100}
            className="mb-4"
          />
          <Button
            onClick={() =>
              openDialog('RoomUploadphotos', { id: photoTour?._id })
            }
            className="border border-black text-sm px-4 py-2 rounded-md"
          >
            {typeof sidebar?.ROOM_BEDROOM_ADD === 'string'
              ? sidebar.ROOM_BEDROOM_ADD
              : 'Add photo'}
          </Button>
        </div>
      )}

      {/* <div className="w-full space-y-1">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center px-4 py-4 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                        <div>
                            <div className="font-medium text-gray-900">{item.label}</div>
                            <div className="text-gray-500 text-xs">
                                {typeof sidebar?.ROOM_FEATURE_ADD_DETAILS === 'string' ? sidebar.ROOM_FEATURE_ADD_DETAILS : "Add details"}
                            </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-400" />
                    </div>
                ))}

                <hr className="my-6 border-gray-200" />

                <div className="flex items-center gap-2 text-sm text-gray-600 px-4 py-2 cursor-pointer hover:text-red-600">
                    <Trash2 size={16} />
                    <span>
                        {typeof sidebar?.ROOM_FEATURE_DELETE === 'string' ? sidebar.ROOM_FEATURE_DELETE : "Delete room or space"}
                    </span>
                </div>
            </div> */}
    </section>
  );
}
