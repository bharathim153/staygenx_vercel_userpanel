// lib/stores/dialog-store.ts
import { create } from 'zustand';

type Message = {
  reservationSection: boolean;
  setReserveSection: (value: boolean) => void;

  conversation: boolean;
  setconversation: (value: boolean) => void;

  messageList: boolean;
  setMessageList: (value: boolean) => void;
};

export const useMessageStore = create<Message>(set => ({
  reservationSection: true,
  setReserveSection: value => set({ reservationSection: value }),

  conversation: false,
  setconversation: value => set({ conversation: value }),

  messageList: true,
  setMessageList: value => set({ messageList: value }),
}));
