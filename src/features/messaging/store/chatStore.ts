// src/features/messaging/store/chatStore.ts (Phase 1 Stub)
import { create } from 'zustand';
interface ChatStateStub { error: string | null; }
export const useChatStore = create<ChatStateStub>(() => ({ error: null }));
