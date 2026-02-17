// store/useCreateListingApi.ts

import { CreateListingApi, CreateListingApiData } from '@/services/listing';
import { ApiResponse } from '@/utils/apiresponse';
import { create } from 'zustand';

interface Data {
  data: CreateListingApiData;
  step?: number;
  isEdit?: boolean;
  editdata?: Record<string, string | number>;
  arraydata?: {
    [key: string]:
      | Record<string, string[] | number[]>
      | string
      | boolean
      | string[]
      | number[];
  };
}
interface CreateListingApiStore {
  CreateListing: (param: Data) => Promise<ApiResponse>;
}

export const useCreateListingApi = create<CreateListingApiStore>(() => ({
  CreateListing: (param: Data): Promise<ApiResponse> => {
    return new Promise((resolve, reject) => {
      CreateListingApi(param, (res: ApiResponse) => {
        try {
          if (
            (res?.statusCode === 201 || res?.statusCode === 200) &&
            res?.data
          ) {
            resolve(res);
          } else {
            reject(new Error(res?.message || 'Failed to create listing'));
          }
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  },
}));
