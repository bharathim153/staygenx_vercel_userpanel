'use client';

import StepNavigation from './StepNavigation';

// Step 0
const stepList = [
  {
    number: 1,
    title: 'Tell us about your place',
    desc: 'Share some basic info, such as where it is and how many guests can stay.',
    img: '/images/tellus.png',
  },
  {
    number: 2,
    title: 'Make it stand out',
    desc: 'Add 5 or more photos plus a title and description – we’ll help you out.',
    img: '/images/tellus.png',
  },
  {
    number: 3,
    title: 'Finish up and publish',
    desc: 'Choose a starting price, verify a few details, then publish your listing.',
    img: '/images/tellus.png',
  },
];

const StepZero = () => (
  <div className="flex flex-col md:flex-row md:justify-between items-center w-full min-h-[400px]">
    <div className="w-full md:w-1/2 flex flex-col justify-center items-start mb-12 md:mb-0">
      <h1 className="text-3xl font-bold mb-6">
        It’s easy to get
        <br />
        started on Airbnb
      </h1>
    </div>
    <div className="w-full md:w-1/2 flex flex-col gap-8">
      {stepList.map(step => (
        <div
          key={step.number}
          className="flex items-center gap-6 border-b pb-8 last:border-b-0"
        >
          <div className="text-3xl font-semibold text-gray-900 min-w-[32px]">
            {step.number}
          </div>
          <div className="flex-1">
            <div className="text-xl font-bold mb-1">{step.title}</div>
            <div className="text-lg text-gray-600">{step.desc}</div>
          </div>
          <Image
            src={step.img}
            alt={step.title}
            width={112}
            height={80}
            className="w-28 h-20 object-contain"
          />
        </div>
      ))}
    </div>
  </div>
);

const StepOne = () => (
  <div className="flex flex-col md:flex-row md:justify-between items-center w-full min-h-[400px]">
    <div className="w-full md:w-1/2 mb-8 md:mb-0">
      <div className="text-left md:pl-12">
        <div className="text-xl font-semibold mb-2">Step 1</div>
        <h1 className="text-3xl font-bold mb-6">Tell us about your place</h1>
        <p className="text-xl text-gray-700">
          In this step, we&apos;ll ask you which type of property you have and
          if guests will book the entire place or just a room. Then let us know
          the location and how many guests can stay.
        </p>
      </div>
    </div>
    <div className="w-full md:w-1/2 flex justify-center">
      <Image
        src="/images/step1.jpg"
        alt="Step 1"
        width={384}
        height={256}
        className="max-w-md w-full"
      />
    </div>
  </div>
);

const propertyTypes = [
  { label: 'House', icon: '🏠' },
  { label: 'Flat/apartment', icon: '🏢' },
  { label: 'Barn', icon: '🏚️' },
  { label: 'Bed & breakfast', icon: '☕' },
  { label: 'Boat', icon: '⛵' },
  { label: 'Cabin', icon: '🛖' },
  { label: 'Campervan/motorhome', icon: '🚐' },
  { label: 'Casa particular', icon: '🏘️' },
  { label: 'Castle', icon: '🏰' },
];

const StepTwo = ({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (val: string) => void;
}) => (
  <div className="flex flex-col items-center w-full min-h-[400px]">
    <h1 className="text-3xl font-bold mb-8 text-center">
      Which of these best describes your place?
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
      {propertyTypes.map(type => (
        <Button
          key={type.label}
          onClick={() => onSelect(type.label)}
          className={`flex flex-col items-start border rounded-2xl p-6 text-left text-xl font-medium transition-all duration-150 h-36 w-full focus:outline-none ${selected === type.label ? 'border-black shadow-lg bg-gray-50' : 'border-gray-300 bg-white hover:border-black'}`}
        >
          <span className="text-4xl mb-2">{type.icon}</span>
          <span>{type.label}</span>
        </Button>
      ))}
    </div>
  </div>
);

import { loadGoogleMapsScript } from '@/hooks/loadMapScript';
import Button from '@/shadcn/ui/Button';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const placeTypes = [
  {
    label: 'An entire place',
    desc: 'Guests have the whole place to themselves.',
    icon: (
      <svg
        width="36"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 10.5V21h18V10.5M3 10.5L12 3l9 7.5" />
        <path d="M9 21V15h6v6" />
      </svg>
    ),
  },
  {
    label: 'A room',
    desc: 'Guests have their own room in a home, plus access to shared spaces.',
    icon: (
      <svg
        width="36"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="10" width="18" height="11" rx="2" />
        <path d="M7 21V10m10 11V10" />
        <path d="M12 14v7" />
      </svg>
    ),
  },
  {
    label: 'A shared room in a hostel',
    desc: 'Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.',
    icon: (
      <svg
        width="36"
        height="36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="10" width="18" height="11" rx="2" />
        <path d="M7 21V10m10 11V10" />
        <circle cx="8.5" cy="16.5" r="1.5" />
        <circle cx="15.5" cy="16.5" r="1.5" />
      </svg>
    ),
  },
];

// Step 3
const StepThree = ({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (val: string) => void;
}) => (
  <div className="flex flex-col items-center w-full min-h-[400px]">
    <h1 className="text-3xl font-bold mb-12 text-center">
      What type of place will guests have?
    </h1>
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      {placeTypes.map(type => (
        <Button
          key={type.label}
          onClick={() => onSelect(type.label)}
          className={`flex items-center justify-between border rounded-2xl px-8 py-6 text-left w-full transition-all duration-150 focus:outline-none ${
            selected === type.label
              ? 'border-black bg-gray-100 shadow-lg'
              : 'border-gray-300 bg-white hover:border-black'
          }`}
        >
          <div>
            <div className="text-2xl font-bold mb-1">{type.label}</div>
            <div className="text-lg text-gray-600">{type.desc}</div>
          </div>
          <div className="ml-8 text-gray-800">{type.icon}</div>
        </Button>
      ))}
    </div>
  </div>
);

// Step 4

const StepFour = ({
  location,
  onLocationChange,
}: {
  location: string;
  onLocationChange: (val: string) => void;
  locationSelected: boolean;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  // const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  // Load Google Maps script
  useEffect(() => {
    loadGoogleMapsScript();
    // Wait for window.google to be available
    const interval = setInterval(() => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Initialize map and autocomplete
  useEffect(() => {
    if (mapLoaded && mapRef.current && window.google) {
      const defaultCenter = { lat: 19.076, lng: 72.8777 };
      const gMap = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 8,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      // setMap(gMap);

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current!,
        {
          types: ['geocode'],
          componentRestrictions: { country: 'in' },
        }
      );
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          gMap.setCenter({ lat, lng });
          gMap.setZoom(15);
          if (marker) marker.setMap(null);
          const newMarker = new window.google.maps.Marker({
            position: { lat, lng },
            map: gMap,
          });
          setMarker(newMarker);
          onLocationChange(place.formatted_address || '');
        }
      });
    }
    // eslint-disable-next-line
  }, [mapLoaded]);

  return (
    <div className="flex flex-col items-center w-full min-h-[400px]">
      <h1 className="text-3xl font-bold mt-4 mb-4 text-center">
        Where&apos;s your place located?
      </h1>
      <div className="text-2xl text-gray-500 mb-8 text-center">
        Your address is only shared with guests after they&apos;ve made a
        reservation.
      </div>
      <div className="w-full max-w-2xl flex flex-col items-center">
        <div className="relative w-full mb-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-500">
            <svg
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="10" r="3.5" />
              <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.73 0l-1.41 1.41M6.34 17.66l-1.41 1.41" />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            className="pl-12 pr-4 py-4 w-full rounded-full shadow-lg text-xl border border-gray-200 focus:border-black focus:ring-2 focus:ring-black outline-none transition"
            placeholder="Enter your address"
            value={location}
            onChange={e => onLocationChange(e.target.value)}
          />
        </div>
        <div className="w-full h-72 rounded-3xl overflow-hidden bg-gray-200 flex items-center justify-center">
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

const steps = [
  { content: <StepZero /> },
  { content: <StepOne /> },
  { content: null },
  { content: null },
  { content: null },
];

const CreateListingSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null); // for StepTwo
  const [placeType, setPlaceType] = useState<string | null>(null); // for StepThree
  const [location, setLocation] = useState(''); // for StepFour

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // For progress bar, fill only for steps 1 and onward (step 0 = 0%)
  const fillPercent =
    currentStep === 0
      ? 0
      : steps.length > 2
        ? ((currentStep - 1) / (steps.length - 2)) * 100
        : 100;

  // Render step content
  let stepContent = null;
  if (currentStep === 2) {
    stepContent = (
      <StepTwo selected={selectedType} onSelect={setSelectedType} />
    );
  } else if (currentStep === 3) {
    stepContent = <StepThree selected={placeType} onSelect={setPlaceType} />;
  } else if (currentStep === 4) {
    stepContent = (
      <StepFour
        location={location}
        onLocationChange={setLocation}
        locationSelected={!!location}
      />
    );
  } else {
    stepContent = steps[currentStep].content;
  }

  // Navigation Button logic
  let isNextDisabled = false;
  if (currentStep === 2) isNextDisabled = !selectedType;
  if (currentStep === 3) isNextDisabled = !placeType;
  if (currentStep === 4) isNextDisabled = !location;

  return (
    <div className="flex flex-col w-full py-12 px-4 md:px-24 min-h-[600px]">
      <div className="flex-1 flex flex-col justify-center">{stepContent}</div>
      {/* Bottom Stepper Progress Bar*/}
      <div
        className="w-full relative mb-2"
        style={{
          position: 'fixed',
          left: 0,
          bottom: 90,
          zIndex: 40,
          background: 'white',
          height: '6px',
        }}
      >
        <div className="absolute left-0 top-0 w-full h-full bg-gray-200 rounded-full" />
        <div
          className="absolute left-0 top-0 h-full bg-black rounded-full transition-all duration-300"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      <StepNavigation
        onBack={handleBack}
        onNext={handleNext}
        backLabel="Back"
        nextLabel={currentStep === 0 ? 'Get started' : 'Next'}
        isBackHidden={currentStep === 0}
        isNextDisabled={isNextDisabled}
        currentStep={currentStep}
        totalSteps={steps.length}
        nextButtonClassName={
          currentStep === 0
            ? 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white'
            : undefined
        }
      />
    </div>
  );
};

export default CreateListingSteps;
