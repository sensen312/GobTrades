// src/types/models.ts
/**
 * This file defines the core data model interfaces used throughout the frontend application.
 * These types typically mirror the structure of data stored in the backend MongoDB database
 * and are used for type safety and clarity when handling API responses and application state.
 */
export interface UserProfile {
  _id: string;
  uuid: string;
  goblinName: string;
  pfpIdentifier: string;
  items: Item[];
  offeredItemTags: string[];
  wantsTags: string[];
  offeredItemsDescription: string;
  wantedItemsDescription: string;
  likeCount: number;
  lastActive: string; // ISO 8601 Date string
  createdAt: string;  // ISO 8601 Date string
  updatedAt: string;  // ISO 8601 Date string
}

export interface Item {
  dbId?: string; // MongoDB ObjectId string from server
  localId: string; // Client-generated UUID for keying and tracking new items
  itemName: string;
  imageFilename: string;
  createdAt?: string;
  updatedAt?: string;

  // --- Client-side only properties ---
  uri?: string; // Local file URI for new images, or full remote URL for existing images
  isNew?: boolean; // Flag to indicate if the item is newly added on the client
  type?: string; // Mime type for uploads
  name?: string; // Original filename from picker
  originalFilename?: string; // The original filename from the server for existing images
}

export interface Message {
  _id: string;
  localId?: string; // For optimistic UI
  chatId: string;
  senderId: string; // This is a User UUID
  text?: string;
  createdAt: string; // ISO 8601
  status?: 'sending' | 'sent' | 'failed';
  imageFilename?: string; // For future use
  isOffer?: boolean; // For future use
  offeredListingId?: string; // For future use
}

export interface ChatPreview {
  _id: string;
  participantUuids: string[];
  otherParticipant: {
    _id: string; // UserProfile DB ID
    uuid: string;
    goblinName: string;
    pfpIdentifier: string;
  };
  lastMessagePreview?: string;
  lastMessageAt: string; // ISO 8601
  unreadCount: number;
  associatedListingId?: string; // For future use if a chat is tied to an item
}

export interface TradeRequest {
  _id: string;
  senderUuid: string;
  senderGoblinName: string;
  senderPfpIdentifier: string;
  recipientUuid: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string; // ISO 8601
}

// Unified object for image handling across the app.
export interface ImageObject {
  uri: string;
  type?: string; // Mime type e.g., 'image/jpeg'
  name?: string; // Filename
  localId: string; // Client-side unique ID
  isNew: boolean;
  originalFilename?: string; // Filename from server for existing images
  dbId?: string; // The Item's database ID for existing items
}
