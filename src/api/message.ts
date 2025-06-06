// src/api/message.ts
import apiClient from './index';
import {
  FetchChatsAndRequestsResponseDto,
  FetchMessagesParamsDto,
  FetchMessagesResponseDto,
  UploadChatMessageImageApiDto
} from '../types';

export const fetchChatsAndRequestsApi = async (): Promise<FetchChatsAndRequestsResponseDto> => {
  const response = await apiClient.get<FetchChatsAndRequestsResponseDto>('/messages/chats-and-requests');
  return response.data;
};

export const fetchMessagesForChatApi = async (
  chatId: string,
  params?: FetchMessagesParamsDto
): Promise<FetchMessagesResponseDto> => {
  const response = await apiClient.get<FetchMessagesResponseDto>(`/messages/chats/${chatId}/messages`, { params });
  return response.data;
};

export const uploadChatMessageImageApi = async (formData: FormData): Promise<UploadChatMessageImageApiDto> => {
    const response = await apiClient.post<UploadChatMessageImageApiDto>('/messages/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const markChatAsReadApi = async (chatId: string): Promise<void> => {
    await apiClient.post(`/messages/chats/${chatId}/read`);
};
