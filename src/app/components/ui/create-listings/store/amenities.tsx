import { create } from 'zustand';

export interface AmenityApiData {
  _id: string;
  name: string;
  icon: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string; // ISO date string
  __v: number;
}

interface AmenityStore {
  AmenityData: AmenityApiData[];
  setAmenity: (data: AmenityApiData[]) => void;
}

export const useAmenityStore = create<AmenityStore>(set => ({
  AmenityData: [],
  setAmenity: data => set({ AmenityData: data }),
}));
