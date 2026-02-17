// lib/stores/dialog-store.ts
import { ReactNode } from 'react';
import { create } from 'zustand';

type DialogState = {
  openSearch: boolean;
  setOpenSearch: (open: boolean) => void;

  GooglemapLoader: boolean;
  setGooglemapLoader: (value: boolean) => void;

  isLoggedin: boolean;
  setIsLoggedIn: (value: boolean) => void;

  successHeader: {
    header: boolean;
    content: string;
    email: string;
  };
  setSuccessHeader: (value: {
    header: boolean;
    content: string;
    email: string;
  }) => void;

  ListingEdit: {
    isEdit: boolean;
    content: ReactNode;
    title?: string;
  };
  setListingEdit: (value: {
    isEdit: boolean;
    content: ReactNode;
    title?: string;
  }) => void;

  title: string;
  setTitle: (value: string) => void;
};

export const useGlobalStore = create<DialogState>(set => ({
  openSearch: true,
  setOpenSearch: open => set({ openSearch: open }),

  GooglemapLoader: false,
  setGooglemapLoader: (value: boolean) => set({ GooglemapLoader: value }),

  isLoggedin: false,
  setIsLoggedIn: (value: boolean) => set({ isLoggedin: value }),

  successHeader: {
    header: false,
    content: '',
    email: '',
  },
  setSuccessHeader: (value: {
    header: boolean;
    content: string;
    email: string;
  }) => set({ successHeader: value }),

  ListingEdit: {
    isEdit: false,
    content: null,
    title: '',
  },
  setListingEdit: value => set({ ListingEdit: value }),

  title: 'Login/Signup',
  setTitle: value => set({ title: value }),
}));
