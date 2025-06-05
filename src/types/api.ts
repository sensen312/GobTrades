// src/types/api.ts
import type { UserProfile, Message, ChatPreview, TradeRequest, Item } from './models';

export interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
}

// --- User & Auth ---
export interface CreateUserRequestDto {
  uuid: string;
  goblinName: string;
  pfpIdentifier: string;
}
export type CreateUserResponseDto = Pick<UserProfile, '_id' | 'uuid' | 'goblinName' | 'pfpIdentifier' | 'createdAt' | 'updatedAt'>;

export interface DeleteUserResponseDto {
    success: boolean;
    message?: string;
}

// --- Stall / Profile ---
export interface UpdateItemDto {
  localId?: string; // Client-side ID for new items
  dbId?: string;    // Server-side DB ID for existing items
  itemName: string;
  imageFilename: string; // Name for backend to store
}

export interface UpdateProfileRequestDto {
  items: UpdateItemDto[];
  offeredItemsDescription: string;
  wantedItemsDescription: string;
  offeredItemTags: string[];
  wantsTags: string[];
  removedItemDbIds?: string[];
}

export type UpdateProfileResponseDto = UserProfile;
export type FetchMyStallResponseDto = UserProfile | null;

export type ProfileFeedItemDto = Pick<UserProfile, '_id' | 'uuid' | 'goblinName' | 'pfpIdentifier' | 'items' | 'lastActive' | 'offeredItemTags' | 'wantsTags'>;
export type FetchProfileFeedResponseDto = PaginatedResponse<ProfileFeedItemDto>;


// --- Market ---
export interface MarketStatusResponseDto {
  isMarketOpen: boolean;
  endTime: string | null;
}

// --- Messaging & Trades ---
export interface FetchChatsAndRequestsResponseDto {
  chats: ChatPreview[];
  tradeRequests: TradeRequest[];
}
export interface FetchMessagesParamsDto {
  page?: number;
  limit?: number;
}
export type FetchMessagesResponseDto = PaginatedResponse<Message>;
export interface UploadChatMessageImageApiDto {
    imageFilename: string;
}

