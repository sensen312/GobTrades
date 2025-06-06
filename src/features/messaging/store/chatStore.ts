// src/features/messaging/store/chatStore.ts
import { create } from 'zustand';
import { Message, ChatPreview, TradeRequest } from '../../../types';
import { fetchChatsAndRequestsApi, fetchMessagesForChatApi, markChatAsReadApi } from '../../../api/message';
import { showErrorToast } from '../../../utils/toast';

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
    try {
      const response = await fetchChatsAndRequestsApi();
      const unread = response.chats.reduce((acc, chat) => acc + chat.unreadCount, 0);
      set({ chats: response.chats, tradeRequests: response.tradeRequests, totalUnreadCount: unread });
    } catch (e: any) {
      showErrorToast("Failed to fetch messages and requests.");
    }
  },

  fetchMessages: async (chatId) => {
    set(state => ({ messagesStatus: { ...state.messagesStatus, [chatId]: 'loading' }}));
    try {
        const response = await fetchMessagesForChatApi(chatId);
        set(state => ({ 
            messages: { ...state.messages, [chatId]: response.items },
            messagesStatus: { ...state.messagesStatus, [chatId]: 'success' }
        }));
    } catch (e: any) {
        set(state => ({ messagesStatus: { ...state.messagesStatus, [chatId]: 'error' }, error: "Failed to load messages"}));
    }
  },

  addMessage: (message) => {
    set((state) => {
      const chatMessages = state.messages[message.chatId] || [];
      if (chatMessages.some(m => m._id === message._id)) return {};
      return { messages: { ...state.messages, [message.chatId]: [...chatMessages, message] } };
    });
  },

  addOptimisticMessage: (message) => {
     set((state) => ({
        messages: {
            ...state.messages,
            [message.chatId]: [...(state.messages[message.chatId] || []), message]
        }
     }));
  },

  updateMessageStatus: (localId, chatId, status, serverId) => {
      set(state => {
          const chatMessages = state.messages[chatId] || [];
          const updatedMessages = chatMessages.map(m =>
              m.localId === localId ? { ...m, status, _id: serverId || m._id } : m
          );
          return { messages: { ...state.messages, [chatId]: updatedMessages } };
      });
  },
  
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setActiveChatId: (chatId) => set({ activeChatId: chatId }),
  
  markChatAsRead: async (chatId) => {
    set(state => {
        const chat = state.chats.find(c => c._id === chatId);
        if (!chat || chat.unreadCount === 0) return {};
        const newTotal = state.totalUnreadCount - chat.unreadCount;
        return {
            totalUnreadCount: newTotal < 0 ? 0 : newTotal,
            chats: state.chats.map(c => c._id === chatId ? {...c, unreadCount: 0} : c)
        };
    });
    try {
        await markChatAsReadApi(chatId);
    } catch (e) {
        console.error("Failed to mark chat as read on server:", e);
    }
  },
}));
