// src/types/api.ts
import type { UserProfile as FullUserProfile, Message as ModelMessage, ChatPreview as ModelChatPreview, TradeRequest as ModelTradeRequest, Item as ModelItem } from './models';

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
export type CreateUserResponseDto = Pick<FullUserProfile, '_id' | 'uuid' | 'goblinName' | 'pfpIdentifier' | 'createdAt' | 'updatedAt'>;

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
export type UpdateProfileResponseDto = FullUserProfile;
export type FetchMyStallResponseDto = FullUserProfile | null;

// Corrected: UserProfile in models.ts now includes 'items' and 'lastActive'
export type ProfileFeedItemDto = Pick<FullUserProfile, '_id' | 'uuid' | 'goblinName' | 'pfpIdentifier' | 'items' | 'lastActive'>;
export type FetchProfileFeedResponseDto = PaginatedResponse<ProfileFeedItemDto>;

export interface MarketStatusResponseDto {
  isMarketOpen: boolean;
  endTime: string | null;
}

export interface FetchChatsAndRequestsResponseDto {
  chats: ModelChatPreview[];
  tradeRequests: ModelTradeRequest[];
}

export interface FetchMessagesParamsDto {
  page?: number;
  limit?: number;
}
export type FetchMessagesResponseDto = PaginatedResponse<ModelMessage>;

export interface DeleteUserResponseDto {
    success: boolean;
    message?: string;
}
