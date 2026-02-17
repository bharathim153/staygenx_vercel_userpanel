'use client';

import { useDialogStore } from '@/lib/store/dialog-store';
import Button from '@/shadcn/ui/Button';

import { useListingStore } from './store';
import { useCallback, useContext, useLayoutEffect, useState } from 'react';
import { Ellipsis, Plus } from 'lucide-react';
import PageContext from '../../contextprovider';
import { useListingContext } from '../../layouts/createlistingLayout/ListingContext';
import Image from 'next/image';

export default function Photos() {
  const { openDialog } = useDialogStore();
  const { setDisabled } = useListingContext();

  const { ListingData, SetListingData } = useListingStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { i18 } = useContext(PageContext);
  useLayoutEffect(() => {
    if (Array.isArray(ListingData?.images) && ListingData?.images?.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [ListingData, setDisabled]);

  const photos =
    typeof i18?.CREATELISTING?.PHOTOS === 'object'
      ? i18.CREATELISTING.PHOTOS
      : {};

  const images = Array.isArray(ListingData?.images) ? ListingData.images : [];

  const updateImages = useCallback(
    (newImages: string[]) => {
      SetListingData({
        images: newImages,
        uploadimage: { images: newImages, preview: newImages },
      });
    },
    [SetListingData]
  );

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.dataTransfer.setData('drag-index', index.toString());
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    const dragIndex = Number(e.dataTransfer.getData('drag-index'));
    if (dragIndex === dropIndex) return;

    const updated = [...images];
    const [draggedItem] = updated.splice(dragIndex, 1);
    updated.splice(dropIndex, 0, draggedItem);
    updateImages(updated);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    updateImages(updated);
  };

  const remove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    updateImages(updated);
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [cover] = updated.splice(index, 1);
    updated.unshift(cover);
    updateImages(updated);
  };

  if (images.length === 0) {
    return (
      <div className="max-w-[630px] mx-auto flex flex-col items-start h-full">
        <div className="mb-4 text-start flex flex-col">
          <h1 className="text-[30px] md:text-[32px] font-bold">
            {(typeof photos.TITLE === 'string' && photos.TITLE) ||
              'Add some photos of your container'}
          </h1>
          <p className="text-[#6A6A6A]">
            {(typeof photos.DESC === 'string' && photos.DESC) ||
              "You'll need 5 photos to get started. You can add more or make changes later."}
          </p>
        </div>
        <div
          className="w-full bg-[#F7F7F7] border border-dashed border-gray-400 rounded-xl p-10 flex flex-col items-center justify-center text-center"
          style={{
            height: '100%',
          }}
        >
          <Image
            src="/images/camera.avif"
            alt="Camera Icon"
            className="w-[182px] h-[182px] mb-6 object-cover"
            width={100}
            height={100}
          />
          <Button
            onClick={() => openDialog('Uploadphotos')}
            className="bg-white px-6 py-2 border border-gray-400 rounded-lg text-sm"
          >
            {(typeof photos.ADDPHOTOS === 'string' && photos.ADDPHOTOS) ||
              'Add photos'}
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-[680px] mx-auto p-4 grid grid-cols-2 gap-4">
      {images.map((img, i) => (
        <div
          key={i}
          draggable
          onDragStart={e => handleDragStart(e, i)}
          onDragOver={e => e.preventDefault()}
          onDrop={e => handleDrop(e, i)}
          className={`relative rounded-xl overflow-hidden group ${
            i === 0 ? 'col-span-2 h-full' : 'h-50'
          }`}
        >
          <Image
            src={process.env.NEXT_PUBLIC_IMAGE_URL + img}
            alt={`Image ${i}`}
            className="object-cover w-full h-full"
            width={100}
            height={100}
          />
          <div className="absolute top-2 right-2">
            <div className="relative ">
              <Button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="border bg-white shadow-sm rounded-full p-1 shadow hover:bg-gray-100"
              >
                <Ellipsis />
              </Button>
              {openIndex === i && (
                <div className="absolute right-0 top-6 bg-white shadow rounded-lg text-sm w-40  z-10">
                  {i > 0 && (
                    <button
                      onClick={() => move(i, i - 1)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {(typeof photos.BACKWARD === 'string' &&
                        photos.BACKWARD) ||
                        'Move backwards'}
                    </button>
                  )}
                  {i < images.length - 1 && (
                    <button
                      onClick={() => move(i, i + 1)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {(typeof photos.FORWARD === 'string' && photos.FORWARD) ||
                        'Move forwards'}
                    </button>
                  )}
                  {i !== 0 && (
                    <button
                      onClick={() => makeCover(i)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {(typeof photos.COVERPHOTO === 'string' &&
                        photos.COVERPHOTO) ||
                        'Make cover photo'}
                    </button>
                  )}
                  <button
                    onClick={() => remove(i)}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-500"
                  >
                    {(typeof photos.DELETE === 'string' && photos.DELETE) ||
                      'Delete'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div
        onClick={() => openDialog('Uploadphotos')}
        className={`border-2 h-50 border-dashed rounded-lg p-8 flex flex-col gap-3 items-center justify-center text-center cursor-pointer transition`}
      >
        <Plus size={30} />
      </div>
    </div>
  );
}
