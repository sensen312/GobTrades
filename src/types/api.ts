import type { UserProfile, Listing, ChatPreview, Message } from './models';

export interface PaginatedResponse<T> { items: T[]; hasMore: boolean; totalItems?: number; currentPage?: number; totalPages?: number; }
export interface CreateUserRequest { uuid: string; goblinName: string; pfpIdentifier: string; }
export type CreateUserResponse = UserProfile;
export interface FilterParams { page?: number; limit?: number; categories?: string[]; wantsCategories?: string[]; sortBy?: 'newest' | 'oldest'; searchTerm?: string; userId?: string; likedByUserId?: string; isActive?: boolean; }
export type FetchListingsResponse = PaginatedResponse<Listing>;
export type CreateListingResponse = Listing;
export type UpdateListingResponse = Listing;
export type FetchListingByIdResponse = Listing;
export interface MarkTradedRequest { isActive: boolean; }
export type FetchChatsResponse = ChatPreview[];
export interface FetchMessagesParams { page?: number; limit?: number; }
export type FetchMessagesResponse = PaginatedResponse<Message>;
export interface InitiateChatRequest { recipientUserId: string; listingId: string; }
export interface InitiateChatResponse { chatId: string; initialMessage?: Message; }
export interface UploadChatImageResponse { imageFilename: string; }
export interface MarketStatusResponse { endTime: string | null; isMarketOpen: boolean; }