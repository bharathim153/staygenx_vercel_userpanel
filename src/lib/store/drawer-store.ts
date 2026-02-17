import { create } from 'zustand';

type DrawerState = {
  name: string | null;
  props?: Record<string, unknown>;
  openDrawer: (name: string, props?: Record<string, unknown>) => void;
  closeDrawer: () => void;
};

export const useDrawerStore = create<DrawerState>(set => ({
  name: null,
  props: {},
  openDrawer: (name, props = {}) => set({ name, props }),
  closeDrawer: () => set({ name: null, props: {} }),
}));
