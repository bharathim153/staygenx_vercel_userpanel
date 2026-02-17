import { BlockDatesApi, UnBlockDatesApi } from '@/services/host';
import { ApiResponse } from '@/utils/apiresponse';
import { create } from 'zustand';

export interface BlockdateRequestPayload {
  listingId: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate: string; // ISO date string (YYYY-MM-DD)
  title?: string;
  description?: string;
}
export interface BlockedDate {
  _id: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  title: string;
  description: string;
  reason: 'manual' | string;
}

interface BLockdatesState {
  blockdateData: Record<string, unknown> | null;
  BlockDates: (data: { body: BlockdateRequestPayload }) => Promise<ApiResponse>;

  unblockdateData: Record<string, unknown> | null;
  unBlockDates: (data: {
    body: BlockdateRequestPayload;
  }) => Promise<ApiResponse>;

  loading: boolean;
  setloading: (value: boolean) => void;

  BlockDatesData: BlockedDate[];
  setBlockDatesData: (value: BlockedDate[]) => void;
}

export const useBlockdatesStore = create<BLockdatesState>(set => ({
  blockdateData: null,

  BlockDates: data => {
    return new Promise((resolve, reject) => {
      try {
        BlockDatesApi(data, (res: ApiResponse) => {
          set({ blockdateData: res });
          if (res?.success) {
            resolve(res);
          } else {
            reject(new Error('User exists check failed'));
          }
        });
      } catch (err) {
        set({ blockdateData: null });
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  },

  unblockdateData: null,

  unBlockDates: data => {
    return new Promise((resolve, reject) => {
      try {
        UnBlockDatesApi(data, (res: ApiResponse) => {
          set({ unblockdateData: res });
          if (res?.success) {
            resolve(res);
          } else {
            reject(new Error('User exists check failed'));
          }
        });
      } catch (err) {
        set({ blockdateData: null });
        reject(err instanceof Error ? err : new Error(String(err)));
      }
    });
  },

  loading: false,
  setloading: value => set({ loading: value }),
  BlockDatesData: [],
  setBlockDatesData: value => set({ BlockDatesData: value }),
}));
