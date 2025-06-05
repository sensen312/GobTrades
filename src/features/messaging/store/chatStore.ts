// src/features/messaging/store/chatStore.ts
import { create } from 'zustand';
import { Message, ChatPreview, TradeRequest } from '../../../types';
import { fetchChatsAndRequestsApi, fetchMessagesForChatApi, markChatAsReadApi } from '../../../api/message';

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error';
export type MessagesStatus = 'idle' | 'loading' | 'success' | 'error';

interface ChatState {
  chats: ChatPreview[];
  tradeRequests: TradeRequest[];
  messages: { [chatId: string]: Message[] };
  messagesStatus: { [chatId: string]: MessagesStatus };
  connectionStatus: ConnectionStatus;
  activeChatId: string | null;
  totalUnreadCount: number;
  error: string | null;
  
  fetchChatsAndRequests: () => Promise<void>;
  fetchMessages: (chatId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  addOptimisticMessage: (message: Message) => void;
  updateMessageStatus: (localId: string, chatId: string, status: Message['status'], serverId?: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setActiveChatId: (chatId: string | null) => void;
  markChatAsRead: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  tradeRequests: [],
  messages: {},
  messagesStatus: {},
  connectionStatus: 'disconnected',
  activeChatId: null,
  totalUnreadCount: 0,
  error: null,
  
  fetchChatsAndRequests: async () => {
    // Full implementation for future phases
  },
  fetchMessages: async (chatId) => {
    // Full implementation for future phases
  },
  addMessage: (message) => {
    set((state) => {
      const chatMessages = state.messages[message.chatId] || [];
      if (chatMessages.some(m => m._id === message._id)) {
        return {};
      }
      return {
        messages: {
          ...state.messages,
          [message.chatId]: [...chatMessages, message],
        },
      };
    });
  },
  addOptimisticMessage: (message) => {
     set((state) => {
        const chatMessages = state.messages[message.chatId] || [];
        return {
            messages: {
                ...state.messages,
                [message.chatId]: [...chatMessages, message]
            }
        };
     });
  },
  updateMessageStatus: (localId, chatId, status, serverId) => {
      set(state => {
          const chatMessages = state.messages[chatId] || [];
          const updatedMessages = chatMessages.map(m =>
              m.localId === localId ? { ...m, status, _id: serverId || m._id } : m
          );
          return {
              messages: { ...state.messages, [chatId]: updatedMessages }
          };
      });
  },
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
  markChatAsRead: async (chatId) => {
    // Full implementation for future phases
  },
}));
