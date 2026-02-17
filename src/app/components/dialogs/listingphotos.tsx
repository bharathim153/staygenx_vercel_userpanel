import { useDrawerStore } from '@/lib/store/drawer-store';
import Button from '@/shadcn/ui/Button';
import { ArrowLeft, Check, Trash2, X } from 'lucide-react';
import { useListingStore } from '../ui/create-listings/store';

import { useEffect, useState } from 'react';
import { useCreateListingApi } from '../ui/create-listings/store/api';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useDialogStore } from '@/lib/store/dialog-store';
import Image from 'next/image';

export default function ListingPhotos() {
  const { closeDrawer } = useDrawerStore();
  const { openDialog } = useDialogStore();
  const { ListingData, SetListingData } = useListingStore();

  const [managephotos, SetManagephotos] = useState(false);
  const [images, setImages] = useState(ListingData?.images || []);
  const [selectedImage, setSelectedImage] = useState<number[]>([]);
  const [drag, setDrag] = useState(false);
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.setData('dragIndex', index.toString());
  };

  const { CreateListing } = useCreateListingApi();
  const { trigger } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      if (data) {
        setDrag(false);
      }
    },
  });

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'), 10);
    if (dragIndex === dropIndex) return;
    setDrag(true);
    const updated = [...images];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, moved);
    setImages(updated);
    SetListingData({
      ...ListingData,
      images: updated,
    });
  };
  const handleClick = (index: number) => {
    if (managephotos) {
      setSelectedImage(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    }
  };
  useEffect(() => {
    if (drag) {
      trigger({
        data: {
          listingId: ListingData?.listingId,
        },
        step: 8,
        isEdit: true,
        arraydata: {
          array: images,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag]);
  const handleSelect = () => {
    if (managephotos) {
      if (selectedImage.length > 0) {
        setSelectedImage([]);
      } else {
        SetManagephotos(false);
      }
    } else {
      closeDrawer();
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  return (
    <div className="p-10 flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <Button
          onClick={handleSelect}
          variant="gray"
          className="flex items-center gap-2 p-3 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          {managephotos ? (
            selectedImage.length > 0 ? (
              <p className="text-[14px] ">Deselect</p>
            ) : (
              <X className="w-5 h-5" />
            )
          ) : (
            <ArrowLeft className="w-5 h-5" />
          )}
        </Button>
        <h1 className="text-[40px] font-semibold">
          {managephotos
            ? selectedImage.length > 0
              ? `${selectedImage.length} selected`
              : 'Select photos'
            : 'All photos'}
        </h1>
        <div className="flex gap-3 items-center">
          {!managephotos ? (
            <>
              {/* <Button
                onClick={() => SetManagephotos(true)}
                variant="gray"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <span>Manage photos</span>
              </Button> */}
              {/* <Button
                variant="gray"
                className="flex items-center gap-2 p-3 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Plus className="w-5 h-5" />
              </Button> */}
            </>
          ) : (
            selectedImage.length > 0 && (
              <>
                {/* <Button
                                    onClick={() => openDialog('space')}
                                    variant="gray"
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
                                >
                                    <span className="text-[14px]">Move</span>
                                </Button> */}
                <Button
                  onClick={() =>
                    openDialog('DeletePhoto', { index: selectedImage })
                  }
                  variant="gray"
                  className="flex items-center gap-2 p-3 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </>
            )
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {images.map((img: string, index: number) => (
          <div
            key={index}
            className="w-full sm:w-[48%] md:w-[260px] flex flex-col gap-3 cursor-pointer border  rounded-lg"
            draggable
            onDragStart={e => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, index)}
          >
            <div
              className={`rounded-2xl overflow-hidden ${selectedImage.includes(index) ? ' border-2 border-[#000]' : ''}`}
            >
              <div
                className="relative w-full aspect-square"
                onClick={() => handleClick(index)}
              >
                {index === 0 && (
                  <div className="absolute top-3 left-3 bg-white py-1 px-2 rounded-full z-50 shadow-md">
                    <p className="text-[14px] text-[#6A6A6A]">Cover photo</p>
                  </div>
                )}
                {managephotos && selectedImage.includes(index) && (
                  <div className="absolute top-3 right-3 z-50">
                    <Button
                      variant="gray"
                      className="flex items-center gap-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                    >
                      <Check className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                <Image
                  src={process.env.NEXT_PUBLIC_IMAGE_URL + img}
                  alt={`img-${index}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
