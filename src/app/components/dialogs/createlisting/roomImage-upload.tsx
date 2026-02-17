import { useContext, useRef, useState } from 'react';
import { Images, Plus, Trash2 } from 'lucide-react';
import Button from '@/shadcn/ui/Button';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useListingStore } from '../../ui/create-listings/store';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import PageContext from '../../contextprovider';
import { RoomImageUpload } from '@/services/listing';
import { SingleListing } from '@/services/listing/getapis';
import Image from 'next/image';

type RoomImageState = {
  images: File[];
  preview: string[];
};

export default function RoomPhotoUpload({ data }: { data?: { id?: string } }) {
  const { i18 } = useContext(PageContext);

  const photos =
    typeof i18?.CREATELISTING?.PHOTOS === 'object'
      ? i18.CREATELISTING.PHOTOS
      : {};

  const common = typeof i18?.COMMON?.TEXT === 'object' ? i18.COMMON?.TEXT : {};

  const [roomimage, setRoomImage] = useState<RoomImageState>({
    images: [],
    preview: [],
  });
  const [errorFlags, setErrorFlags] = useState<boolean[]>([]);
  const { closeDialog } = useDialogStore();
  const { ListingData } = useListingStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const { trigger, isPending } = useCustomMutation(RoomImageUpload, {
    onSuccessCallback: data => {
      if (data) {
        closeDialog();
        SingleListing({ listingId: ListingData?.listingId ?? '' });
      }
    },
  });

  const handlesave = () => {
    const formData = new FormData();

    roomimage.images.forEach(file => {
      formData.append('images', file);
    });

    trigger({
      listingId: ListingData?.listingId ?? '',
      roomId: data?.id ?? '',
      images: formData,
    });
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files);
    const previewUrls = imageFiles.map(file => URL.createObjectURL(file));

    const validImages: File[] = [];
    const newErrorFlags: boolean[] = [];

    imageFiles.forEach(file => {
      if (file.size <= 50 * 1024) {
        validImages.push(file);
        newErrorFlags.push(false);
      } else {
        newErrorFlags.push(true);
      }
    });

    setRoomImage(prev => ({
      images: [...prev.images, ...validImages],
      preview: [...prev.preview, ...previewUrls],
    }));

    setErrorFlags(prev => [...prev, ...newErrorFlags]);
  };

  const removeImage = (index: number) => {
    setRoomImage(prev => {
      const updatedPreviews = prev.preview.filter((_, i) => i !== index);

      let updatedImages = prev.images;
      if (!errorFlags[index]) {
        let validIdx = -1;
        for (let i = 0, j = 0; i < errorFlags.length; i++) {
          if (!errorFlags[i]) {
            if (i === index) {
              validIdx = j;
              break;
            }
            j++;
          }
        }
        if (validIdx > -1) {
          updatedImages = updatedImages.filter((_, k) => k !== validIdx);
        }
      }

      return {
        images: updatedImages,
        preview: updatedPreviews,
      };
    });

    setErrorFlags(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const hasValidImages = roomimage.images.length > 0;

  return (
    <div className="space-y-6 h-[400px] overflow-y-auto">
      {/* Upload Box */}
      {roomimage?.preview.length === 0 && (
        <div
          onDragOver={e => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`border-2 border-dashed ${
            dragOver ? 'border-black bg-gray-50' : 'border-gray-300'
          } rounded-lg p-8 flex flex-col gap-3 items-center justify-center text-center cursor-pointer transition`}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={e => handleFiles(e.target.files)}
          />
          <Images size={30} />
          <p className="font-semibold text-lg">
            {(typeof photos?.DRAGANDDROP === 'string' && photos?.DRAGANDDROP) ||
              'Drag and drop'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {(typeof photos?.BROWSEPHOTOS === 'string' &&
              photos?.BROWSEPHOTOS) ||
              'or browse for photos'}
          </p>
          <Button
            variant="black"
            type="button"
            className="text-white px-6 py-2 rounded-md pointer-events-none"
          >
            {(typeof photos?.BROWSE === 'string' && photos?.BROWSE) || 'Browse'}
          </Button>
        </div>
      )}

      {/* Thumbnails Preview */}
      {roomimage?.preview.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-18">
          {roomimage?.preview.map((src, index) => {
            const hasError = errorFlags[index] ?? false;
            return (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-md border group"
              >
                {/* Delete Button */}
                <Button
                  variant="black"
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/80 hover:bg-black text-white p-2 rounded-full z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

                <Image
                  src={src}
                  alt={`Uploaded ${index}`}
                  fill
                  className="object-cover"
                />

                {hasError && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs p-2 rounded-md">
                    File too large (&gt; 50KB)
                  </div>
                )}
              </div>
            );
          })}
          <div
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            className={`border-2 h-[250px] border-dashed ${
              dragOver ? 'border-black bg-gray-50' : 'border-gray-300'
            } rounded-lg p-8 flex flex-col gap-3 items-center justify-center text-center cursor-pointer transition`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
            <Plus size={30} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 z-40">
        <div className="flex justify-between items-center">
          <Button
            className="font-semibold text-gray-700"
            variant="transparent"
            onClick={() => {
              closeDialog();
            }}
          >
            {(typeof common?.CANCEL === 'string' && common?.CANCEL) || 'Cancel'}
          </Button>
          <Button
            loading={isPending}
            disabled={!hasValidImages}
            variant="black"
            onClick={handlesave}
            className="px-6 py-3 rounded-md text-white"
          >
            {(typeof common?.UPLOAD === 'string' && common?.UPLOAD) || 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
}
