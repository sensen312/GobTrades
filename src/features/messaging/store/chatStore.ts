import { create } from 'zustand';
import { ChatPreview, Message } from '../../../types'; // Adjusted path
import { fetchChatsApi, fetchMessagesForChatApi } from '../../../api/message'; // Adjusted path
import { showErrorToast } from '../../../utils/toast'; // Adjusted path
import { useAuthStore } from '../../auth/store/authStore'; // Adjusted path

type ChatStatus = 'idle' | 'loading' | 'success' | 'error';
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface ChatState {
    chats: ChatPreview[];
    messages: { [chatId: string]: Message[] }; // Store messages keyed by chatId
    chatsStatus: ChatStatus;
    messagesStatus: { [chatId: string]: ChatStatus }; // Store status per chat
    connectionStatus: ConnectionStatus;
    activeChatId: string | null; // Track the currently viewed chat
    unreadCounts: { [chatId: string]: number };
    totalUnreadCount: number;
    error: string | null;

    // --- Actions ---
    setConnectionStatus: (status: ConnectionStatus) => void;
    fetchChats: () => Promise<void>;
    fetchMessages: (chatId: string) => Promise<void>; // Load messages for a specific chat
    addMessage: (message: Message) => void; // Add incoming/sent message
    addOptimisticMessage: (message: Message) => void; // Add message to UI before sending
    updateMessageStatus: (localId: string, chatId: string, newStatus: 'sent' | 'failed', serverId?: string) => void; // Update status after send attempt
    markChatAsRead: (chatId: string) => void;
    setActiveChatId: (chatId: string | null) => void;
    resetChatState: () => void; // Action to reset the state
}

// Define initial state values directly without Omit
// This object shape matches the data properties defined in ChatState
const initialStateData = {
    chats: [],
    messages: {},
    chatsStatus: 'idle' as ChatStatus, // Explicit type assertion
    messagesStatus: {},
    connectionStatus: 'disconnected' as ConnectionStatus, // Explicit type assertion
    activeChatId: null,
    unreadCounts: {},
    totalUnreadCount: 0,
    error: null,
};


// Create the store
export const useChatStore = create<ChatState>((set, get) => ({
    // Spread the correctly defined initial data state
    ...initialStateData,

    // --- Actions Implementation ---
    setConnectionStatus: (status) => set({ connectionStatus: status }),

    fetchChats: async () => {
        if (get().chatsStatus === 'loading') return;
        set({ chatsStatus: 'loading', error: null });
        try {
            const fetchedChats = await fetchChatsApi();
            const sortedChats = fetchedChats.sort((a, b) =>
                new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
            );

            let initialTotalUnread = 0;
            const initialUnreadCounts: { [chatId: string]: number } = {};
            sortedChats.forEach(chat => {
                initialUnreadCounts[chat._id] = chat.unreadCount || 0;
                initialTotalUnread += chat.unreadCount || 0;
            });

            set({
                chats: sortedChats,
                unreadCounts: initialUnreadCounts,
                totalUnreadCount: initialTotalUnread,
                chatsStatus: 'success'
            });
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not load your chats.";
            console.error("Fetch Chats Error:", message);
            set({ chatsStatus: 'error', error: message });
            showErrorToast(message, "Chats Error");
        }
    },

    fetchMessages: async (chatId: string) => {
        const currentStatus = get().messagesStatus[chatId];
        if (currentStatus === 'loading' || currentStatus === 'success') return;

        set(state => ({
            messagesStatus: { ...state.messagesStatus, [chatId]: 'loading' },
            error: null
        }));

        try {
            const fetchedMessagesResponse = await fetchMessagesForChatApi(chatId, { limit: 50 });
            const fetchedMessages = fetchedMessagesResponse.items;

            set((state) => ({
                messages: {
                    ...state.messages,
                    [chatId]: fetchedMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                },
                messagesStatus: { ...state.messagesStatus, [chatId]: 'success' }
            }));

            if (get().activeChatId === chatId) {
                get().markChatAsRead(chatId);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Could not load messages for this chat.";
            console.error(`Workspace Messages Error (Chat ${chatId}):`, message);
            set(state => ({
                messagesStatus: { ...state.messagesStatus, [chatId]: 'error' },
                 error: message
            }));
            showErrorToast(message, "Messages Error");
        }
    },

    addMessage: (message: Message) => {
        set((state) => {
            const chatId = message.chatId;
            const currentMessages = state.messages[chatId] || [];
            let messageUpdated = false;
            let newChatMessages: Message[];

            const updatedOptimistic = currentMessages.map(m => {
                if (m.localId && m.localId === message.localId) {
                    messageUpdated = true;
                    return { ...message, status: 'sent' as const };
                }
                return m;
            });

            if (messageUpdated) {
                newChatMessages = updatedOptimistic;
            } else if (!currentMessages.some(m => m._id === message._id)) {
                newChatMessages = [...currentMessages, { ...message, status: 'sent' }];
            } else {
                 return {}; // Ignore likely duplicate
            }

            const newMessagesState = { ...state.messages, [chatId]: newChatMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) };

            let newUnreadCounts = { ...state.unreadCounts };
            let newTotalUnreadCount = state.totalUnreadCount;
            const currentUserUuid = useAuthStore.getState().uuid;

            if (!messageUpdated && state.activeChatId !== chatId && message.senderId !== currentUserUuid) {
                newUnreadCounts[chatId] = (newUnreadCounts[chatId] || 0) + 1;
                newTotalUnreadCount++;
            }

            const updatedChats = state.chats.map(chat =>
                chat._id === chatId
                    ? {
                        ...chat,
                        lastMessagePreview: message.text?.substring(0, 30) || (message.imageFilename ? '📷 Image' : (message.isOffer ? '🎁 Trade Offer' : '...')),
                        lastMessageAt: message.createdAt,
                        unreadCount: newUnreadCounts[chatId] || 0
                      }
                    : chat
            ).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());


            return {
                messages: newMessagesState,
                unreadCounts: newUnreadCounts,
                totalUnreadCount: newTotalUnreadCount,
                chats: updatedChats
            };
        });
    },

     addOptimisticMessage: (message: Message) => {
        set((state) => {
            const chatId = message.chatId;
            const currentMessages = state.messages[chatId] || [];

            if (!message.localId) {
                console.error("Optimistic message requires a localId.");
                return {};
            }
             const optimisticMsg = { ...message, status: 'sending' as const };

            if (currentMessages.some(m => m.localId === optimisticMsg.localId)) {
                console.warn(`Optimistic message with localId ${optimisticMsg.localId} already exists.`);
                return {};
            }

            const newMessagesState = { ...state.messages, [chatId]: [...currentMessages, optimisticMsg].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) };

             const updatedChats = state.chats.map(chat =>
                chat._id === chatId
                    ? {
                        ...chat,
                         lastMessagePreview: message.text?.substring(0, 30) || (message.imageFilename ? '📷 Image' : (message.isOffer ? '🎁 Trade Offer' : '...')),
                         lastMessageAt: message.createdAt,
                       }
                    : chat
             ).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

            return { messages: newMessagesState, chats: updatedChats };
        });
    },

    updateMessageStatus: (localId, chatId, newStatus, serverId) => {
        set(state => {
            const chatMessages = state.messages[chatId] || [];
            let messageFound = false;
            const updatedMessages = chatMessages.map(msg => {
                if (msg.localId === localId) {
                    messageFound = true;
                    return {
                        ...msg,
                        status: newStatus,
                        _id: (newStatus === 'sent' && serverId) ? serverId : msg._id,
                    };
                }
                return msg;
            }).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            if (!messageFound) {
                 console.warn(`updateMessageStatus: Message with localId ${localId} not found in chat ${chatId}.`);
                 return {};
             }

            return {
                messages: { ...state.messages, [chatId]: updatedMessages }
            };
        });
    },


    markChatAsRead: (chatId: string) => {
        set((state) => {
            const count = state.unreadCounts[chatId] || 0;
            if (count > 0) {
                const newUnreadCounts = { ...state.unreadCounts, [chatId]: 0 };
                const newTotalUnreadCount = Math.max(0, state.totalUnreadCount - count);
                 const updatedChats = state.chats.map(chat =>
                    chat._id === chatId ? { ...chat, unreadCount: 0 } : chat
                 );

                return {
                    unreadCounts: newUnreadCounts,
                    totalUnreadCount: newTotalUnreadCount,
                    chats: updatedChats
                 };
            }
            return {};
        });
    },

    setActiveChatId: (chatId) => {
        const currentActiveChatId = get().activeChatId;
        if (chatId !== currentActiveChatId) {
            set({ activeChatId: chatId });
            if (chatId) {
                get().markChatAsRead(chatId);
            }
        }
    },

    // Reset state to initial values
    resetChatState: () => set(initialStateData),
}));