import { create } from 'zustand';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  thinking?: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  model: string;
  created_at: Date;
  updated_at: Date;
  messages: Message[];
  message_count?: number;
}

interface ChatStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  isDarkMode: boolean;
  language: 'en' | 'ar';
  thinkingMode: boolean;
  focusLevel: number;
  
  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  setIsLoading: (loading: boolean) => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
  addMessage: (conversationId: string, message: Message) => void;
  setThinkingMode: (enabled: boolean) => void;
  setFocusLevel: (level: number) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  currentConversation: null,
  isLoading: false,
  isDarkMode: true,
  language: 'ar',
  thinkingMode: true,
  focusLevel: 100,
  
  setConversations: (conversations) => set({ conversations }),
  setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLanguage: (lang) => set({ language: lang }),
  addMessage: (conversationId, message) => 
    set((state) => {
      if (state.currentConversation?.id === conversationId) {
        return {
          currentConversation: {
            ...state.currentConversation,
            messages: [...state.currentConversation.messages, message]
          }
        };
      }
      return state;
    }),
  setThinkingMode: (enabled) => set({ thinkingMode: enabled }),
  setFocusLevel: (level) => set({ focusLevel: Math.min(100, Math.max(0, level)) })
})))
