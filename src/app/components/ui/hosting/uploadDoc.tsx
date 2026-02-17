import { useCustomMutation } from '@/hooks/useCustomeMutation';
import { DocumentVerify } from '@/services/user/verify';
import Button from '@/shadcn/ui/Button';
import { ArrowLeft, CreditCard, IdCard, Lock } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function UploadDocuments({
  selected,
  handleback,
}: {
  selected: string;
  handleback: () => void;
}) {
  const Router = useRouter();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);

  const [backImage, setBackImage] = useState<File | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: 'front' | 'back'
  ) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (side === 'front') {
      setFrontImage(file);
      setFrontPreview(previewUrl);
    } else {
      setBackImage(file);
      setBackPreview(previewUrl);
    }
  };
  const { trigger, isPending } = useCustomMutation(DocumentVerify, {
    onSuccessCallback: data => {
      if (data) {
        Router.push(`verify-listing/${listingId}`);
      }
    },
  });
  const isContinueEnabled = frontImage && backImage;
  const searchparams = useSearchParams();
  const listingId = searchparams.get('listingid');

  const handleVerify = () => {
    if (!listingId || !frontImage || !backImage) return;
    const formData = new FormData();
    formData.append('listingId', listingId);
    formData.append('documentType', selected);
    formData.append('frontImage', frontImage);
    formData.append('backImage', backImage);

    trigger({ body: formData });
  };

  return (
    <div className="p-6 h-full flex flex-col gap-6 justify-center">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">
          Upload images of your driving licence
        </h2>
        <p className="text-sm text-gray-600">
          Make sure your photos aren’t blurry and the front of your driving
          licence clearly shows your face.
        </p>
      </div>

      <div className="flex gap-4">
        {/* Upload front */}
        <label
          htmlFor="front-upload"
          className="flex w-full items-center justify-center border h-[155px] border-dashed border-gray-400 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden"
        >
          {frontPreview ? (
            <Image
              src={frontPreview}
              alt="Front preview"
              className="w-full h-[155px] object-contain"
              width={100}
              height={100}
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">
                <IdCard />
              </div>
              <div className="font-medium text-gray-800">Upload front</div>
              <div className="text-xs text-gray-500">JPEG or PNG only</div>
            </div>
          )}
          <input
            id="front-upload"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={e => handleFileChange(e, 'front')}
          />
        </label>

        {/* Upload back */}
        <label
          htmlFor="back-upload"
          className="flex w-full items-center justify-center border h-[155px] border-dashed border-gray-400 rounded-lg text-center  cursor-pointer hover:bg-gray-50 transition relative overflow-hidden"
        >
          {backPreview ? (
            <Image
              src={backPreview}
              alt="Back preview"
              className="w-full h-[155px] object-contain"
              fill
            />
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">
                <CreditCard />
              </div>
              <div className="font-medium text-gray-800">Upload back</div>
              <div className="text-xs text-gray-500">JPEG or PNG only</div>
            </div>
          )}
          <input
            id="back-upload"
            type="file"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={e => handleFileChange(e, 'back')}
          />
        </label>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          onClick={handleback}
          className="text-sm text-black underline hover:text-gray-700 flex items-center"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button
          onClick={handleVerify}
          variant="black"
          disabled={!isContinueEnabled}
          loading={isPending}
          className={`py-2 px-6 rounded-lg font-medium flex gap-2 items-center justify-center ${
            isContinueEnabled
              ? 'bg-black text-white hover:bg-gray-900'
              : 'bg-gray-300 text-white cursor-not-allowed'
          }`}
        >
          <Lock size={16} /> Continue
        </Button>
      </div>
    </div>
  );
}
