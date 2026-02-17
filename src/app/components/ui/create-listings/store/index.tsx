import { AddressFields } from '@/app/components/header/searchbarcomponents/autocomplete';
import { create } from 'zustand';

// --- Types ---
export interface Amenity {
  _id: string;
  name: string;
  icon: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface ListingData {
  [key: string]: unknown;
  listingId?: string;
  categories?: { category: string };
  propertytype?: { propertyType: string };
  amenities?: { amenities: string[] };
  uploadimage?: { images: (string | File)[]; preview: string[] };
  images?: string[];
  description?: { title: string; description: string };
  bookingmode: { bookingMode: string };
  baseprice: { weekday: number; weekend: number };
  location?: AddressFields;
  houseRule?: {
    houseRules: string[];
    hasSmokeAlarm: boolean;
    hasFirstAidKit: boolean;
    cancellationPolicy: string;
  };
  documentVerification?: {
    _id: string;
    listingId: string;
    documentType: string;
    frontImage: string;
    backImage: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  arrivalguide?: {
    checkInTime: string;
    checkOutTime: string;
    checkInMethod: string;
    wifiDetails: {
      networkName: string;
      password: string;
    };
    checkoutInstructions: string[];
  };
  photoTour?: [
    {
      roomType: string;
      roomTypeName: string;
      photos: string[];
      sleepingArrangements: string[];
      _id: string;
      icon?: string; // Optional icon field for space
    },
  ];
  floorplan?: Partial<{
    adults: number;
    children: number;
    infants: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    pets?: boolean;
  }>;
}

interface ListingStore {
  loading: boolean;
  setloading: (loading: boolean) => void;
  ListingData: ListingData;
  isInitial: boolean;
  SetListingData: (
    data: Partial<ListingData> | ((prev: ListingData) => Partial<ListingData>)
  ) => void;
  ResetListingData: () => void;
}

// --- Initial Listing State ---
const initialListingData: ListingData = {
  categories: { category: '' },
  propertytype: { propertyType: '' },
  amenities: { amenities: [] },
  uploadimage: { images: [], preview: [] },
  images: [],
  description: { title: '', description: '' },
  bookingmode: { bookingMode: '' },
  baseprice: { weekday: 0, weekend: 0 },
  publish: { status: 'Published' },
  houseRule: {
    houseRules: [],
    hasSmokeAlarm: false,
    hasFirstAidKit: false,
    cancellationPolicy: 'flexible',
  },
  arrivalguide: {
    checkInTime: '',
    checkOutTime: '',
    checkInMethod: '',
    wifiDetails: {
      networkName: '',
      password: '',
    },
    checkoutInstructions: [],
  },
  photoTour: [
    {
      roomType: '',
      roomTypeName: '',
      photos: [],
      sleepingArrangements: [],
      _id: '',
      icon: '',
    },
  ],
  location: {
    lat: 0,
    lng: 0,
    address: '',
    country: '',
    landmark: '',
    district: '',
    city: '',
    state: '',
    pincode: '',
    street: '',
  },
  documentVerification: {
    _id: '',
    listingId: '',
    documentType: '',
    frontImage: '',
    backImage: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    __v: 0,
  },
  floorplan: {
    adults: 1,
    children: 0,
    infants: 0,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    pets: false,
  },
};

// --- Deep Compare Utility ---
function deepEqual<T>(a: T, b: T): boolean {
  if (Object.is(a, b)) return true;

  if (typeof a !== typeof b || a === null || b === null) return false;

  if (typeof a !== 'object') return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((item, index) => deepEqual(item, b[index]))
    );
  }

  if (
    typeof a === 'object' &&
    typeof b === 'object' &&
    !Array.isArray(a) &&
    !Array.isArray(b)
  ) {
    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);

    if (keysA.length !== keysB.length) return false;

    return keysA.every(key =>
      deepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    );
  }

  return false;
}

// --- Zustand Store ---
export const useListingStore = create<ListingStore>((set, get) => ({
  loading: false,
  setloading: (loading: boolean) => set({ loading }),
  ListingData: initialListingData,
  isInitial: true,

  SetListingData: data => {
    const prev = get().ListingData;
    const newPartial = typeof data === 'function' ? data(prev) : data;
    const updated = { ...prev, ...newPartial };
    const isEqual = deepEqual(updated, initialListingData);

    set({
      ListingData: updated,
      isInitial: isEqual,
    });
  },

  ResetListingData: () => {
    set({
      ListingData: initialListingData,
      isInitial: true,
    });
  },
}));
