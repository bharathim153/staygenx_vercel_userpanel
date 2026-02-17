import { BookingPriceBreakdown } from '@/services/bookings';
import { create } from 'zustand';

export interface EstimationRequestPayload {
  listingId: string;
  checkInDate: string; // ISO date string (YYYY-MM-DD)
  checkOutDate: string; // ISO date string (YYYY-MM-DD)
  guestCount: number;
}

interface EstimationState {
  loading: boolean;
  setloading: (value: boolean) => void;
  estimationData: BookingPriceBreakdown | null;
  setEstimation: (data: BookingPriceBreakdown | null) => void;
}

export const useEstimationStore = create<EstimationState>(set => ({
  loading: false,
  setloading: value => set({ loading: value }),
  estimationData: null,
  setEstimation: estimationData => {
    set({ estimationData });
  },
}));
