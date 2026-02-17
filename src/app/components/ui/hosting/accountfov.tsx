'use client';

import Button from '@/shadcn/ui/Button';
import { Car, Globe, IdCard, Lock } from 'lucide-react';
import { useState } from 'react';
import UploadDocuments from './uploadDoc';

export default function AccountFov() {
  const [selectedID, setSelectedID] = useState<string | null>(null);
  const [upload, setUpload] = useState<string | null>(null);

  const idOptions = [
    { id: 'Driving License', label: 'Driving licence', icon: <Car /> },
    { id: 'Passport', label: 'Passport', icon: <Globe /> },
    { id: 'PAN card', label: 'PAN card', icon: <IdCard /> },
  ];

  return (
    <div className="max-w-md mx-auto overflow-auto scrollbar-hide flex items-center justify-center h-full">
      {!upload ? (
        <div className=" p-6 h-full flex flex-col gap-6 items-center justify-center">
          <div className=" w-full flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Choose an ID type to add</h2>
          </div>

          <div className="flex flex-col gap-3 w-full">
            {idOptions.map(option => (
              <Button
                key={option.id}
                onClick={() => setSelectedID(option.id)}
                className={`w-full flex items-center gap-4 border p-6 rounded-lg text-left hover:bg-gray-50 transition ${
                  selectedID === option.id
                    ? 'border-black border-2'
                    : 'border-gray-300'
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="text-gray-800 font-medium">
                  {option.label}
                </span>
              </Button>
            ))}
          </div>

          <div className="text-sm text-gray-600">
            <p>
              To help protect your personal info, don’t submit your Aadhaar or
              your UIDAI ID card or number. Instead, you can submit a driving
              licence, PAN ID or passport.{' '}
              <a href="#" className="text-blue-600 underline">
                Learn more
              </a>
            </p>
            <p className="mt-2">
              Your ID will be handled according to our{' '}
              <a href="#" className="text-blue-600 underline">
                Privacy Policy
              </a>{' '}
              and won’t be shared with your Host or guests.
            </p>
          </div>
          <Button
            variant="black"
            disabled={!selectedID}
            onClick={() => setUpload(selectedID)}
            className={`w-full p-3 rounded-lg text-white font-medium flex gap-2 c-items-center justify-center ${
              selectedID
                ? 'bg-black hover:bg-gray-900'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Lock size={16} /> Continue
          </Button>
        </div>
      ) : (
        <UploadDocuments
          selected={selectedID as string}
          handleback={() => setUpload(null)}
        />
      )}
    </div>
  );
}
