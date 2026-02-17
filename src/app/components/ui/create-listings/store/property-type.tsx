// store/useCreateListingApi.ts

import { create } from 'zustand';
import { PropertyTypeApi } from '@/services/listing/getapis';

export interface PropertyTypeData {
  _id: string;
  name: string;
  icon: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PropertyTypeStore {
  PropertyType: PropertyTypeData[];
  fetchPropertyType: () => Promise<void>;
}

export const usePropertyTypeStore = create<PropertyTypeStore>(set => ({
  PropertyType: [],

  fetchPropertyType: async () => {
    try {
      const response = await PropertyTypeApi(); // ✅ typed as ApiResponse<CategoryData[]>
      if (response.statusCode === 200 && Array.isArray(response.data)) {
        set({ PropertyType: response.data });
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  },
}));
