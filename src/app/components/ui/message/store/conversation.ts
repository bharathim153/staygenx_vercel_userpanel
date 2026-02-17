import { create } from 'zustand';

interface Conversation {
  message: string;
}

interface ConversationStore {
  conversation: Conversation[];
  setConversation: (value: Conversation) => void;
}

export const useConversationStore = create<ConversationStore>(set => ({
  conversation: [],

  setConversation: value =>
    set(state => ({
      conversation: [...state.conversation, value],
    })),
}));
