import { useContext, useMemo, useRef, useState } from 'react';
import { Images, Plus, Trash2 } from 'lucide-react';
import Button from '@/shadcn/ui/Button';
import { useDialogStore } from '@/lib/store/dialog-store';
import { useListingStore } from '../../ui/create-listings/store';
import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { useCreateListingApi } from '../../ui/create-listings/store/api';
import { usePathname } from 'next/navigation';
import PageContext from '../../contextprovider';
import Image from 'next/image';

export default function PhotoUpload() {
  const pathname = usePathname();
  const { i18 } = useContext(PageContext);

  const photos =
    typeof i18?.CREATELISTING?.PHOTOS === 'object'
      ? i18.CREATELISTING.PHOTOS
      : {};

  const common = typeof i18?.COMMON?.TEXT === 'object' ? i18.COMMON?.TEXT : {};

  const { closeDialog } = useDialogStore();
  const { CreateListing } = useCreateListingApi();
  const { SetListingData, ListingData } = useListingStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const [errorFlags, setErrorFlags] = useState<boolean[]>([]);

  const { trigger, isPending } = useCustomMutation(CreateListing, {
    onSuccessCallback: data => {
      if (data) {
        closeDialog();
        SetListingData({
          images: Array.isArray(data?.data?.images) ? data.data.images : [],
          uploadimage: {
            images: [],
            preview: [],
          },
        });
      }
    },
  });

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const imageFiles = Array.from(files);
    const previewUrls = imageFiles.map(file => URL.createObjectURL(file));

    const validImages: File[] = [];
    const newErrorFlags: boolean[] = [];
    imageFiles.forEach(file => {
      debugger;
      if (file.size <= 50 * 1024) {
        validImages.push(file);
        newErrorFlags.push(false);
      } else {
        newErrorFlags.push(true);
      }
    });

    // ✅ Update store (only valid images & all previews)
    SetListingData(prev => ({
      ...prev,
      uploadimage: {
        images: [...(prev.uploadimage?.images ?? []), ...validImages],
        preview: [...(prev.uploadimage?.preview ?? []), ...previewUrls],
      },
    }));

    // ✅ Track errors separately
    setErrorFlags(prev => [...prev, ...newErrorFlags]);
  };

  const handleClick = () => {
    trigger({
      data: { listingId: extractedId },
      step: 8,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    SetListingData(prev => {
      const updatedPreviews =
        prev.uploadimage?.preview?.filter((_, i) => i !== index) ?? [];

      let updatedImages = prev.uploadimage?.images ?? [];
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
        ...prev,
        uploadimage: {
          images: updatedImages,
          preview: updatedPreviews,
        },
      };
    });

    // ✅ Remove error flag at same index
    setErrorFlags(prev => prev.filter((_, i) => i !== index));
  };

  const extractedId = useMemo(() => {
    const parts = pathname.split('/');
    return parts[2] === 'listing' ? parts[4] : parts[2];
  }, [pathname]);

  return (
    <div className="space-y-6 h-[400px] overflow-y-auto">
      {/* Upload Box */}
      {(!ListingData?.uploadimage?.preview ||
        ListingData?.uploadimage?.preview.length === 0) && (
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
      {ListingData?.uploadimage?.preview &&
        ListingData?.uploadimage?.preview.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-18">
            {ListingData?.uploadimage?.preview.map((src, index) => {
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

                  {/* Image */}
                  <Image
                    src={src}
                    alt={`Uploaded ${index}`}
                    fill
                    className="object-cover"
                  />

                  {/* Error Label */}
                  {hasError && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs text-center p-3 rounded-md">
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
            disabled={!ListingData?.uploadimage?.images?.length}
            variant="black"
            onClick={handleClick}
            className="px-6 py-3 rounded-md text-white"
          >
            {(typeof common?.UPLOAD === 'string' && common?.UPLOAD) || 'Upload'}
          </Button>
        </div>
      </div>
    </div>
  );
}
