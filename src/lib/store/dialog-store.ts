// lib/stores/dialog-store.ts
import { create } from 'zustand';
import { useGlobalStore } from './global-store';

type DialogState = {
  name: string | null;
  props?: Record<string, unknown>;

  nameNested: string | null;
  propsNested?: Record<string, unknown>;

  openDialog: (name: string, props?: Record<string, unknown>) => void;
  closeDialog: () => void;

  openDialogNested: (name: string, props?: Record<string, unknown>) => void;
  closeDialogNested: () => void;
};

export const useDialogStore = create<DialogState>(set => ({
  name: null,
  props: {},

  nameNested: null,
  propsNested: {},

  openDialog: (name, props = {}) => set({ name, props }),
  closeDialog: () => {
    set({ name: null, props: {} });
    useGlobalStore.getState().setTitle('Login/Signup');
  },

  openDialogNested: (nameNested, propsNested = {}) =>
    set({ nameNested, propsNested }),
  closeDialogNested: () => set({ nameNested: null, propsNested: {} }),
}));
