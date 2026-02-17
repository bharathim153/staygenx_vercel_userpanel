// store/useCreateListingApi.ts

import { create } from 'zustand';
import { CategoryApi } from '@/services/listing/getapis';

export interface CategoryData {
  _id: string;
  name: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CategoryStore {
  categoryData: CategoryData[];
  fetchCategory: () => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>(set => ({
  categoryData: [],

  fetchCategory: async () => {
    try {
      const response = await CategoryApi(); // ✅ typed as ApiResponse<CategoryData[]>
      if (response.statusCode === 200 && Array.isArray(response.data)) {
        set({ categoryData: response.data });
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  },
}));
