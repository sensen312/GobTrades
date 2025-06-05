// src/api/message.ts
import apiClient from './index';
import {
  FetchChatsAndRequestsResponseDto,
  FetchMessagesParamsDto,
  FetchMessagesResponseDto,
} from '../types';

/**
 * Fetches chat previews and pending trade requests.
 * Stub for Phase 1, will return empty arrays.
 * Reasoning: Placeholder for future messaging list functionality.
 * @returns A promise resolving to an object containing empty arrays for chats and trade requests.
 */
export const fetchChatsAndRequestsApi = async (): Promise<FetchChatsAndRequestsResponseDto> => {
  console.log('API CALL: GET /messages/chats-and-requests (Phase 1 Stub)');
  // For Phase 1, this endpoint might not be fully implemented or might return empty data.
  // Simulating an empty response as per the plan.
  return Promise.resolve({ chats: [], tradeRequests: [] });
};

/**
 * Fetches messages for a specific chat.
 * Stub for Phase 1, will return an empty paginated response.
 * Reasoning: Placeholder for future chat history functionality.
 * @param chatId - The ID of the chat.
 * @param params - Pagination parameters.
 * @returns A promise resolving to an empty paginated message response.
 */
export const fetchMessagesForChatApi = async (
  chatId: string,
  params?: FetchMessagesParamsDto
): Promise<FetchMessagesResponseDto> => {
  console.log(`API CALL: GET /messages/chats/${chatId}/messages (Phase 1 Stub)`, params);
  // Simulating an empty response as per the plan.
  return Promise.resolve({ items: [], hasMore: false, currentPage: params?.page || 1, totalItems: 0, totalPages: 0 });
};
