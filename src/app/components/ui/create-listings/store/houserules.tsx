import { create } from 'zustand';

export interface Data {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface HouseRulesStore {
  HouserulesData: Data[];
  setHouseRules: (data: Data[]) => void;
}

export const useHouseruleStore = create<HouseRulesStore>(set => ({
  HouserulesData: [],
  setHouseRules: data => set({ HouserulesData: data }),
}));
