import { create } from 'zustand';

export interface SpaceData {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface SpaceStore {
  space: SpaceData[];
  setSpace: (data: SpaceData[]) => void;
}

export const useSpaceStore = create<SpaceStore>(set => ({
  space: [],
  setSpace: data => set({ space: data }),
}));
