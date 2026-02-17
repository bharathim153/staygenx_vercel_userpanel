import { initiatePayment, Reserve } from '@/services/bookings/payments.ts';
import { create } from 'zustand';

export interface EstimationRequestPayload {
  listingId: string;
  checkInDate: string; // ISO date string (YYYY-MM-DD)
  checkOutDate: string; // ISO date string (YYYY-MM-DD)
  guestCount: number;
}

interface PaymentData {
  body: Record<string, unknown>;
}

interface PaymentsState {
  initiateBooking: Record<string, unknown> | null;
  PostInitiateBooking: (data: PaymentData) => Promise<void>;
  ReservatoinData: Record<string, unknown> | null;
  Reservatoin: (data: PaymentData) => Promise<void>;
}

export const usePaymentStore = create<PaymentsState>(set => ({
  initiateBooking: null,
  ReservatoinData: null,

  PostInitiateBooking: (data: PaymentData) => {
    return new Promise<void>((resolve, reject) => {
      initiatePayment(data, (res: unknown) => {
        if (
          typeof res === 'object' &&
          res !== null &&
          'data' in res &&
          typeof (res as { data?: unknown }).data === 'object' &&
          (res as { data?: { statusCode?: number } }).data?.statusCode === 201
        ) {
          debugger;
          set({
            initiateBooking: (res as { data: { data: unknown } }).data
              .data as Record<string, unknown>,
          });
          resolve();
        } else {
          reject(new Error('Initiate booking failed'));
        }
      });
    });
  },

  Reservatoin: (data: PaymentData) => {
    return new Promise<void>((resolve, reject) => {
      Reserve(data, (res: unknown) => {
        if (
          typeof res === 'object' &&
          res !== null &&
          'data' in res &&
          typeof (res as { data?: unknown }).data === 'object' &&
          (res as { data?: { statusCode?: number } }).data?.statusCode === 201
        ) {
          debugger;
          set({
            ReservatoinData: (res as { data: { data: unknown } }).data
              .data as Record<string, unknown>,
          });
          resolve();
        } else {
          reject(new Error('Initiate booking failed'));
        }
      });
    });
  },
}));
