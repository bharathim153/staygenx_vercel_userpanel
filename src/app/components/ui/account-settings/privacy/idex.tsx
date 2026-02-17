'use client';
import Button from '@/shadcn/ui/Button';
import { ChevronRight, Lock } from 'lucide-react';
import { useState } from 'react';

export default function PrivacySettings() {
  const [readReceipts, setReadReceipts] = useState(true);
  const [searchEngineListing, setSearchEngineListing] = useState(true);
  const [showCity, setShowCity] = useState(false);
  const [showTripType, setShowTripType] = useState(false);

  const Toggle = ({
    enabled,
    onClick,
  }: {
    enabled: boolean;
    onClick: () => void;
  }) => (
    <Button
      onClick={onClick}
      disabled={enabled}
      variant={enabled ? 'black' : 'gray'}
      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200`}
    >
      <div
        className={`h-4 w-4 rounded-full transition-transform duration-200 transform ${
          enabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white'
        }`}
      />
    </Button>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      {/* Privacy */}
      <section className="space-y-6">
        <h2 className="text-[26px] font-semibold">Privacy</h2>

        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-[22px]">Read receipts</p>
            <p className="text-sm text-gray-600">
              Show people when I’ve read their messages.{' '}
              <a href="#" className="underline">
                Learn more
              </a>
            </p>
          </div>
          <Toggle
            enabled={readReceipts}
            onClick={() => setReadReceipts(!readReceipts)}
          />
        </div>
      </section>

      <hr />

      {/* Listings */}
      <section className="space-y-6">
        <h2 className="font-semibold text-[22px]">Listings</h2>

        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">
              Include my listing(s) in search engines
            </p>
            <p className="text-sm text-gray-600">
              Turning this on means search engines, like Google, will display
              your listing page(s) in search results.
            </p>
          </div>
          <Toggle
            enabled={searchEngineListing}
            onClick={() => setSearchEngineListing(!searchEngineListing)}
          />
        </div>
      </section>

      <hr />

      {/* Reviews */}
      <section className="space-y-6">
        <h2 className="font-semibold text-[22px]">Reviews</h2>
        <p className="text-sm text-gray-600">
          Choose what’s shared when you write a review. Updating this setting
          will change what’s displayed for all past reviews.{' '}
          <a href="#" className="underline">
            Learn more
          </a>
        </p>

        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">Show my home city and country</p>
            <p className="text-sm text-gray-600">E.g. City and country</p>
          </div>
          <Toggle enabled={showCity} onClick={() => setShowCity(!showCity)} />
        </div>

        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">Show my trip type</p>
            <p className="text-sm text-gray-600">
              E.g. Stayed with kids or pets
            </p>
          </div>
          <Toggle
            enabled={showTripType}
            onClick={() => setShowTripType(!showTripType)}
          />
        </div>
      </section>
      <hr />
      <div className=" space-y-6">
        <h2 className="text-xl font-semibold">Data privacy</h2>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button className="w-full flex justify-between items-center px-4 py-4 border rounded-xl text-left hover:bg-gray-50">
            <span className="font-medium">Request my personal data</span>
            <ChevronRight />
          </Button>

          <Button className="w-full flex justify-between items-center px-4 py-4  border rounded-xl text-left hover:bg-gray-50">
            <span className="font-medium">Delete my account</span>
            <ChevronRight />
          </Button>
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-4 bg-gray-100 border border-gray-200 rounded-xl p-4">
          <div className="text-pink-600 mt-1">
            <Lock size={24} strokeWidth={1.5} />
          </div>
          <div className="text-sm text-gray-700">
            <p className="font-medium">Committed to privacy</p>
            <p>
              staygenx is committed to keeping your data protected. Read details
              in our{' '}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              . To help us improve your experience,{' '}
              <a href="#" className="underline">
                share your feedback
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
