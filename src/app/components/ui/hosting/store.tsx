import { create } from 'zustand';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  userinfo: null; // adjust if userinfo has a defined shape
}

export interface Category {
  _id: string;
  name: string;
}

export interface PropertyType {
  _id: string;
  name: string;
}

export interface Amenity {
  _id: string;
  name: string;
  icon: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ListingTypes {
  _id: string;
  userId: User;
  category: Category;
  propertyType: PropertyType;
  adults: number;
  pets: boolean;
  amenities: string[];
  images: string[];
  title: string;
  description: string;
  bookingMode: string;
  firstGuestPolicy: string;
  houseRules: string[]; // could be string[] if needed
  hasSmokeAlarm: boolean;
  hasCarbonMonoxideAlarm: boolean;
  hasFirstAidKit: boolean;
  hasFireExtinguisher: boolean;
  cancellationPolicy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  pincode: string;
  state: string;
  bathrooms: number;
  bedrooms: number;
  beds: number;
  children: number;
  infants: number;
  weekdayBasePrice: number;
  weekendBasePrice: number;
  progressPercentage: number;
  photoTour: [
    {
      roomType: string;
      roomTypeName: string;
      photos: string[];
      sleepingArrangements: string[];
      _id: string;
    },
  ];
  arrivalGuide: {
    checkInTime: string;
    checkOutTime: string;
    checkInMethod: string;
    wifiDetails: {
      networkName: string;
      password: string;
    };
    checkoutInstructions: string[];
  };
  documentVerification: {
    _id: string;
    listingId: string;
    userId: string;
    documentType: string;
    frontImage: string;
    backImage: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface SingleListStore {
  Lists: ListingTypes[];
  setList: (value: ListingTypes[]) => void;
  loading: boolean;
  setloading: (value: boolean) => void;
}

export const useListeStore = create<SingleListStore>(set => ({
  loading: false,
  setloading: value => set({ loading: value }),
  Lists: [],
  setList: value => set({ Lists: value }),
}));
