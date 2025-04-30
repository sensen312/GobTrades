import apiClient from './index';
import {
    ChatPreview, Message, FetchChatsResponse, FetchMessagesParams,
    FetchMessagesResponse, InitiateChatRequest, InitiateChatResponse,
    UploadChatImageResponse
} from '../types'; // Ensure types are imported

/** Fetches user's chat list previews (user identified by X-User-UUID header). */
export const fetchChatsApi = async (): Promise<FetchChatsResponse> => {
    const response = await apiClient.get<FetchChatsResponse>('/messages/chats');
    return response.data; // Expects ChatPreview[]
};

/** Fetches message history for a specific chat. */
export const fetchMessagesForChatApi = async (chatId: string, params?: FetchMessagesParams): Promise<FetchMessagesResponse> => {
    const response = await apiClient.get<FetchMessagesResponse>(`/messages/chats/${chatId}/messages`, { params });
    return response.data; // Expects PaginatedResponse<Message>
};

/** Initiates/retrieves chat for a listing/user (initiator identified by X-User-UUID header). */
export const initiateChatApi = async (requestData: InitiateChatRequest): Promise<InitiateChatResponse> => {
    const response = await apiClient.post<InitiateChatResponse>('/messages/chats/initiate', requestData);
    return response.data; // Expects { chatId: string, initialMessage?: Message }
};

/** Uploads image for chat message (sends FormData). */
export const uploadChatMessageImageApi = async (imageData: FormData): Promise<UploadChatImageResponse> => {
    // Expects FormData with key like 'imageFile' (confirm with backend)
    const response = await apiClient.post<UploadChatImageResponse>('/messages/images', imageData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // Expects { imageFilename: string }
};
