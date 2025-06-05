// src/api/message.ts
import apiClient from './index';
import {
  FetchChatsAndRequestsResponseDto,
  FetchMessagesParamsDto,
  FetchMessagesResponseDto,
  UploadChatMessageImageApiDto
} from '../types';

export const fetchChatsAndRequestsApi = async (): Promise<FetchChatsAndRequestsResponseDto> => {
  console.log('API CALL: GET /messages/chats-and-requests (Phase 1 Stub)');
  return Promise.resolve({ chats: [], tradeRequests: [] });
};

export const fetchMessagesForChatApi = async (
  chatId: string,
  params?: FetchMessagesParamsDto
): Promise<FetchMessagesResponseDto> => {
  console.log(`API CALL: GET /messages/chats/${chatId}/messages (Phase 1 Stub)`, params);
  return Promise.resolve({ items: [], hasMore: false, currentPage: params?.page || 1, totalItems: 0, totalPages: 0 });
};

// Stubbing this function as it is not used in Phase 1
export const uploadChatMessageImageApi = async (formData: FormData): Promise<UploadChatMessageImageApiDto> => {
    console.log('API CALL: POST /messages/images (STUBBED FOR PHASE 1)');
    // Simulate a successful response with a dummy filename
    return Promise.resolve({ imageFilename: 'stubbed_image.jpg' });
};

// Stubbing this function as it is not used in Phase 1
export const markChatAsReadApi = async (chatId: string): Promise<void> => {
    console.log(`API CALL: POST /messages/chats/${chatId}/read (STUBBED FOR PHASE 1)`);
    return Promise.resolve();
};

