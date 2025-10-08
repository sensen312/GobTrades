// src/types/api.ts
import type { UserProfile, Message, ChatPreview, TradeRequest } from './models';

export interface PaginatedResponse<T> {
  items: T[];
  hasMore: boolean;
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface CreateUserRequestDto {
  uuid: string;
  goblinName: string;
  pfpIdentifier: string;
}
export type CreateUserResponseDto = Pick<UserProfile, '_id' | 'uuid' | 'goblinName' | 'pfpIdentifier' | 'createdAt' | 'updatedAt'>;

export interface UpdateItemDto {
  localId?: string;
  dbId?: string;
  itemName: string;
  imageFilename: string;
}

export interface UpdateProfileRequestDto {
  items: UpdateItemDto[];
  offeredItemTags: string[];
  wantsTags: string[];
  offeredItemsDescription: string;
  wantedItemsDescription: string;
  removedItemDbIds?: string[];
}
export type UpdateProfileResponseDto = UserProfile;
export type FetchMyStallResponseDto = UserProfile | null;

export type ProfileFeedItemDto = Pick<UserProfile, '_id' | 'uuid' | 'goblinName' | 'pfpIdentifier' | 'items' | 'lastActive' | 'offeredItemTags' | 'wantsTags'>;
export type FetchProfileFeedResponseDto = PaginatedResponse<ProfileFeedItemDto>;

export interface MarketStatusResponseDto {
  isMarketOpen: boolean;
  endTime: string | null;
}

export interface FetchChatsAndRequestsResponseDto {
  chats: ChatPreview[];
  tradeRequests: TradeRequest[];
}
export interface FetchMessagesParamsDto {
  page?: number;
  limit?: number;
}
export type FetchMessagesResponseDto = PaginatedResponse<Message>;

export interface DeleteUserResponseDto {
    success: boolean;
    message?: string;
}

export interface UploadChatMessageImageApiDto {
    imageFilename: string;
}
